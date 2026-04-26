interface LanguageSwitcherProps {
  currentLang: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export default function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex justify-center gap-2 mb-3">
      <label className="flex items-center gap-1 cursor-pointer text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <input
          type="radio"
          name="language"
          value="en"
          checked={currentLang === 'en'}
          onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ar')}
          className="cursor-pointer accent-emerald-500"
        />
        <span>English</span>
      </label>
      <label className="flex items-center gap-1 cursor-pointer text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <input
          type="radio"
          name="language"
          value="ar"
          checked={currentLang === 'ar'}
          onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ar')}
          className="cursor-pointer accent-emerald-500"
        />
        <span>العربية</span>
      </label>
    </div>
  );
}
