"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import ShortCard from "~~/components/cards/ShortCard";
import { notification } from "~~/utils/scaffold-eth";

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
      if (response.status !== 200) {
        notification.warning("Ocurrió un error al cargar los cortos");
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
            <ShortCard key={post.id} id={post.id} title={post.title} content={post.content} mediaUrl={post.mediaUrl} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
