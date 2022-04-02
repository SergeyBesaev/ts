import IService from '../service/iservice'
import asyncHandler from 'express-async-handler'
import express from 'express'

export function initApi(
    app: express.Express,
    { userService }: IService
) {
    
    app.route('/users')
        .get(asyncHandler( async (req, res, next) => {
            res.locals.body = await userService.fetchAllUsers()
            next()
        }))
        .post(asyncHandler(async (req, res, next) => {
            const dto = { ...req.body }

            res.locals.body = await userService.saveUser(dto)
            next()
        }))

    app.route('/users/:login')
        .get(async (req, res) => {
            const user = await userService.fetchUserByLogin(req.params.login)
            res.json(user)
        })
        .put(async (req, res) =>{
            const user = await userService.updateUser(req.params.login, { ...req.body })
            res.json(user)
        })
        .delete(async (req, res) => {
            const usersList = await userService.deleteUserByLogin(req.params.login)
            res.json(usersList)
        })

}
