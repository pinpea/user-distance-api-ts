import * as express from 'express';
import City from './models/City';
import LatitudeLongitude from './models/Coordinates';
import { CombinedUsers } from './models/UserRequesters';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger/swagger.json';
import errorMiddleware from './models/ErrorHandler';
import { UsersNotFoundException } from './models/HttpError';

class Router {
    private router;
    private server: express.Express;
    constructor( server: express.Express ) {
        this.router = express.Router();
        this.server = server;
        this.initialiseRoutes();
        this.initialiseSwagger();
        server.use( '/', this.router );
        this.initialiseErrorHandling();
    }

    private initialiseSwagger() {
        this.server.use( '/swagger', swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );
    }

    private initialiseRoutes() {
        this.router.get( '/', ( req: express.Request, res: express.Response ) => {
            res.redirect( '/swagger' );
            return res.status;
        } );

        this.router.get( '/london_users', ( req: express.Request, res: express.Response ) => {
            res.redirect( '/london_users/0' );
            return res.status;
        } );

        //get users in a specified range of London
        this.router.get( '/london_users/:range', async ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
            let search_radius = req.params.range;
            let city_coordinates: LatitudeLongitude = { latitude: 51.506, longitude: -0.1272 };
            let city = new City( 'London', city_coordinates, search_radius );
            let city_users = new CombinedUsers( city );
            let num_users = await city_users.getNumberOfUsers();
            if ( num_users ) {
                res.json( {
                    "number_of_users": num_users
                } );
                return res.status;
            }
            else {
                next( new UsersNotFoundException( city.cityName ) );
            }


        } );

        this.router.get( '/bristol_users', ( req: express.Request, res: express.Response ) => {
            res.redirect( '/bristol_users/0' );
            return res.status;
        } );
        this.router.get( '/bristol_users/:range', async ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
            let search_radius = req.params.range;
            let city_coordinates: LatitudeLongitude = { latitude: 51.4545, longitude: -2.5879 };
            let city = new City( 'Bristol', city_coordinates, search_radius );
            let city_users = new CombinedUsers( city );
            let num_users = await city_users.getNumberOfUsers();
            if ( num_users ) {
                res.json( {
                    "number_of_users": num_users
                } );
            }
            else {
                next( new UsersNotFoundException( city.cityName ) );
            }


        } );
        this.router.get( '*', ( req: express.Request, res: express.Response, next: express.NextFunction ) => {
            next( new UsersNotFoundException( "" ) );
            // return res.status;
        } );
    };

    private initialiseErrorHandling() {
        this.server.use( errorMiddleware );
    }

}

export default Router;

