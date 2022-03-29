import express from 'express'
import { initSimpleAPI } from './api/SimpleApi'
import Services from './service/services'
import { PersonService } from './service/person.service'
import { initDB } from './db/init'
import { UserRepo } from './repo/user.repo'
import { Client } from 'pg'
import Repos from './repo/repos'

export class App {

    async run() {
        const app = express()

        const dbClient = await initDB()
        const repos = this.initRepos(dbClient)

        const services = this.initServices(repos)

        initSimpleAPI(app, services)

        const port = 3000

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    private initServices(repos: Repos): Services {
        return {
            personService: new PersonService(repos),
        }
    }

    private initRepos(dbClient: Client): Repos {
        return {
            userRepo: new UserRepo(dbClient)
        }
    }

}


void new App().run()
