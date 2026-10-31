export function Gavel({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 220" fill="none" aria-hidden="true">
      <ellipse cx="155" cy="185" rx="104" ry="14" fill="#3b201e" opacity=".15" />
      <path d="M156 93 250 164" stroke="#5B3025" strokeWidth="32" strokeLinecap="round" />
      <path d="M155 89 249 159" stroke="#B77D45" strokeWidth="22" strokeLinecap="round" />
      <path d="m91 47 45-36 58 66-45 37z" fill="#682236" stroke="#451823" strokeWidth="6" />
      <path d="m101 52 35-28 14 16-36 30z" fill="#D3AC62" />
      <path d="m168 108 14-12 14 10-13 15z" fill="#E7C97F" />
      <path d="M57 175h203" stroke="#A37D41" strokeWidth="8" strokeLinecap="round" />
      <path d="M78 191h161" stroke="#682236" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function JudgePortrait({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 245" role="img" aria-label="Judge Reginald P. Pettiness">
      <ellipse cx="121" cy="229" rx="82" ry="10" fill="#54331f" opacity=".16" />
      <path d="M43 214c7-45 34-68 77-68s71 23 78 68v10H43z" fill="#662034" stroke="#4c1627" strokeWidth="3"/>
      <path d="m84 158 37 43 37-43-18-15h-39z" fill="#f5edda" stroke="#9c824d" strokeWidth="2"/>
      <path d="m108 179 13 17 13-17-13-10z" fill="#b4914c"/>
      <path d="M94 120c0 23 12 39 27 39s27-16 27-39v-13H94z" fill="#d8aa7b" stroke="#6d4c32" strokeWidth="2"/>
      <path d="M83 77c2-26 19-42 39-42s37 16 39 42l-5 34c-2 16-18 29-34 29s-32-13-34-29z" fill="#e9bc8c" stroke="#725137" strokeWidth="3"/>
      <path d="M77 79c-9-25 7-58 44-60 35-2 51 24 43 60l-10-12-8-22c-19 10-42 13-59 7l-5 24z" fill="#382a24" stroke="#241d1a" strokeWidth="3"/>
      <path d="M82 68c-7 13-5 25 1 31l9-18M158 66c7 12 5 25-1 32l-9-19" fill="#382a24"/>
      <path d="M99 91q8-5 16 0m11 0q8-5 16 0" fill="none" stroke="#4b3024" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="107" cy="100" rx="3" ry="4" fill="#34251e"/><ellipse cx="135" cy="100" rx="3" ry="4" fill="#34251e"/>
      <path d="M112 119q9 5 18 0" fill="none" stroke="#7d3036" strokeWidth="3" strokeLinecap="round"/>
      <path d="M113 109h16" stroke="#a8894a" strokeWidth="2"/>
      <path d="M96 151q25 11 50 0" fill="none" stroke="#dfbf7e" strokeWidth="3"/>
      <path d="M66 205h108" stroke="#b9944c" strokeWidth="3"/>
    </svg>
  );
}

export function Seal({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <circle cx="120" cy="120" r="106" fill="#6B2034" />
      <circle cx="120" cy="120" r="92" stroke="#D7B86E" strokeWidth="3" />
      <circle cx="120" cy="120" r="80" stroke="#D7B86E" strokeWidth="1.5" strokeDasharray="2 5" />
      <circle cx="120" cy="120" r="59" stroke="#D7B86E" strokeWidth="2" />
      <path d="m120 57 10 27 29-1-23 18 9 28-25-16-24 16 9-28-23-18 29 1z" fill="#D7B86E" />
      <circle cx="120" cy="120" r="14" fill="#F4EBD9" />
    </svg>
  );
}
