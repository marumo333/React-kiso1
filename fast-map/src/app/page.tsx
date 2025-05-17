'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';

// LeafletのCSSを動的にインポート
import 'leaflet/dist/leaflet.css';

// Leafletコンポーネントを動的にインポート
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// カスタムマーカーアイコンの設定
const createCustomIcon = (type: 'current' | 'destination') => {
  const L = require('leaflet');
  const iconUrl = type === 'current' 
    ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
    : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
  
  const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

  return new L.Icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function Home() {
  const [position, setPosition] = useState<LatLngExpression>([35.6812, 139.7671]); // 東京駅の座標
  const [isMounted, setIsMounted] = useState(false);
  const [destination, setDestination] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // 現在位置を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
        }
      );
    }
  }, []);

  // 地図クリック時の処理
  const handleMapClick = (e: any) => {
    console.log('Map clicked:', e.latlng);
    setDestination([e.latlng.lat, e.latlng.lng]);
  };

  if (!isMounted) {
    return <div className="w-full h-screen flex items-center justify-center">地図を読み込み中...</div>;
  }

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={createCustomIcon('current')}>
          <Popup>
            <div>
              <h3 className="font-bold">現在位置</h3>
              <p>緯度: {Array.isArray(position) ? position[0] : ''}</p>
              <p>経度: {Array.isArray(position) ? position[1] : ''}</p>
            </div>
          </Popup>
        </Marker>
        {destination && (
          <Marker position={destination} icon={createCustomIcon('destination')}>
            <Popup>
              <div>
                <h3 className="font-bold">目的地</h3>
                <p>緯度: {Array.isArray(destination) ? destination[0] : ''}</p>
                <p>経度: {Array.isArray(destination) ? destination[1] : ''}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
