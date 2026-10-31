import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { VideoCanvas, useVideoAudio, useVideoPlayer, type VideoAspectRatio } from '@/lib/video';
import { Scene01 } from './video_scenes/Scene01';
import { Scene02 } from './video_scenes/Scene02';
import { Scene03 } from './video_scenes/Scene03';
import { Scene04 } from './video_scenes/Scene04';
import { Scene05 } from './video_scenes/Scene05';

export const SCENE_DURATIONS = {
  opening: 4000,
  courtroom: 4000,
  statute: 5000,
  verdict: 5000,
  finale: 6000,
};

export const VIDEO_ASPECT_RATIO: VideoAspectRatio = '16:9';
type AudioPlayback = { volume: number; pause: () => void; currentTime: number; play: () => Promise<void> };

const SCENE_START_SEC: Record<string, number> = (() => {
  const starts: Record<string, number> = {};
  let elapsed = 0;
  for (const [key, duration] of Object.entries(SCENE_DURATIONS)) {
    starts[key] = elapsed / 1000;
    elapsed += duration;
  }
  return starts;
})();

const SCENES = [Scene01, Scene02, Scene03, Scene04, Scene05];

export default function VideoTemplate() {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations: SCENE_DURATIONS, loop: true });
  const { muted, paused } = useVideoAudio();
  const audioRef = useRef<AudioPlayback | null>(null);
  const baseSceneKey = currentSceneKey?.replace(/_r[12]$/, '') ?? 'opening';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.46;
    if (paused) {
      audio.pause();
      return;
    }
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > 0.18) audio.currentTime = targetTime;
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted, paused]);

  const Scene = SCENES[currentScene] ?? Scene01;

  return (
    <VideoCanvas
      aspectRatio={VIDEO_ASPECT_RATIO}
      className="film-canvas"
      style={{ backgroundColor: 'var(--paper)' }}
    >
      <div className="film-grain" aria-hidden="true" />
      <div className="film-vignette" aria-hidden="true" />
      <AnimatePresence mode="sync">
        <Scene key={currentSceneKey} />
      </AnimatePresence>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </VideoCanvas>
  );
}
