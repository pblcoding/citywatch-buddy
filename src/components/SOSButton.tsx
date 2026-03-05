import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SOSButton() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<'idle' | 'locating' | 'sending' | 'sent'>('idle');

  const handleSOS = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setState('locating');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      setState('sending');
      await api.triggerSOS({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setState('sent');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      // Fallback to default location
      setState('sending');
      await api.triggerSOS({ lat: 40.7128, lng: -74.006 });
      setState('sent');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  if (state === 'sent') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-2xl bg-success text-success-foreground shadow-2xl"
      >
        <CheckCircle className="h-6 w-6" />
        <span className="font-bold">Alert Sent!</span>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleSOS}
      disabled={state !== 'idle'}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-lg transition-all ${
        state === 'idle'
          ? 'bg-emergency text-emergency-foreground pulse-emergency hover:scale-105'
          : 'bg-warning text-warning-foreground'
      }`}
    >
      {state === 'idle' && (
        <>
          <AlertTriangle className="h-6 w-6" />
          SOS
        </>
      )}
      {state === 'locating' && (
        <>
          <MapPin className="h-6 w-6 animate-bounce" />
          Locating...
        </>
      )}
      {state === 'sending' && (
        <>
          <Loader2 className="h-6 w-6 animate-spin" />
          Sending...
        </>
      )}
    </motion.button>
  );
}
