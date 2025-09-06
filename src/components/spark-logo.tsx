interface SparkLogoProps {
  className?: string;
  size?: number;
}

export default function SparkLogo({ className = "", size = 32 }: SparkLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      
      {/* Main S shape inspired by your logo */}
      <path
        d="M25 20 
           L70 20 
           C80 20 85 25 85 35
           C85 45 80 50 70 50
           L40 50
           C35 50 32 53 32 58
           C32 63 35 66 40 66
           L75 66
           L75 80
           L30 80
           C20 80 15 75 15 65
           C15 55 20 50 30 50
           L60 50
           C65 50 68 47 68 42
           C68 37 65 34 60 34
           L25 34
           Z"
        fill="url(#sparkGradient)"
      />
      
      {/* Sound waves elements */}
      <g opacity="0.7">
        {/* Small wave */}
        <path
          d="M88 35 Q92 40 88 45"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Medium wave */}
        <path
          d="M90 30 Q96 40 90 50"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Large wave */}
        <path
          d="M92 25 Q100 40 92 55"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      
      {/* Spark/Star element */}
      <g opacity="0.8">
        <path
          d="M15 15 L17 19 L21 17 L17 21 L15 15Z"
          fill="#22d3ee"
        />
        <path
          d="M80 70 L82 74 L86 72 L82 76 L80 70Z"
          fill="#a855f7"
        />
      </g>
    </svg>
  );
}