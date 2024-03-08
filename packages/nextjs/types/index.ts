import { Post, User } from "@prisma/client";

export type PostType = {
  attesters: string[];
  attestations: AttestationType[];
  author: User;
  authorId: string;
  collaborators: string[];
  comments: CommentType[];
  content: string;
  createdAt: string;
  downvotes: number;
  id: string;
  mediaUrl: string;
  title: string;
  updatedAt: string;
  upvotes: number;
  votes: VoteType[];
};

export type AttestationType = {
  id: string;
  txId: string;
  chain: string;
  schemaId: string;
  attester: string;
  recipient: string;
  emotion: string;
  impact: number;
  attesterRole: string;
  category: string;
  post: Post;
  postId: string;
};

export type CommentType = {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  author: string;
  authorId: string;
  post: Post;
  postId: string;
};

export type VoteType = {
  id: string;
  user: User;
  userId: string;
  post: Post;
  postId: string;
  voteValue: number; // Values: -1 (downvote), 0 (no vote), 1 (upvote)
};
