"use client";
import React, { useEffect } from "react";

interface SEOMetaProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export function SEOMeta({
  title = "Nirva Yoga Studio",
  description = "Yoga for everyone, everywhere.",
  url = "https://nirvayogastudio.com",
  image = "/assets/og-image.png",
}: SEOMetaProps) {
  useEffect(() => {
    let script = document.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "YogaStudio",
      name: title,
      description,
      url,
      image,
    });
  }, [title, description, url, image]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
    </>
  );
}