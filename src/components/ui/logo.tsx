import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="godGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5B544" />
          <stop offset="100%" stopColor="#D4922F" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#godGradient)" />
      <path
        d="M20 24C20 21.7909 21.7909 20 24 20H40C42.2091 20 44 21.7909 44 24V32H36C33.7909 32 32 33.7909 32 36V44H24C21.7909 44 20 42.2091 20 40V24Z"
        stroke="#0B0D17"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="38" cy="38" r="4" fill="#0B0D17" />
    </svg>
  );
}