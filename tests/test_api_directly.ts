import axios, { AxiosInstance, AxiosResponse } from 'axios';
import User from '../src/models/User';

// perform tests calling the API directly

describe( 'Calling the API ', () => {
    const port_number = parseInt( process.env.PORT || '3100' ).toString();
    let base: string = 'http://localhost:';
    let baseURL: string = base.concat( port_number );
    test( 'Test API calls ', async () => {
        let user_url: string = baseURL.concat( '/london_users/50' );
        let current_user = await axios.get<User[]>( user_url ).then( response_body => {
            var number_of_users_in_london = response_body.data[ 'number_of_users' ];
            expect( number_of_users_in_london ).toEqual( 9 );

        } );
    } );

    test( 'Test calling london_users without range value ', async () => {
        let user_url: string = baseURL.concat( '/london_users/' );
        let current_user = await axios.get<User[]>( user_url ).then( response_body => {
            var number_of_users_in_london = response_body.data[ 'number_of_users' ];
            expect( number_of_users_in_london ).toEqual( 6 );
        } );
    } );

    test( 'Test API 404 error handling', async () => {
        let junk_url: string = baseURL.concat( '/londonusers/' );
        try {
            let current_user = await axios.get<User[]>( junk_url );
        }
        catch ( error ) {
            expect( error.response.status ).toBe( 404 );
        }
    } );

    test( 'Test API 404 error message handling', async () => {
        let junk_url: string = baseURL.concat( '/londonusers/' );
        try {
            let current_user = await axios.get<User[]>( junk_url );
        }
        catch ( error ) {
            expect( error.response.data[ 'status' ] ).toBe( 404 );
            expect( error.response.data[ 'message' ] ).toBe( 'No users found in requested city ' );
        }
    } );
} );