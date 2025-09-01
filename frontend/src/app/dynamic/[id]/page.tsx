'use client';
import { useParams } from 'next/navigation';

export default function DynamicPage() {
  const params = useParams();
  const id = params?.id ?? ''; 

  return (
    <div style={{ padding: 20 }}>
      <h1>Dynamic Route: {id}</h1>
      <p>This page is to {id}</p>
    </div>
  );
}
