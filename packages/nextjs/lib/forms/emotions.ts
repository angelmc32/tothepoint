export const emotionsArray = [
  { id: "like", value: "like", label: "👍" },
  { id: "care", value: "care", label: "🔥" },
  { id: "surprise", value: "surprise", label: "😮" },
  { id: "fun", value: "fun", label: "😂" },
  { id: "learning", value: "learning", label: "🤓" },
  { id: "dislike", value: "dislike", label: "👎" },
  { id: "sad", value: "sad", label: "😢" },
  { id: "angry", value: "angry", label: "😠" },
  { id: "uncomfortable", value: "uncomfortable", label: "😟" },
  { id: "trash", value: "trash", label: "💩" },
];

type EmotionObjectType = {
  like: string;
  care: string;
  surprise: string;
  fun: string;
  learning: string;
  dislike: string;
  sad: string;
  angry: string;
  uncomfortable: string;
  trash: string;
};

export const emotionsObject: EmotionObjectType = {
  like: "👍",
  care: "🔥",
  surprise: "😮",
  fun: "😂",
  learning: "🤓",
  dislike: "👎",
  sad: "😢",
  angry: "😠",
  uncomfortable: "😟",
  trash: "💩",
};

export function getEmojiFromString(emotion: string) {
  switch (emotion) {
    case "like":
      return "👍";
    case "care":
      return "🔥";
    case "surprise":
      return "😮";
    case "fun":
      return "😂";
    case "learning":
      return "🤓";
    case "dislike":
      return "👎";
    case "sad":
      return "😢";
    case "angry":
      return "😠";
    case "uncomfortable":
      return "😟";
    case "trash":
      return "💩";
    default:
      return "👻";
  }
}
