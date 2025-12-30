import { DogCatReplacementService } from '../../src/services/DogCatReplacementService';

describe('DogCatReplacementService', () => {
  let service: DogCatReplacementService;

  beforeEach(() => {
    service = new DogCatReplacementService({ maxReplacements: 5 });
  });

  describe('constructor', () => {
    it('should set default values when no parameters are provided', () => {
      const defaultService = new DogCatReplacementService({});
      expect((defaultService as any).maxReplacements).toBe(5);
    });
  });

  describe('replaceAnimal', () => {
    it('should replace dog with cat in a simple string', () => {
      const input = { message: 'I have a dog' };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect((result as any).message).toContain('cat');
    });

    it('should respect maxReplacements limit', () => {
      const input = { text: 'dog dog dog dog dog dog dog' };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect(service['maxReplacements']).toBe(5);
      expect((result as any).text.split('cat').length - 1).toBe(5);
    });

    it('should handle nested objects', () => {
      const input = {
        level1: {
          level2: {
            message: 'dog in nested object',
          },
        },
      };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect((result as any).level1.level2.message).toContain('cat');
    });

    it('should handle arrays', () => {
      const input = {
        animals: ['dog', 'dog lover', 'another dog'],
      };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect((result as any).animals[0]).toBe('cat');
      expect((result as any).animals[1]).toBe('cat lover');
      expect((result as any).animals[2]).toBe('another cat');
    });

    it('should handle case-insensitive matching', () => {
      const input = { text: 'Dog DOG dOg' };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect((result as any).text).toBe('cat cat cat');
    });

    it('should handle non-string values', () => {
      const input = {
        number: 123,
        boolean: true,
        null: null,
      };
      const result = service.replaceAnimal(input);
      expect(result).toBeDefined();
      expect((result as any).number).toBe(123);
      expect((result as any).boolean).toBe(true);
      expect((result as any).null).toBeNull();
    });

    it('should handle empty objects gracefully', () => {
      const input = {};
      const result = service.replaceAnimal(input);
      expect(result).toEqual({});
    });

    it('should handle inputs with no occurrences of the target animal', () => {
      const input = { text: 'I have a fish' };
      const result = service.replaceAnimal(input);
      expect(result).toEqual(input);
    });

    it('should handle invalid inputs gracefully', () => {
      const input = null;
      const result = service.replaceAnimal(input as any);
      expect(result).toBeNull();
    });

    it('should use default maxReplacements when not provided', () => {
      const defaultService = new DogCatReplacementService({});
      const input = { text: 'dog' };
      const result = defaultService.replaceAnimal(input);
      expect(result).toBeDefined();
    });
  });
});
