import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#00bfa5] to-[#1de9b6] animate-in fade-in duration-300">
      <div className="text-center space-y-6">
        <div className="text-white">
          <svg
            className="w-32 h-32 mx-auto mb-4"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="3" fill="none" />
            <path
              d="M30 50C30 38.954 38.954 30 50 30C61.046 30 70 38.954 70 50C70 61.046 61.046 70 50 70C38.954 70 30 61.046 30 50Z"
              fill="white"
            />
            <path
              d="M45 40C45 37.239 47.239 35 50 35C52.761 35 55 37.239 55 40V60C55 62.761 52.761 65 50 65C47.239 65 45 62.761 45 60V40Z"
              fill="#00bfa5"
            />
            <path
              d="M40 45H60C62.761 45 65 47.239 65 50C65 52.761 62.761 55 60 55H40C37.239 55 35 52.761 35 50C35 47.239 37.239 45 40 45Z"
              fill="#00bfa5"
            />
          </svg>
          <h1 className="text-5xl font-bold mb-2">OPPO EGYPT</h1>
          <p className="text-xl font-light opacity-95">نظام المخالفات</p>
        </div>
      </div>
    </div>
  );
}
