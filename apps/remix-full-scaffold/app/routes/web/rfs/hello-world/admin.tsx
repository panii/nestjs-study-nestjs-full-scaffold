import type { LinksFunction } from '@remix-run/node';
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";

import stylesUrl from '../../../../styles/web/rfs/hello-world/index.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type Post = {
  slug: string;
  title: string;
};
type LoaderData = {
  posts: Array<Post>;
};
export const loader = async () => {
  return json<LoaderData>({
    posts: [
      {
        slug: "my-first-post",
        title: "My First Post",
      },
      {
        slug: "90s-mixtape",
        title: "A Mixtape I Made Just For You",
      },
    ],
  });
};

export default function WebRfsHelloWorld() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1><p>Web Rfs Hello World works!</p></h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
                  to={`${post.slug}`}
                  className="text-blue-600 underline"
                >
              {post.slug} - {post.title}
              </Link>
          </li>
        ))}
      </ul>
      <br /><button type="button" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300">xxx</button><br />
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <main className="col-span-4 md:col-span-3">
        <Outlet />
      </main>
    </div>
  );
}
