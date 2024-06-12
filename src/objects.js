import axios from 'axios';

export class ObjectsService {
  #apiUrl = 'https://api-dev.brp.org.ua/api';
  #pageSize

  constructor(pageSize = 100) {
    this.#pageSize = pageSize;
  }

  async getObjects(skip) {
    const response = await axios.get(`${this.#apiUrl}/object-profile?take=${this.#pageSize}&skip=${skip}`);
    const { data } = response.data;
    return data;
  }
}

