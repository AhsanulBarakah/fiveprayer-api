interface NextPrayerProps {
  nextPrayerLabel: string;
  nextPrayer: string;
  nextTime: string;
  icon: string;
}

export default function NextPrayer({ nextPrayerLabel, nextPrayer, nextTime, icon }: NextPrayerProps) {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-3 mb-3 text-center text-white relative">
      <span className="absolute top-0 right-2 text-xl">{icon}</span>
      <h2 className="text-xs uppercase tracking-wider opacity-90 mb-1">{nextPrayerLabel}</h2>
      <div className="flex justify-center items-center gap-3">
        <span className="text-base font-bold">{nextPrayer}</span>
        <span className="text-base font-semibold">{nextTime}</span>
      </div>
    </div>
  );
}
