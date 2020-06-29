import City from '../src/models/City';
import LatitudeLongitude from '../src/models/Coordinates';
import calculateHaversineDistance from '../src/models/haversine';
import { CityUsersByIdRequester } from './TestUsersByID';
import { CombinedUsers } from '../src/models/UserRequesters';

//perform unit tests on models and methods

describe( 'Test api methods', () => {
    let city_cordinates: LatitudeLongitude;
    let test_city: City;
    let search_radius: any;

    beforeEach( () => {
        city_cordinates = { latitude: 47.4979, longitude: 19.0402 };
        return city_cordinates;
    } );

    test( 'Test coordinate interface ', function () {
        let temp_var = 47.4979;
        expect( temp_var ).toBe( city_cordinates.latitude );

    } );

    test( 'Test search_radius conversion ', function () {
        let search_radius: any = '0';
        const test_city = new City( 'Budapest', city_cordinates, search_radius );
        let output_search_radius = test_city.searchRadius;
        expect( typeof output_search_radius ).toBe( 'number' );

    } );

    test( 'Test Haversine distance calculation function ', function () {
        let user_cordinates: LatitudeLongitude = { latitude: 47.440449, longitude: 19.1700809 };
        let dist = calculateHaversineDistance( user_cordinates, city_cordinates );
        expect( dist ).toBeLessThanOrEqual( 10 ); // not by code, but by design - specific user chosen
    } );

    beforeEach( () => {
        search_radius = '0';
        test_city = new City( 'Budapest', city_cordinates, search_radius );
    } );

    test( 'Return users by city name - search_radius = 0 ', async () => {
        let test_combined_users = new CombinedUsers( test_city );
        let num_output_users = await test_combined_users.getNumberOfUsers();
        expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
    } );


    test( 'Get users and check the city matches the output when calling bptds with /user/{id} ', async () => {

        let budapest_users = new CombinedUsers( test_city );
        const users = await budapest_users.getUsers();
        let inst_idreq = new CityUsersByIdRequester( users ); // class created to test this functionality
        let users_by_id = await inst_idreq.getUsers();

        users_by_id.forEach( user => {
            expect( user[ 'city' ] ).toEqual( test_city.cityName );
        } );

    } );

    beforeEach( () => {
        search_radius = '50';
        test_city = new City( 'Budapest', city_cordinates, search_radius );
    } );


    test( 'Return unique users by distance from city ', async () => {
        let test_combined_users = new CombinedUsers( test_city );
        let num_output_users = await test_combined_users.getNumberOfUsers();
        // if filtering for unique users is not working, four users will be returned in this case
        expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
    } );


    test( 'Check 404 Response Error handling ', async () => {
        try {
            let junk_url: string = 'https://bpdts-test-app.herokuapp.com/usr/';
            let test_combined_users = new CombinedUsers( test_city, junk_url );
            let num_output_users = await test_combined_users.getNumberOfUsers();
        }
        catch ( error ) {
            expect( error.response.status ).toBe( 404 );
        }

    } );

    test( 'Check Request Error handling ', async () => {
        try {
            let junk_url: string = 'https://bpdts-test-appherokuappcom/';
            let test_combined_users = new CombinedUsers( test_city, junk_url );
            let num_output_users = await test_combined_users.getNumberOfUsers();
        }
        catch ( error ) {
            expect( error.request );
        }

    } );


} );


