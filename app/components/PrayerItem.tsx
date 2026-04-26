interface PrayerItemProps {
  icon: string;
  name: string;
  time: string;
  iqamah?: string;
  iqamahLabel: string;
  isNext: boolean;
  isSunrise?: boolean;
}

export default function PrayerItem({ icon, name, time, iqamah, iqamahLabel, isNext, isSunrise = false }: PrayerItemProps) {
  if (isSunrise) {
    return (
      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg mb-1 opacity-70">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-xs flex-1">{name}</span>
        <span className="font-medium text-xs text-gray-600">{time}</span>
      </div>
    );
  }

  return (
    <div className={`flex justify-between items-center p-1.5 bg-gray-50 rounded-lg mb-1 transition-all gap-1 ${isNext ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-semibold text-xs flex-1">{name}</span>
      <span className={`font-medium text-xs flex flex-col items-end gap-0.5 ${isNext ? 'text-white' : 'text-gray-600'}`}>
        <span>{time}</span>
        {iqamah && (
          <span className={`text-[10px] ${isNext ? 'text-white/80' : 'text-gray-500'}`}>{iqamahLabel}: {iqamah}</span>
        )}
      </span>
    </div>
  );
}
