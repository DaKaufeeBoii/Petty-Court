import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { Seal } from './CourtMarks';

const EASE = [0.2, 0.9, 0.25, 1] as const;

export function Scene05() {
  const [beat, setBeat] = useState(0);
  useSceneTimer([
    { time: 180, callback: () => setBeat(1) },
    { time: 850, callback: () => setBeat(2) },
    { time: 1520, callback: () => setBeat(3) },
    { time: 2240, callback: () => setBeat(4) },
    { time: 3300, callback: () => setBeat(5) },
    { time: 4600, callback: () => setBeat(6) },
    { time: 5450, callback: () => setBeat(7) },
  ]);
  return (
    <motion.section className="shot shot-five" initial={{ backgroundColor: '#6B2034' }} animate={{ backgroundColor: '#6B2034' }} exit={{ scale: .94, opacity: 0 }}>
      <div className="finale-border" />
      <motion.div className="finale-small" initial={{ x: -60, opacity: 0 }} animate={{ x: beat >= 1 ? 0 : -60, opacity: beat >= 1 ? 1 : 0 }} transition={{ duration: .3, ease: EASE }}>SMALL MATTERS.</motion.div>
      <motion.div className="finale-large" initial={{ x: 70, opacity: 0 }} animate={{ x: beat >= 2 ? 0 : 70, opacity: beat >= 2 ? 1 : 0 }} transition={{ duration: .38, ease: EASE }}>LARGE<br/><i>FEELINGS.</i></motion.div>
      <motion.div className="finale-seal" initial={{ rotate: -40, scale: .6, opacity: 0 }} animate={{ rotate: beat >= 3 ? 0 : -40, scale: beat >= 3 ? 1 : .6, opacity: beat >= 3 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 190, damping: 17 }}>
        <Seal /><span>PETTY<br/>COURT</span>
      </motion.div>
      <motion.div className="finale-slogan" initial={{ opacity: 0, y: 14 }} animate={{ opacity: beat >= 4 ? 1 : 0, y: beat >= 4 ? 0 : 14 }}>Justice for things that absolutely do not matter.</motion.div>
      <motion.div className="finale-process" initial={{ opacity: 0 }} animate={{ opacity: beat >= 5 ? 1 : 0 }}>
        <span>FILE YOUR CASE.</span><i /><span>GET A RULING.</span><i /><span>ACCEPT YOUR SENTENCE.</span>
      </motion.div>
      <motion.div className="finale-footer" initial={{ opacity: 0 }} animate={{ opacity: beat >= 6 ? 1 : 0 }}>NOT A REAL COURT <b>·</b> VERY REAL FEELINGS</motion.div>
      <motion.div className="finale-light" initial={{ x: '-110%' }} animate={{ x: beat >= 6 ? '110%' : '-110%' }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
      <motion.div className="loop-seal" initial={{ scale: 0, opacity: 0 }} animate={{ scale: beat >= 7 ? .28 : 0, opacity: beat >= 7 ? 1 : 0 }} transition={{ duration: .55 }}>
        <Seal />
      </motion.div>
    </motion.section>
  );
}
