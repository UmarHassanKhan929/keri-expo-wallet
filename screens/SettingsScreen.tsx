import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSignify } from '../contexts/SignifyContext';

const STORAGE_KEYS = {
  AGENT_URL: 'agent_url',
  PASSCODE: 'passcode',
  BOOT_URL: 'boot_url',
};

export default function SettingsScreen() {
  const [agentUrl, setAgentUrl] = useState('');
  const [passcode, setPasscode] = useState('');
  const [bootUrl, setBootUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { connect, disconnect, isConnected } = useSignify();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('agent_url');
        const savedPasscode = await AsyncStorage.getItem('passcode');
        const savedBootUrl = await AsyncStorage.getItem('boot_url');
        if (savedUrl) setAgentUrl(savedUrl);
        if (savedPasscode) setPasscode(savedPasscode);
        if (savedBootUrl) setBootUrl(savedBootUrl);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!agentUrl || !passcode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await connect(agentUrl, passcode, bootUrl);
      Alert.alert('Success', 'Connected to agent successfully!');
    } catch (error) {
      console.error('Error connecting to agent:', error);
      Alert.alert('Error', 'Failed to connect to agent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await disconnect();
      setAgentUrl('');
      setPasscode('');
      setBootUrl('');
      Alert.alert('Success', 'Connection settings cleared');
    } catch (error) {
      console.error('Error clearing settings:', error);
      Alert.alert('Error', 'Failed to clear settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Agent URL</Text>
        <TextInput
          style={styles.input}
          value={agentUrl}
          onChangeText={setAgentUrl}
          placeholder="Enter agent URL"
          autoCapitalize="none"
          keyboardType="url"
        />
        <Text style={styles.label}>Boot URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Boot URL"
          value={bootUrl}
          onChangeText={setBootUrl}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passcode</Text>
        <TextInput
          style={styles.input}
          value={passcode}
          onChangeText={setPasscode}
          placeholder="Enter passcode"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Connecting...' : isConnected ? 'Reconnect' : 'Save & Connect'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Reset Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
}); 