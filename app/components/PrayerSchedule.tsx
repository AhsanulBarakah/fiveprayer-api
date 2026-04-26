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
      <h3 className="text-base font-semibold mb-2">
        {currentLang === 'en' ? "Today's Schedule" : 'جدول اليوم'}
      </h3>
      
      {prayers.map((prayer) => {
        const prayerDataKey = prayer.key as keyof typeof prayerData.prayer_schedule;
        const prayerInfo = prayerData.prayer_schedule[prayerDataKey];
        
        if (!prayerInfo) return null;

        if (prayer.isSunrise) {
          return (
            <PrayerItem
              key={prayer.key}
              icon={prayer.icon}
              name={prayerInfo.name?.[currentLang] || ''}
              time={prayerInfo.time?.[currentLang] || ''}
              iqamahLabel={prayerData.iqamah_label[currentLang]}
              isNext={false}
              isSunrise={true}
            />
          );
        }

        return (
          <PrayerItem
            key={prayer.key}
            icon={prayer.icon}
            name={prayerInfo.name[currentLang]}
            time={prayerInfo.begins[currentLang]}
            iqamah={prayerInfo.iqamah?.[currentLang]}
            iqamahLabel={prayerData.iqamah_label[currentLang]}
            isNext={nextPrayerName === prayer.key}
          />
        );
      })}
    </div>
  );
}
