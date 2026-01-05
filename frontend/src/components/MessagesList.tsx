import { useEffect, useState } from 'react';
import { api, type MessageRecord } from '../api/client';

interface MessagesListProps {
  explainMode?: boolean;
}

const MessagesList = ({ explainMode = false }: MessagesListProps) => {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMessages();
      setMessages(data.reverse());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading && messages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        <p className="text-gray-600 italic">Gathering your secure conversations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conversations</h2>
          <p className="text-sm text-gray-500">{messages.length} messages found</p>
        </div>
        <button
          onClick={fetchMessages}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
          aria-label="Refresh messages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl mb-4 border border-red-100" role="alert">
          {error}
        </div>
      )}
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="group border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">{msg.sender}</span>
                  <span className="text-gray-400">→</span>
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                    {msg.recipient.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">{msg.recipient}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="mb-4 pl-10">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 inline-block max-w-full">
                  <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
              
              {explainMode && (
                <div className="mt-4 pl-10 grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="p-1 bg-blue-100 rounded text-blue-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16" />
                        </svg>
                      </span>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">SHA-256 Hash</span>
                    </div>
                    <div className="bg-white/50 p-2 rounded border border-blue-100 break-all font-mono text-[10px] text-blue-900 leading-relaxed">
                      {msg.hash}
                    </div>
                  </div>

                  <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                    <div className="flex items-center space-x-2 mb-2">
                       <span className="p-1 bg-purple-100 rounded text-purple-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </span>
                      <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">RSA-2048 Signature</span>
                    </div>
                    <div className="bg-white/50 p-2 rounded border border-purple-100 break-all font-mono text-[10px] text-purple-900 leading-relaxed">
                      {msg.signature}
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="p-1 bg-emerald-100 rounded text-emerald-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">AES-256-GCM Encryption</span>
                    </div>
                    <div className="space-y-2">
                       <div>
                        <span className="text-[10px] text-emerald-600 font-semibold uppercase">Ciphertext</span>
                        <div className="bg-white/50 p-2 rounded border border-emerald-100 break-all font-mono text-[10px] text-emerald-900 mt-1">
                          {msg.encrypted.ciphertext}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-emerald-600 font-semibold uppercase">IV</span>
                          <div className="bg-white/50 p-2 rounded border border-emerald-100 break-all font-mono text-[10px] text-emerald-900 mt-1">
                            {msg.encrypted.iv}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-600 font-semibold uppercase">Auth Tag</span>
                          <div className="bg-white/50 p-2 rounded border border-emerald-100 break-all font-mono text-[10px] text-emerald-900 mt-1">
                            {msg.encrypted.authTag}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList;

