import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Calculator, VenusAndMars, ArrowRight, Sparkles } from 'lucide-react';
import { UserSettings, THEMES, ThemeId } from '../hooks/useLocalStorage';

interface OnboardingModalProps {
  onComplete: (settings: Partial<UserSettings>) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [sex, setSex] = useState<'male' | 'female' | 'other' | ''>('');
  const [theme, setTheme] = useState<ThemeId>('dark');

  const handleDobChange = (value: string) => {
    setDob(value);
    // Auto-calculate age from DOB
    if (value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 150) {
        setAge(calculatedAge);
      }
    }
  };

  const handleComplete = () => {
    onComplete({
      name,
      dob,
      age: age as number,
      sex: sex as 'male' | 'female' | 'other',
      theme,
      onboardingComplete: true,
    });
  };

  const canProceedFromStep0 = name.trim().length > 0;
  const canProceedFromStep1 = dob && age !== '' && sex !== '';
  const canComplete = true; // theme is always selected

  const steps = [
    // Step 0: Name
    <div key="name" className="flex flex-col items-center gap-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center">
        <User className="w-8 h-8 text-white/80" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-serif text-white mb-2">Welcome to glyph.</h2>
        <p className="text-white/50 text-sm">Let's personalize your journey.</p>
      </div>
      <div className="w-full max-w-xs">
        <label className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all text-lg"
          autoFocus
        />
      </div>
    </div>,

    // Step 1: DOB, Age, Sex
    <div key="details" className="flex flex-col items-center gap-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center">
        <VenusAndMars className="w-8 h-8 text-white/80" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-serif text-white mb-2">Tell us about yourself</h2>
        <p className="text-white/50 text-sm">This helps us personalize your cosmic experience.</p>
      </div>
      <div className="w-full max-w-xs space-y-5">
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => handleDobChange(e.target.value)}
            className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white focus:outline-none focus:border-white/20 transition-all [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
            <Calculator className="w-3 h-3" /> Age
          </label>
          <input
            type="number"
            min={1}
            max={150}
            value={age}
            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="Your age"
            className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest mb-2">Sex</label>
          <div className="flex gap-3">
            {(['male', 'female', 'other'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSex(option)}
                className={`flex-1 py-3 px-4 rounded-2xl border text-sm font-medium transition-all capitalize ${
                  sex === option
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white/70'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 2: Theme Selection
    <div key="theme" className="flex flex-col items-center gap-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-white/80" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-serif text-white mb-2">Choose your theme</h2>
        <p className="text-white/50 text-sm">Set the mood for your reading sanctuary.</p>
      </div>
      <div className="w-full max-w-sm grid grid-cols-2 gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              theme === t.id
                ? 'border-white/20 bg-white/10'
                : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10'
            }`}
          >
            <div
              className="w-6 h-6 rounded-full border border-white/10 shrink-0"
              style={{ backgroundColor: t.accent }}
            />
            <div className="flex flex-col items-start">
              <span className="text-white text-sm font-medium">{t.label}</span>
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: t.primary + '80' }}
              >
                {t.id}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-violet-900/20 blur-[200px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-30%] right-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-900/15 blur-[200px]"
        />
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-auto p-8"
      >
        {steps[step]}

        {/* Progress dots + Navigation */}
        <div className="flex items-center justify-between mt-10 w-full max-w-xs mx-auto">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === step ? 'bg-white/60 w-6' : i < step ? 'bg-white/20' : 'bg-white/5'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (step < steps.length - 1) {
                const canProceed = step === 0 ? canProceedFromStep0 : canProceedFromStep1;
                if (canProceed) setStep(step + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={
              (step === 0 && !canProceedFromStep0) ||
              (step === 1 && !canProceedFromStep1)
            }
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step < steps.length - 1 ? (
              <>Next <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Begin Journey <Sparkles className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
