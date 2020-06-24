import LatLong from './LatLong'

const haversineDistance = (location_1: LatLong, location_2: LatLong, earth_radius: number = 3956 ) => {
    // Reference to https://www.movable-type.co.uk/scripts/latlong.html and https://en.wikipedia.org/wiki/Haversine_formula
    // Receives latitude and longitude of the user and a the latitude and longitude of the reference point, e.g., London
    // By default, distance returned in miles, to get km change earth radius to earth_radius=6371
    
    // Degrees to radians
    var latitude_1_rads = location_1.latitude* (Math.PI/180);
    var latitude_2_rads = location_2.latitude* (Math.PI/180);
    var longitude_1_rads = location_1.longitude* (Math.PI/180);
    var longitude_2_rads = location_2.longitude* (Math.PI/180);

    
    var delta_lat = latitude_2_rads - latitude_1_rads;
    var delta_long = longitude_2_rads - longitude_1_rads;

    var a = (Math.sin(delta_lat/2))**2 + Math.cos(latitude_1_rads) * Math.cos(latitude_2_rads) * (Math.sin(delta_long/2))**2;
    var c = 2 * Math.asin(Math.sqrt(a));
    var distance = earth_radius * c;
    return distance ;
}
export default haversineDistance