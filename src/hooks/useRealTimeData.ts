import { useEffect, useState } from 'react';

export function useRealTimeData() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    // SYSTÈME TEMPS RÉEL DÉSACTIVÉ COMPLÈTEMENT
    // Plus de connexion WebSocket ni de mises à jour automatiques
    setIsConnected(false);
    setLastUpdate(null);
    setUpdateCount(0);
  }, []);

  return {
    isConnected: false,
    lastUpdate: null,
    updateCount: 0,
  };
}

export default useRealTimeData;