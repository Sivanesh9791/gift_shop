import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, label = 'Sale Ends In' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isEnded: false
      };
    };

    // Initial call
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isEnded) {
    return (
      <div className="bg-white/20 rounded-xl px-6 py-4 text-center">
        <p className="text-xl font-bold uppercase tracking-widest">Sale Ended!</p>
      </div>
    );
  }

  const TimeBlock = ({ value, unit }) => (
    <div className="flex flex-col items-center min-w-[60px] bg-white/20 rounded-lg px-3 py-2 text-center backdrop-blur-sm border border-white/10">
      <span className="text-2xl font-bold font-mono tracking-tighter">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">
        {unit}
      </span>
    </div>
  );

  return (
    <div className="inline-flex flex-col items-center">
      {label && <p className="text-sm font-bold uppercase tracking-widest mb-3 opacity-90">{label}</p>}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <TimeBlock value={timeLeft.days} unit="Days" />
        <span className="text-xl font-bold opacity-50 pb-4">:</span>
        <TimeBlock value={timeLeft.hours} unit="Hours" />
        <span className="text-xl font-bold opacity-50 pb-4">:</span>
        <TimeBlock value={timeLeft.minutes} unit="Mins" />
        <span className="text-xl font-bold opacity-50 pb-4">:</span>
        <TimeBlock value={timeLeft.seconds} unit="Secs" />
      </div>
    </div>
  );
}
