import express from 'express'
import Services from '../service/services'
import { Person } from '../entity/person'

export function initSimpleAPI(
    app: express.Express,
    { personService }: Services,
) {

    app.use(express.json()) // for parsing application/json

    app.route('/person/:id')
        .get(async (req, res) => {
            const person = await personService.getPerson(req.params.id as unknown as number)
            res.json(person)
        })
        .put(async (req, res) => {
            const person: Person = await personService.updatePerson(req.params.id, { ...req.body })
            res.send(person)
        })
        .delete(async (req, res) => {
            const list: Array<Person>[] = await personService.deletePersonById(req.params.id as unknown as number)
            res.send(list)
        })

    app.route('/person/new')
        .post(async (req, res) => {
            const list: Array<Person>[] = await personService.savePerson({ ...req.body })
            res.send(list)
        })

    app.route('/persons')
        .get(async (req, res) => {
            const list: Array<Person>[] = await personService.getAllPerson()
            res.send(list)
        })

}
