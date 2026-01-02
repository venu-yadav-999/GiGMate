
import React from 'react';
import { 
  LayoutDashboard, 
  IndianRupee, 
  MapPin, 
  Wallet, 
  Briefcase 
} from 'lucide-react';
import { AppTab, Platform, EarningEntry } from './types';

export const NAV_ITEMS = [
  { id: AppTab.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={20} /> },
  { id: AppTab.EARNINGS, label: 'Earnings', icon: <IndianRupee size={20} /> },
  { id: AppTab.MAP, label: 'Hotspots', icon: <MapPin size={20} /> },
  { id: AppTab.FINANCE, label: 'Money', icon: <Wallet size={20} /> },
  { id: AppTab.CAREER, label: 'Career', icon: <Briefcase size={20} /> },
];

export const PLATFORM_COLORS: Record<Platform, string> = {
  Swiggy: 'bg-orange-500',
  Zomato: 'bg-red-600',
  Uber: 'bg-black',
  Rapido: 'bg-yellow-400',
  Zepto: 'bg-purple-600',
  Blinkit: 'bg-yellow-500',
};

export const MOCK_EARNINGS: EarningEntry[] = [
  // Added missing required property 'importMethod' to satisfy EarningEntry type
  { id: '1', platform: 'Swiggy', amount: 850, date: '2023-10-25', orders: 12, durationHours: 6, importMethod: 'MANUAL' },
  { id: '2', platform: 'Zomato', amount: 920, date: '2023-10-25', orders: 15, durationHours: 5.5, importMethod: 'MANUAL' },
  { id: '3', platform: 'Uber', amount: 1200, date: '2023-10-24', orders: 8, durationHours: 7, importMethod: 'MANUAL' },
  { id: '4', platform: 'Rapido', amount: 450, date: '2023-10-24', orders: 20, durationHours: 4, importMethod: 'MANUAL' },
];
