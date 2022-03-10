import express from 'express'
import { initSimpleAPI } from './api/SimpleApi'
import Services from './service/services'
import { PersonService } from './service/person.service'
import { initDB } from './db/init'

export class App {

    async run() {
        const app = express()

        const dbClint = await initDB()

        const services: Services = { personService: new PersonService(dbClint) }

        initSimpleAPI(app, services)

        const port = 3000

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }
}


void new App().run()
