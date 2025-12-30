/// <reference path="./types/express.d.ts" />

import express, { Request, Response, NextFunction } from 'express';
import { createContainer, asClass, asValue, AwilixContainer } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-express';
import { DogCatReplacementService } from './services/DogCatReplacementService';
import { LRUCache } from 'lru-cache'

const app = express();
const container = createContainer();

// Implement a local LRU Cache. Ideally this would use an external caching service like Redis for a real-world application.
const cacheOptions = {
  ttl: parseInt(process.env.CACHE_TTL || '600', 10),
  max: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10),
};

const cacheInstance = new LRUCache<string, any>(cacheOptions);

// This should have some error handling to log and dependancy resolution issues
container.register({
  dogCatReplacementService: asClass(DogCatReplacementService).scoped(),
  lruCache: asValue<LRUCache<string, any>>(cacheInstance),
});

app.use(scopePerRequest(container));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.container.register({
    maxReplacements: asValue(process.env.MAX_REPLACEMENTS),
  });
  next();
});

app.use(loadControllers('controllers/*.ts', { cwd: __dirname }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

app.listen(3000, () => console.log('Server running on port 3000'));
