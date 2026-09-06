import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  X,
  Headphones,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { Language, StudentUser } from '../types';
import { TRANSLATIONS } from '../lib/translations';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  language: Language;
  currentUser: StudentUser | null;
  onLogFocusMinutes: (minutes: number, subject?: string) => void;
}

// Preset durations in minutes
const PRESETS: Record<PomodoroMode, { defaultMinutes: number; options: number[] }> = {
  focus: { defaultMinutes: 25, options: [15, 25, 45, 50, 60] },
  shortBreak: { defaultMinutes: 5, options: [3, 5, 10] },
  longBreak: { defaultMinutes: 15, options: [10, 15, 20, 30] },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  language,
  currentUser,
  onLogFocusMinutes,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState(0);
  const [lastLoggedToast, setLastLoggedToast] = useState<{ minutes: number; time: string } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<AudioNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play melodic completion chime using Web Audio API
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Harmonic chime chord (528Hz Solfeggio + 660Hz E5 + 792Hz G5)
      const frequencies = [528, 660, 792, 1056];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.0);
      });
    } catch (e) {
      console.warn('Audio chime playback not allowed or supported:', e);
    }
  };

  // Toggle ambient focus tone (soft brown noise generator)
  const toggleAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (ambientSoundActive) {
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        setAmbientSoundActive(false);
      } else {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Generate gentle white/brown noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter for smooth rain/hum feel
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        ambientNodeRef.current = gainNode;
        setAmbientSoundActive(true);
      }
    } catch (e) {
      console.warn('Ambient sound toggle error:', e);
      setAmbientSoundActive(false);
    }
  };

  // Cleanup ambient audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer Tick Mechanism
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playCompletionChime();

            // When a Focus session completes, auto-log minutes
            if (mode === 'focus') {
              const minutes = durationMinutes;
              onLogFocusMinutes(minutes, selectedSubject);
              setSessionsCompletedToday((sc) => sc + 1);
              setLastLoggedToast({
                minutes,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              });
              // Auto-switch to short break
              setMode('shortBreak');
              setDurationMinutes(PRESETS.shortBreak.defaultMinutes);
              return PRESETS.shortBreak.defaultMinutes * 60;
            } else {
              // Break ended -> prompt next focus session
              setMode('focus');
              setDurationMinutes(PRESETS.focus.defaultMinutes);
              return PRESETS.focus.defaultMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, durationMinutes, selectedSubject, onLogFocusMinutes, soundEnabled]);

  // Mode Switcher Handler
  const handleModeChange = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    const defMin = PRESETS[newMode].defaultMinutes;
    setDurationMinutes(defMin);
    setTimeLeft(defMin * 60);
  };

  // Custom preset select
  const handlePresetSelect = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  // Reset current timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  // Manual Log Session
  const handleManualLogSession = () => {
    const elapsedSeconds = durationMinutes * 60 - timeLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    onLogFocusMinutes(elapsedMinutes, selectedSubject);
    setLastLoggedToast({
      minutes: elapsedMinutes,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    handleReset();
  };

  // Formatter
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100)
  );

  const subjectsList = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Language',
    'History',
    'Geography',
    'Economics',
    'Civics',
    'General Study',
  ];

  const totalUserMinutes = currentUser?.totalStudyMinutes || 0;
  const totalHours = (totalUserMinutes / 60).toFixed(1);

  return (
    <div className="relative">
      {/* HEADER LAUNCHER PILL BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
          isRunning
            ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] shadow-md shadow-[#C5A059]/20'
            : 'border-[#2D2D30] bg-[#111112] text-[#E0E0E0] hover:border-[#C5A059] hover:text-[#C5A059]'
        }`}
        title={t.timerTitle}
        aria-label="Pomodoro Study Focus Timer"
      >
        <span className="relative flex h-2 w-2">
          {isRunning && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isRunning ? 'bg-[#C5A059]' : 'bg-slate-500'
            }`}
          />
        </span>

        <Timer className="w-3.5 h-3.5 text-[#C5A059]" />

        <span className="font-mono text-xs font-bold tracking-tight">
          {formatTime(timeLeft)}
        </span>

        <span className="hidden xl:inline text-[10px] uppercase font-bold text-slate-400">
          {mode === 'focus' ? 'Focus' : 'Break'}
        </span>
      </button>

      {/* FLOATING TIMER MODAL / POPOVER */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#141416] border-2 border-[#2D2D30] shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-white space-y-4">
            
            {/* Header with Title & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2D30]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                    {t.timerTitle}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {language === 'am' ? 'የትምህርት ትኩረት ጊዜ ቆጣሪ' : language === 'om' ? 'Yeroo Xiyyeeffannoo Barnootaa' : 'Eyoel Focus Study Session'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-[#1A1A1C] border border-[#2D2D30]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#101012] p-1 rounded-xl border border-[#2D2D30] text-[11px] font-bold uppercase tracking-wider">
              <button
                onClick={() => handleModeChange('focus')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  mode === 'focus'
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Focus</span>
              </button>
              <button
                onClick={() => handleModeChange('shortBreak')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  mode === 'shortBreak'
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Short</span>
              </button>
              <button
                onClick={() => handleModeChange('longBreak')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  mode === 'longBreak'
                    ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Long</span>
              </button>
            </div>

            {/* Target Subject Selector (Focus mode only) */}
            {mode === 'focus' && (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#C5A059]" />
                  {t.timerFocusSubject}:
                </span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-[#111112] border border-[#2D2D30] text-white text-xs rounded-lg px-2 py-1 focus:border-[#C5A059] focus:outline-none"
                >
                  {subjectsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Duration Presets */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {PRESETS[mode].options.map((m) => (
                <button
                  key={m}
                  onClick={() => handlePresetSelect(m)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all ${
                    durationMinutes === m
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]'
                      : 'border-[#2D2D30] bg-[#111112] text-slate-400 hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>

            {/* BIG CLOCK DISPLAY WITH CIRCULAR ACCENT */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#18181A] to-[#101012] border border-[#2D2D30] text-center space-y-2 overflow-hidden shadow-inner">
              
              {/* Progress bar line at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2D2D30]">
                <div
                  className="h-full bg-[#C5A059] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                {mode === 'focus'
                  ? `${selectedSubject} Focus`
                  : mode === 'shortBreak'
                  ? 'Recharge & Relax'
                  : 'Restorative Break'}
              </div>

              <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {formatTime(timeLeft)}
              </div>

              <div className="text-[10px] text-slate-400 font-sans">
                {isRunning
                  ? language === 'am' ? 'የትኩረት ጊዜ እየቆጠረ ነው...' : language === 'om' ? 'Xiyyeeffannoon adeemsarra jira...' : 'Session in progress...'
                  : language === 'am' ? 'ለመጀመር ቁልፉን ይጫኑ' : language === 'om' ? 'Jalqabuuf tuqaa' : 'Ready to start'}
              </div>
            </div>

            {/* Controls (Play/Pause, Reset, Finish & Log) */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isRunning
                    ? 'bg-[#2A2A2E] text-white hover:bg-[#35353A] border border-[#C5A059]/40'
                    : 'bg-[#C5A059] text-black hover:bg-[#d8b168] shadow-[#C5A059]/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{t.timerPause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{timeLeft < durationMinutes * 60 ? t.timerResume : t.timerStart}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-[#1A1A1C] border border-[#2D2D30] hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                title={t.timerReset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {mode === 'focus' && timeLeft < durationMinutes * 60 && (
                <button
                  onClick={handleManualLogSession}
                  className="px-3 py-2.5 rounded-xl bg-[#1A1A1C] border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 font-semibold text-xs transition-colors"
                  title="Log focused time elapsed so far"
                >
                  Log
                </button>
              )}
            </div>

            {/* Audio & Ambience Tools */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2D2D30] text-xs">
              
              {/* Sound Chime Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  soundEnabled
                    ? 'bg-[#1A1A1C] border-[#C5A059]/40 text-[#C5A059]'
                    : 'bg-[#121214] border-[#2D2D30] text-slate-500'
                }`}
                title={t.timerSoundChime}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
              </button>

              {/* Ambient Focus White Noise Toggle */}
              <button
                onClick={toggleAmbientSound}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  ambientSoundActive
                    ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                    : 'bg-[#1A1A1C] border-[#2D2D30] text-slate-300 hover:text-white'
                }`}
                title={t.timerAmbientSound}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{ambientSoundActive ? 'Ambience ON' : 'Study Rain'}</span>
              </button>
            </div>

            {/* Total Focused Time & Sessions Status */}
            <div className="p-3 rounded-xl bg-[#101012] border border-[#2D2D30] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.timerTotalFocusTime}
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {totalUserMinutes} mins ({totalHours} hrs)
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.timerSessionsCompleted}
                </span>
                <span className="font-mono font-bold text-[#C5A059] text-sm flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentUser?.pomodoroSessionsCompleted || sessionsCompletedToday}
                </span>
              </div>
            </div>

            {/* Notification Toast when minutes are logged */}
            {lastLoggedToast && (
              <div className="p-2.5 rounded-xl bg-[#C5A059]/10 border border-[#C5A059] text-xs text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-[#C5A059]">+{lastLoggedToast.minutes} mins</span> logged to your profile at {lastLoggedToast.time}!
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};
