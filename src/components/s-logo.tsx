interface SLogoProps {
  className?: string;
  size?: number;
}

export default function SLogo({ className = "", size = 24 }: SLogoProps) {
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
        <linearGradient id="sGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Clean modern S - instantly recognizable */}
      <path
        d="M70 20
           L30 20
           C20 20 15 25 15 35
           C15 45 20 50 30 50
           L60 50
           C65 50 68 53 68 58
           C68 63 65 66 60 66
           L30 66
           L30 80
           L70 80
           C80 80 85 75 85 65
           C85 55 80 50 70 50
           L40 50
           C35 50 32 47 32 42
           C32 37 35 34 40 34
           L70 34
           Z"
        fill="url(#sGradient)"
      />
      
      {/* White outline for contrast and definition */}
      <path
        d="M70 20
           L30 20
           C20 20 15 25 15 35
           C15 45 20 50 30 50
           L60 50
           C65 50 68 53 68 58
           C68 63 65 66 60 66
           L30 66
           L30 80
           L70 80
           C80 80 85 75 85 65
           C85 55 80 50 70 50
           L40 50
           C35 50 32 47 32 42
           C32 37 35 34 40 34
           L70 34
           Z"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
    </svg>
  );
}