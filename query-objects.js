import { Elasticsearch } from './src/elasticsearch.js';
import { GridConverter } from './src/grid-converter.js'
const apiKey = 'WmF1czVZNEJlSHJxcEVyNjBSVFE6UV9jN0ttUGlTUm1uUi0wdm1vOU1BQQ==';

const objectsElasticService = new Elasticsearch({ indexName: 'objects', apiKey });
const gridConverter = new GridConverter();

const data = await objectsElasticService.queryObjects();
const bucketsList = data.aggregations.objects_clusters.buckets;

const objectsClusters = bucketsList.map(bucket => ({
  coordinate: gridConverter.convertTileKeyToCoordinates(bucket.key),
  numberOfObjects: bucket.doc_count,
  bucket,
}));

console.log(objectsClusters);
