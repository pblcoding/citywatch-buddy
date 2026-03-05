import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { api } from '@/services/api';
import type { HeatmapPoint, CrimeReport } from '@/types';
import 'leaflet/dist/leaflet.css';

const riskColors = {
  low: { fill: '#22c55e', stroke: '#16a34a' },
  medium: { fill: '#f59e0b', stroke: '#d97706' },
  high: { fill: '#ef4444', stroke: '#dc2626' },
};

function getColor(intensity: number) {
  if (intensity >= 0.7) return riskColors.high;
  if (intensity >= 0.4) return riskColors.medium;
  return riskColors.low;
}

export default function HeatmapPage() {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.getHeatmapData().then(setPoints);
    api.getCrimeReports().then(setReports);
  }, []);

  const filteredPoints = useMemo(() => {
    if (filter === 'all') return points;
    return points.filter(p => p.type === filter);
  }, [points, filter]);

  const types = ['all', 'theft', 'assault', 'vandalism', 'robbery', 'fraud', 'harassment'];

  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crime Heatmap</h1>
              <p className="text-muted-foreground">Visualize crime hotspots in your area</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-4">
            {[
              { label: 'Low Risk', color: 'bg-success' },
              { label: 'Medium Risk', color: 'bg-warning' },
              { label: 'High Risk', color: 'bg-emergency' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-sm">
                <div className={`h-3 w-3 rounded-full ${l.color}`} />
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: '65vh' }}>
            <MapContainer center={[40.7128, -74.006]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredPoints.map((point, i) => {
                const colors = getColor(point.intensity);
                return (
                  <CircleMarker
                    key={i}
                    center={[point.lat, point.lng]}
                    radius={point.intensity * 25 + 8}
                    pathOptions={{
                      fillColor: colors.fill,
                      color: colors.stroke,
                      weight: 2,
                      fillOpacity: 0.4,
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold capitalize">{point.type}</p>
                        <p>Risk: {point.intensity >= 0.7 ? 'High' : point.intensity >= 0.4 ? 'Medium' : 'Low'}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
              {reports.map(r => (
                <CircleMarker
                  key={r._id}
                  center={[r.location.lat, r.location.lng]}
                  radius={6}
                  pathOptions={{
                    fillColor: r.severity === 'high' ? '#ef4444' : r.severity === 'medium' ? '#f59e0b' : '#22c55e',
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{r.title}</p>
                      <p className="capitalize">{r.type} · {r.severity}</p>
                      <p className="text-xs">{r.location.address}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
