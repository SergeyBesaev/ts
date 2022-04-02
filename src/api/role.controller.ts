import express from 'express'
import IService from '../service/iservice'

export function roleApi(
    app: express.Express,
    { roleService }: IService
) {


    app.route('/roles')
        .get(async (req, res) => {
            res.send('Hello from Roles')
        })

}
