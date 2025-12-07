import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc, isFilled } from "@prismicio/client";
import { PrismicImage, SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("blog").catch(() => notFound());
  const authorLinks = page.data.authors ?? [];
  if (isFilled.group(authorLinks)) {
    authorLinks.map((author) => author.author);
  }
  const authorData = [];
  if (isFilled.group(authorLinks)) {
    for (let index = 0; index < authorLinks.length; index++) {
      const element = authorLinks[index];
      if (isFilled.contentRelationship(element.author)) {
        authorData.push(element.author.data);
      }
    }
  }

  const formattedDescription = page.data.description?.split("\n");
  return (
    <div className="px-4 py-8 max-w-5xl flex flex-col items-stretch mx-auto">
      <h1 className="text-xl text-primary font-bold py-2">
        {page.data.blogTitle}
      </h1>
      <div>
        {formattedDescription?.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="divider divider-primary" />

      <div className="flex flex-col gap-4">
        <h2>Forfatterne bag:</h2>
        {authorData.map((author) => (
          <div key={author?.name} className="flex flex-row items-center gap-4">
            <div className="avatar  h-12">
              <div className=" rounded-full bg-primary p-1">
                <PrismicImage field={author?.avatar} />
              </div>
            </div>
            <div>
              <p className="font-bold">{author?.name}</p>
              <p className="text-xs italic">
                {`Fokus på: ${author?.expertise}`}
              </p>
              <p className="text-xs italic">{`Boligsituation: ${author?.home_situation}`}</p>
            </div>
          </div>
        ))}
      </div>

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
