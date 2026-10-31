import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { Gavel, Seal } from './CourtMarks';

const EASE = [0.2, 0.9, 0.25, 1] as const;

export function Scene01() {
  const [beat, setBeat] = useState(0);
  useSceneTimer([
    { time: 480, callback: () => setBeat(1) },
    { time: 1250, callback: () => setBeat(2) },
    { time: 2350, callback: () => setBeat(3) },
    { time: 3250, callback: () => setBeat(4) },
    { time: 3650, callback: () => setBeat(5) },
  ]);
  return (
    <motion.section className="shot shot-one" initial={{ opacity: 1, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ scale: 1.14, opacity: 0 }}>
      <div className="paper-field" />
      <div className="ink-wash wash-one" />
      <div className="shot-kicker">PETTY COURT // CASE FILE 0042</div>
      <motion.div className="gavel-macro" initial={{ rotate: -13, y: '-5%' }} animate={{ rotate: beat > 0 ? 0 : -4, y: beat > 0 ? '0%' : '-2%' }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
        <Gavel />
      </motion.div>
      <motion.div className="impact-ring" initial={{ scale: .3, opacity: 0 }} animate={beat > 0 ? { scale: [1, 1.08, 1.2], opacity: [1, .7, 0] } : { scale: .3, opacity: 0 }} transition={{ duration: .65 }} />
      <motion.div className="exhibit-word" initial={{ x: -70, opacity: 0 }} animate={{ x: beat >= 1 ? 0 : -70, opacity: beat >= 1 ? 1 : 0 }} transition={{ duration: .35, ease: EASE }}>
        <span>EXHIBIT</span><b>A</b>
      </motion.div>
      <motion.div className="evidence-tag" initial={{ rotate: 8, scale: .72, opacity: 0 }} animate={{ rotate: beat >= 2 ? -3 : 8, scale: beat >= 2 ? 1 : .72, opacity: beat >= 2 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 230, damping: 18 }}>
        <span>DOMESTIC EVIDENCE / 01</span><strong>EMPTY MILK CARTON<br/>RETURNED TO FRIDGE</strong><div className="tiny-carton"><i /><i /><i /></div>
      </motion.div>
      <motion.div className="parties-label" initial={{ y: 20, opacity: 0 }} animate={{ y: beat >= 3 ? 0 : 20, opacity: beat >= 3 ? 1 : 0 }} transition={{ duration: .32 }}>
        THE PEOPLE <em>v.</em> THE CARTON RETURNER
      </motion.div>
      <motion.div className="opening-seal" initial={{ scale: .5, rotate: -18, opacity: 0 }} animate={beat >= 5 ? { scale: 1.32, rotate: 24, opacity: .2 } : beat >= 4 ? { scale: 1, rotate: 0, opacity: 1 } : { scale: .5, rotate: -18, opacity: 0 }} transition={{ duration: beat >= 5 ? .35 : undefined, type: 'spring', stiffness: 250, damping: 18 }}>
        <Seal /><span>PETTY COURT<br/>NO. 0042</span>
      </motion.div>
      <div className="edge-caption">A VERY SMALL CLAIMS TRIBUNAL</div>
    </motion.section>
  );
}
