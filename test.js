const db = require("./index")

const productModel = {
    "table": "product",
    "fields": [
        {"name": "id_product", "type": "integer", "format": ">>>>>>>>>9", "label": "Id produto"},
        {"name": "product_name", "type": "string", "format": "40", "label": "Nome produto"}
    ],
    "primaryIndex": {"name": "idx_key", "fields": ["product_name"]},
    "indexes":[
        {"name": "idx_name", "fields": ["product_name"]}
    ]
}

const sallesorderModel = {
    "table": "sallesorder",
    "fields": [
        {"name": "id_order", "type": "integer", "format": ">>>>>>>>>9", "label": "Id pedido"},
        {"name": "id_customer", "type": "string", "format": "40", "label": "Id cliente"},
        {"name": "cod_order_customer", "type": "string", "format": "40", "label": "Cód pedido cliente"}
    ],
    "primaryIndex": {"name": "idx_key", "fields": ["id_customer", "cod_order_customer"]},
    "indexes":[
        {"name": "idx_name", "fields": ["id_order"]}
    ]
}

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
            } } 
        )

        let product = await db.findfirst(productModel, "*", "id_product = 2")
        product.id_product = 5
        product.product_name = "TESTE"
        await db.create(productModel , product)
        // console.log(product)
        // let product2 = await db.findfirst(productModel, "*")
        // console.log(product2)

        // let product3 = await db.findlast(sallesorderModel, "*", "id_order = 2")
        // console.log(product3)

        // let product4 = await db.findlast(sallesorderModel, "*")
        // console.log(product4)

        // let boo = await db.canfind(sallesorderModel, "id_order = 1")
        // console.log(boo)

        // let product4 = await db.foreach(sallesorderModel, "*")
        // console.log(product4)

        await db.close()
    }catch(err){

    }
}

fnTest()