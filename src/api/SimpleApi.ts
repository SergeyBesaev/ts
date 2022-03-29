import express, { NextFunction, Request, Response } from 'express'
import Services from '../service/services'
import asyncHandler from 'express-async-handler'

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

export function initSimpleAPI(
    app: express.Express,
    { personService }: Services,
) {

    app.use(express.json()) // for parsing application/json

    app.route('/users')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await personService.fetchAllUsers()
            next()
        }))
        .post(asyncHandler(async (req, res, next) => {
            res.locals.body = await personService.saveUserWithRoles({ ...req.body })
            next()
        }))

    app.route('/users/:login')
        .get(asyncHandler(async (req, res, next) => {
            res.locals.body = await personService.fetchUserWithRoles(req.params.login)
            next()
        }))
        .put(asyncHandler(async (req, res, next) => {
            res.locals.body = await personService.updateUser( { ...req.body })
            next()
        }))
        .delete(asyncHandler(async (req, res, next) => {
            res.locals.body = await personService.deleteUserByLogin(req.params.login)
            next()
        }))


    app.use(errorHandler())
    app.use(responseHandler())

}
