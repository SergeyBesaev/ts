import express from 'express'
import Services from '../service/services'

export function initSimpleAPI(
    app: express.Express,
    { personService }: Services
) {
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.get('/person', async (req, res) => {
        const person = await personService.getPerson(1)
        res.json(person)
    })

}
