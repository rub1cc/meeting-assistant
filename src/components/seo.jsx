import Head from "next/head";

export function Seo({
  title = "Automate your meeting notes with AI",
  description = "Meeting Assistant will help you to transcribe, summarize, and take notes for your meetings.",
  image = "https://meeting-assistant.rub1.cc/og-image.png",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content="{title}" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://meeting-assistant.rub1.cc/" />

      {/* Twitter */}
      <meta property="og:image" content={image} />

      <meta property="twitter:title" content="{title}" />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta
        property="twitter:url"
        content="https://meeting-assistant.rub1.cc/"
      />
    </Head>
  );
}
