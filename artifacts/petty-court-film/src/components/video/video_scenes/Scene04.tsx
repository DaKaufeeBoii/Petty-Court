import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { JudgePortrait, Seal } from './CourtMarks';

const EASE = [0.2, 0.9, 0.25, 1] as const;

export function Scene04() {
  const [step, setStep] = useState(0);
  useSceneTimer([
    { time: 400, callback: () => setStep(1) },
    { time: 1100, callback: () => setStep(2) },
    { time: 1750, callback: () => setStep(3) },
    { time: 2050, callback: () => setStep(4) },
    { time: 2950, callback: () => setStep(5) },
    { time: 4150, callback: () => setStep(6) },
  ]);
  return (
    <motion.section className="shot shot-four" initial={{ clipPath: 'circle(10% at 50% 50%)', scale: 1.12 }} animate={{ clipPath: 'circle(78% at 50% 50%)', scale: 1 }} exit={{ scale: 1.4, opacity: 0 }} transition={{ duration: .72, ease: EASE }}>
      <div className="verdict-field">
        <div className="verdict-orbit orbit-a" /><div className="verdict-orbit orbit-b" />
        <div className="verdict-kicker">THE HONORABLE</div>
        <motion.div className="judge-hero" initial={{ scale: .74, y: 30 }} animate={{ scale: step >= 1 ? 1 : .74, y: step >= 1 ? 0 : 30 }} transition={{ type: 'spring', stiffness: 190, damping: 17 }}><JudgePortrait /></motion.div>
        <motion.div className="judge-nameplate" initial={{ scaleX: 0 }} animate={{ scaleX: step >= 2 ? 1 : 0 }} transition={{ duration: .55, ease: EASE }}>
          <span>REGINALD P. PETTINESS</span><small>CHIEF JUDGE · VERY SMALL CLAIMS</small>
        </motion.div>
        <motion.div className="stamp-arm" initial={{ y: '-70%', rotate: -16 }} animate={{ y: step >= 3 ? '0%' : '-70%', rotate: step >= 3 ? 0 : -16 }} transition={{ type: 'spring', stiffness: 235, damping: 16 }}>
          <div className="stamp-handle" /><div className="stamp-head"><Seal /></div>
        </motion.div>
        <motion.div className="verdict-stamp" initial={{ scale: 1.5, rotate: -18, opacity: 0 }} animate={{ scale: step >= 4 ? 1 : 1.5, rotate: step >= 4 ? -10 : -18, opacity: step >= 4 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 240, damping: 17 }}>
          <span>THE COURT</span><b>GUILTY</b><span>HAS RULED</span>
        </motion.div>
        <motion.div className="sentence-ribbon" initial={{ y: 18, opacity: 0 }} animate={{ y: step >= 5 ? 0 : 18, opacity: step >= 5 ? 1 : 0 }}><span>THE SENTENCE</span><b>Return the carton with a ceremonial apology.</b></motion.div>
        <motion.div className="last-word" initial={{ opacity: 0, x: 22 }} animate={{ opacity: step >= 6 ? 1 : 0, x: step >= 6 ? 0 : 22 }}>COURT IS ADJOURNED.<br/><i>The group chat may now resume.</i></motion.div>
        <motion.div className="ink-expansion" initial={{ scale: .15, opacity: 0 }} animate={{ scale: step >= 6 ? 3.5 : .15, opacity: step >= 6 ? .9 : 0 }} transition={{ duration: .75, ease: EASE }} />
      </div>
    </motion.section>
  );
}
