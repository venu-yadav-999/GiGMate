
import { Platform, EarningEntry, ImportMethod } from '../types';

interface SMS {
  sender: string;
  body: string;
  timestamp: string;
}

// Mock patterns for Indian Gig Platforms
const PATTERNS: Record<Platform, RegExp> = {
  Swiggy: /Congratulations! You earned ₹(\d+(?:\.\d+)?) for (\d+) orders today\./i,
  Zomato: /Your total earnings for today is ₹(\d+(?:\.\d+)?)\. You completed (\d+) deliveries\./i,
  Uber: /Uber: ₹(\d+(?:\.\d+)?) was added to your wallet for (\d+) trips\./i,
  Rapido: /Rapido Captain: You completed (\d+) rides and earned ₹(\d+(?:\.\d+)?)\./i,
  Zepto: /Zepto: ₹(\d+(?:\.\d+)?) earned for (\d+) batches today\./i,
  Blinkit: /Blinkit: Total payout for today is ₹(\d+(?:\.\d+)?)\. Orders: (\d+)/i
};

export const parseSMS = (sms: SMS): Partial<EarningEntry> | null => {
  for (const [platform, regex] of Object.entries(PATTERNS)) {
    const match = sms.body.match(regex);
    if (match) {
      const amount = parseFloat(platform === 'Rapido' ? match[2] : match[1]);
      const orders = parseInt(platform === 'Rapido' ? match[1] : match[2]);
      
      return {
        platform: platform as Platform,
        amount,
        orders,
        date: new Date(sms.timestamp).toISOString().split('T')[0],
        importMethod: 'SMS' as ImportMethod,
        durationHours: 0 // SMS usually doesn't have duration
      };
    }
  }
  return null;
};

export const getMockSMS = (): SMS[] => [
  { sender: 'BZ-SWIGGY', body: 'Congratulations! You earned ₹845.50 for 12 orders today.', timestamp: new Date().toISOString() },
  { sender: 'AD-UBERIN', body: 'Uber: ₹1250.00 was added to your wallet for 8 trips.', timestamp: new Date().toISOString() },
  { sender: 'JM-ZOMATO', body: 'Your total earnings for today is ₹920. deliveries completed: 15.', timestamp: new Date().toISOString() }
];
