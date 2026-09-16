import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/forgot-password', { email });
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Unable to request a password reset. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-extrabold text-[#1E40AF] text-center">BD Studeo</h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-1 text-center">Reset your password</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email address and we will send you a reset link.
          </p>

          {message.text && (
            <div className={`mb-4 p-3 text-sm text-white rounded-lg text-center ${
              message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-bold rounded-lg bg-[#1E40AF] hover:bg-blue-800 text-white shadow-md disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Email reset link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="font-semibold text-[#1E40AF] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
