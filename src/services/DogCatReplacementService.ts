export interface AnimalReplacementService {
  replaceAnimal(input: Object): Object;
}

export class DogCatReplacementService implements AnimalReplacementService {
  private readonly animalToReplace: string;
  private readonly replacementAnimal: string;
  private readonly maxReplacements: number;

  constructor({ maxReplacements }: { maxReplacements?: number }) {
    this.animalToReplace = 'dog';
    this.replacementAnimal = 'cat';
    this.maxReplacements = maxReplacements ?? 5;
  }

  replaceAnimal(input: Object): Object {
    let numberOfReplacements = 0;

    const traverse = (obj: any): any => {
      if (typeof obj === 'string') {
        const lowerObj = obj.toLowerCase();
        if (lowerObj.includes(this.animalToReplace) && numberOfReplacements < this.maxReplacements) {
          const occurrences = lowerObj.split(this.animalToReplace).length - 1;
          const replacements = Math.min(occurrences, this.maxReplacements - numberOfReplacements);
          numberOfReplacements += replacements;
          return lowerObj.split(this.animalToReplace, numberOfReplacements + 1).join(this.replacementAnimal);
        }
        return obj;
      } else if (Array.isArray(obj)) {
        return obj.map(traverse);
      } else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = traverse(obj[key]);
        }
        return newObj;
      } else {
        return obj;
      }
    };
    return traverse(input);
  }
}
