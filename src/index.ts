import express from 'express'
import { initApi } from './api/user.controller'
import { initDB } from './db/init'
import { Client } from 'pg'
import IRepo from './repo/irepo'
import { Repo } from './repo/repo'
import IService from './service/iservice'
import { Service } from './service/service'

export class App {

    async run() {
        const app = express()

        const dbClientDb = initDB()
        const repo = this.initRepo(await dbClientDb)
        const service = this.initService(repo)

        initApi(app, service)

        const port = 8080

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    private initRepo(dbClient: Client): IRepo {
        return {
            repo: new Repo(dbClient)
        }
    }

    private initService(repo: IRepo): IService {
        return {
            service: new Service(repo)
        }
    }

}


void new App().run()
