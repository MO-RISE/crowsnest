import "maplibre-gl/dist/maplibre-gl.css";

import ReactMapGl from "react-map-gl/maplibre";
import DeckGL from "deck.gl";
import React from "react";
import { GeoJsonLayer } from "@deck.gl/layers";

const protocol =
  window.location.hostname === "localhost" ? "http://" : "https://";
const chart4000 =
  protocol + window.location.hostname + "/tiles/styles/chart_4000/style.json";

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

export default function Monitor() {
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
        <ReactMapGl mapStyle={chart4000} />
      </DeckGL>
    </div>
  );
}
