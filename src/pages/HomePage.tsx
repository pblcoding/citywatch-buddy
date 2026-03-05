import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, MapPin, FileText, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: AlertTriangle, title: 'SOS Emergency', desc: 'One-tap emergency alert with GPS location', link: '/', color: 'text-emergency' },
  { icon: FileText, title: 'Report Crime', desc: 'Submit detailed crime reports with evidence', link: '/report', color: 'text-primary' },
  { icon: MapPin, title: 'Crime Heatmap', desc: 'Visualize crime hotspots in your area', link: '/heatmap', color: 'text-warning' },
  { icon: Phone, title: 'Emergency Services', desc: 'Find nearest police, hospitals & fire stations', link: '/emergency-services', color: 'text-success' },
];

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-[var(--nav-height)]">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emergency/5" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Protecting Our Communities
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your City, <span className="gradient-text">Safer Together</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              MySafeCity empowers citizens to report crimes, trigger emergency alerts, and stay informed about safety in their neighborhood — all in real time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-accent transition-colors"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/report')}
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  {user?.role === 'admin' ? 'Go to Dashboard' : 'Report a Crime'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How MySafeCity Keeps You Safe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={f.link}
                  className="block glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow group"
                >
                  <f.icon className={`h-10 w-10 ${f.color} mb-4`} />
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '247', label: 'Reports Filed' },
              { value: '189', label: 'Cases Resolved' },
              { value: '24/7', label: 'Monitoring' },
              { value: '50K+', label: 'Citizens Protected' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-6"
              >
                <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
