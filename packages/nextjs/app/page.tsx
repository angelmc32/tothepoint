"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import VideoPlayer from "~~/components/video-player/VideoPlayer";
import { notification } from "~~/utils/scaffold-eth";

type ReportCardProps = {
  title: string;
  content: string;
  mediaUrl: string;
};
function ReportCard({ title, content, mediaUrl }: ReportCardProps) {
  return (
    <div className="card md:card-side bg-base-100 shadow-xl card-compact lg:card-normal">
      <VideoPlayer widthClassName="md:w-2/5" mediaUrl={mediaUrl} />
      {/* <div className="relative h-64 md:h-56 lg:h-64 w-full md:w-2/5 rounded-t-box md:rounded-t-none md:rounded-s-box">
        <Image
          src={mediaUrl}
          alt="Placeholder image for video interview"
          fill
          objectFit="cover"
          className="rounded-t-box md:rounded-t-none md:rounded-s-box"
        />
      </div> */}
      <div className="card-body md:w-3/5">
        <h4 className="card-title">{title}</h4>
        <p>{content}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Ver 👀</button>
        </div>
      </div>
    </div>
  );
}

type PostType = {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
};

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("api/posts", {
        method: "GET",
      });
      const data = await response.json();
      setPosts(data.posts);
      if (response.status === 200) {
        notification.success(`Se han cargado los reportes exitosamente`);
      } else {
        notification.error(data.error);
      }
    }
    fetchPosts();
  }, []);
  return (
    <>
      <div className="w-full flex space-y-4 flex-col items-center pt-16 bg-base-200 flex-grow px-6 lg:px-16">
        <div className="md:w-4/5">
          <h2 className="text-4xl text-left">Últimos reportes...</h2>
        </div>
        <div className="flex justify-end w-full md:w-4/5">
          <Link href="/crear">
            <button className="btn btn-accent">Crear ✍️</button>
          </Link>
        </div>
        <div className="grid gap-6 auto-rows-fr grid-cols-1 w-full md:w-4/5">
          {posts.map(post => (
            <ReportCard key={post.id} title={post.title} content={post.content} mediaUrl={post.mediaUrl} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
