import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Phone, Shield as ShieldIcon, Siren, Flame, Hospital, Navigation, ExternalLink } from 'lucide-react';
import { api } from '@/services/api';
import type { EmergencyService } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconMap = {
  police: { icon: ShieldIcon, color: 'text-primary', bg: 'bg-primary/10' },
  hospital: { icon: Hospital, color: 'text-success', bg: 'bg-success/10' },
  fire: { icon: Flame, color: 'text-emergency', bg: 'bg-emergency/10' },
};

function createIcon(type: EmergencyService['type']) {
  const colors = { police: '#2563eb', hospital: '#22c55e', fire: '#ef4444' };
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${colors[type]};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function EmergencyServicesPage() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.getEmergencyServices().then(setServices);
  }, []);

  const filtered = filter === 'all' ? services : services.filter(s => s.type === filter);

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Siren className="h-8 w-8 text-emergency" />
            <div>
              <h1 className="text-3xl font-bold">Nearby Emergency Services</h1>
              <p className="text-muted-foreground">Find police, hospitals, and fire stations near you</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {['all', 'police', 'hospital', 'fire'].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}>
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg" style={{ height: '500px' }}>
              <MapContainer center={[40.7128, -74.006]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map(s => (
                  <Marker key={s._id} position={[s.location.lat, s.location.lng]} icon={createIcon(s.type)}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{s.name}</p>
                        <p>{s.address}</p>
                        <p>{s.phone}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map(s => {
                const meta = iconMap[s.type];
                const Icon = meta.icon;
                return (
                  <motion.div key={s._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl p-4 flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${meta.bg}`}>
                      <Icon className={`h-6 w-6 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <a href={`tel:${s.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Phone className="h-3 w-3" />{s.phone}
                        </a>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Navigation className="h-3 w-3" />{s.distance} mi
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${s.location.lat},${s.location.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
