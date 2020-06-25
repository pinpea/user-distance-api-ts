import * as express from 'express'
import City from './models/City'
import  LatLong  from './models/LatLong'
import  { CombinedUsers}   from './models/UserRequests'

class Router {

    constructor(server: express.Express) {
        const router = express.Router()

        router.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                message: ``
            })
        })

        //get users in a specified range of London
        router.get('/london_users/:range', async (req: express.Request, res: express.Response) => {
            try{
                let search_radius = req.params.range;
                let london_coordinates: LatLong = {latitude: 51.506, longitude: -0.1272};
                let london = new City('London', london_coordinates, search_radius);

                let londonUsers = new CombinedUsers(london);
                const num_users =  await londonUsers.getUsers();

                res.json({
                    "out": num_users
                })

            } catch (e) {
                res.status(404).send(JSON.stringify({ "error": "request page not found" }));
            }


        })

        server.use('/', router)
    }
}

export default Router;