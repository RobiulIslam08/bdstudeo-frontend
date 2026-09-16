import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    token: searchParams.get('token') || '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/reset-password', form);
      setMessage({ type: 'success', text: response.data.message });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Unable to reset your password. Please request a new link.',
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
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-1 text-center">Choose a new password</h2>

          {message.text && (
            <div className={`my-4 p-3 text-sm text-white rounded-lg text-center ${
              message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input type="hidden" name="token" value={form.token} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input id="password" type="password" name="password" value={form.password} onChange={handleChange} minLength="8" required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <input id="password_confirmation" type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} minLength="8" required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
            </div>
            <button type="submit" disabled={loading || !form.token}
              className="w-full py-3 text-sm font-bold rounded-lg bg-[#1E40AF] hover:bg-blue-800 text-white shadow-md disabled:opacity-70">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>

          {!form.token && <p className="mt-3 text-center text-sm text-red-600">This reset link is missing its token. Request a new one.</p>}
          <p className="mt-6 text-center text-sm text-gray-600">
            <Link to="/login" className="font-semibold text-[#1E40AF] hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
