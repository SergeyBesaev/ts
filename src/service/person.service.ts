import { Person } from '../entity/person'
import { Client } from 'pg'

export class PersonService {

    constructor(private readonly dbClient: Client) {
    }

    public async getPerson(id: number): Promise<Person> {
        const abc = await this.dbClient.query<Person>({
            text: 'select * from person where id = $1',
            values: [id]
        })
        return abc.rows[0]
    }

    public async getAllPerson() {
        const abc = await this.dbClient.query<Array<Person>>({
            text: 'select * from person'
        })
        return abc.rows
    }

    public async deletePersonById(id: number) {
        await this.dbClient.query({
            text: 'delete from person where id = $1',
            values: [id]
        })
        return this.getAllPerson()
    }

    public async savePerson(person: Person) {
        await this.dbClient.query({
            text: 'insert into person (name, age) values ($1, $2)',
            values: [person.name, person.age]
        })
        return this.getAllPerson()
    }

    public async updatePerson(id: number, person: Person) {
        await this.dbClient.query({
            text: 'update person set name = $1, age = $2 where id = $3',
            values: [person.name, person.age, id]
        })
        return this.getPerson(id)
    }

}
