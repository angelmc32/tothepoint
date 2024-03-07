import { ReactNode } from "react";
import Link from "next/link";
import VideoPlayer from "../video-player/VideoPlayer";

type ShortCardProps = {
  children?: ReactNode;
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  layout?: "col" | "row";
};

export default function ShortCard({ children, id, title, content, mediaUrl, layout = "row" }: ShortCardProps) {
  const mdCardLayout = layout === "row" ? "md:card-side" : "";
  const videoPlayerWidth = layout === "row" ? "md:w-2/5" : "w-full";
  const cardBodyWidth = layout === "row" ? "md:w-3/5" : "w-full";
  return (
    <div className={`${mdCardLayout} card bg-base-100 shadow-xl card-compact lg:card-normal`}>
      <VideoPlayer widthClassName={videoPlayerWidth} mediaUrl={mediaUrl} />
      <div className={`${cardBodyWidth} card-body`}>
        <h4 className="card-title">{title}</h4>
        <p>{content}</p>
        {children ? (
          children
        ) : (
          <div className="card-actions justify-end">
            <Link href={`/povs/${id}`}>
              <button className="btn btn-primary">Ver 👀</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
