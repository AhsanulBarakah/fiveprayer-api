'use client';

import { useEffect, useState } from 'react';
import type { PrayerTimesResponse } from '../lib/api';

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

    // Update clock every second
    const clockInterval = setInterval(updateClock, 1000);
    
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
      clearInterval(clockInterval);
      clearInterval(fetchInterval);
      if (midnightTimeout) clearTimeout(midnightTimeout);
    };
  }, [prayerData, currentLang]);

  // Update clock immediately when language changes
  useEffect(() => {
    updateClock();
  }, [currentLang]);

  function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      if (currentLang === 'ar') {
        const toArabicNumeral = (n: string) => {
          const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
          return n.replace(/\d/g, (d) => arabicNumerals[parseInt(d)]);
        };
        const arabicAmpm = hours >= 12 ? 'م' : 'ص';
        clockElement.textContent = `${toArabicNumeral(displayHours.toString())}:${toArabicNumeral(minutes)}:${toArabicNumeral(seconds)} ${arabicAmpm}`;
      } else {
        clockElement.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
      }
    }
  }

  function parseTime(timeStr: string): number {
    const isPM = timeStr.toLowerCase().includes('pm') || timeStr.includes('م');
    const isAM = timeStr.toLowerCase().includes('am') || timeStr.includes('ص');
    const cleanTime = timeStr.replace(/(am|pm|AM|PM|م|ص|\s)/g, '');
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
      { name: 'fajr', iqamah: prayerData.prayer_schedule.fajr.iqamah?.[currentLang] },
      { name: 'dhuhr', iqamah: prayerData.prayer_schedule.dhuhr.iqamah?.[currentLang] },
      { name: 'asr', iqamah: prayerData.prayer_schedule.asr.iqamah?.[currentLang] },
      { name: 'maghrib', iqamah: prayerData.prayer_schedule.maghrib.iqamah?.[currentLang] },
      { name: 'isha', iqamah: prayerData.prayer_schedule.isha.iqamah?.[currentLang] },
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

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers: { name: string; time: string; icon: string }[] = [
      { name: 'fajr', time: prayerData.prayer_schedule.fajr.begins[currentLang], icon: '🌙' },
      { name: 'dhuhr', time: prayerData.prayer_schedule.dhuhr.begins[currentLang], icon: '☀️' },
      { name: 'asr', time: prayerData.prayer_schedule.asr.begins[currentLang], icon: '🌤️' },
      { name: 'maghrib', time: prayerData.prayer_schedule.maghrib.begins[currentLang], icon: '🌇' },
      { name: 'isha', time: prayerData.prayer_schedule.isha.begins[currentLang], icon: '🌃' },
    ];

    for (const prayer of prayers) {
      const prayerMinutes = parseTime(prayer.time);
      if (currentMinutes < prayerMinutes) {
        return prayer;
      }
    }
    return prayers[0] || null;
  }

  const nextPrayer = getNextPrayer();
  const translations = {
    title: { en: 'Prayer Times', ar: 'أوقات الصلاة' },
    schedule_label: { en: "Today's Schedule", ar: 'جدول اليوم' },
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
          {/* Language Switcher */}
          <div className="flex justify-center gap-3 mb-4">
            <label className="flex items-center gap-1 cursor-pointer text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <input
                type="radio"
                name="language"
                value="en"
                checked={currentLang === 'en'}
                onChange={(e) => setCurrentLang(e.target.value as 'en' | 'ar')}
                className="cursor-pointer accent-emerald-500"
              />
              <span>English</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <input
                type="radio"
                name="language"
                value="ar"
                checked={currentLang === 'ar'}
                onChange={(e) => setCurrentLang(e.target.value as 'en' | 'ar')}
                className="cursor-pointer accent-emerald-500"
              />
              <span>العربية</span>
            </label>
          </div>

          {/* Header */}
          <div className="text-center mb-4 pb-4 border-b border-gray-200">
            <h1 className="text-xl font-bold mb-1">{translations.title[currentLang]}</h1>
            <p className="text-sm text-gray-600 mb-3">{prayerData.date_translated[currentLang]}</p>
            <p className="text-xs text-gray-500">
              <span>{prayerData.current_local_time_label[currentLang]}: </span>
              <span id="live-clock" className="font-mono inline-block min-w-[120px]">{prayerData.current_time[currentLang]}</span>
            </p>
          </div>

          {/* Next Prayer */}
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-4 mb-4 text-center text-white relative">
            <span className="absolute top-0 right-2 text-2xl">{nextPrayer?.icon || '🌙'}</span>
            <h2 className="text-xs uppercase tracking-wider opacity-90 mb-1">{prayerData.next_prayer_label[currentLang]}</h2>
            <div className="flex justify-center items-center gap-4">
              <span className="text-lg font-bold">{prayerData.next_prayer[currentLang]}</span>
              <span className="text-lg font-semibold">{prayerData.next_time[currentLang]}</span>
            </div>
          </div>

          {/* Prayer Schedule */}
          <div>
            <h3 className="text-base font-semibold mb-2">{translations.schedule_label[currentLang]}</h3>
            
            <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${nextPrayer?.name === 'fajr' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
              <span className="text-xl">🌙</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.fajr.name[currentLang]}</span>
              <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${nextPrayer?.name === 'fajr' ? 'text-white' : 'text-gray-600'}`}>
                <span>{prayerData.prayer_schedule.fajr.begins[currentLang]}</span>
                <span className={`text-xs ${nextPrayer?.name === 'fajr' ? 'text-white/80' : 'text-gray-500'}`}>{prayerData.iqamah_label[currentLang]}: {prayerData.prayer_schedule.fajr.iqamah?.[currentLang]}</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 opacity-70">
              <span className="text-xl">🌅</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.sunrise.name?.[currentLang]}</span>
              <span className="font-medium text-sm text-gray-600">{prayerData.prayer_schedule.sunrise.time?.[currentLang]}</span>
            </div>

            <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${nextPrayer?.name === 'dhuhr' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
              <span className="text-xl">☀️</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.dhuhr.name[currentLang]}</span>
              <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${nextPrayer?.name === 'dhuhr' ? 'text-white' : 'text-gray-600'}`}>
                <span>{prayerData.prayer_schedule.dhuhr.begins[currentLang]}</span>
                <span className={`text-xs ${nextPrayer?.name === 'dhuhr' ? 'text-white/80' : 'text-gray-500'}`}>{prayerData.iqamah_label[currentLang]}: {prayerData.prayer_schedule.dhuhr.iqamah?.[currentLang]}</span>
              </span>
            </div>

            <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${nextPrayer?.name === 'asr' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
              <span className="text-xl">🌤️</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.asr.name[currentLang]}</span>
              <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${nextPrayer?.name === 'asr' ? 'text-white' : 'text-gray-600'}`}>
                <span>{prayerData.prayer_schedule.asr.begins[currentLang]}</span>
                <span className={`text-xs ${nextPrayer?.name === 'asr' ? 'text-white/80' : 'text-gray-500'}`}>{prayerData.iqamah_label[currentLang]}: {prayerData.prayer_schedule.asr.iqamah?.[currentLang]}</span>
              </span>
            </div>

            <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${nextPrayer?.name === 'maghrib' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
              <span className="text-xl">🌇</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.maghrib.name[currentLang]}</span>
              <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${nextPrayer?.name === 'maghrib' ? 'text-white' : 'text-gray-600'}`}>
                <span>{prayerData.prayer_schedule.maghrib.begins[currentLang]}</span>
                <span className={`text-xs ${nextPrayer?.name === 'maghrib' ? 'text-white/80' : 'text-gray-500'}`}>{prayerData.iqamah_label[currentLang]}: {prayerData.prayer_schedule.maghrib.iqamah?.[currentLang]}</span>
              </span>
            </div>

            <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${nextPrayer?.name === 'isha' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
              <span className="text-xl">🌃</span>
              <span className="font-semibold text-sm flex-1">{prayerData.prayer_schedule.isha.name[currentLang]}</span>
              <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${nextPrayer?.name === 'isha' ? 'text-white' : 'text-gray-600'}`}>
                <span>{prayerData.prayer_schedule.isha.begins[currentLang]}</span>
                <span className={`text-xs ${nextPrayer?.name === 'isha' ? 'text-white/80' : 'text-gray-500'}`}>{prayerData.iqamah_label[currentLang]}: {prayerData.prayer_schedule.isha.iqamah?.[currentLang]}</span>
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">Timezone: {prayerData.timezone}</p>
          <p className="text-center text-xs text-gray-400 mt-1 leading-relaxed">Please follow your local masjid prayer times. Data provided by fiveprayer API.</p>
        </div>
      </div>
    </div>
  );
}
