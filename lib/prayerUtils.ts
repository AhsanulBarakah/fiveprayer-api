import type { PrayerTimesResponse } from './api';

export interface NextPrayer {
  name: string;
  time: string;
  icon: string;
}

const prayerIcons: { [key: string]: string } = {
  'fajr': '🌙',
  'dhuhr': '☀️',
  'asr': '🌤️',
  'maghrib': '🌇',
  'isha': '🌃',
};

export function getNextPrayer(prayerData: PrayerTimesResponse): NextPrayer | null {
  if (!prayerData) return null;

  const apiNextPrayer = prayerData.next_prayer['en'].toLowerCase();
  const prayerKeys: (keyof typeof prayerData.prayer_schedule)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // Find the prayer key by matching the API's next_prayer name with prayer_schedule names
  for (const key of prayerKeys) {
    const prayer = prayerData.prayer_schedule[key];
    if (!prayer) continue;
    
    const prayerName = prayer.name['en'].toLowerCase();
    if (prayerName === apiNextPrayer || apiNextPrayer.includes(prayerName) || prayerName.includes(apiNextPrayer)) {
      return {
        name: key,
        time: prayer.begins['en'],
        icon: prayerIcons[key],
      };
    }
  }
  
  return null;
}

export function shouldUpdateNextPrayer(prayerData: PrayerTimesResponse): boolean {
  if (!prayerData) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'fajr', iqamah: prayerData.prayer_schedule.fajr.iqamah?.['en'] },
    { name: 'dhuhr', iqamah: prayerData.prayer_schedule.dhuhr.iqamah?.['en'] },
    { name: 'asr', iqamah: prayerData.prayer_schedule.asr.iqamah?.['en'] },
    { name: 'maghrib', iqamah: prayerData.prayer_schedule.maghrib.iqamah?.['en'] },
    { name: 'isha', iqamah: prayerData.prayer_schedule.isha.iqamah?.['en'] },
  ];

  for (const prayer of prayers) {
    if (prayer.iqamah) {
      const iqamahMinutes = parseTime(prayer.iqamah);
      if (currentMinutes >= iqamahMinutes && currentMinutes < iqamahMinutes + 1) {
        return true;
      }
    }
  }
  return false;
}

function parseTime(timeStr: string): number {
  const isPM = timeStr.toLowerCase().includes('pm');
  const isAM = timeStr.toLowerCase().includes('am');
  const cleanTime = timeStr.replace(/(am|pm|AM|PM|\s)/g, '');
  const [hours, minutes] = cleanTime.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;
  if (isPM && hours !== 12) totalMinutes += 12 * 60;
  if (isAM && hours === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
}
