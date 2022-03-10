import { Client } from 'pg'

export async function initDB() {

    const client = new Client({
        user: 'sergey',
        host: 'localhost',
        database: 'typescriptCRUD',
        password: 'password123',
        port: 5432,
    })

    await client.connect()
    return client

}
