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
        router.get('/london_users/:range', (req: express.Request, res: express.Response) => {
            try{
                let search_radius = req.params.range;
                let london_coordinates: LatLong = {latitude: 51.506, longitude: -0.1272};
                let london = new City('London', london_coordinates, search_radius);

                let londonUsers = new CombinedUsers(london);
                var num_users = londonUsers.getUsers();
                console.log(num_users);

                res.json({
                    "out": num_users
                })

            } catch (e) {
                res.status(404).send(JSON.stringify({ "error": "request page not found" }));
            }


        })
        // router.options('*', cors());

        server.use('/', router)
    }
}

        // //create new cat
        // router.post('/cats', cors(), (req: express.Request, res: express.Response) => {
        //     try {
        //         let cat: Cat = {} as Cat;
        //         Object.assign(cat, req.body)
        //         const newUUID = uuid();
        //         cats[newUUID] = cat;
        //         res.json({
        //             uuid: newUUID
        //         })
        //     } catch (e) {
        //         res.status(400).send(JSON.stringify({ "error": "problem with posted data" }));
        //     }
        // })

export default Router;