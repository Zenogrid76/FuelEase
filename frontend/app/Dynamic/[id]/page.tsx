'use client';
import { useParams } from 'next/navigation';

export default function DynamicPage() {
  const params = useParams();
  const id = params?.id ?? '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Operator Info</h1>
        <h2 className="text-xl text-gray-600">Operator ID: <span className="font-semibold text-cyan-600">{id}</span></h2>
      </div>
    </div>
  );
}
