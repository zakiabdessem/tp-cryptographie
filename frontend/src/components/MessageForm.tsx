import { useState } from 'react';
import { api, type CreateMessageRequest } from '../api/client';

interface MessageFormProps {
  onMessageSent: () => void;
}

const MessageForm = ({ onMessageSent }: MessageFormProps) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!sender.trim() || !recipient.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const data: CreateMessageRequest = { sender, recipient, message };
      await api.createMessage(data);
      setSuccess(true);
      setSender('');
      setRecipient('');
      setMessage('');
      setTimeout(() => {
        setSuccess(false);
        onMessageSent();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label htmlFor="sender" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Sender
            </label>
            <input
              id="sender"
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              placeholder="Your name"
            />
          </div>
          <div className="relative group">
            <label htmlFor="recipient" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Recipient
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              placeholder="Recipient name"
            />
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="message" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm h-32 resize-none"
            placeholder="Write your secure message here..."
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-4 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Message encrypted and sent securely!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden relative group"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Encrypting...</span>
            </div>
          ) : (
            <>
              <span className="relative z-10">Send Secure Message</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;

