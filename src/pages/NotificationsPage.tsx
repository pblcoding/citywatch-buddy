import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, FileText, Info, Shield, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
  sos: { icon: AlertTriangle, color: 'text-emergency', bg: 'bg-emergency/10' },
  crime: { icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
  alert: { icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
  system: { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="min-h-screen pt-[var(--nav-height)] py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">{unreadCount} unread</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-accent transition-colors">
                <CheckCheck className="h-4 w-4" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.map(n => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => markAsRead(n._id)}
                  className={`glass-card rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${!n.read ? 'border-l-4 border-l-primary' : 'opacity-70'}`}
                >
                  <div className={`p-2 rounded-full ${config.bg} mt-0.5`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-2 shrink-0" />}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
