import Link from "next/link";

export function UploadButton() {
  return (
    <Link
      href="/"
      className="bg-primary rounded-full px-4 py-2 text-primary-foreground text-xs"
    >
      <span className="hidden md:inline">Upload a meeting</span>
      <span className="inline md:hidden">New</span>
    </Link>
  );
}
