'use client';

import { useEffect, useState } from 'react';
import type { PrayerTimesResponse } from '../lib/api';
import LanguageSwitcher from './components/LanguageSwitcher';
import Header from './components/Header';
import NextPrayer from './components/NextPrayer';
import PrayerSchedule from './components/PrayerSchedule';
import Footer from './components/Footer';
import Skeleton from './components/Skeleton';

export default function Home() {
  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }
    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (!prayerData) return;

    // Schedule 1 AM refresh
    const refreshTimeout = scheduleOneAMRefresh();

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
    };
  }, [prayerData, currentLang]);

  function scheduleOneAMRefresh(): NodeJS.Timeout | null {
    const now = new Date();
    const oneAM = new Date(now);
    oneAM.setHours(1, 0, 0, 0);
    
    // If it's already past 1 AM, schedule for tomorrow
    if (now.getTime() > oneAM.getTime()) {
      oneAM.setDate(oneAM.getDate() + 1);
    }
    
    const msUntilOneAM = oneAM.getTime() - now.getTime();
    
    return setTimeout(() => {
      fetch('/api/prayer-times')
        .then(res => res.json())
        .then(setPrayerData)
        .catch(setError);
    }, msUntilOneAM);
  }

  function getNextPrayer(): { name: string; time: string; icon: string } | null {
    if (!prayerData) return null;

    // Normalize the API's next_prayer to match prayer_schedule keys
    const apiNextPrayer = prayerData.next_prayer['en'].toLowerCase();
    const prayerKeyMap: { [key: string]: string } = {
      'fajr': 'fajr',
      'dhuhr': 'dhuhr',
      'asr': 'asr',
      'asra': 'asr', // Normalize "asra" to "asr"
      'maghrib': 'maghrib',
      'isha': 'isha',
    };
    
    const prayerKey = prayerKeyMap[apiNextPrayer] || apiNextPrayer;
    const prayer = prayerData.prayer_schedule[prayerKey as keyof typeof prayerData.prayer_schedule];
    
    if (!prayer) return null;

    const prayerIcons: { [key: string]: string } = {
      'fajr': '🌙',
      'dhuhr': '☀️',
      'asr': '🌤️',
      'maghrib': '🌇',
      'isha': '🌃',
    };

    return {
      name: prayerKey,
      time: prayer.begins['en'],
      icon: prayerIcons[prayerKey] || '🌙',
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

  if (isLoading) {
    return <Skeleton />;
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
              nextPrayer={prayerData.prayer_schedule[nextPrayer.name as keyof typeof prayerData.prayer_schedule].name[currentLang]}
              nextTime={prayerData.prayer_schedule[nextPrayer.name as keyof typeof prayerData.prayer_schedule].begins[currentLang]}
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
