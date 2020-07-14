const db = require("./index")
const model = require("../model/productModel")

async function fnTest() {
    try {
        await db.connect("mssql", config = {
            user: 'master',
            password: 'LogMaster*2015',
            server: 'DESKTOP-VI2BQVN',
            database: 'framework-node-vue',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        })
        let result = await db.createTable(model)
        await db.close()
    }
    catch(e){
        console.error(e)
        process.exit()
    }
}

fnTest()
