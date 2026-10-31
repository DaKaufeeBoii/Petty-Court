import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { Gavel } from './CourtMarks';

const EASE = [0.2, 0.9, 0.25, 1] as const;

export function Scene03() {
  const [step, setStep] = useState(0);
  useSceneTimer([
    { time: 220, callback: () => setStep(1) },
    { time: 850, callback: () => setStep(2) },
    { time: 1750, callback: () => setStep(3) },
    { time: 2700, callback: () => setStep(4) },
    { time: 3900, callback: () => setStep(5) },
  ]);
  return (
    <motion.section className="shot shot-three" initial={{ scale: 1.22, rotate: 1.5, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 1.24, rotate: -1.5, opacity: 0 }} transition={{ duration: .68, ease: EASE }}>
      <div className="statute-page">
        <div className="page-topline"><span>THE DOMESTIC SNACK ALLOCATION CODE</span><span>ART. XII</span></div>
        <div className="page-index">§ 0042<br/><b>MINOR<br/>MATTERS</b></div>
        <div className="page-rule" />
        <motion.div className="charge-copy" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: step >= 1 ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }} transition={{ duration: .55, ease: EASE }}>
          <span>THE CHARGE</span><h2>UNAUTHORIZED<br/><i>CARTON RE-ENTRY</i></h2>
        </motion.div>
        <motion.div className="citation-copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 12 }}><span>SUBJECT TO</span><strong>THE DOMESTIC SNACK<br/>ALLOCATION CODE · ART. XII</strong></motion.div>
        <div className="evidence-column">
          <span>THE EVIDENCE</span>
          <motion.div className="magnifier" initial={{ scale: .2, rotate: -20, opacity: 0 }} animate={{ scale: step >= 3 ? 1 : .2, rotate: step >= 3 ? 4 : -20, opacity: step >= 3 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 190, damping: 15 }}>
            <div className="drop">1<small>DROP</small></div>
          </motion.div>
          <b>ONE EMPTY<br/>CARTON</b>
        </div>
        <motion.div className="defense-note" initial={{ x: 30, opacity: 0 }} animate={{ x: step >= 4 ? 0 : 30, opacity: step >= 4 ? 1 : 0 }}><span>THE DEFENSE</span><p>“There was probably<br/>one more drop.”</p><b>OBJECTION</b></motion.div>
        <motion.div className="red-ruling" initial={{ scale: .8, opacity: 0, rotate: -12 }} animate={{ scale: step >= 4 ? 1 : .8, opacity: step >= 4 ? 1 : 0, rotate: step >= 4 ? -7 : -12 }}>OVERRULED</motion.div>
        <motion.div className="law-verdict" initial={{ y: 15, opacity: 0 }} animate={{ y: step >= 5 ? 0 : 15, opacity: step >= 5 ? 1 : 0 }}>THE COURT HAS HEARD ENOUGH.</motion.div>
        <motion.div className="page-gavel" animate={{ rotate: step >= 5 ? -18 : -5, x: step >= 5 ? 20 : 0 }}><Gavel /></motion.div>
        <motion.div className="red-aperture" initial={{ scale: .2, opacity: 0 }} animate={{ scale: step >= 5 ? 5.6 : .2, opacity: step >= 5 ? [.2, 1, .78] : 0 }} transition={{ duration: 1.12, ease: EASE }} />
      </div>
    </motion.section>
  );
}
