import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='home text-6xl items-center justify-center flex flex-col'>
        <h1>THIS IS THE HOMEPAGE</h1>
      </div>

      <div className='flex gap-4 justify-center mt-4'>
        <Link href="/register">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">REGISTER</button>
        </Link>
        <Link href="/login">
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">LOGIN</button>
        </Link>
        <Link href="/dynamic">
        <button className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700">Dynamic</button>
        </Link>
      </div>
    </div>
  );
}
