# Tiles Service

The tiles service is a [TileServer GL](https://github.com/maptiler/tileserver-gl) instance running in a Docker container.

An overview of the provided tiles is available at https://crowsnest.mo.ri.se/tiles.

## Deployment

Almost all the files necessary to deploy this service are found in the [/backend-services/tiles](/backend-services/tiles) folder.

The [docker compose file](backend-services/tiles/docker-compose.tiles.yml) describes how the container is run and the Traefik configuration. Note that this configuration requires the existance of a [reverse proxy service](#reverse-proxy) and an [authentication service](#authentication). Additionaly, the configuration allows Cross-Origin-Resource-Sharing (CORS), so that other applications, besides Crowsnest, can use the service as long as they have a valid access token.

The files in the [tileserver](backend-services/tiles/tileserver) folder contain the descriptions of the tiles styles, data sources, and additional configuration. To learn more about this files, see the [TileServer GL documentation](https://tileserver.readthedocs.io/en/latest/). At the root of this folder, the MBTiles files described in the [tilserver configuration file](backend-services/tiles/tileserver/config.json) **must be added**. This files are not included in this repository as they contain data that cannot be shared outside of our organization. Replicas, or similar versions of this files can be generated with the tool [S57toolbox](https://git.ri.se/mo-rise/s57toolbox).

After copying and adding the necessary files in the desired location, deploy the service by running the following command:

```bash
docker-compose -f docker-compose.reverse-proxy.yml -f docker-compose.authentication.yml -f docker-compose.tiles.yml up -d
```

## Usage

### React application

Deck.gl and react-map-gl are convenient libraries to use this service in a React application. The following example assumes that these libraries are installed.

### Installation

### Example

To run this example locally, a Cookie with a valid access token is necessary. To create such a cookie, login into https://crowsnest.mo.ri.se and then use the inspect function of the web-browser to look at the contents of the cookie created during the login. The cookie contains a variable named `crowsnest-auth-access`. Copy the value of this variable as it is a valid access token. Then, in a new web-browser window or tab, open the locally served React application (e.g. at http://localhost:3000), use the inspect function of the web-browser to open the JavaSrctip console, and run the following command:

```js
document.cookie = "crowsnest-auth-access=[YOUR TOKEN HERE]";
```

A cookie for the locally served React application containing a valid access token is now created.

```jsx
import "maplibre-gl/dist/maplibre-gl.css";

import ReactMapGl from "react-map-gl/maplibre";
import DeckGL from "deck.gl";
import React from "react";
import { GeoJsonLayer } from "@deck.gl/layers";

const crowsnestChartServer =
  "https://crowsnest.mo.ri.se/tiles/styles/chart_4000/style.json";

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const transformRequest = (url, resourceType) => {
  const token = getCookie("crowsnest-auth-access");
  if (!token) {
    console.log("Missing Crow's Nest access cookie.");
  }
  return {
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

const geojsonTest = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [11.871927851584275, 57.68847127768268],
            [11.871927851584275, 57.68517753703662],
            [11.891079221957511, 57.68517753703662],
            [11.891079221957511, 57.68847127768268],
            [11.871927851584275, 57.68847127768268],
          ],
        ],
        type: "Polygon",
      },
    },
  ],
};

// <div className='w-screen h-screen'>

function App() {
  const layers = [
    new GeoJsonLayer({
      id: "test",
      data: geojsonTest,
      opacity: 0.4,
      stroked: false,
      filled: true,
      extruded: false,
      wireframe: true,
      getLineColor: [255, 255, 255],
      getFillColor: [43, 153, 138],
      pickable: true,
      getElevation: 30,
    }),
  ];

  return (
    <div
      id='map-wrapper'
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DeckGL
        initialViewState={{
          longitude: 11.97,
          latitude: 57.70887,
          zoom: 10,
        }}
        layers={layers}
        controller={{ dragPan: "dragging" }}
      >
        <ReactMapGl
          mapStyle={crowsnestChartServer}
          transformRequest={transformRequest}
        />
      </DeckGL>
    </div>
  );
}

export default App;
```
