import { User, SOSAlert, CrimeReport, EmergencyService, Notification, DashboardStats, HeatmapPoint } from '@/types';

// Mock users
const users: User[] = [
  { _id: '1', name: 'John Citizen', email: 'john@example.com', role: 'citizen', phone: '+1234567890', createdAt: '2024-01-15' },
  { _id: '2', name: 'Admin User', email: 'admin@mysafecity.com', role: 'admin', createdAt: '2024-01-01' },
];

// Center point: New York City
const CENTER = { lat: 40.7128, lng: -74.006 };

const mockSOSAlerts: SOSAlert[] = [
  { _id: 's1', userId: '1', userName: 'John Citizen', location: { lat: 40.7580, lng: -73.9855, address: 'Times Square, NYC' }, status: 'active', createdAt: new Date(Date.now() - 120000).toISOString() },
  { _id: 's2', userId: '3', userName: 'Sarah Miller', location: { lat: 40.7489, lng: -73.9680, address: 'Grand Central, NYC' }, status: 'responding', createdAt: new Date(Date.now() - 600000).toISOString() },
  { _id: 's3', userId: '4', userName: 'Mike Johnson', location: { lat: 40.7614, lng: -73.9776, address: 'Rockefeller Center, NYC' }, status: 'resolved', createdAt: new Date(Date.now() - 3600000).toISOString(), resolvedAt: new Date(Date.now() - 1800000).toISOString() },
];

const crimeTypes: CrimeReport['type'][] = ['theft', 'assault', 'vandalism', 'robbery', 'fraud', 'harassment', 'other'];

const mockCrimeReports: CrimeReport[] = [
  { _id: 'c1', userId: '1', userName: 'John Citizen', type: 'theft', title: 'Phone stolen at subway', description: 'Someone grabbed my phone while boarding the train at 14th St station.', location: { lat: 40.7368, lng: -73.9927, address: '14th St Station' }, status: 'approved', severity: 'medium', createdAt: '2024-12-10T14:30:00Z' },
  { _id: 'c2', userId: '3', userName: 'Sarah Miller', type: 'vandalism', title: 'Car window smashed', description: 'Parked car had window smashed overnight. Nothing taken.', location: { lat: 40.7282, lng: -73.7949, address: 'Queens Blvd' }, status: 'pending', severity: 'low', createdAt: '2024-12-12T08:00:00Z' },
  { _id: 'c3', userId: '4', userName: 'Mike Johnson', type: 'assault', title: 'Mugging near Central Park', description: 'Was threatened at knifepoint near the park entrance.', location: { lat: 40.7829, lng: -73.9654, address: 'Central Park West' }, status: 'investigating', severity: 'high', createdAt: '2024-12-14T22:15:00Z' },
  { _id: 'c4', userId: '5', userName: 'Lisa Chen', type: 'robbery', title: 'Store robbery on 5th Ave', description: 'Armed robbery at convenience store.', location: { lat: 40.7527, lng: -73.9772, address: '5th Avenue' }, status: 'approved', severity: 'high', createdAt: '2024-12-15T03:45:00Z' },
  { _id: 'c5', userId: '6', userName: 'David Brown', type: 'fraud', title: 'ATM skimming device', description: 'Found a skimming device on ATM machine.', location: { lat: 40.7484, lng: -73.9857, address: 'Herald Square' }, status: 'approved', severity: 'medium', createdAt: '2024-12-16T11:20:00Z' },
  { _id: 'c6', userId: '7', userName: 'Emma Wilson', type: 'harassment', title: 'Street harassment incident', description: 'Verbal harassment near subway exit.', location: { lat: 40.7061, lng: -74.0087, address: 'Fulton St' }, status: 'pending', severity: 'medium', createdAt: '2024-12-17T19:30:00Z' },
];

const mockEmergencyServices: EmergencyService[] = [
  { _id: 'e1', name: 'NYPD 1st Precinct', type: 'police', location: { lat: 40.7135, lng: -74.0078 }, address: '16 Ericsson Pl, New York', phone: '212-334-0611', distance: 0.8 },
  { _id: 'e2', name: 'NYPD Midtown South', type: 'police', location: { lat: 40.7505, lng: -73.9934 }, address: '357 W 35th St, New York', phone: '212-239-9811', distance: 2.1 },
  { _id: 'e3', name: 'Bellevue Hospital', type: 'hospital', location: { lat: 40.7392, lng: -73.9754 }, address: '462 1st Ave, New York', phone: '212-562-4141', distance: 1.5 },
  { _id: 'e4', name: 'NYU Langone Health', type: 'hospital', location: { lat: 40.7421, lng: -73.9739 }, address: '550 1st Ave, New York', phone: '212-263-7300', distance: 1.8 },
  { _id: 'e5', name: 'FDNY Engine 1', type: 'fire', location: { lat: 40.7425, lng: -73.9958 }, address: '142 W 31st St, New York', phone: '212-570-4300', distance: 1.2 },
  { _id: 'e6', name: 'FDNY Ladder 24', type: 'fire', location: { lat: 40.7614, lng: -73.9858 }, address: '227 W 43rd St, New York', phone: '212-570-4300', distance: 3.0 },
];

const mockNotifications: Notification[] = [
  { _id: 'n1', type: 'sos', title: 'SOS Alert Nearby', message: 'An emergency alert was triggered near Times Square.', read: false, createdAt: new Date(Date.now() - 60000).toISOString() },
  { _id: 'n2', type: 'crime', title: 'Crime Report Update', message: 'Your report #c1 has been approved by admin.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'n3', type: 'alert', title: 'Safety Advisory', message: 'Increased police presence in Midtown area tonight.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: 'n4', type: 'system', title: 'Welcome to MySafeCity', message: 'Your account has been created. Stay safe!', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const mockHeatmapPoints: HeatmapPoint[] = [
  { lat: 40.7580, lng: -73.9855, intensity: 0.9, type: 'theft' },
  { lat: 40.7489, lng: -73.9680, intensity: 0.7, type: 'assault' },
  { lat: 40.7368, lng: -73.9927, intensity: 0.5, type: 'theft' },
  { lat: 40.7282, lng: -73.7949, intensity: 0.3, type: 'vandalism' },
  { lat: 40.7829, lng: -73.9654, intensity: 0.8, type: 'assault' },
  { lat: 40.7527, lng: -73.9772, intensity: 0.9, type: 'robbery' },
  { lat: 40.7484, lng: -73.9857, intensity: 0.6, type: 'fraud' },
  { lat: 40.7061, lng: -74.0087, intensity: 0.4, type: 'harassment' },
  { lat: 40.7200, lng: -73.9900, intensity: 0.7, type: 'theft' },
  { lat: 40.7650, lng: -73.9800, intensity: 0.5, type: 'vandalism' },
  { lat: 40.7300, lng: -74.0000, intensity: 0.8, type: 'robbery' },
  { lat: 40.7450, lng: -73.9900, intensity: 0.6, type: 'assault' },
];

const mockDashboardStats: DashboardStats = {
  totalReports: 247,
  activeAlerts: 3,
  resolvedCases: 189,
  pendingReports: 12,
  reportsByType: [
    { type: 'Theft', count: 78 },
    { type: 'Assault', count: 45 },
    { type: 'Vandalism', count: 38 },
    { type: 'Robbery', count: 32 },
    { type: 'Fraud', count: 28 },
    { type: 'Harassment', count: 18 },
    { type: 'Other', count: 8 },
  ],
  reportsByMonth: [
    { month: 'Jul', count: 28 },
    { month: 'Aug', count: 35 },
    { month: 'Sep', count: 42 },
    { month: 'Oct', count: 38 },
    { month: 'Nov', count: 51 },
    { month: 'Dec', count: 53 },
  ],
  severityDistribution: [
    { severity: 'Low', count: 89 },
    { severity: 'Medium', count: 102 },
    { severity: 'High', count: 56 },
  ],
};

// Simulated API service
export const api = {
  // Auth
  login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
    await delay(500);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { user, token: 'mock-jwt-token-' + user._id };
  },

  register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User; token: string }> => {
    await delay(500);
    const newUser: User = {
      _id: String(Date.now()),
      name: data.name,
      email: data.email,
      role: 'citizen',
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    return { user: newUser, token: 'mock-jwt-token-' + newUser._id };
  },

  // SOS
  triggerSOS: async (location: { lat: number; lng: number }): Promise<SOSAlert> => {
    await delay(300);
    const alert: SOSAlert = {
      _id: 'sos-' + Date.now(),
      userId: '1',
      userName: 'Current User',
      location: { ...location, address: 'Current Location' },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    return alert;
  },

  getSOSAlerts: async (): Promise<SOSAlert[]> => {
    await delay(300);
    return mockSOSAlerts;
  },

  updateSOSStatus: async (id: string, status: SOSAlert['status']): Promise<SOSAlert> => {
    await delay(300);
    const alert = mockSOSAlerts.find(a => a._id === id);
    if (!alert) throw new Error('Alert not found');
    return { ...alert, status };
  },

  // Crime Reports
  getCrimeReports: async (): Promise<CrimeReport[]> => {
    await delay(300);
    return mockCrimeReports;
  },

  submitCrimeReport: async (data: Partial<CrimeReport>): Promise<CrimeReport> => {
    await delay(500);
    const report: CrimeReport = {
      _id: 'cr-' + Date.now(),
      userId: '1',
      userName: 'Current User',
      type: data.type || 'other',
      title: data.title || '',
      description: data.description || '',
      location: data.location || { lat: CENTER.lat, lng: CENTER.lng },
      status: 'pending',
      severity: data.severity || 'medium',
      createdAt: new Date().toISOString(),
    };
    return report;
  },

  updateReportStatus: async (id: string, status: CrimeReport['status']): Promise<CrimeReport> => {
    await delay(300);
    const report = mockCrimeReports.find(r => r._id === id);
    if (!report) throw new Error('Report not found');
    return { ...report, status };
  },

  // Heatmap
  getHeatmapData: async (): Promise<HeatmapPoint[]> => {
    await delay(200);
    return mockHeatmapPoints;
  },

  // Emergency Services
  getEmergencyServices: async (): Promise<EmergencyService[]> => {
    await delay(300);
    return mockEmergencyServices;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(200);
    return mockNotifications;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(300);
    return mockDashboardStats;
  },
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
