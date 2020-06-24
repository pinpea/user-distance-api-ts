import LatLong from './LatLong'

class City{
    private _city: string;
    private _coordinates: LatLong;
    private _search_radius: number;
  
    constructor(city: string, position: LatLong, search_radius: string ) {
      this._city = city;
      this._coordinates = position;
      this._search_radius = Math.abs(Number(search_radius));
    }
  
    get coordinates(): LatLong{
        return this._coordinates
    }

    get latitude(): number {
      return this._coordinates.latitude;
    }
    get longitude(): number {
      return this._coordinates.longitude;
    }
    get cityName(): string {
      return this._city;
    }
    get searchRadius(): number {
      return this._search_radius;
    }
  
  }

export default City