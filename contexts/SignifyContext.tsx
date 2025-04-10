import React, { createContext, useContext, useState, useEffect } from 'react';
import signify, { SignifyClient, Tier } from 'signify-ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignifyContextType {
  client: SignifyClient | null;
  isConnected: boolean;
  connect: (url: string, passcode: string, bootUrl: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getIdentifiers: () => Promise<any[]>;
  getCredentials: (identifier: string) => Promise<any[]>;
  currentIdentifier: string | null;
  setCurrentIdentifier: (identifier: string) => void;
}

const SignifyContext = createContext<SignifyContextType | undefined>(undefined);

export const SignifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<SignifyClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentIdentifier, setCurrentIdentifier] = useState<string | null>(null);

  useEffect(() => {
    loadSavedClient();
  }, []);

  const loadSavedClient = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('agent_url');
      const savedPasscode = await AsyncStorage.getItem('passcode');
      const savedBootUrl = await AsyncStorage.getItem('boot_url');

      if (savedUrl && savedPasscode) {
        await connect(savedUrl, savedPasscode, savedBootUrl || '');
      }
    } catch (error) {
      console.error('Error loading saved client:', error);
    }
  };

  const connect = async (url: string, passcode: string, bootUrl: string) => {
    try {
      await signify.ready();
      const newClient = new signify.SignifyClient(url, passcode, Tier.low, bootUrl);
      await newClient.boot();
      await newClient.connect();

      setClient(newClient);
      setIsConnected(true);

      await AsyncStorage.setItem('agent_url', url);
      await AsyncStorage.setItem('passcode', passcode);
      await AsyncStorage.setItem('boot_url', bootUrl);
    } catch (error) {
      console.error('Error connecting to agent:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await AsyncStorage.removeItem('agent_url');
      await AsyncStorage.removeItem('passcode');
      await AsyncStorage.removeItem('boot_url');
      setClient(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  };

  const getIdentifiers = async () => {
    if (!client) throw new Error('Not connected to agent');
    try {
      const identifiers = client.identifiers();
      const _ids = (await identifiers.list()).aids;
      return _ids;
    } catch (error) {
      console.error('Error fetching identifiers:', error);
      throw error;
    }
  };

  const getCredentials = async () => {
    if (!client) throw new Error('Not connected to agent');
    const aid = (await getIdentifiers()).filter((id: any) => id.name === currentIdentifier)[0].prefix;

    try {
      const credentials = await client.credentials().list();
      return credentials.map((cred: any) => ({
        title: cred.schema.title,
        said: cred.sad.d,
        aid: aid,
        lei: cred.sad.a.LEI,
        personLegalName: cred.sad.a.personLegalName,
        role: cred.sad.a.officialRole || cred.sad.a.engagementContextRole
      }))

    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
  };

  return (
    <SignifyContext.Provider value={{
      client,
      isConnected,
      connect,
      disconnect,
      getIdentifiers,
      getCredentials,
      currentIdentifier,
      setCurrentIdentifier
    }}>
      {children}
    </SignifyContext.Provider>
  );
};

export const useSignify = () => {
  const context = useContext(SignifyContext);
  if (!context) {
    throw new Error('useSignify must be used within a SignifyProvider');
  }
  return context;
}; 