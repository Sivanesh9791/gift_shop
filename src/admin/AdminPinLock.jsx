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
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div
        className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full transition-all duration-500 ${
          shake ? 'animate-pulse' : ''
        }`}
      >
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <span className="text-5xl">🎁</span>
          <div className="mt-2">
            <span style={{fontFamily: 'Playfair Display, serif'}}
              className="block text-3xl font-black tracking-widest text-red-600 uppercase">
              TRESOR GIFTS
            </span>
            <span className="block text-xs font-bold tracking-widest text-gray-400 uppercase mt-1">
              ✦ The Customized Gift Store ✦
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Admin Panel — Enter PIN
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                index < pin.length
                  ? 'bg-red-600 border-red-600'
                  : 'bg-gray-800 border-gray-800'
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
                  : 'bg-gray-800 text-white hover:bg-gray-700'
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
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                : 'bg-gray-800 text-white hover:bg-gray-700'
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
                : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-700'
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
