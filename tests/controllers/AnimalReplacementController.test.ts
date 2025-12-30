import { AnimalReplacementController } from '../../src/controllers/AnimalReplacementController';
import { DogCatReplacementService } from '../../src/services/DogCatReplacementService';
import { LRUCache } from 'lru-cache';
import { Request, Response } from 'express';

describe('AnimalReplacementController', () => {
  let controller: InstanceType<typeof AnimalReplacementController>;
  let mockService: DogCatReplacementService;
  let mockCache: LRUCache<string, any>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new DogCatReplacementService({ maxReplacements: 5 });
    mockCache = new LRUCache({ ttl: 600, max: 100 });
    
    mockRequest = {
      body: { text: 'I have a dog' },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    controller = new AnimalReplacementController({
      dogCatReplacementService: mockService,
      lruCache: mockCache,
    });
  });

  describe('constructor', () => {
    it('should initialize with provided service and cache', () => {
      expect((controller as any).animalReplacementService).toBe(mockService);
      expect((controller as any).cache).toBe(mockCache);
    });
  });

  describe('replaceAnimal', () => {
    it('should return cached result if available', () => {
      const testBody = { text: 'dog' };
      const cachedResult = { text: 'cat' };
      const cacheKey = JSON.stringify(testBody);
      
      mockCache.set(cacheKey, cachedResult);
      mockRequest.body = testBody;

      controller.replaceAnimal(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(cachedResult);
    });

    it('should call service and cache result when not in cache', () => {
      const testBody = { text: 'dog' };
      mockRequest.body = testBody;

      controller.replaceAnimal(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(mockCache.has(JSON.stringify(testBody))).toBe(true);
    });

    it('should handle empty request body', () => {
      mockRequest.body = {};

      controller.replaceAnimal(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle non string values in request body', () => {
      mockRequest.body = { number: 42, boolean: true, nullValue: null };
      controller.replaceAnimal(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    // Enable once request body validation is implemented
    it.skip('should handle invalid request body gracefully', () => {
      mockRequest.body = null;
        controller.replaceAnimal(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
