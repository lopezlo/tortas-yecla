'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom divIcon markers (avoids default image path issues)
const restaurantIcon = L.divIcon({
  html: `<div style="background:#d97706;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white;">🍞</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const userIcon = L.divIcon({
  html: `<div style="background:#3b82f6;border-radius:50%;width:18px;height:18px;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.4);"></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyToUser({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.2 });
  }, [position, map]);
  return null;
}

interface MapRestaurant {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

interface MapClientProps {
  restaurants: MapRestaurant[];
}

const YECLA: [number, number] = [38.6167, -1.1167];

export default function MapClient({ restaurants }: MapClientProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  function locateUser() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  const mappableRestaurants = restaurants.filter(
    (r): r is MapRestaurant & { lat: number; lng: number } =>
      r.lat !== null && r.lng !== null
  );

  return (
    <div className="relative h-full">
      <MapContainer
        center={YECLA}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        className="rounded-none"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappableRestaurants.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={restaurantIcon}>
            <Popup>
              <div className="font-bold text-stone-800 text-sm">{r.name}</div>
              <div className="text-xs text-stone-500 mt-0.5">{r.address}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-600 underline block mt-1"
              >
                Abrir en Google Maps
              </a>
            </Popup>
          </Marker>
        ))}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <span className="text-sm">Estás aquí</span>
            </Popup>
          </Marker>
        )}

        <FlyToUser position={userPos} />
      </MapContainer>

      {/* Locate button */}
      <button
        onClick={locateUser}
        disabled={locating}
        className="absolute bottom-4 right-4 z-[1000] bg-white shadow-lg rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors border border-stone-200 disabled:opacity-50"
      >
        {locating ? '📍 Localizando…' : '📍 Mi ubicación'}
      </button>
    </div>
  );
}
