import City from '../../../src/models/City';
import LatLong from '../../../src/models/LatLong';

// Unit tests

test( 'Test coordinate interface ', function () {
    let london_coordinates: LatLong = { latitude: 32.3199, longitude: 106.7637 };
    let temp_var = 1;
    expect( temp_var ).toBe( 1 );

} );

// test( 'Test City return values ', function () {
//     test_city = "Srunikrajan";
//     expect().toBe( true );
// } );