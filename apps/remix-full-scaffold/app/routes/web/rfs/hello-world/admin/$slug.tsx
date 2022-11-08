import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({
  params,
}) => {
  return json({ slug: params.slug });
};

export default function PostSlug() {
  const { slug } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <br />
      <Link to="/web/rfs/hello-world/admin" className="text-blue-600 underline">admin</Link>
      <br />
      <Link to="/" className="text-green-300 underline">index</Link>
      <br />
      <h3 className="my-6 border-b-2 text-center text-3xl">
        Some Post: {slug}
      </h3>
    </main>
  );
}