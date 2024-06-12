import { Elasticsearch } from './src/elasticsearch.js';
import { ObjectsService } from './src/objects.js';
const apiKey = 'WmF1czVZNEJlSHJxcEVyNjBSVFE6UV9jN0ttUGlTUm1uUi0wdm1vOU1BQQ==';

const objectsElasticService = new Elasticsearch({ indexName: 'objects', apiKey });
await objectsElasticService.createIndexMappingIfNotExists();

console.time('ExecutionTime');

const objectsService = new ObjectsService(100);

const mapObjectEntity = (rawEntity) => {
  return {
    id: rawEntity.id,
    regionId: rawEntity.regionId,
    districtId: rawEntity.districtId,
    cityId: rawEntity.cityId,
    title: rawEntity.name[0].translation,// For simplicity
    type: rawEntity.type,
    status: rawEntity.status,
    location: {
      lat: rawEntity.latitude,
      lon: rawEntity.longitude,
    }
  };
}


let skip = 0;
let rawObjects;

while ((rawObjects = await objectsService.getObjects(skip)) && rawObjects.length > 0) {
  const objects = rawObjects.map(mapObjectEntity);

  await objectsElasticService.indexDocuments(objects);

  skip += objects.length;

  console.log(objects);
  console.log(skip);
}

console.timeEnd('ExecutionTime');
