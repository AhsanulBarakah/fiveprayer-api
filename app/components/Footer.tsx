interface FooterProps {
  timezone: string;
}

export default function Footer({ timezone }: FooterProps) {
  return (
    <>
      <p className="text-center text-xs text-gray-500 mt-3">Timezone: {timezone}</p>
      <p className="text-center text-xs text-gray-400 mt-1 leading-relaxed">
        Please follow your local masjid prayer times. Data provided by fiveprayer API.
      </p>
    </>
  );
}
