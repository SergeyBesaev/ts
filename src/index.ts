import express, { NextFunction, Request, Response } from 'express'
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

        app.use(express.json())

        initApi(app, service)
        roleApi(app, service)

        function errorHandler() {
            return async (error: Error, req: Request, res: Response, next: NextFunction) => {

                console.error(error.stack)
                const body = {
                    success: false,
                    error: error.message
                }
                res.status(500).json(body)
            }

        }

        function responseHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                if (!req.route) {
                    return res.status(404).end()
                }
                console.log(`Success response to ${req.originalUrl}`)
                const body = {
                    success: true,
                    data: res.locals.body
                }
                return res.status(200).json(body).end()
            }

        }

        app.use(errorHandler())
        app.use(responseHandler())

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
