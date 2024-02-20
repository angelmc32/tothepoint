import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";

export default function VideoPlayer({ mediaUrl, widthClassName }: { mediaUrl: string; widthClassName: string }) {
  return (
    <div className={widthClassName}>
      <MediaPlayer title="Sprite Fight" src={mediaUrl} playsInline>
        <MediaProvider />
        <DefaultVideoLayout
          thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>
    </div>
  );
}
