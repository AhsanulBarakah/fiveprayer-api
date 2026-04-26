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

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  return (
    <div className="text-center mb-3 pb-3 border-b border-gray-200">
      <h1 className="text-lg font-bold mb-1">{title}</h1>
      <p className="text-xs text-gray-600 mb-2">{date}</p>
      <p className="text-xs text-gray-500">
        <span>{currentTimeLabel}: </span>
        <span id="live-clock" className="font-mono inline-block min-w-[120px]">{currentTime}</span>
      </p>
    </div>
  );
}
