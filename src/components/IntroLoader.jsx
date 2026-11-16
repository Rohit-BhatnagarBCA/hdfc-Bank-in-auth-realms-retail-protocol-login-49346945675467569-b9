// Small centered loader shown briefly after login — just a box with a video inside.
import { useEffect } from "react";


const VIDEO_SRC = "/rrr.mp4"; // <- your video file, placed in the public folder
const DURATION_MS = 5500; // how long this stays on screen

export default function IntroLoader({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/20">
      <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-xl">
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          className="h-35 w-35 rounded-xl object-cover"
        />
      </div>
    </div>
  );
}