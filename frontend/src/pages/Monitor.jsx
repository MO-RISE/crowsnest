import "maplibre-gl/dist/maplibre-gl.css";

import ReactMapGl from "react-map-gl/maplibre";
import DeckGL from "deck.gl";
import React from "react";
import { GeoJsonLayer } from "@deck.gl/layers";

const protocol =
  window.location.hostname === "localhost" ? "http://" : "https://";
const chart4000 =
  protocol + window.location.hostname + "/tiles/styles/chart_4000/style.json";

const area = {
  coordinates: [
    [
      [11.811578676341128, 57.68509160435036],
      [11.811578676341128, 57.66136222163314],
      [11.841157116273138, 57.66136222163314],
      [11.841157116273138, 57.68509160435036],
      [11.811578676341128, 57.68509160435036],
    ],
  ],
  type: "Polygon",
};

export default function Monitor() {
  const [obstacles, setObstacles] = React.useState(null);

  // Query the GIS database and get obstacleswithin an area for a ship with a draft of 4 m.
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/gis/api/rpc/get_obstacles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              area_geom: area,
              draft: 4,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setObstacles(result);
        console.log(result);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: "test",
      data: area,
      opacity: 0.2,
      stroked: true,
      filled: true,
      extruded: false,
      wireframe: true,
      getLineColor: [0, 255, 0],
      getFillColor: [0, 100, 0],
      getLineWidth: 4,
      pickable: true,
      getElevation: 30,
    }),
    new GeoJsonLayer({
      id: "test",
      data: obstacles,
      opacity: 1,
      stroked: true,
      filled: false,
      extruded: false,
      wireframe: true,
      getLineColor: [0, 255, 0],
      getFillColor: [43, 153, 138],
      getLineWidth: 4,
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
        <ReactMapGl mapStyle={chart4000} />
      </DeckGL>
    </div>
  );
}
