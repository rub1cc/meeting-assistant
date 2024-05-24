import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const secondsToHms = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600); // 0
  const m = Math.floor((d % 3600) / 60); // 1
  const s = Math.floor((d % 3600) % 60); // 12

  const hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + ":" : "00:";
  const mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + ":" : "00:";
  const sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";

  return hDisplay + mDisplay + sDisplay; // 00:01:12
};

export const secondsToCreditsShort = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600); // 0
  const m = Math.floor((d % 3600) / 60); // 1
  const s = Math.floor((d % 3600) % 60); // 12

  const hDisplay = h > 0 ? `${h}h ` : "";
  const mDisplay = m > 0 ? `${m}m ` : "";
  const sDisplay = s > 0 ? `${s}s` : "";

  return hDisplay + mDisplay + sDisplay; // 0h 1m 12s
};

export const secondsToCreditsLong = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600); // 0
  const m = Math.floor((d % 3600) / 60); // 1
  const s = Math.floor((d % 3600) % 60); // 12

  const hDisplay = h > 0 ? `${h} hours ` : "";
  const mDisplay = m > 0 ? `${m} minutes ` : "";
  const sDisplay = s > 0 ? `${s} seconds` : "";

  return hDisplay + mDisplay + sDisplay; // 0h 1m 12s
};

export const formatFileName = (str) => {
  if (!str) return null;
  if (str.length > 25) {
    const [name, ext] = str.split(".");
    return `${name.slice(0, 15)}...${name.slice(-5)}.${ext}`;
  }

  return str;
};

export const generateRandomString = (length = 5) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const getImageUrl = (bucket, path) => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/" +
    bucket +
    "/" +
    path
  );
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};
