import '../styles/ConfirmDialog.css';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="button-group">
          <button onClick={onConfirm} className="confirm-btn">Confirmer</button>
          <button onClick={onCancel} className="cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  );
} 