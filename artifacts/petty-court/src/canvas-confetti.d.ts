declare module 'canvas-confetti' {
  type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    gravity?: number;
    ticks?: number;
    angle?: number;
  };
  export default function confetti(options?: ConfettiOptions): Promise<null> | null;
}
