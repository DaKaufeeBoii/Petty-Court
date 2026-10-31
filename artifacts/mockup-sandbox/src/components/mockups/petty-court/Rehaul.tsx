import './Rehaul.css';
import { useEffect, useRef, useState, type FormEvent } from 'react';
const confetti = (_options: unknown) => {};

import {
  ArrowLeft, ArrowRight, BookOpen, Check, Clipboard,
  Gavel, History, Info, RotateCcw, Scale, ScrollText, Sparkles, Volume2, VolumeX,
  X,
} from 'lucide-react';

type CaseInput = { dispute: string; defendant: string; plaintiff: string; defense: string; plaintiffArgument: string };
type VerdictName = 'GUILTY' | 'ABSOLUTELY GUILTY' | 'BOTH ARE DISQUALIFIED' | 'ACQUITTED (Barely)';
type Ruling = CaseInput & {
  id: string; docket: string; charge: string; verdict: VerdictName;
  reasoning: string[]; punishment: string; finalWord: string; timestamp: string;
};

const verdicts: VerdictName[] = ['GUILTY', 'ABSOLUTELY GUILTY', 'BOTH ARE DISQUALIFIED', 'ACQUITTED (Barely)'];
const statutes = [
  'The Unauthorized Thermostat Adjustment Act, § 4(b)',
  'The Domestic Snack Allocation Code, Article XII',
  'The Covenant of Shared Blanket Conduct, Clause 7',
  'The Great Sock Disappearance Ordinance of 1986',
  'The Statute Against Suspiciously Loud Chewing, § 2',
  'The Remote Control Custody & Jurisdiction Act',
  'The Household Chore Fairness Amendment (as amended)',
  'The Doctrine of Implied Pizza Crust Ownership',
  'The Municipal Code of Passenger-Seat DJ Rights',
  'The No-Context Texting Prevention Act, § 11',
  'The Last-Slice Treaty of the Kitchen Table',
  'The Act for the Preservation of Personal Space in Hallways',
  'The Ancient Law of Borrowed Chargers, subsection C',
  'The Sunday Errand Reciprocity Provision',
  'The Code of Civil Bedtime Negotiations',
  'The Statute of Unannounced Spoiler Disclosure',
  'The House Rules on Cupboard Door Closure',
  'The Petty Larceny of Another Person’s Good Pen',
  'The Civil Code of “I’m Ready” Accuracy',
  'The Precedent of the Unreturned Shopping Cart',
];
const reasoningTemplates = [
  'The Court finds that {d} acted with the confidence of a person who believed the rules were merely decorative.',
  'After hearing the matter of “{issue},” this bench determines that common sense was present, but apparently not invited.',
  'The record reflects {p}’s account: “{plaintiffArgument}” — a statement the Court finds emotionally persuasive and legally inconvenient.',
  'The defense offered by {d} (“{defense}”) has been entered into evidence and gently set aside.',
  'In this Court, “I was only trying to help” is not a defense; it is usually the opening sentence of the incident report.',
  'The Court observes that the alleged event lasted mere seconds, yet has somehow occupied the better part of the evening.',
  '{p} has demonstrated the patience of a saint and the posture of a person preparing a very specific group chat.',
  'The defense’s central theory appears to be “it seemed fine at the time,” which is not a recognized unit of measurement.',
  'Evidence was presented, eyebrows were raised, and one entirely innocent household object has been dragged into this.',
  'The Court cannot ignore the timing, the tone, or the conspicuous absence of an apology shaped like a snack.',
  'Having considered both sides, the Court finds the truth somewhere between “not a big deal” and “I have screenshots.”',
  'The defendant’s explanation contains several compelling words, none of which appear to be “you were right.”',
  'No serious harm was done. Nevertheless, the principle of the thing has arrived wearing its finest hat.',
  'The testimony is vivid, the stakes are microscopic, and the Court is prepared to treat both facts with equal gravity.',
  'The bench notes that this exact dispute has been litigated before, usually beside a sink and after 9 p.m.',
  'The plaintiff’s account is supported by an impressive quantity of detail for an event involving one tiny inconvenience.',
  'The defendant was afforded every opportunity to explain. The explanation, while spirited, has not improved matters.',
  'The Court recognizes that “I forgot” may be true, but truth and exoneration are not the same delightful thing.',
  'In weighing the evidence, we find one side persuasive and the other side holding a suspiciously empty plate.',
  'The testimony of {p} is accepted with the solemnity due to all who have been mildly inconvenienced at home.',
  'A reasonable person might have let this go. Unfortunately, no reasonable person is currently presiding.',
  'The Court has reviewed the facts, the feelings, and the dramatic retelling. All three point in the same direction.',
  'The disputed act was small, the response was theatrical, and the Court sees no reason to interrupt tradition.',
  'The parties have made their points. The Court will now make one, in a font large enough for the hallway.',
];
const punishments = [
  'Must surrender the comfiest cushion for one evening and refer to the plaintiff as “Your Honor.”',
  'Shall provide one ceremonial snack, delivered on a plate, with no crumbs left behind.',
  'Must perform a sincere five-second apology while maintaining respectful eye contact with the object involved.',
  'Is sentenced to choose the next film, but may not say “I don’t mind” when asked what to watch.',
  'Must refill the household water glasses and announce, “Justice has been hydrated.”',
  'Shall do the next small chore without a sigh audible from the adjacent room.',
  'Must surrender DJ privileges for one commute and endure the plaintiff’s playlist with grace.',
  'Is hereby required to bring the plaintiff a treat of modest size and unreasonable emotional significance.',
  'Must restore the thermostat to its rightful setting and submit a written appeal in triplicate.',
  'Shall fold exactly one load of laundry, with socks paired by color and no appeals to the Supreme Dryer.',
  'Must make the bed to a standard that would impress a very particular hotel inspector.',
  'Is sentenced to one evening of blanket-sharing without strategic corner acquisition.',
  'Must compliment the plaintiff’s excellent judgment on three separate occasions before sundown.',
  'Shall return the borrowed item to its precise original location, accompanied by a tiny parade.',
  'Must clean the mysterious crumb from the counter and refrain from asking where it came from.',
  'Is required to say “you were right” once, clearly, without adding “but.”',
  'Must relinquish the last bite or provide an equivalent bite of equal structural integrity.',
  'Shall send one thoughtful text beginning with “Upon reflection…” and ending with a sincere apology.',
  'Must carry all shopping bags on the next outing, including the light one with the awkward handles.',
  'Is sentenced to a ten-minute chore of the plaintiff’s choosing, with no dramatic soundtrack.',
  'Must put the remote back in its natural habitat and stop calling the couch a “shared jurisdiction.”',
  'Shall make tea or coffee for the plaintiff, then wait patiently while it reaches a drinkable temperature.',
  'Must accept one (1) lovingly delivered “I told you so,” redeemable at any time this week.',
  'Is ordered to repair the vibes with one sincere compliment and a highly specific snack.',
  'Must complete a ceremonial lap of the room carrying the disputed object as a reminder to all.',
  'Shall offer the plaintiff first choice of the next available seat, cushion, or side of the bed.',
];
const samples: (CaseInput & { short: string; category: string })[] = [
  { short: 'Putting the empty milk carton back in the fridge.', category: 'REFRIGERATOR', dispute: 'Putting the empty milk carton back in the fridge.', defendant: 'The carton returner', plaintiff: 'The next person needing milk', defense: 'There was probably one more drop.', plaintiffArgument: 'I opened it with a bowl of cereal in hand.' },
  { short: 'Leaving 2 seconds on the microwave and not pressing clear.', category: 'MICROWAVE', dispute: 'Leaving 2 seconds on the microwave and not pressing clear.', defendant: 'The microwave abandoner', plaintiff: 'The keeper of a peaceful kitchen', defense: 'I was already walking away.', plaintiffArgument: 'The beeping countdown follows me through the house.' },
  { short: 'Stealing the blanket at 3:14 AM and rolling into a human burrito.', category: 'BLANKET', dispute: 'Stealing the blanket at 3:14 AM and rolling into a human burrito.', defendant: 'The blanket annexer', plaintiff: 'The cold and betrayed sleeper', defense: 'I was asleep and the blanket moved itself.', plaintiffArgument: 'I woke up shivering beside a human burrito.' },
  { short: 'Saying “I’m fine with anything for dinner” then vetoing 5 options.', category: 'DINNER', dispute: 'Saying “I’m fine with anything for dinner” then vetoing 5 options.', defendant: 'The dinner vetoer', plaintiff: 'The exhausted menu planner', defense: 'I was only trying to find something I really wanted.', plaintiffArgument: 'Five options were rejected without a counterproposal.' },
  { short: 'Walking at a glacial pace across a busy pedestrian crossing.', category: 'CROSSWALK', dispute: 'Walking at a glacial pace across a busy pedestrian crossing.', defendant: 'The leisurely pedestrian', plaintiff: 'The person waiting at the crossing', defense: 'I was enjoying the fresh air.', plaintiffArgument: 'The signal had already changed twice.' },
];
const blank: CaseInput = { dispute: '', defendant: '', plaintiff: '', defense: '', plaintiffArgument: '' };

function pick<T>(items: T[], exclude?: T) {
  const available = exclude === undefined ? items : items.filter((item) => item !== exclude);
  return available[Math.floor(Math.random() * available.length)] ?? items[0];
}
function fillTemplate(template: string, input: CaseInput) {
  const plaintiffArgument = input.plaintiffArgument.trim() || 'I rest my case.';
  const defense = input.defense.trim() || 'No formal defense was submitted; the Court shall presume a thoughtful silence.';
  return template.replaceAll('{d}', input.defendant.trim() || 'the defendant')
    .replaceAll('{p}', input.plaintiff.trim() || 'the plaintiff')
    .replaceAll('{issue}', input.dispute.trim() || 'the alleged matter')
    .replaceAll('{plaintiffArgument}', plaintiffArgument)
    .replaceAll('{defense}', defense);
}
function getDocket() {
  const day = new Date();
  const seed = Number(`${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, '0')}${String(day.getDate()).padStart(2, '0')}`);
  const base = (seed * 37) % 641 + 120;
  return String(base).padStart(4, '0');
}

function Judge({ verdict, deliberating = false }: { verdict?: VerdictName; deliberating?: boolean }) {
  const stern = verdict === 'GUILTY' || verdict === 'ABSOLUTELY GUILTY';
  const baffled = verdict === 'BOTH ARE DISQUALIFIED';
  const relieved = verdict === 'ACQUITTED (Barely)';
  return (
    <svg className={`judge-float ${deliberating ? 'judge-thinking' : ''}`} viewBox="0 0 240 245" role="img" aria-label={`Judge Reginald P. Pettiness ${deliberating ? 'is deliberating' : verdict ? `looks ${stern ? 'stern' : baffled ? 'bewildered' : 'mildly relieved'} after the verdict` : 'presides over the court'}`}>
      <ellipse cx="121" cy="229" rx="82" ry="10" fill="#54331f" opacity=".16" />
      <path d="M43 214c7-45 34-68 77-68s71 23 78 68v10H43z" fill="#662034" stroke="#4c1627" strokeWidth="3"/>
      <path d="M84 158l37 43 37-43-18-15h-39z" fill="#f5edda" stroke="#9c824d" strokeWidth="2"/>
      <path d="M108 179l13 17 13-17-13-10z" fill="#b4914c"/>
      <path d="M94 120c0 23 12 39 27 39s27-16 27-39v-13H94z" fill="#d8aa7b" stroke="#6d4c32" strokeWidth="2"/>
      <path d="M83 77c2-26 19-42 39-42s37 16 39 42l-5 34c-2 16-18 29-34 29s-32-13-34-29z" fill="#e9bc8c" stroke="#725137" strokeWidth="3"/>
      <path d="M76 81c-12-30 7-62 44-64 37-2 56 27 44 64l-12-13-8-24c-18 10-42 13-59 7l-5 26z" fill="#f4ead5" stroke="#49362d" strokeWidth="3"/>
      <path d="M82 70c-9 13-7 28 2 34l11-22M158 68c9 13 7 28-2 35l-11-22" fill="#f4ead5" stroke="#49362d" strokeWidth="2"/>
      <path d="M91 47c6-11 16-16 28-15 13-1 24 5 31 16-17 8-43 10-59-1z" fill="#fff7e6" stroke="#c9b997" strokeWidth="2"/>
      <g fill="#f8efd9" stroke="#c9b997" strokeWidth="1.5">
        <circle cx="82" cy="57" r="10"/><circle cx="92" cy="42" r="10"/><circle cx="107" cy="32" r="10"/>
        <circle cx="124" cy="31" r="10"/><circle cx="140" cy="38" r="10"/><circle cx="155" cy="52" r="10"/>
        <circle cx="82" cy="82" r="10"/><circle cx="158" cy="82" r="10"/>
      </g>
      <path d={stern ? 'M99 91q8-5 16 0' : baffled ? 'M98 89q9 3 16-1' : 'M98 91q8-2 16 1'} fill="none" stroke="#4b3024" strokeWidth="3" strokeLinecap="round"/>
      <path d={stern ? 'M126 91q8-5 16 0' : baffled ? 'M126 88q9 4 16 0' : 'M126 92q8-2 16-1'} fill="none" stroke="#4b3024" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="107" cy="100" rx="3" ry="4" fill="#34251e"/><ellipse cx="135" cy="100" rx="3" ry="4" fill="#34251e"/>
      <circle cx="107" cy="100" r="10" fill="none" stroke="#8a6d3a" strokeWidth="2"/><circle cx="135" cy="100" r="10" fill="none" stroke="#8a6d3a" strokeWidth="2"/>
      <path d="M117 99h8" stroke="#8a6d3a" strokeWidth="2"/>
      <path d={stern ? 'M112 122q9-7 18 0' : baffled ? 'M111 123q10-8 20 0' : relieved ? 'M111 117q10 13 20 0' : 'M112 119q9 5 18 0'} fill="none" stroke="#7d3036" strokeWidth="3" strokeLinecap="round"/>
      <path d="M102 105q19 10 39 0" fill="none" stroke="#bb8067" strokeWidth="2"/>
      <path d="M113 109h16" stroke="#a8894a" strokeWidth="2"/>
      <path d="M96 151q25 11 50 0" fill="none" stroke="#dfbf7e" strokeWidth="3"/>
      <path d="M66 205h108" stroke="#b9944c" strokeWidth="3"/>
      <path d="M106 211q15 10 30 0" fill="none" stroke="#f0db9f" strokeWidth="2"/>
    </svg>
  );
}

export function Rehaul() {
  const [form, setForm] = useState<CaseInput>(blank);
  const [ruling, setRuling] = useState<Ruling | null>(null);
  const [archive, setArchive] = useState<Ruling[]>([]);
  const [busy, setBusy] = useState(false);
  const [sound, setSound] = useState(true);
  const [toast, setToast] = useState('');
  const [shake, setShake] = useState(false);
  const [stamp, setStamp] = useState(false);
  const [view, setView] = useState<'form' | 'ruling'>('form');
  const timeoutRef = useRef<number | undefined>(undefined);
  const resultRef = useRef<HTMLElement>(null);
  const docket = getDocket();

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };
  const makeSound = (isStamp = false) => {
    if (!sound) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const now = context.currentTime;
      const noise = context.createBufferSource();
       const duration = isStamp ? .1 : .16;
       const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
      noise.buffer = buffer;
      const filter = context.createBiquadFilter();
       filter.type = 'lowpass'; filter.frequency.setValueAtTime(isStamp ? 800 : 450, now);
      const gain = context.createGain();
       gain.gain.setValueAtTime(isStamp ? .42 : .65, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration);
      noise.connect(filter).connect(gain).connect(context.destination);
      noise.start(now);
      const tone = context.createOscillator(); const toneGain = context.createGain();
       tone.type = 'triangle'; tone.frequency.setValueAtTime(isStamp ? 175 : 110, now); tone.frequency.exponentialRampToValueAtTime(isStamp ? 82 : 48, now + duration);
       toneGain.gain.setValueAtTime(isStamp ? .22 : .35, now); toneGain.gain.exponentialRampToValueAtTime(.001, now + duration + .03);
       tone.connect(toneGain).connect(context.destination); tone.start(now); tone.stop(now + duration + .04);
      noise.onended = () => void context.close();
    } catch { /* Sound is a flourish; the ruling still proceeds if unavailable. */ }
  };
  const celebrate = () => {
    confetti({ particleCount: 74, spread: 72, startVelocity: 33, origin: { y: .48 }, colors: ['#76263a', '#c5a456', '#f4ead1', '#44634d'], gravity: .85, ticks: 120 });
    confetti({ particleCount: 24, angle: 60, spread: 45, origin: { x: .12, y: .55 }, colors: ['#76263a', '#c5a456', '#f4ead1'], gravity: .8, ticks: 100 });
    confetti({ particleCount: 24, angle: 120, spread: 45, origin: { x: .88, y: .55 }, colors: ['#76263a', '#c5a456', '#f4ead1'], gravity: .8, ticks: 100 });
  };
  const createRuling = (data: CaseInput, previous?: Ruling): Ruling => {
    const verdict = pick(verdicts, previous?.verdict);
    const reasoning = [...reasoningTemplates].sort(() => Math.random() - .5).slice(0, 3).map((template) => fillTemplate(template, data));
    return {
      ...data, id: `${Date.now()}-${Math.random()}`, docket: `${docket}-${Math.floor(Math.random() * 90 + 10)}`,
      charge: pick(statutes), verdict, reasoning, punishment: pick(punishments),
      finalWord: pick([
        'Let this be a lesson, though almost certainly it will not.',
        'Court is adjourned. The group chat may now resume.',
        'The law is blind. This judge, however, has excellent peripheral vision.',
        'Petty? Perhaps. Necessary? The Court says: obviously.',
        'May your future disputes be smaller, and your evidence more organized.',
        'The Court has spoken. Please stop looking at me like that.',
        'Let the record show: we made this much more dramatic than it needed to be.',
      ]),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
  };
  const runHearing = (data: CaseInput, previous?: Ruling) => {
    if (busy) return;
    setBusy(true); setShake(true); setStamp(false);
    makeSound();
    window.setTimeout(() => setShake(false), 500);
    timeoutRef.current = window.setTimeout(() => {
      const next = createRuling(data, previous);
      setRuling(next);
      setArchive((current) => [next, ...current.filter((item) => item.id !== next.id)].slice(0, 5));
       setView('ruling'); setBusy(false); setStamp(true);
       makeSound(true); celebrate();
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }, 1200);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.dispute.trim() || !form.defendant.trim() || !form.plaintiff.trim()) {
      notify('The Court needs the dispute and both parties named before opening proceedings.');
      return;
    }
    runHearing(form);
  };
  const copyTranscript = async () => {
    if (!ruling) return;
    const text = `PETTY COURT — DOCKET ${ruling.docket}\n\nIN THE MATTER OF: ${ruling.dispute}\n${ruling.plaintiff} v. ${ruling.defendant}\n\nCHARGE: ${ruling.charge}\nVERDICT: ${ruling.verdict}\n\n${ruling.reasoning.join('\n\n')}\n\nSENTENCE: ${ruling.punishment}\n\nJUDGE REGINALD P. PETTINESS: “${ruling.finalWord}”\n\nJustice for things that absolutely do not matter.`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text); notify('Transcript copied. The group chat is now in session.');
    } catch { notify('Clipboard unavailable here — select and copy the transcript text instead.'); }
  };
  const resetCase = () => {
    window.clearTimeout(timeoutRef.current);
    setBusy(false); setForm(blank); setRuling(null); setView('form'); setStamp(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reviewCase = (item: Ruling) => {
    setRuling(item); setForm({ dispute: item.dispute, defendant: item.defendant, plaintiff: item.plaintiff, defense: item.defense, plaintiffArgument: item.plaintiffArgument });
    setView('ruling'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const updateForm = (key: keyof CaseInput, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const archivePanel = (
    <div className="archive-card">
      <div className="archive-heading">
        <div><History size={16}/><span className="section-label">SESSION ARCHIVE</span></div>
        <span className="archive-count">{archive.length} / 5</span>
      </div>
      {archive.length === 0 ? (
        <div className="archive-empty">
          <div className="empty-seal"><Gavel size={17}/></div>
          <strong className="serif">The record is clear.</strong>
          <p>Rulings will be filed here as soon as the first tiny trial concludes.</p>
        </div>
      ) : (
        <div className="archive-list">
          {archive.map((item, index) => (
            <button className={`archive-item ${ruling?.id === item.id ? 'selected' : ''}`} type="button" key={item.id} onClick={() => reviewCase(item)} data-testid={`button-archive-${index}`} aria-label={`Review ruling ${index + 1}: ${item.dispute}`}>
              <span className="archive-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="archive-item-body"><strong>{item.dispute}</strong><small>{item.plaintiff} v. {item.defendant}</small></span>
              <span className="archive-verdict">{item.verdict === 'ABSOLUTELY GUILTY' ? 'GUILTY++' : item.verdict}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className={`app-shell ${shake ? 'shaking' : ''}`} id="top">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Petty Court home" data-testid="link-home">
          <span className="brand-seal"><Scale size={22}/></span>
          <span className="brand-wordmark">PETTY <b>COURT</b><small>THE COURT OF VERY SMALL CLAIMS</small></span>
        </a>
        <div className="topbar-right">
          <span className="docket-pill"><span className="live-dot"/> TODAY’S DOCKET <b>NO. {docket}</b></span>
          <button className="sound-toggle" type="button" onClick={() => setSound((current) => !current)} aria-pressed={sound} aria-label={sound ? 'Turn courtroom sounds off' : 'Turn courtroom sounds on'} data-testid="button-toggle-sound">
            {sound ? <Volume2 size={17}/> : <VolumeX size={17}/>}<span>{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>
        </div>
      </header>

      <section className="hero courtroom-stage" aria-labelledby="court-title">
        <div className="stage-wall" aria-hidden="true"><span className="stage-column stage-column-left"/><span className="stage-column stage-column-right"/><span className="stage-arch"/><span className="stage-panel"/></div>
        <div className="hero-copy enter">
          <div className="eyebrow"><span className="eyebrow-line"/>THE PEOPLE’S COURT OF PETTINESS<span className="eyebrow-line"/></div>
          <h1 className="serif" id="court-title">PETTY<br/><i>COURT</i></h1>
          <p>Justice for things that<br className="desktop-break"/> absolutely do not matter.</p>
          <div className="hero-meta"><span><Gavel size={15}/> Open for extremely minor business</span><span className="hero-divider">/</span><span>Est. five minutes ago</span></div>
          <a href="#filing" className="stage-link" data-testid="link-file-case"><span>Bring your case before the bench</span><ArrowRight size={15}/></a>
        </div>
        <div className="judge-portrait">
          <div className="portrait-star star-one"><Sparkles size={21}/></div><div className="portrait-star star-two"><Sparkles size={15}/></div>
          <div className="portrait-arch"><div className="portrait-halo"/><Judge verdict={ruling?.verdict} deliberating={busy}/><div className="portrait-bench"/></div>
          <div className="judge-caption"><span className="caption-rule"/>THE HONORABLE<span className="caption-rule"/></div>
          <strong className="serif judge-name">Reginald P. Pettiness</strong>
          <small>CHIEF JUDGE · VERY SMALL CLAIMS</small>
        </div>
        <div className="court-inscription"><span>BE IT KNOWN</span><span className="inscription-rule"/><span>EVERY LITTLE THING IS HEARD HERE</span></div>
      </section>

      <div className="court-content">
        {busy && <div className="deliberation enter" role="status" aria-live="polite"><div className="delib-mark"><Gavel size={21}/></div><span className="delib-kicker">THE COURT IS DELIBERATING</span><strong className="serif">Consulting the Sacred Law of Minor Inconveniences…</strong><span className="delib-dots"><i/><i/><i/></span><small>Silence in the court, please.</small></div>}
        {view === 'ruling' && ruling && !busy ? (
          <section className="verdict-layout enter" ref={resultRef} aria-live="polite">
            <div className="ruling-paper paper-card court-frame">
              <div className="ruling-topline"><span>IN THE COURT OF VERY SMALL CLAIMS</span><span>DOCKET NO. {ruling.docket}</span></div>
              <div className="ruling-title">
                <span className="ornament"><Sparkles size={13}/> &nbsp; THE PEOPLE v. &nbsp; <Sparkles size={13}/></span>
                <h2 className="serif">{ruling.dispute}</h2>
                <p>{ruling.plaintiff} <em>versus</em> {ruling.defendant}</p>
              </div>
              <div className="charge-box"><span className="section-label">FORMAL CHARGE</span><strong className="serif">{ruling.charge}</strong></div>
              <div className="verdict-stamp-area"><div className={`stamp ${stamp ? 'show' : ''}`} aria-label={`Verdict: ${ruling.verdict}`}><span>THE COURT</span><b>{ruling.verdict}</b><span>HAS RULED</span></div></div>
              <h3 className="verdict-heading serif">{ruling.verdict}</h3>
              <div className="reasoning"><span className="section-label">FINDINGS OF FACT & VERY LITTLE IMPORTANCE</span>{ruling.reasoning.map((sentence, index) => <p key={`${ruling.id}-${index}`}>{sentence}</p>)}</div>
              <div className="sentence-box"><div><Gavel size={18}/><span className="section-label">THE SENTENCE</span></div><p className="serif">{ruling.punishment}</p></div>
              <div className="judge-last-word"><Judge verdict={ruling.verdict}/><div><span className="section-label">JUDGE REGINALD’S FINAL WORD</span><p className="serif">“{ruling.finalWord}”</p></div></div>
              <div className="ruling-footer"><span>SO ORDERED, WITH EXTREME PETTINESS</span><span>{ruling.timestamp}</span></div>
            </div>
            <aside className="ruling-aside">
              <div className="aside-title"><span className="section-label">THE COURT HAS SPOKEN</span><h2 className="serif">A ruling for the ages.<br/><i>Or at least today.</i></h2></div>
              <div className="aside-actions">
                <button className="action-button" type="button" onClick={copyTranscript} data-testid="button-copy-transcript"><Clipboard size={17}/> Copy transcript</button>
                <button className="appeal-button" type="button" onClick={() => runHearing(form, ruling)} disabled={busy} data-testid="button-appeal"><RotateCcw size={16}/> Appeal this ruling</button>
                <button className="new-case-button" type="button" onClick={resetCase} data-testid="button-new-dispute"><ArrowLeft size={16}/> File a new dispute</button>
              </div>
              <div className="appeal-note"><Sparkles size={16}/><p>An appeal goes before the very same judge. He has promised to consider it with an entirely open mind.</p></div>
              <div className="transcript-mini"><span className="section-label">THE RECORD</span><p>{ruling.plaintiff} brought suit against {ruling.defendant} over “{ruling.dispute}.”</p><button type="button" onClick={copyTranscript} data-testid="button-copy-record"><Clipboard size={14}/> Copy the official record <ArrowRight size={13}/></button></div>
              <div className="archive-in-results">{archivePanel}</div>
            </aside>
          </section>
        ) : view === 'form' && !busy && (
          <section className="filing-grid enter" id="filing">
            <div className="form-column">
              <div className="section-heading"><div><span className="step-number">01</span><div><span className="section-label">OPEN A CASE</span><h2 className="serif">What’s the <i>matter?</i></h2></div></div><span className="heading-note">All minor grievances<br/>are solemnly heard.</span></div>
              <div className="sample-area">
                <div className="sample-heading"><span>THE DAILY DISPUTES</span><span>PICK A PRECEDENT</span></div>
                <div className="sample-list">{samples.map((sample, index) => <button type="button" className="sample-chip" key={sample.short} onClick={() => { setForm({ dispute: sample.dispute, defendant: sample.defendant, plaintiff: sample.plaintiff, defense: sample.defense, plaintiffArgument: sample.plaintiffArgument }); notify('Exhibit A has been entered. Names are yours to personalize.'); }} data-testid={`button-sample-${sample.category.toLowerCase()}`}><span className="sample-index">0{index + 1}</span><span className="sample-category">{sample.category}</span><strong>{sample.short}</strong><ArrowRight size={14}/></button>)}</div>
              </div>
              <form className="filing-form paper-card" onSubmit={submit}>
                <div className="form-heading"><span className="filing-stamp"><ScrollText size={18}/></span><div><span className="section-label">OFFICIAL PETITION</span><h3 className="serif">State your case.</h3></div><span className="filing-code">FORM PC–01<br/>FILED IN DUPLICATE</span></div>
                <div className="form-rule"/>
                <div className="form-row"><label className="wide-field"><span>THE DISPUTE <i>— what happened?</i><b>*</b></span><input className="field" value={form.dispute} onChange={(e) => updateForm('dispute', e.target.value)} placeholder="e.g. They ate my clearly labeled leftovers" required maxLength={150} data-testid="input-dispute"/></label></div>
                <div className="form-row"><label><span>THE DEFENDANT <i>— the accused</i><b>*</b></span><input className="field" value={form.defendant} onChange={(e) => updateForm('defendant', e.target.value)} placeholder="Name or title" required maxLength={48} data-testid="input-defendant"/></label><label><span>THE PLAINTIFF <i>— the wronged</i><b>*</b></span><input className="field" value={form.plaintiff} onChange={(e) => updateForm('plaintiff', e.target.value)} placeholder="Name or title" required maxLength={48} data-testid="input-plaintiff"/></label></div>
                <div className="form-row"><label><span>THE DEFENSE <i>— optional</i></span><textarea className="field" rows={2} value={form.defense} onChange={(e) => updateForm('defense', e.target.value)} placeholder="“It was already open…”" maxLength={220} data-testid="input-defense"/></label><label><span>THE PLAINTIFF’S ARGUMENT <i>— optional</i></span><textarea className="field" rows={2} value={form.plaintiffArgument} onChange={(e) => updateForm('plaintiffArgument', e.target.value)} placeholder="“I have receipts. Actual receipts.”" maxLength={220} data-testid="input-plaintiff-argument"/></label></div>
                <div className="summon-row"><button className="action-button summon-button" type="submit" disabled={busy} data-testid="button-summon"><Scale size={20}/> SUMMON THE JUDGE <Gavel size={18}/></button><span className="summon-caption">1.2 seconds to justice<br/><small>Absolutely no legal standing.</small></span></div>
              </form>
              <div className="privacy-note"><Info size={15}/><span>Your case stays right here in this browser session. No lawyers, no servers, no actual consequences.</span></div>
            </div>
            <aside className="archive-column">
              <div className="docket-card paper-card">
                <div className="docket-card-head"><div><BookOpen size={17}/><span className="section-label">THE DAILY DOCKET</span></div><span className="docket-number">NO. {docket}</span></div>
                <div className="docket-count"><strong className="serif">{String(archive.length + 18).padStart(2, '0')}</strong><span>petty matters<br/>heard today</span></div>
                <div className="docket-progress"><span style={{ width: `${Math.min(96, 28 + archive.length * 9)}%` }}/></div>
                <p className="docket-note">A brisk day on the bench. The Court is in excellent spirits.</p>
                <div className="docket-engraving"><Scale size={31}/><span>COURT<br/>IN SESSION</span></div>
              </div>
              {archivePanel}
              <div className="court-motto"><span className="motto-rule"/><span>Small matters.<br/><i>Large feelings.</i></span><span className="motto-rule"/></div>
            </aside>
          </section>
        )}
      </div>
      <footer className="footer"><span>© THE HONORABLE REGINALD P. PETTINESS</span><span>NOT A REAL COURT · VERY REAL FEELINGS</span><span className="footer-seal"><Scale size={15}/></span></footer>
      {toast && <div className="toast toasty" role="status" aria-live="polite"><Check size={17}/><span>{toast}</span><button type="button" onClick={() => setToast('')} aria-label="Dismiss notification" data-testid="button-dismiss-toast"><X size={15}/></button></div>}
    </main>
  );
}

