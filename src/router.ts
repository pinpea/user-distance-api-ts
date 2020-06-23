import * as express from 'express'

class Router {

    constructor(server: express.Express) {
        const router = express.Router()

        router.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                message: `Nothing to see here, [url]/ instead.`
            })
        })

        //get all cats
        router.get('/london', (req: express.Request, res: express.Response) => {
            res.json({
                "out": "hello world"
            })
        })
        // router.options('*', cors());

        server.use('/', router)
    }
}

export default Router;