import testObjects from './test-objects.json' with { type: "json" };

import { Elasticsearch } from './src/elasticsearch.js';
const apiKey = 'WmF1czVZNEJlSHJxcEVyNjBSVFE6UV9jN0ttUGlTUm1uUi0wdm1vOU1BQQ==';

const objectsElasticService = new Elasticsearch({ indexName: 'objects_test', apiKey });
await objectsElasticService.createIndexMappingIfNotExists();

console.time('ExecutionTime');

await objectsElasticService.indexDocuments(testObjects);

console.timeEnd('ExecutionTime');
