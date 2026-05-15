import { useState, useEffect } from 'react';
import { useAdmin } from './context/AdminContext';

const AdminPinLock = () => {
  const { verifyPin, lockoutUntil, pinAttempts } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setIsLocked(true);
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remaining > 0) {
          setCountdown(remaining);
        } else {
          setIsLocked(false);
          setCountdown(null);
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [lockoutUntil]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked) return;

      if (/^\d$/.test(e.key) && pin.length < 4) {
        addDigit(e.key);
      } else if (e.key === 'Backspace') {
        removeDigit();
      } else if (e.key === 'Enter') {
        submitPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isLocked]);

  const addDigit = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      setError('');
    }
  };

  const removeDigit = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const submitPin = () => {
    if (pin.length !== 4) {
      setError('Please enter 4 digits');
      return;
    }

    const result = verifyPin(pin);

    if (result === 'success') {
      setPin('');
      setError('');
      // Fade out happens automatically due to isAdminAuthenticated check in parent
    } else if (result === 'locked') {
      setPin('');
      setError('Too many attempts. Try again in 30 seconds');
      setIsLocked(true);
      triggerShake();
    } else if (result.startsWith('wrong')) {
      setPin('');
      const attemptsLeft = result.split('-')[1];
      setError(`Wrong PIN — ${attemptsLeft} attempt${attemptsLeft !== '1' ? 's' : ''} remaining`);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleNumberClick = (num) => {
    if (!isLocked) {
      addDigit(String(num));
    }
  };

  const handleClear = () => {
    if (!isLocked) {
      removeDigit();
    }
  };

  const handleSubmit = () => {
    if (!isLocked) {
      submitPin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full transition-all duration-500 ${
          shake ? 'animate-pulse' : ''
        }`}
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎁</div>
          <span className="text-3xl font-black tracking-widest bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent uppercase">
            GIFTINY
          </span>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Admin Panel</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your PIN to continue</p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                index < pin.length
                  ? 'bg-rose-500 border-rose-500'
                  : 'bg-gray-100 border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className={`text-center mb-6 p-3 rounded-lg ${
            isLocked
              ? 'bg-red-100 text-red-700'
              : 'bg-red-50 text-red-600'
          } text-sm font-medium`}>
            {error}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* 1-9 */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isLocked}
              className={`h-16 rounded-full text-xl font-bold transition-all ${
                isLocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-rose-50 active:bg-rose-100'
              }`}
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={isLocked}
            className={`h-16 rounded-full text-lg font-bold transition-all ${
              isLocked
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            ← Clear
          </button>

          {/* 0 */}
          <button
            onClick={() => handleNumberClick(0)}
            disabled={isLocked}
            className={`h-16 rounded-full text-xl font-bold transition-all ${
              isLocked
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-rose-50 active:bg-rose-100'
            }`}
          >
            0
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLocked}
            className={`h-16 rounded-full text-lg font-bold transition-all col-span-1 ${
              isLocked
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700'
            }`}
          >
            ✓ Enter
          </button>
        </div>

        {/* Lockout Timer */}
        {isLocked && countdown !== null && (
          <div className="text-center text-sm text-gray-500">
            Too many attempts. Try again in {countdown}s
          </div>
        )}

        {/* Keyboard Hint */}
        {!isLocked && (
          <div className="text-center text-xs text-gray-400 mt-4">
            💡 You can also use your keyboard (0-9, Backspace, Enter)
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPinLock;
