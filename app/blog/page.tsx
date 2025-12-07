import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("blog").catch(() => notFound());
  return (
    <div className="px-4 py-8 max-w-5xl flex flex-col items-stretch mx-auto">
      <h1 className="text-xl text-primary-content bg-primary px-8 py-2">
        {page.data.blogTitle}
      </h1>
      <SliceZone slices={page.data.slices} components={components} />
    </div>
  );
  return;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("blog").catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
