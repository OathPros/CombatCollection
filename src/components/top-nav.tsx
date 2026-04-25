import Link from "next/link";

export function TopNav() {
  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4">
      <div className="font-serif text-lg text-parchment">Combat Collection</div>
      <input
        aria-label="Search"
        placeholder="Search library"
        className="ml-auto w-56 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
      />
      <Link className="text-sm text-zinc-200 hover:text-parchment" href="/library">
        Library
      </Link>
      <Link className="text-sm text-zinc-200 hover:text-parchment" href="/admin/descriptions">
        Admin
      </Link>
    </nav>
  );
}
