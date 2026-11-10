#!/usr/bin/env bash
# External uptime probe for the blog, run by .github/workflows/uptime.yml.
# Checks the HTTP status and the TLS expiry, and posts to Discord only when a
# check changes state (ok -> ko, ko -> ok), so an outage gives one alert.
#
# Env: DISCORD_WEBHOOK_URL (required), URL, STATE_FILE, TLS_WARN_DAYS.
# Exit: 0 when the probe ran, even if the site is down (the alert went out);
# non-zero when the webhook is missing or Discord rejects the post, in which
# case the state file is left untouched so the next run retries the alert.
set -euo pipefail

URL="${URL:-https://blog.dkp-consult.be/}"
STATE_FILE="${STATE_FILE:-.uptime-state}"
TLS_WARN_DAYS="${TLS_WARN_DAYS:-15}"

if [ -z "${DISCORD_WEBHOOK_URL:-}" ]; then
  echo "::error::DISCORD_WEBHOOK_URL is not set: add it as a repository secret (Settings > Secrets and variables > Actions)." >&2
  exit 1
fi

host="${URL#*://}"
host="${host%%/*}"

# HTTP: two attempts with a short timeout; 000 means no response at all.
code=000
for attempt in 1 2; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$URL" 2>/dev/null) || true
  [ "$code" = 200 ] && break
  [ "$attempt" = 1 ] && sleep 5
done
if [ "$code" = 200 ]; then http=ok; else http=ko; fi

# TLS: days left on the served certificate; unreadable counts as ko.
tls=ko
days=unknown
end=$(echo | openssl s_client -connect "$host:443" -servername "$host" 2>/dev/null \
  | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2) || true
if [ -n "$end" ]; then
  end_ts=$(date -u -d "$end" +%s 2>/dev/null || date -u -j -f '%b %e %T %Y %Z' "$end" +%s)
  days=$(( (end_ts - $(date -u +%s)) / 86400 ))
  [ "$days" -gt "$TLS_WARN_DAYS" ] && tls=ok
fi

echo "http=$http (code $code) tls=$tls (days left: $days)"

# Previous state, ok when unknown (first run or evicted cache).
prev_http=$(grep -qx 'prev_http=ko' "$STATE_FILE" 2>/dev/null && echo ko || echo ok)
prev_tls=$(grep -qx 'prev_tls=ko' "$STATE_FILE" 2>/dev/null && echo ko || echo ok)

messages=()
if [ "$http" != "$prev_http" ]; then
  if [ "$http" = ko ]; then
    messages+=(":red_circle: $URL est en panne : $([ "$code" = 000 ] && echo "aucune réponse" || echo "HTTP $code") (2 essais).")
  else
    messages+=(":green_circle: $URL répond à nouveau (HTTP 200).")
  fi
fi
if [ "$tls" != "$prev_tls" ]; then
  if [ "$tls" = ko ]; then
    if [ "$days" = unknown ]; then
      messages+=(":warning: Certificat TLS de $host illisible.")
    else
      messages+=(":warning: Certificat TLS de $host : expiration dans $days jours (seuil $TLS_WARN_DAYS).")
    fi
  else
    messages+=(":white_check_mark: Certificat TLS de $host renouvelé : $days jours restants.")
  fi
fi

for msg in ${messages[@]+"${messages[@]}"}; do
  echo "Posting: $msg"
  payload=$(printf '%s' "$msg" | sed 's/\\/\\\\/g; s/"/\\"/g')
  curl -sS --fail --max-time 10 -H 'Content-Type: application/json' \
    -d "{\"content\":\"$payload\"}" "$DISCORD_WEBHOOK_URL" >/dev/null
done

printf 'prev_http=%s\nprev_tls=%s\n' "$http" "$tls" > "$STATE_FILE"
if [ "${#messages[@]}" -gt 0 ]; then echo "changed=true" >> "${GITHUB_OUTPUT:-/dev/null}"; fi
