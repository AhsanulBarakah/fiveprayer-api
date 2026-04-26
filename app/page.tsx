'use client';

import { useEffect, useState } from 'react';
import type { PrayerTimesResponse } from '../lib/api';
import LanguageSwitcher from './components/LanguageSwitcher';
import Header from './components/Header';
import NextPrayer from './components/NextPrayer';
import PrayerSchedule from './components/PrayerSchedule';
import Footer from './components/Footer';

export default function Home() {
  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    async function loadPrayerTimes() {
      try {
        const response = await fetch('/api/prayer-times');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setPrayerData(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load prayer times');
      }
    }
    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (!prayerData) return;

    // Check every minute if we should fetch new data
    const fetchInterval = setInterval(() => {
      if (shouldFetchNewData()) {
        fetch('/api/prayer-times')
          .then(res => res.json())
          .then(setPrayerData)
          .catch(setError);
      }
    }, 60000);

    // Schedule midnight refresh
    const midnightTimeout = scheduleMidnightRefresh();

    return () => {
      clearInterval(fetchInterval);
      if (midnightTimeout) clearTimeout(midnightTimeout);
    };
  }, [prayerData, currentLang]);

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

  function shouldFetchNewData(): boolean {
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

  function scheduleMidnightRefresh(): NodeJS.Timeout | null {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    return setTimeout(() => {
      fetch('/api/prayer-times')
        .then(res => res.json())
        .then(setPrayerData)
        .catch(setError);
    }, msUntilMidnight);
  }

  function getNextPrayer(): { name: string; time: string; icon: string } | null {
    if (!prayerData) return null;

    const nextPrayerName = prayerData.next_prayer['en'].toLowerCase();
    const prayerIcons: { [key: string]: string } = {
      'fajr': '🌙',
      'dhuhr': '☀️',
      'asr': '🌤️',
      'maghrib': '🌇',
      'isha': '🌃',
    };

    return {
      name: nextPrayerName,
      time: prayerData.next_time['en'],
      icon: prayerIcons[nextPrayerName] || '🌙',
    };
  }

  const nextPrayer = getNextPrayer();
  const translations = {
    title: { en: 'Prayer Times', ar: 'أوقات الصلاة' },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-2xl border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load Prayer Times</h3>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
            <p className="text-red-700 font-medium text-sm leading-relaxed">{error}</p>
          </div>
          <p className="text-gray-600 text-sm mb-6">Please check your API key configuration and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prayerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-200">
          <LanguageSwitcher 
            currentLang={currentLang} 
            onLanguageChange={setCurrentLang} 
          />
          
          <Header
            title={translations.title[currentLang]}
            date={prayerData.date_translated[currentLang]}
            currentTimeLabel={prayerData.current_local_time_label[currentLang]}
            currentTime={prayerData.current_time[currentLang]}
            currentLang={currentLang}
          />

          {nextPrayer && (
            <NextPrayer
              nextPrayerLabel={prayerData.next_prayer_label[currentLang]}
              nextPrayer={prayerData.next_prayer[currentLang]}
              nextTime={prayerData.next_time[currentLang]}
              icon={nextPrayer.icon}
            />
          )}

          <PrayerSchedule
            prayerData={prayerData}
            currentLang={currentLang}
            nextPrayerName={nextPrayer?.name || ''}
          />

          <Footer timezone={prayerData.timezone} />
        </div>
      </div>
    </div>
  );
}
