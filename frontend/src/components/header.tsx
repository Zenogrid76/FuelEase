import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b">
       <Link href="/">
      <div className="font-bold text-xl cursor-pointer">
        Fuelease
      </div>
    </Link>
      <div className="flex gap-4">
        <Link href="/register">
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Signup</button>
        </Link>
        <Link href="/login">
          <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Login</button>
        </Link>
      </div>
    </header>
  );
}
