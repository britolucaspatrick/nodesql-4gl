const db = require("./index")

const productModel = {
    "table": "product",
    "fields": [
        {"name": "product_id", "type": "integer", "format": ">>>>>>>>>9", "label": "ID Produto"},
        {"name": "product_name", "type": "string", "format": "40", "label": "Nome Produto"}
    ],
    "primaryIndex": {"name": "idx_key", "fields": ["product_id"]},
    "indexes":[
        {"name": "idx_product_name", "fields": ["product_name"]}
    ]
}

async function fnTest() {
    try {
        await db.connect("mssql", config = {
            user: 'sa',
            password: 'abc@123',
            server: 'WSNB02',
            database: 'dbtest01',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                instanceName: 'SQLEXPRESS',
                enableArithAbort: true
            }
        })
        let result = await db.createTable(productModel)
        await db.close()
    }
    catch(e){
        console.error(e)
        process.exit()
    }
}

fnTest()
