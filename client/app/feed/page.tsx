'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const router = useRouter();

  // Fetch posts on load
  useEffect(() => {
    fetch('http://localhost:3000/feed')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/');
  };

  const goToProfile = () => {
    const userId = localStorage.getItem('userId');
    router.push(`/profile/${userId}`);
  };
  const createPost = async () => {
    const userId = localStorage.getItem('userId');
    await fetch('http://localhost:3000/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId: Number(userId) }),
    });
    window.location.reload(); 
  };

const handleLike = async (postId: number) => {
    const userId = localStorage.getItem('userId');
    await fetch('http://localhost:3000/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userId: Number(userId) }),
    });
    

    window.location.reload(); 
  };
const handleDelete = async (postId: number) => {
  const userId = localStorage.getItem('userId');

  // Confirm before deleting 
  if (!confirm('Are you sure you want to delete this tweet?')) return;

  await fetch(`http://localhost:3000/tweet/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: Number(userId) }),
  });
  window.location.reload();
};
  const handleRetweet = async (postId: number) => {
    const userId = localStorage.getItem('userId');
    await fetch('http://localhost:3000/retweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userId: Number(userId) }),
    });
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Home Feed</h1>
        <div className="flex gap-2">
          <button 
            onClick={goToProfile} 
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            My Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mb-6 border p-4 rounded bg-white shadow">
        <textarea 
          className="w-full border p-2" 
          placeholder="What's happening?" 
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
          Tweet
        </button>
      </div>

      {posts.map((post: any) => (
        <div key={post.id} className="border p-4 mb-2 rounded bg-white shadow-sm hover:bg-gray-50">
           {/* If it's a retweet, show who retweeted */}
          {post.originalPost && (
             <div className="text-xs text-gray-500 mb-1">Retweeted by {post.author.name}</div>
          )}

        <Link href={`/profile/${post.author.id}`} className="font-bold hover:underline cursor-pointer">
                {post.originalPost ? post.originalPost.author.name : post.author.name}
        </Link>
          
          <p className="text-gray-800 mt-1">
             {post.originalPost ? post.originalPost.content : post.content}
          </p>
          
          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <button onClick={() => handleLike(post.id)} className="hover:text-red-500">
               Like ({post.likes ? post.likes.length : 0})
            </button>
            <button onClick={() => handleRetweet(post.originalPostId || post.id)} className="hover:text-green-500">
               Retweet
            </button>
            {/* Only show Delete if I am the author */}
            {Number(localStorage.getItem('userId')) === post.authorId && (
               <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
                  Delete
               </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}