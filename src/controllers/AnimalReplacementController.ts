import { createController } from 'awilix-express';
import type { AnimalReplacementService } from '../services/DogCatReplacementService';
import { Request, Response } from 'express';
import { LRUCache } from 'lru-cache'

export class AnimalReplacementController {
  private readonly animalReplacementService: AnimalReplacementService;
  private readonly cache: LRUCache<string, any>;

  constructor({ dogCatReplacementService, lruCache }: { dogCatReplacementService: AnimalReplacementService, lruCache: LRUCache<string, any> }) {
    this.animalReplacementService = dogCatReplacementService;
    this.cache = lruCache;
  }

  replaceAnimal(req: Request, res: Response) {
    // ToDo: Implement request body validation logic
    if (this.cache.has(JSON.stringify(req.body))) {
      return res.status(200).json(this.cache.get(JSON.stringify(req.body)));
    }
    const result = this.animalReplacementService.replaceAnimal(req.body);
    this.cache.set(JSON.stringify(req.body), result);
    return res.status(200).json(result);
  }
}

export default createController(AnimalReplacementController).prefix('/animal-replacement').post('', 'replaceAnimal');
