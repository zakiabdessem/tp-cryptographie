const API_BASE_URL = import.meta.env.PROD
  ? 'https://api-crypto.lootzone.digital'
  : 'http://localhost:4001';

export type EncryptResponse = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export type DecryptResponse = {
  plaintext: string;
};

export type SignResponse = {
  signature: string;
};

export type VerifyResponse = {
  isValid: boolean;
};

export type HashResponse = {
  hash: string;
};

export type MessageRecord = {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  encrypted: EncryptResponse;
  signature: string;
  hash: string;
  createdAt: string;
};

export type CreateMessageRequest = {
  sender: string;
  recipient: string;
  message: string;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  encrypt: async (message: string): Promise<EncryptResponse> => {
    const response = await fetch(`${API_BASE_URL}/crypto/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse<EncryptResponse>(response);
  },

  decrypt: async (ciphertext: string, iv: string, authTag: string): Promise<DecryptResponse> => {
    const response = await fetch(`${API_BASE_URL}/crypto/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciphertext, iv, authTag }),
    });
    return handleResponse<DecryptResponse>(response);
  },

  sign: async (message: string): Promise<SignResponse> => {
    const response = await fetch(`${API_BASE_URL}/crypto/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse<SignResponse>(response);
  },

  verify: async (message: string, signature: string): Promise<VerifyResponse> => {
    const response = await fetch(`${API_BASE_URL}/crypto/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });
    return handleResponse<VerifyResponse>(response);
  },

  hash: async (message: string): Promise<HashResponse> => {
    const response = await fetch(`${API_BASE_URL}/crypto/hash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse<HashResponse>(response);
  },

  createMessage: async (data: CreateMessageRequest): Promise<MessageRecord> => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<MessageRecord>(response);
  },

  getMessages: async (): Promise<MessageRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/messages`);
    return handleResponse<MessageRecord[]>(response);
  },
};

