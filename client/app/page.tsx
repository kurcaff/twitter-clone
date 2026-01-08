'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          ...(isLogin ? {} : { name }) // Only send name if registering
        }),
      });

      const data = await res.json();

      if (isLogin) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          router.push('/feed');
        } else {
          alert('Login failed: ' + (data.message || 'Check credentials'));
        }
      } else {
        // Registration successful
        if (data.id) {
          alert('Account created! Please login.');
          setIsLogin(true); // Switch back to login view
        } else {
          alert('Registration failed');
        }
      }
    } catch (err) {
      alert('Server error. Is the backend running?');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        
        {/* Only show Name field if Registering */}
        {!isLogin && (
          <input 
            className="border p-2 mb-3 w-full rounded" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
          />
        )}

        <input 
          className="border p-2 mb-3 w-full rounded" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="border p-2 mb-4 w-full rounded" 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <button 
          className="bg-blue-500 text-white p-2 rounded w-full mb-4 hover:bg-blue-600" 
          onClick={handleSubmit}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="text-sm text-center text-gray-600 cursor-pointer hover:underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "No account? Sign up" : "Have an account? Login"}
        </p>
      </div>
    </div>
  );
}