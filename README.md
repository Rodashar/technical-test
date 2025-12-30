# Tech Lead Technical Test API

A simple Express.js API that replaces occurrences of "dog" with "cat" in JSON objects with configurable limits and caching capabilities.

## Features

- **Animal Replacement**: Recursively replaces "dog" with "cat" throughout JSON objects
- **Configurable Limits**: Set maximum number of replacements per request
- **LRU Caching**: Built-in caching to improve performance for repeated requests
- **Flexible Traversal**: Works with nested objects, arrays, and various data types
- **TypeScript**: Fully typed for a better development experience

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The API server will start on `http://localhost:3000`

### Running Tests

```bash
npm test
```

## API Endpoints

### POST /animal-replacement

Replaces all occurrences of "dog" with "cat" in the provided JSON object.

**Request:**
- **Method**: POST
- **Path**: `/animal-replacement`
- **Content-Type**: `application/json`

**Response:**
- **Status**: 200 OK
- **Content-Type**: `application/json`
- Returns the input object with replacements made

## Examples

### Basic Example

**Request:**
```bash
curl -X POST http://localhost:3000/animal-replacement \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a dog",
    "animals": ["dog", "cat", "dog"]
  }'
```

**Response:**
```json
{
  "message": "I have a cat",
  "animals": ["cat", "cat", "cat"]
}
```

### Nested Objects Example

**Request:**
```bash
curl -X POST http://localhost:3000/animal-replacement \
  -H "Content-Type: application/json" \
  -d '{
    "pets": {
      "name": "My dog",
      "description": "A friendly dog",
      "details": {
        "breed": "Golden dog"
      }
    }
  }'
```

**Response:**
```json
{
  "pets": {
    "name": "My cat",
    "description": "A friendly cat",
    "details": {
      "breed": "Golden cat"
    }
  }
}
```

### Case-Insensitive Example

The replacement is case-insensitive for detection but preserves the original case format:

**Request:**
```bash
curl -X POST http://localhost:3000/animal-replacement \
  -H "Content-Type: application/json" \
  -d '{
    "text1": "I like Dog",
    "text2": "DOG is great",
    "text3": "my dog loves food"
  }'
```

**Response:**
```json
{
  "text1": "I like cat",
  "text2": "cat is great",
  "text3": "my cat loves food"
}
```

### With Replacement Limit

You can control the maximum number of replacements by setting the `MAX_REPLACEMENTS` environment variable (default: 5).

**Example with MAX_REPLACEMENTS=2:**
```bash
curl -X POST http://localhost:3000/animal-replacement \
  -H "Content-Type: application/json" \
  -d '{
    "animals": ["dog", "dog", "dog", "dog"]
  }'
```

**Response:**
```json
{
  "animals": ["cat", "cat", "dog", "dog"]
}
```

### Complex Data Types

The API handles various data types gracefully:

**Request:**
```bash
curl -X POST http://localhost:3000/animal-replacement \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dog",
    "age": 5,
    "active": true,
    "tags": ["dog", "pet", "dog"],
    "metadata": {
      "type": "dog",
      "count": 10
    }
  }'
```

**Response:**
```json
{
  "name": "cat",
  "age": 5,
  "active": true,
  "tags": ["cat", "pet", "cat"],
  "metadata": {
    "type": "cat",
    "count": 10
  }
}
```

## Configuration

### Environment Variables

- `MAX_REPLACEMENTS`: Maximum number of replacements per request (default: 5)
- `CACHE_TTL`: Cache time-to-live in seconds (default: 600)
- `CACHE_MAX_ITEMS`: Maximum items in LRU cache (default: 100)

**Example:**
```bash
MAX_REPLACEMENTS=10 CACHE_TTL=300 npm start
```

## Architecture

- **Controller**: `AnimalReplacementController` - Handles HTTP requests and caching
- **Service**: `DogCatReplacementService` - Implements the replacement logic
- **Caching**: LRU Cache for performance optimization
- **DI Container**: Awilix for dependency injection

## Performance Notes

- Responses are cached based on request body to improve performance for repeated requests
- LRU cache is configured with a TTL (time-to-live) and max item limit
- For production, consider using Redis or another external caching solution
