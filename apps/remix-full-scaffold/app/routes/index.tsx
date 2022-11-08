import { useLoaderData, Link, Outlet } from "@remix-run/react";
export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a className="my-6 border-b-2 text-center text-3xl" target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
            <br />
            <Link to="/web/rfs/hello-world/admin" className="text-blue-600 underline">admin</Link>
            <br />
            <Link to="/daisyui/abc" className="text-blue-600 underline">daisy ui try</Link>
            <br />
            <Link to="/" className="text-yellow-600 underline">index</Link>
            <br />
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
