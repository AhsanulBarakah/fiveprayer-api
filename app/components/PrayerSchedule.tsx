import PrayerItem from './PrayerItem';
import type { PrayerTimesResponse } from '../../lib/api';

interface PrayerScheduleProps {
  prayerData: PrayerTimesResponse;
  currentLang: 'en' | 'ar';
  nextPrayerName: string;
}

export default function PrayerSchedule({ prayerData, currentLang, nextPrayerName }: PrayerScheduleProps) {
  const prayers = [
    { key: 'fajr', icon: '🌙' },
    { key: 'sunrise', icon: '🌅', isSunrise: true },
    { key: 'dhuhr', icon: '☀️' },
    { key: 'asr', icon: '🌤️' },
    { key: 'maghrib', icon: '🌇' },
    { key: 'isha', icon: '🌃' },
  ];

  return (
    <div>
      {prayers.map((prayer) => {
        const prayerDataKey = prayer.key as keyof typeof prayerData.prayer_schedule;
        const prayerInfo = prayerData.prayer_schedule[prayerDataKey];
        
        if (!prayerInfo) return null;

        if (prayer.isSunrise) {
          return (
            <PrayerItem
              key={prayer.key}
              icon={prayer.icon}
              name={prayerInfo.name?.[currentLang] || prayerInfo.name?.['en'] || ''}
              time={prayerInfo.time?.[currentLang] || prayerInfo.time?.['en'] || ''}
              iqamahLabel={prayerData.iqamah_label[currentLang] || prayerData.iqamah_label['en']}
              isNext={false}
              isSunrise={true}
            />
          );
        }

        return (
          <PrayerItem
            key={prayer.key}
            icon={prayer.icon}
            name={prayerInfo.name[currentLang] || prayerInfo.name['en']}
            time={prayerInfo.begins[currentLang] || prayerInfo.begins['en']}
            iqamah={prayerInfo.iqamah?.[currentLang] || prayerInfo.iqamah?.['en']}
            iqamahLabel={prayerData.iqamah_label[currentLang] || prayerData.iqamah_label['en']}
            isNext={nextPrayerName === prayer.key}
          />
        );
      })}
    </div>
  );
}
