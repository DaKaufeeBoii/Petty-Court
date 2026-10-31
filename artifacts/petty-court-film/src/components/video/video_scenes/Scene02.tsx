import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { JudgePortrait, Seal } from './CourtMarks';

const EASE = [0.2, 0.9, 0.25, 1] as const;

export function Scene02() {
  const [phase, setPhase] = useState(0);
  useSceneTimer([
    { time: 250, callback: () => setPhase(1) },
    { time: 750, callback: () => setPhase(2) },
    { time: 1320, callback: () => setPhase(3) },
    { time: 1940, callback: () => setPhase(4) },
    { time: 2950, callback: () => setPhase(5) },
    { time: 3650, callback: () => setPhase(6) },
  ]);
  return (
    <motion.section className="shot shot-two" initial={{ clipPath: 'inset(0 50% 0 50%)', scale: .94 }} animate={{ clipPath: 'inset(0 0% 0 0%)', scale: 1 }} exit={{ scale: 1.08, rotateY: 9, opacity: 0 }} transition={{ duration: .65, ease: EASE }}>
      <div className="court-backdrop">
        <div className="court-curtain curtain-left" />
        <div className="court-curtain curtain-right" />
        <div className="court-arch" />
        <div className="bench" />
        <div className="bench-front" />
        <motion.div className="court-seal" animate={{ rotate: phase > 0 ? 0 : -12, scale: phase > 0 ? 1 : .9 }}><Seal /></motion.div>
        <motion.div className="tiny-judge" initial={{ y: 60, opacity: 0 }} animate={{ y: phase >= 2 ? 0 : 60, opacity: phase >= 2 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 190, damping: 18 }}><JudgePortrait /></motion.div>
        <motion.div className="court-heading" initial={{ y: -22, opacity: 0 }} animate={{ y: phase >= 1 ? 0 : -22, opacity: phase >= 1 ? 1 : 0 }}>
          <span>IN THE PEOPLE’S COURT OF</span><strong>PETTINESS</strong>
          <i>A VERY SMALL CLAIM</i>
        </motion.div>
        <motion.div className="party-card plaintiff-card" initial={{ x: -55, rotate: -8, opacity: 0 }} animate={{ x: phase >= 3 ? 0 : -55, rotate: phase >= 3 ? -3 : -8, opacity: phase >= 3 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 190, damping: 20 }}>
          <small>PLAINTIFF</small><b>NEXT PERSON<br/>NEEDING MILK</b><span>THE WRONGED</span>
        </motion.div>
        <motion.div className="party-card defendant-card" initial={{ x: 55, rotate: 8, opacity: 0 }} animate={{ x: phase >= 4 ? 0 : 55, rotate: phase >= 4 ? 3 : 8, opacity: phase >= 4 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 190, damping: 20 }}>
          <small>DEFENDANT</small><b>THE CARTON<br/>RETURNER</b><span>THE ACCUSED</span>
        </motion.div>
        <motion.div className="court-balance" initial={{ scaleX: 0 }} animate={{ scaleX: phase >= 2 ? 1 : 0 }} transition={{ duration: .7, ease: EASE }} />
        <motion.div className="court-disclaimer" initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }}>NO LAWYERS. NO CONSEQUENCES. ALL FEELINGS.</motion.div>
        <motion.div className="folding-docket" initial={{ y: 85, rotateX: 45, scale: .65, opacity: 0 }} animate={phase >= 6 ? { y: -8, rotateX: 18, scale: 1.85, opacity: .25 } : phase >= 5 ? { y: 0, rotateX: 0, scale: 1.14, opacity: 1 } : { y: 85, rotateX: 45, scale: .65, opacity: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}>
          DOCKET <b>0042</b>
        </motion.div>
      </div>
    </motion.section>
  );
}
