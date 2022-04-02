import express, { NextFunction, Request, Response } from 'express'
import IService from '../service/iservice'
import asyncHandler from 'express-async-handler'

export function initApi(
    app: express.Express,
    { service }: IService
) {

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

    app.use(express.json())

    app.route('/users')
        .get(asyncHandler( async (req, res, next) => {
            res.locals.body = await service.fetchAllUsers()
            next()
        }))
        .post(asyncHandler(async (req, res, next) => {
            const dto = { ...req.body }

            res.locals.body = await service.saveUser(dto)
            next()
        }))

    app.route('/users/:login')
        .get(async (req, res) => {
            const user = await service.fetchUserByLogin(req.params.login)
            res.json(user)
        })
        .put(async (req, res) =>{
            const user = await service.updateUser(req.params.login, { ...req.body })
            res.json(user)
        })
        .delete(async (req, res) => {
            const usersList = await service.deleteUserByLogin(req.params.login)
            res.json(usersList)
        })

    app.use(errorHandler())
    app.use(responseHandler())

}
