import React, { useEffect, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function BubbleMapKecamatan() {
  const [data, setData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyOwq4oLo8fBrsTJn2-zEUlRorQIblfZQ8oFPPHLjPvj0gIgTdtpIQg0-RZVz5oU47jnQ/exec?sheet=latlong%20wil"
    )
      .then((res) => res.json())
      .then((json) => {
        // 🔹 kelompokkan per kecamatan
        const kecamatanMap = {};
        json.forEach((d) => {
          const key = d.kecamatan;
          if (!kecamatanMap[key]) {
            kecamatanMap[key] = {
              kecamatan: d.kecamatan,
              coord: d["latitude,longitude kec"],
              totalPenduduk: 0,
            };
          }
          kecamatanMap[key].totalPenduduk += parseInt(d.penduduk);
        });

        // 🔹 konversi ke GeoJSON
        const features = Object.values(kecamatanMap).map((d) => {
          const [lat, lon] = d.coord.split(",").map(parseFloat);
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat], // lng, lat
            },
            properties: {
              kecamatan: d.kecamatan,
              penduduk: d.totalPenduduk,
            },
          };
        });

        setData({
          type: "FeatureCollection",
          features,
        });
      });
  }, []);

  const bubbleLayer = {
    id: "bubbles",
    type: "circle",
    source: "penduduk",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "penduduk"],
        1000,
        10,
        10000,
        40,
      ],
      "circle-color": "#1976d2",
      "circle-opacity": 0.6,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{
          latitude: -9.7,
          longitude: 119.3,
          zoom: 9,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={["bubbles"]}
        onMouseMove={(e) => {
          const feature = e.features && e.features[0];
          setHoverInfo(
            feature
              ? {
                  longitude: e.lngLat.lng,
                  latitude: e.lngLat.lat,
                  kecamatan: feature.properties.kecamatan,
                  penduduk: feature.properties.penduduk,
                }
              : null
          );
        }}
        onMouseLeave={() => setHoverInfo(null)}
      >
        {data && (
          <Source id="penduduk" type="geojson" data={data}>
            <Layer {...bubbleLayer} />
          </Source>
        )}

        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="top"
          >
            <div>
              <b>{hoverInfo.kecamatan}</b>
              <br />
              Penduduk: {hoverInfo.penduduk.toLocaleString("id-ID")}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
