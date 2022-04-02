import express from 'express'
import { initApi } from './api/user.controller'
import { initDB } from './db/init'
import { Client } from 'pg'
import IRepo from './repo/irepo'
import { UserRepo } from './repo/user.repo'
import IService from './service/iservice'
import { UserService } from './service/user.service'
import { RoleRepo } from './repo/role.repo'
import { RoleService } from './service/role.service'
import { roleApi } from './api/role.controller'

export class App {

    async run() {
        const app = express()

        const dbClientDb = initDB()
        const repo = this.initRepo(await dbClientDb)
        const service = this.initService(repo)

        initApi(app, service)
        roleApi(app, service)

        const port = 8080

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    private initRepo(dbClient: Client): IRepo {
        return {
            userRepo: new UserRepo(dbClient),
            roleRepo: new RoleRepo(dbClient),
        }
    }

    private initService(repo: IRepo): IService {
        return {
            userService: new UserService(repo),
            roleService: new RoleService(repo),
        }
    }

}

void new App().run()
