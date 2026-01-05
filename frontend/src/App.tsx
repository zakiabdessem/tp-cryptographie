import { useState } from 'react';
import MessageForm from './components/MessageForm';
import MessagesList from './components/MessagesList';
import UtilityCard from './components/UtilityCard';
import { api } from './api/client';

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [explainMode, setExplainMode] = useState(false);

  const handleMessageSent = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
              Secure<span className="text-blue-600">Chat</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium whitespace-pre-line">
              Industrial-grade encryption for your private conversations.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <span className={`text-sm font-bold transition-colors ${!explainMode ? 'text-blue-600' : 'text-gray-400'}`}>Normal</span>
            <button
              onClick={() => setExplainMode(!explainMode)}
              className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Explain Mode"
            >
              <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${explainMode ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold transition-colors ${explainMode ? 'text-blue-600' : 'text-gray-400'}`}>Explain</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <MessageForm onMessageSent={handleMessageSent} />
            <MessagesList key={refreshKey} explainMode={explainMode} />
          </div>

          <div className="space-y-8">
            <UtilityCard
              title="Hash"
              description="SHA-256 integrity check"
              onSubmit={async (message) => {
                const result = await api.hash(message);
                return result.hash;
              }}
              inputLabel="Message"
              resultLabel="Hash Output"
            />
            <UtilityCard
              title="Encrypt"
              description="AES-256-GCM encryption"
              onSubmit={async (message) => {
                const result = await api.encrypt(message);
                return JSON.stringify(result, null, 2);
              }}
              inputLabel="Plaintext"
              resultLabel="Encrypted Payload"
            />
            <UtilityCard
              title="Sign"
              description="RSA-2048 digital signature"
              onSubmit={async (message) => {
                const result = await api.sign(message);
                return result.signature;
              }}
              inputLabel="Message"
              resultLabel="Digital Signature"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UtilityCard
            title="Decrypt"
            description="AES-256-GCM decryption using individual components."
            onSubmit={async (_, fields) => {
              if (!fields) throw new Error('Fields missing');
              const { ciphertext, iv, authTag } = fields;
              const result = await api.decrypt(ciphertext, iv, authTag);
              return result.plaintext;
            }}
            fields={[
              { id: 'ciphertext', label: 'Ciphertext', placeholder: 'Enter base64 ciphertext' },
              { id: 'iv', label: 'IV', placeholder: 'Enter base64 initialization vector' },
              { id: 'authTag', label: 'Auth Tag', placeholder: 'Enter base64 authentication tag' },
            ]}
            resultLabel="Decrypted Message"
          />
          <UtilityCard
            title="Verify"
            description="RSA-2048 signature verification."
            onSubmit={async (_, fields) => {
              if (!fields) throw new Error('Fields missing');
              const { message, signature } = fields;
              const result = await api.verify(message, signature);
              return result.isValid ? '✓ Signature is valid' : '✗ Signature is invalid';
            }}
            fields={[
              { id: 'message', label: 'Original Message', placeholder: 'What was the original text?', type: 'textarea' },
              { id: 'signature', label: 'Digital Signature', placeholder: 'Enter base64 signature' },
            ]}
            resultLabel="Verification Status"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
