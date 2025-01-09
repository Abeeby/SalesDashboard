import React, { useState } from 'react';
import { contentGenerator } from '../services/contentGeneration.mjs';
import { ImageUploader, PriceSelector, DescriptionEditor } from './ui';

function ListingCreator() {
  const [images, setImages] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = async (newImages) => {
    setImages(newImages);
    if (newImages.length > 0) {
      setIsGenerating(true);
      try {
        const content = await contentGenerator.generateListingContent(newImages);
        setGeneratedContent(content);
      } catch (error) {
        console.error('Erreur de génération:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="listing-creator">
      <ImageUploader onUpload={handleImageUpload} />
      {isGenerating && <LoadingSpinner text="Génération du contenu..." />}
      {generatedContent && (
        <div className="generated-content">
          <DescriptionEditor 
            initialContent={generatedContent.description}
            suggestions={generatedContent.marketingPoints}
          />
          <PriceSelector 
            suggestion={generatedContent.priceSuggestion}
            marketData={generatedContent.marketAnalysis}
          />
          <TagSelector suggestions={generatedContent.tags} />
        </div>
      )}
    </div>
  );
}

export default ListingCreator; 