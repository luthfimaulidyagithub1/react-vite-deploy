import React, { useEffect, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList
} from "recharts";

export default function BubbleMapKecamatan() {
  const [data, setData] = useState(null);
  const [json, setJson] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState("Semua");
  const [kecamatanList, setKecamatanList] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/luthfimaulidyagithub1/DDA-json/contents/latlong%20wil.json",
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setJson(json);

        const kecamatanMap = json.reduce((acc, d) => {
          if (!acc[d.kecamatan]) {
            acc[d.kecamatan] = {
              kecamatan: d.kecamatan,
              coord: d["latitude,longitude kec"],
              totalPenduduk: 0,
              totalKK: 0,
            };
          }
          acc[d.kecamatan].totalPenduduk += +d.penduduk;
          acc[d.kecamatan].totalKK += +d.kk;
          return acc;
        }, {});

        const features = Object.values(kecamatanMap).map((d) => {
          const [lat, lon] = d.coord.split(",").map(parseFloat);
          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: {
              kecamatan: d.kecamatan,
              penduduk: d.totalPenduduk,
              kk: d.totalKK,
            },
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
    filter:
      selectedKecamatan === "Semua"
        ? true
        : ["==", ["get", "kecamatan"], selectedKecamatan],
  };

  const barChartData =
    selectedKecamatan === "Semua"
      ? (data?.features || []).map((f) => ({
          kecamatan: f.properties.kecamatan,
          kk: json
            .filter((d) => d.kecamatan === f.properties.kecamatan)
            .reduce((sum, d) => sum + +d.kk, 0),
        }))
      : [
          {
            kecamatan: selectedKecamatan,
            kk: json
              .filter((d) => d.kecamatan === selectedKecamatan)
              .reduce((sum, d) => sum + +d.kk, 0),
          },
        ];

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 🔹 Filter Dropdown */}
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

      {/* 🔹 Peta */}
      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{ latitude: -9.7, longitude: 119.3, zoom: 9 }}
        style={{ width: "100%", height: "70vh" }}
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
              <Typography variant="subtitle2">
                {hoverInfo.kecamatan}
              </Typography>
              <Typography variant="body2">
                Penduduk: {hoverInfo.penduduk.toLocaleString("id-ID")}
              </Typography>
            </Paper>
          </Popup>
        )}
      </Map>

      {/* 🔹 Bar Chart */}
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Jumlah KK per Kecamatan
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kecamatan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="kk" fill="#1976d2" name="Jumlah KK">
      <LabelList dataKey="kk" position="top" formatter={(value) => value.toLocaleString("id-ID")}/>
    </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
