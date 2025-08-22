import React, { useEffect, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from "@mui/material";

export default function BubbleMapKecamatan() {
  const [data, setData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState("Semua");
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong%20wil.json", {
        headers: {
          "Accept": "application/vnd.github.v3.raw"
        }
      })
      .then((res) => res.json())
      .then((json) => {
        console.log("Data JSON:", json);
        const kecamatanMap = json.reduce((acc, d) => {
          if (!acc[d.kecamatan]) {
            acc[d.kecamatan] = {
              kecamatan: d.kecamatan,
              coord: d["latitude,longitude kec"],
              totalPenduduk: 0,
            };
          }
          acc[d.kecamatan].totalPenduduk += +d.penduduk;
          return acc;
        }, {});

        const features = Object.values(kecamatanMap).map((d) => {
          const [lat, lon] = d.coord.split(",").map(parseFloat);
          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: { kecamatan: d.kecamatan, penduduk: d.totalPenduduk },
          };
        });

        const geojson = { type: "FeatureCollection", features };
        setData(geojson);
        setKecamatanList(["Semua", ...Object.keys(kecamatanMap)]);
      });
  }, []);

  const bubbleLayer = {
    id: "bubbles",
    type: "circle",
    source: "penduduk",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["get", "penduduk"], 1000, 10, 10000, 40],
      "circle-color": "#1976d2",
      "circle-opacity": 0.6,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
    filter:
      selectedKecamatan === "Semua"
        ? true
        : ["==", ["get", "kecamatan"], selectedKecamatan],
  };

  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* 🔹 Filter Kecamatan pakai MUI */}
      <Paper
        sx={{
          position: "absolute",
          zIndex: 10,
          top: 16,
          left: 16,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="kecamatan-select-label">Kecamatan</InputLabel>
          <Select
            labelId="kecamatan-select-label"
            value={selectedKecamatan}
            label="Kecamatan"
            onChange={(e) => setSelectedKecamatan(e.target.value)}
          >
            {kecamatanList.map((kec) => (
              <MenuItem key={kec} value={kec}>
                {kec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{ latitude: -9.7, longitude: 119.3, zoom: 9 }}
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
            <Paper sx={{ p: 1, borderRadius: 1 }}>
              <Typography variant="subtitle2">{hoverInfo.kecamatan}</Typography>
              <Typography variant="body2">
                Penduduk: {hoverInfo.penduduk.toLocaleString("id-ID")}
              </Typography>
            </Paper>
          </Popup>
        )}
      </Map>
    </Box>
  );
}
