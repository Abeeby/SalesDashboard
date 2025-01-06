import { useState } from 'react';
import { imageService } from '../services/imageService';
import '../styles/ImageUpload.css';

export default function ImageUpload({ itemId, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Générer la miniature pour l'aperçu
      const thumbnail = await imageService.generateThumbnail(file);
      setPreview(URL.createObjectURL(thumbnail));

      // Upload de l'image originale
      const downloadURL = await imageService.uploadImage(file, itemId);
      onImageUploaded(downloadURL);
      setProgress(100);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Aperçu" className="preview-image" />
        </div>
      )}
    </div>
  );
} 