import { TensorFlow } from '@tensorflow/tfjs';
import { ImageProcessing } from './imageProcessing.mjs';
import { ColorAnalyzer } from './colorAnalysis.mjs';

class ImageAnalysisService {
  constructor() {
    this.tf = new TensorFlow();
    this.imageProcessor = new ImageProcessing();
    this.colorAnalyzer = new ColorAnalyzer();
    this.models = {
      garmentDetection: null,
      qualityAssessment: null,
      brandRecognition: null
    };
    this.initModels();
  }

  async initModels() {
    this.models.garmentDetection = await this.tf.loadLayersModel(
      'models/garment-detection/model.json'
    );
    this.models.qualityAssessment = await this.tf.loadLayersModel(
      'models/quality-assessment/model.json'
    );
    this.models.brandRecognition = await this.tf.loadLayersModel(
      'models/brand-recognition/model.json'
    );
  }

  async analyzeImage(image) {
    const processedImage = await this.imageProcessor.preprocess(image);
    
    const [garmentType, quality, brandInfo] = await Promise.all([
      this.detectGarmentType(processedImage),
      this.assessQuality(processedImage),
      this.recognizeBrand(processedImage)
    ]);

    const colorAnalysis = await this.colorAnalyzer.analyze(processedImage);

    return {
      garmentInfo: {
        type: garmentType,
        style: await this.detectStyle(processedImage),
        pattern: await this.detectPattern(processedImage)
      },
      qualityAssessment: {
        overall: quality.score,
        details: quality.details,
        suggestions: quality.improvements
      },
      colorProfile: {
        dominant: colorAnalysis.dominant,
        palette: colorAnalysis.palette,
        contrast: colorAnalysis.contrast
      },
      brandDetails: brandInfo,
      marketRelevance: await this.assessMarketRelevance(garmentType, brandInfo)
    };
  }

  async optimizeImages(images) {
    return Promise.all(images.map(async (image) => {
      const optimized = await this.imageProcessor.optimize(image);
      return {
        original: image,
        optimized,
        metadata: await this.extractMetadata(image)
      };
    }));
  }
}

export const imageAnalyzer = new ImageAnalysisService(); 