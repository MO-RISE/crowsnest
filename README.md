# Crowsnest

Crowsnest is the test and demo platform of the Maritime Operations group at RISE Research Institutes of Sweden.

Crowsnest is a comprehensive web application composed of a frontend interface and multiple backend services. Both the frontend and backend components are hosted on a web server, which is shielded and managed by a reverse proxy.

## Development

Different steps are needed to develop the different components of Crowsnest. The following subsections describe the specific steps for specific components, but the base setup is the following:

1. Clone this repository: `git clone github.com/mo-rise/crowsnest`.
2. Cd into the repository's root directory: `cd crowsnest`.
3. Copy tile files (i.e. \*.mbtiles) into the `backend-services/tiles` directory. This files are not included in this repository.
4. Create an instance of the `gis-database` service.

```bash
docker-compose -f docker-compose.gis-database.yml
```

5. Load the chart data into the GIS database with [S57toolbox](https://git.ri.se/mo-rise/s57toolbox).

```bash
docker run -e ACTION="s57_to_postgis" -e CONN="dbname=crowsnest user=user password=password host=crowsnest-gis-database-1" -v <DIRECTORY_WITH_CHART_FILES>/data --network=crowsnest_default s57toolbox
```

6. Configure the `gis-database` by running the SQL query `/backend-services/gis/gis-database-setup.sql` in the database with PgAdmin or similar.

### Frontend

1. Start the backend-services and the frontend router.

```bash
docker-compose \
-f docker-compose.reverse-proxy.yml \
-f docker-compose.auth-database.yml \
-f docker-compose.gis-database.yml \
-f docker-compose.tiles.yml \
-f docker-compose.auth.yml \
-f docker-compose.frontend.dev.yml \
up
```

3. Start the frontend server.

```bash
cd frontend
npm start
```

Now you are ready. Note: hot reloading is broken.
