import { useEffect } from 'react';

interface HeaderProps {
  title: string;
  date: string;
  currentTimeLabel: string;
  currentTime: string;
  currentLang: 'en' | 'ar';
}

export default function Header({ title, date, currentTimeLabel, currentTime, currentLang }: HeaderProps) {
  useEffect(() => {
    updateClock();
  }, [currentLang]);

  function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
      const now = new Date();
      const timeString = now.toLocaleTimeString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      clockElement.textContent = timeString;
    }
  }

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  return (
    <div className="text-center mb-4 pb-4 border-b border-gray-200">
      <div className="inline-block bg-gradient-to-r from-emerald-50 to-yellow-50 rounded-2xl px-6 py-4 mb-2">
        <h1 className="text-2xl font-bold h-8 bg-gradient-to-r from-emerald-600 to-yellow-500 bg-clip-text text-transparent">{title}</h1>
      </div>
      <p className="text-sm text-gray-600 mb-2 h-5 font-medium">{date}</p>
      <div className="inline-flex items-center bg-gray-50 rounded-full px-4 py-2">
        <span className="font-medium text-gray-700">{currentTimeLabel}:</span>
        <span id="live-clock" className="font-mono inline-block min-w-[140px] font-semibold text-emerald-600 ml-1">{currentTime}</span>
      </div>
    </div>
  );
}
