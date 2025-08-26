import React from 'react';
import { Button } from '@mui/material';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-blue-50">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Dashboard SIPADA</h1>
        <h2 className="text-xl md:text-2xl text-gray-600 mb-6">Visualisasi Interaktif Publikasi Daerah Dalam Angka</h2>
        <p className="text-md md:text-lg text-gray-500 max-w-2xl mb-8">
          Badan Pusat Statistik Kabupaten Sumba Barat <br />
          Menyajikan data resmi untuk perencanaan dan pembangunan daerah.
        </p>
        <div className="flex gap-4">
          <Button variant="contained" color="primary" size="large" href="/dashboard">
            Masuk Dashboard
          </Button>
          <Button variant="outlined" color="secondary" size="large" href="https://sumbabaratkab.bps.go.id" target="_blank">
            Unduh Publikasi BPS
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <h3 className="text-2xl font-semibold text-center mb-10 text-gray-800">Fitur Utama</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-purple-50 p-6 rounded-2xl shadow">
            <h4 className="font-bold text-lg mb-2 text-purple-700">Geografi & Iklim</h4>
            <p className="text-gray-600">Eksplorasi data spasial dan kondisi iklim Kabupaten Sumba Barat.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow">
            <h4 className="font-bold text-lg mb-2 text-purple-700">Pemerintahan</h4>
            <p className="text-gray-600">Informasi administrasi wilayah dan struktur pemerintahan.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow">
            <h4 className="font-bold text-lg mb-2 text-purple-700">Penduduk & Ketenagakerjaan</h4>
            <p className="text-gray-600">Statistik penduduk, tenaga kerja, dan indikator sosial ekonomi.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Badan Pusat Statistik Kabupaten Sumba Barat</p>
        <p className="mt-2">
          Jl. Wee Karou, Kec. Loli, Kabupaten Sumba Barat, Nusa Tenggara Timur <br />
          Telp: (0387) 21256 · Email: bps5301@bps.go.id
        </p>
      </footer>
    </div>
  );
}
