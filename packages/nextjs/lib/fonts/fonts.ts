import { MuseoModerno, Raleway, Sora } from "next/font/google";

// Global font
export const globalFont = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

// brand
export const museoModernoFont = MuseoModerno({
  subsets: ["latin"],
  variable: "--font-museoModerno",
});

// Used as global font
export const ralewayFont = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

// Headers
export const soraFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});
