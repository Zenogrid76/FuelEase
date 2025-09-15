'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DynamicParent() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      router.push(`/dynamic/${input}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Route</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter route"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white size-xl font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
