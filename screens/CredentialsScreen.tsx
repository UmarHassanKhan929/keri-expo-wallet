import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { useSignify } from '../contexts/SignifyContext';
import { CameraView, Camera } from 'expo-camera';

export default function CredentialsScreen() {
  const [identifiers, setIdentifiers] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { getIdentifiers, getCredentials, isConnected, currentIdentifier, setCurrentIdentifier, client } = useSignify();
  const [selectedCredential, setSelectedCredential] = useState<any>(null);


  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

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
      setSelectedCredential({
        ...item,
        vlei_cesr
      });

      // Request camera permission when presenting
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        setIsScanning(true);
      } else {
        Alert.alert('Permission Required', 'Camera permission is required to scan QR codes');
      }
    } catch (error) {
      console.error('Error getting credential CESR:', error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScannedData(data);
    setIsScanning(false);

    console.log('Scanned Data:', data);
    console.log('Scanned Type:', type);

    try {
      // Here you would call your API with the scanned data
      fetch(data, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          said: selectedCredential.said,
          aid: selectedCredential.aid,
          vlei: selectedCredential.vlei_cesr
        })
      });
      Alert.alert('Success', 'QR Code scanned successfully: ');
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process QR code');
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

      {isScanning && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isScanning}
          onRequestClose={() => setIsScanning(false)}
        >
          <View style={{ flex: 1 }}>
            {hasPermission ? (
              <View style={styles.cameraContainer}>
                <CameraView
                  onBarcodeScanned={handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlay}>
                  <View style={styles.scannerContainer}>
                    <View style={styles.scannerOutline}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <Text style={styles.scannerText}>Position QR code within the frame</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsScanning(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
  closeButton: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#fff',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#007AFF',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
}); 