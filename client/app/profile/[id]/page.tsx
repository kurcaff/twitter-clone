'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Profile() {
  const { id } = useParams(); // This grabs the number from the URL
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the user details AND their posts
    fetch(`http://localhost:3000/user/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [id]);

  if (!user) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={() => router.push('/feed')} className="mb-4 text-blue-500 underline">
        &larr; Back to Feed
      </button>

      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded shadow mb-6 text-center border">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-600">
          {user.name[0].toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500 mb-4">{user.email}</p>
        <div className="border-t pt-4">
            <span className="font-bold text-xl">{user.posts ? user.posts.length : 0}</span> 
            <span className="text-gray-600 ml-1">Tweets</span>
        </div>
      </div>

      {/* List of their Tweets */}
      <h3 className="text-xl font-bold mb-4">My Tweets</h3>
      {user.posts && user.posts.map((post: any) => (
        <div key={post.id} className="border p-4 mb-2 rounded bg-white shadow-sm">
          <div className="font-bold">{user.name}</div>
          <p className="text-gray-800 mt-1">{post.content}</p>
          <div className="text-xs text-gray-400 mt-2">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
      
      {user.posts && user.posts.length === 0 && (
        <p className="text-gray-500 text-center">No tweets yet.</p>
      )}
    </div>
  );
}