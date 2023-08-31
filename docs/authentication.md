# Authentication

## Deployment

One of the files necessary to deploy this service are found in the [/backend-services/authentication](/backend-services/authenication) folder.

The [docker compose file](backend-services/authentication/docker-compose.authentication.yml) describes how the container is run and the Traefik configuration. Note that this configuration requires the existance of a [reverse proxy service](#reverse-proxy).

The docker compose file requires an `.env` file with the following definitions:

```bash
# Auth setup
CROWSNEST_AUTH_DB=XXXX
CROWSNEST_AUTH_DB_USER=XXXX
CROWSNEST_AUTH_DB_PASSWORD=XXXX
CROWSNEST_AUTH_COOKIE_DOMAIN=crowsnest.mo.ri.se
CROWSNEST_AUTH_ACCESS_COOKIE_HTTPONLY=XXXX
CROWSNEST_AUTH_ACCESS_TOKEN_EXPIRE_MINUTES=XXXX
CROWSNEST_AUTH_ADMIN_USER_PASSWORD=XXXX
JWT_TOKEN_SECRET=XXXX
```

Deploy the service by running the following command:

```bash
docker-compose -f docker-compose.reverse-proxy.yml -f docker-compose.authentication.yml up -d
```
