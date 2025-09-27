import Sound from 'react-native-sound';

let bg: Sound | null = null;
let muted = false;
const VOLUME = 0.05;
let click: Sound | null = null;

export function startBackground(): void {
  if (bg) return;
  Sound.setCategory('Ambient', true);
  const s = new Sound('gamebackground1', Sound.MAIN_BUNDLE, (e) => {
    if (e) {
      // eslint-disable-next-line no-console
      console.warn('Background sound load error:', e);
      return;
    }
    s.setNumberOfLoops(-1);
    s.setVolume(muted ? 0 : VOLUME);
    s.play();
  });
  bg = s;
}

export function setMuted(nextMuted: boolean): void {
  muted = nextMuted;
  if (!bg) return;
  if (muted) {
    try { bg.pause(); } catch {}
    bg.setVolume(0);
  } else {
    bg.setVolume(VOLUME);
    try { bg.play(); } catch {}
  }
}

export function isMuted(): boolean {
  return muted;
}

export function releaseBackground(): void {
  try { bg?.stop(); bg?.release(); } catch {}
  bg = null;
}


export function playClick(): void {
  if (muted) return;
  const playNow = (s: Sound) => {
    try { s.stop(); } catch {}
    try { s.setCurrentTime(0); } catch {}
    s.setVolume(1.0);
    s.play();
  };
  if (click && click.isLoaded()) {
    playNow(click);
    return;
  }
  const s = new Sound('buttonclick', Sound.MAIN_BUNDLE, (e) => {
    if (!e) {
      click = s;
      playNow(s);
    }
  });
}


