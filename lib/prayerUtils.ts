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

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers: { key: string; time: string; icon: string }[] = [
    { key: 'fajr', time: prayerData.prayer_schedule.fajr.begins['en'], icon: prayerIcons['fajr'] },
    { key: 'dhuhr', time: prayerData.prayer_schedule.dhuhr.begins['en'], icon: prayerIcons['dhuhr'] },
    { key: 'asr', time: prayerData.prayer_schedule.asr.begins['en'], icon: prayerIcons['asr'] },
    { key: 'maghrib', time: prayerData.prayer_schedule.maghrib.begins['en'], icon: prayerIcons['maghrib'] },
    { key: 'isha', time: prayerData.prayer_schedule.isha.begins['en'], icon: prayerIcons['isha'] },
  ];

  for (const prayer of prayers) {
    const prayerMinutes = parseTime(prayer.time);
    if (currentMinutes < prayerMinutes) {
      return {
        name: prayer.key,
        time: prayer.time,
        icon: prayer.icon,
      };
    }
  }
  
  // If all prayers have passed, return the first prayer (fajr) for tomorrow
  return prayers[0] ? { name: prayers[0].key, time: prayers[0].time, icon: prayers[0].icon } : null;
}

export function shouldUpdateNextPrayer(prayerData: PrayerTimesResponse): boolean {
  // Always return true to update next prayer every minute
  // This ensures the highlight changes dynamically as time passes
  return true;
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
