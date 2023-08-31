# Reverse Proxy

## Deployment

The docker compose file requires an `.env` file where the values of the following variables are defined:

```bash
# Reverse proxy
CROWSNEST_EXTERNAL_HTTP_PORT=XXXX
CROWSNEST_EXTERNAL_MQTT_TCP_PORT=XXXX
CROWSNEST_EXTERNAL_TRAEFIK_DASHBOARD_PORT=XXXX
CROWSNEST_EXTERNAL_EMQX_DASHBOARD_PORT=XXX
```
