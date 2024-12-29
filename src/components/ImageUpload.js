import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span">
          Télécharger une image
        </Button>
      </label>
      {preview && (
        <Box mt={2}>
          <img src={preview} alt="Aperçu" style={{ maxWidth: '200px' }} />
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload; 