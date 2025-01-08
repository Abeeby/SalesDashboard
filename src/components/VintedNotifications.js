import React, { useEffect, useState } from 'react';
import { db } from '../auth/firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

export function VintedNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Écouter les changements en temps réel
    const unsubscribe = onSnapshot(
      collection(db, 'vintedData'),
      (snapshot) => {
        const latestData = snapshot.docs[0]?.data();
        
        // Vérifier les nouveaux messages
        if (latestData?.messages) {
          const unreadCount = latestData.messages.filter(m => m.unread).length;
          if (unreadCount > 0) {
            toast.info(`Vous avez ${unreadCount} nouveau(x) message(s)`);
          }
        }

        // Vérifier les nouvelles ventes
        if (latestData?.sales) {
          const recentSales = latestData.sales.filter(
            s => new Date(s.saleDate) > new Date(Date.now() - 300000)
          );
          recentSales.forEach(sale => {
            toast.success(`Nouvelle vente : ${sale.title} - ${sale.price}`);
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return null; // Composant invisible, utilise uniquement les notifications toast
} 