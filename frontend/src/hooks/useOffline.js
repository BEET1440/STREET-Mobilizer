import { useState, useEffect } from 'react';
import { getOfflineRecords, clearSyncedRecords } from '../utils/offlineStorage';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial count
    setOfflineCount(getOfflineRecords().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setOfflineCount(getOfflineRecords().length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const syncRecords = async () => {
    if (!isOnline) return { success: false, message: 'No internet connection' };
    
    const records = getOfflineRecords();
    if (records.length === 0) return { success: true, message: 'Nothing to sync' };

    setIsSyncing(true);
    const syncedIds = [];

    try {
      for (const record of records) {
        // Simulation of API call to register child
        // In reality, this would be an actual fetch/axios call
        console.log(`Syncing record: ${record.name} to blockchain...`);
        
        // Mocking a successful response
        const response = await new Promise(resolve => setTimeout(resolve, 1000));
        
        syncedIds.push(record.id);
      }

      clearSyncedRecords(syncedIds);
      setOfflineCount(getOfflineRecords().length);
      setIsSyncing(false);
      return { success: true, count: syncedIds.length };
    } catch (error) {
      console.error('Sync failed:', error);
      setIsSyncing(false);
      return { success: false, message: 'Sync failed, will retry later' };
    }
  };

  return { isOnline, offlineCount, isSyncing, syncRecords };
};
