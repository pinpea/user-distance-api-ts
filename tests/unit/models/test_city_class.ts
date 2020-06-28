import City from '../../../src/models/City';
import User from '../../../src/models/User';
import LatitudeLongitude from '../../../src/models/Coordinates';
import calculateHaversineDistance from '../../../src/models/haversine';
import { CityUsersByIdRequester } from './TestUser';
import { CombinedUsers } from '../../../src/models/UserRequesters';
import { doesNotReject, rejects } from 'assert';
import { resolve } from 'dns';

// Unit tests

test( 'Test coordinate interface ', function () {
    let city_cordinates: LatitudeLongitude = { latitude: 32.3199, longitude: 106.7637 };
    let temp_var = 32.3199;
    expect( temp_var ).toBe( city_cordinates.latitude );

} );

test( 'Test search radius conversion ', function () {
    const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
    let search_radius: any = '0';
    const test_city = new City( 'Budapest', city_cordinates, search_radius );
    let output_search_radius = test_city.searchRadius;
    expect( typeof output_search_radius ).toBe( 'number' );

} );


test( 'Test Haversine function ', function () {
    const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
    let user_cordinates: LatitudeLongitude = { latitude: 47.440449, longitude: 19.1700809 };
    let dist = calculateHaversineDistance( user_cordinates, city_cordinates );
    expect( dist ).toBeLessThanOrEqual( 10 ); // not by code, but by design - specific user chosen
} );

test( 'Return users by city name ', async () => {
    const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
    let search_radius: any = '0';
    const test_city = new City( 'Budapest', city_cordinates, search_radius );
    let test_combined_users = new CombinedUsers( test_city );
    let num_output_users = await test_combined_users.getNumberOfUsers();
    expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
} );


test( 'Return unique users by distance from city ', async () => {
    const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
    let search_radius: any = '50';
    const test_city = new City( 'Budapest', city_cordinates, search_radius );
    let test_combined_users = new CombinedUsers( test_city );
    let num_output_users = await test_combined_users.getNumberOfUsers();
    // if filtering for unique users is not working, four users will be returned in this case
    expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
} );

test( 'Return users by city name ', async () => {


    let search_radius = '0';
    let city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
    let budapest = new City( 'Budapest', city_cordinates, search_radius );

    let budapest_users = new CombinedUsers( budapest );
    const _users = await budapest_users.getUsers();
    let inst_idreq = new CityUsersByIdRequester( _users );
    let users_by_id = await inst_idreq.getUsers();

    users_by_id.forEach( user => {
        expect( user[ 'city' ] ).toBe( budapest.cityName );
    } );


} );

test( 'Check 404 Response Error handling ', async () => {
    try {
        const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
        let search_radius: string = '0';
        const test_city = new City( 'Budapest', city_cordinates, search_radius );
        let junk_url: string = 'https://bpdts-test-app.herokuapp.com/usr/';

        let test_combined_users = new CombinedUsers( test_city, junk_url );
        let num_output_users = await test_combined_users.getNumberOfUsers();
    }
    catch ( error ) {
        if ( error.response ) {
            expect( error.response.status ).toBe( 404 );
            return;
        }
        if ( error.request ) {
            console.log( 'request test 1' );
            return;
        }
        else {
            console.log( 'other', error );
            return;
        }

    }

    // expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
} );

test( 'Check Request Error handling ', async () => {
    try {
        const city_cordinates: LatitudeLongitude = { latitude: 47.4979, longitude: 19.0402 };
        let search_radius: string = '0';
        const test_city = new City( 'Budapest', city_cordinates, search_radius );
        let junk_url: string = 'https://bpdts-test-appherokuappcom/';

        let test_combined_users = new CombinedUsers( test_city, junk_url );
        let num_output_users = await test_combined_users.getNumberOfUsers();
    }
    catch ( error ) {
        if ( error.response ) {
            console.log( 'response test 2' );
        }
        if ( error.request ) {
            console.log( 'request test 2' );
        }
        else {
            console.log( 'other', error );
        }

    }

    // expect( num_output_users ).toEqual( 2 ); // not by code, but by design - specific test case chosen
} );