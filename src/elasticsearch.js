import { Client } from '@elastic/elasticsearch';

export class Elasticsearch {
  #indexName;
  #client;

  constructor({ indexName, apiKey }) {
    this.#indexName = indexName;

    this.#client = new Client({
      node: 'https://localhost:9200/',
      auth: {
        apiKey,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  indexDocuments(documentsList) {
    return this.#client.helpers.bulk({
      datasource: documentsList,
      onDocument: (doc) => ({ index: { _index: this.#indexName, _id: doc.id } }),
    });
  }

  async createIndexMappingIfNotExists() {
    const mapping = {
      index: this.#indexName,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text' },
            type: { type: 'keyword' },
            status: { type: 'keyword' },
            location: { type: 'geo_point' }
          }
        }
      }
    }

    const indexExists = await this.#client.indices.exists({ index: this.#indexName });
    if (!indexExists) {
      return this.#client.indices.create(mapping);
    }

    return false;
  }

  queryObjects(zoom = 8) {
    return this.#client.search({
      index: this.#indexName,
      size: 0,
      aggregations: {
        objects_clusters: {
          geotile_grid: {
            field: 'location',
            precision: zoom,
          },
        },
      },
    });
  }
}
