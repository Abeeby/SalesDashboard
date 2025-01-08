import React from 'react';

export function OrderTracking({ orders }) {
  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'En attente'),
    shipping: orders.filter(o => o.status === 'En cours d\'envoi'),
    delivered: orders.filter(o => o.status === 'Livré')
  };

  return (
    <div className="order-tracking">
      <h3>Suivi des commandes</h3>
      <div className="order-status-grid">
        {Object.entries(ordersByStatus).map(([status, orders]) => (
          <div key={status} className={`status-column ${status}`}>
            <h4>{status.charAt(0).toUpperCase() + status.slice(1)}</h4>
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <img src={order.imageUrl} alt={order.title} />
                <h5>{order.title}</h5>
                <p>{order.price}</p>
                <p>Acheteur: {order.buyerName}</p>
                <p>Date: {order.saleDate}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 