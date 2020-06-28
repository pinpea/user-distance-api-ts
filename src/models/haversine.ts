import LatitudeLongitude from './Coordinates';

const degreesToRadians = ( angle_in_degrees: number ) => {
    return angle_in_degrees * ( Math.PI / 180 );
};

const calculateHaversineDistance = ( location_1: LatitudeLongitude, location_2: LatitudeLongitude, earth_radius: number = 3956 ) => {
    /* Reference to https://www.movable-type.co.uk/scripts/latlong.html and https://en.wikipedia.org/wiki/Haversine_formula
    Receives latitude and longitude of the user and a the latitude and longitude of the reference point, e.g., London
    By default, distance returned in miles. To get km use earth_radius=6371 
    Input of latitude, longitude is assumed to be in degrees.*/

    var latitude_1_radians = degreesToRadians( location_1.latitude );
    var latitude_2_radians = degreesToRadians( location_2.latitude );
    var longitude_1_radians = degreesToRadians( location_1.longitude );
    var longitude_2_radians = degreesToRadians( location_2.longitude );

    var delta_latitude = latitude_2_radians - latitude_1_radians;
    var delta_longitude = longitude_2_radians - longitude_1_radians;

    var a = ( Math.sin( delta_latitude / 2 ) ) ** 2 + Math.cos( latitude_1_radians ) * Math.cos( latitude_2_radians ) * ( Math.sin( delta_longitude / 2 ) ) ** 2;
    var c = 2 * Math.asin( Math.sqrt( a ) );
    var distance = earth_radius * c;
    return distance;
};
export default calculateHaversineDistance;