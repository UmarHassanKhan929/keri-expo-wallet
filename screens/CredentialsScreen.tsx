import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useSignify } from '../contexts/SignifyContext';

export default function CredentialsScreen() {
  const [identifiers, setIdentifiers] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { getIdentifiers, getCredentials, isConnected, currentIdentifier, setCurrentIdentifier, client } = useSignify();

  const loadIdentifiers = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const ids = await getIdentifiers();
      setIdentifiers(ids);
      if (ids.length > 0 && !currentIdentifier) {
        setCurrentIdentifier(ids[0].name);
      }
    } catch (error) {
      console.error('Error loading identifiers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCredentials = async () => {
    if (!isConnected || !currentIdentifier) return;
    setIsLoading(true);
    try {
      const creds = await getCredentials(currentIdentifier);
      setCredentials(creds);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdentifiers();
  }, [isConnected]);

  useEffect(() => {
    if (currentIdentifier) {
      loadCredentials();
    }
  }, [currentIdentifier]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCredentials();
    setRefreshing(false);
  };

  const handlePresentCredential = async (item: any) => {
    try {
      const creds = client?.credentials();
      if (!creds) throw new Error('Client not available');

      const vlei_cesr = await creds.get(item.said, true);

      console.log('Credential Details:', {
        title: item.title,
        said: item.said,
        aid: item.aid,
        lei: item.lei,
        personLegalName: item.personLegalName,
        role: item.role,
        cesr: vlei_cesr
      });
    } catch (error) {
      console.error('Error getting credential CESR:', error);
    }
  };

  const renderIdentifierItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.identifierItem,
        currentIdentifier === item.name && styles.selectedIdentifier
      ]}
      onPress={() => setCurrentIdentifier(item.name)}
    >
      <Text style={styles.identifierName}>{item.name}</Text>
      <Text style={styles.identifierAid}>{item.prefix}</Text>
    </TouchableOpacity>
  );

  const renderCredentialItem = ({ item }: { item: any }) => (
    <View style={styles.credentialItem}>
      <View style={styles.credentialHeader}>
        <Text style={styles.credentialTitle}>{item.title || 'Unknown Credential'}</Text>
        <View style={styles.credentialIcon}>
          <Text style={styles.credentialIconText}>ID</Text>
        </View>
      </View>

      <View style={styles.credentialBody}>
        {item.said && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>SAID:</Text>
            <Text style={styles.credentialValue}>{item.said}</Text>
          </View>
        )}

        {item.aid && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>AID:</Text>
            <Text style={styles.credentialValue}>{item.aid}</Text>
          </View>
        )}

        {item.lei && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>LEI:</Text>
            <Text style={styles.credentialValue}>{item.lei}</Text>
          </View>
        )}

        {item.personLegalName && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Name:</Text>
            <Text style={styles.credentialValue}>{item.personLegalName}</Text>
          </View>
        )}

        {item.role && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Role:</Text>
            <Text style={styles.credentialValue}>{item.role}</Text>
          </View>
        )}

        {item.sad?.dt && (
          <View style={styles.credentialRow}>
            <Text style={styles.credentialLabel}>Issued:</Text>
            <Text style={styles.credentialValue}>
              {new Date(item.sad.dt).toLocaleDateString()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.presentButton}
          onPress={() => handlePresentCredential(item)}
        >
          <Text style={styles.presentButtonText}>Present</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Not connected to agent. Please connect in Settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.identifiersContainer}>
        <Text style={styles.sectionTitle}>Identifiers</Text>
        <FlatList
          data={identifiers}
          renderItem={renderIdentifierItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.credentialsContainer}>
        <Text style={styles.sectionTitle}>Credentials</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={credentials}
            renderItem={renderCredentialItem}
            keyExtractor={(item) => item.sad?.d || Math.random().toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.message}>No credentials found</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  identifiersContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  credentialsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  identifierItem: {
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedIdentifier: {
    backgroundColor: '#f2ffFF',
  },
  identifierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  identifierAid: {
    fontSize: 12,
    color: '#666',
  },
  credentialItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  credentialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  credentialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: '80%',
  },
  credentialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  credentialIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  credentialBody: {
    padding: 16,
  },
  credentialRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  credentialLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  credentialValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  attributesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attributesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  attributeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  attributeLabel: {
    width: 100,
    fontSize: 12,
    color: '#666',
  },
  attributeValue: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  presentButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  presentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 