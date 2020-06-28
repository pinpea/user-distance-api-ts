import * as express from 'express';
import City from './models/City';
import LatitudeLongitude from './models/Coordinates';
import { CombinedUsers } from './models/UserRequesters';
import { CityUsersByIdRequester } from '../tests/unit/models/TestUser';


class Router {

    constructor( server: express.Express ) {
        const router = express.Router();

        router.get( '/', ( req: express.Request, res: express.Response ) => {
            res.redirect( '/swagger' );
            return res.status;
        } );

        //get users in a specified range of London
        router.get( '/london_users/:range', async ( req: express.Request, res: express.Response ) => {
            try {
                let search_radius = req.params.range;
                let london_coordinates: LatitudeLongitude = { latitude: 51.506, longitude: -0.1272 };
                let london = new City( 'London', london_coordinates, search_radius );

                let london_users = new CombinedUsers( london );
                const num_users = await london_users.getNumberOfUsers();

                res.json( {
                    "out": num_users
                } );

            } catch ( error ) {
                if ( error.response.status == 404 ) {
                    res.status( 404 ).send( JSON.stringify( { "error": "request page not found" } ) );
                    return;
                }
                if ( error.response.status == 500 ) {
                    res.status( 500 ).send( JSON.stringify( { "error": "request page not found" } ) );
                }


            }
        } );


        server.use( '/', router );
    }
}

export default Router;

