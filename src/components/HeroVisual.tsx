export function HeroVisual() {
  return (
    <svg
      viewBox="0 0 480 480"
      className="h-full w-full"
      role="img"
      aria-label="Amad key visual"
    >
      <defs>
        <linearGradient id="amad-grad-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#837FD8" />
          <stop offset="100%" stopColor="#6b66c7" />
        </linearGradient>
        <linearGradient id="amad-grad-2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#CD907E" />
          <stop offset="100%" stopColor="#e0b0a1" />
        </linearGradient>
      </defs>

      <circle cx="240" cy="240" r="210" fill="#FFFFFF" opacity="0.06" />
      <circle cx="240" cy="240" r="165" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1" />

      <circle cx="240" cy="130" r="46" fill="url(#amad-grad-1)" />
      <circle cx="140" cy="300" r="60" fill="url(#amad-grad-2)" />
      <circle cx="335" cy="300" r="38" fill="#FFFFFF" opacity="0.9" />

      <path
        d="M140 300 L240 130 L335 300 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <circle cx="240" cy="130" r="6" fill="#FDF8F5" />
      <circle cx="140" cy="300" r="6" fill="#FDF8F5" />
      <circle cx="335" cy="300" r="6" fill="#002134" />
    </svg>
  );
}
