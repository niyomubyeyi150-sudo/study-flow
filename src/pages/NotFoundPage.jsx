import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
function NotFound() {
  useDocumentTitle("Page Not Found");
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F4EF] px-6">
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#806A91]">
          Page not found
        </p>

        <h1 className="mb-4 text-6xl font-bold text-[#3B3044]">404</h1>

        <h2 className="mb-3 text-xl font-semibold text-[#302B32]">
          Oops! We couldn't find that page.
        </h2>

        <p className="mb-7 text-sm leading-6 text-[#938B94]">
          The page you're looking for may have been moved, deleted, or the URL
          might be incorrect.
        </p>

        <Link
          to="/"
          className="inline-block rounded-xl bg-[#3B3044] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#806A91]"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
