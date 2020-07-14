const db = require("./index")
const productModel = require("../model/productModel")

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
        product.product_name = "TESTE"
        await db.delete(productModel , product)


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