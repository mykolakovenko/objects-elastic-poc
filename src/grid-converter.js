export class GridConverter {
  convertTileKeyToCoordinates(tileKey) {
    const [zoom, x, y] = tileKey.split('/');

    const longitudeMin = this.#tile2longitude(parseInt(x), parseInt(zoom));
    const longitudeMax = this.#tile2longitude(parseInt(x) + 1, parseInt(zoom));
    const latitudeMin = this.#tile2latitude(parseInt(y) + 1, parseInt(zoom));
    const latitudeMax = this.#tile2latitude(parseInt(y), parseInt(zoom));

    return {
      latitude: (latitudeMin + latitudeMax) / 2,
      longitude: (longitudeMin + longitudeMax) / 2,
    }
  }

  #tile2latitude(y, z) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
  }

  #tile2longitude(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
  }
}
