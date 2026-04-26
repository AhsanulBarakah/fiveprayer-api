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
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 opacity-70">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-sm flex-1">{name}</span>
        <span className="font-medium text-sm text-gray-600">{time}</span>
      </div>
    );
  }

  return (
    <div className={`flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-1.5 transition-all gap-1.5 ${isNext ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-[1.02] shadow-lg' : ''}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-sm flex-1">{name}</span>
      <span className={`font-medium text-sm flex flex-col items-end gap-0.5 ${isNext ? 'text-white' : 'text-gray-600'}`}>
        <span>{time}</span>
        {iqamah && (
          <span className={`text-xs ${isNext ? 'text-white/80' : 'text-gray-500'}`}>{iqamahLabel}: {iqamah}</span>
        )}
      </span>
    </div>
  );
}
