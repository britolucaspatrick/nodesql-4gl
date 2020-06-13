const mssql = require('mssql')
let pool

getDescItens = function(list){
    let stringDesc = ""
    let virg = ""

    for(var k in list) {
        stringDesc += virg + list[k] + " desc" 
        virg = ","
    }

    return stringDesc
}

exports.connect = async function(typeDatabase, config) {
    try {
        pool = new mssql.ConnectionPool(config)
        await pool.connect()
        console.log("connected")
    } catch (error) {
        return error
    }
}

exports.close = async function(){
    try {
        await pool.close()
    } catch (error) {
        
    }
}

exports.findfirst = async function(model, fields, where){
    try{
        let result
        if (where){
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} where ${where} order by ${model.primaryIndex.fields.toString()}`)
        }
        else{
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} order by ${model.primaryIndex.fields.toString()} `)
        } 
        return result.recordset[0]
    }catch(err){
        return err
    }
}

exports.findlast = async function(model, fields, where){
    try{
        let result
        if (where){
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} where ${where} order by ${getDescItens(model.primaryIndex.fields)}`)
        }
        else{
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} order by ${getDescItens(model.primaryIndex.fields)}`)
        } 
        return result.recordset[0]
    }catch(err){
        return err
    }
}

exports.canfind = async function(model, where) {
    try{
        let result
        if (where){
            result = await pool.request().query(`select 1 from ${model.table} where ${where}`)
        }
        else{
            result = await pool.request().query(`select 1 from ${model.table}`)
        } 

        return result.recordset[0][''] == 1
    }catch(err){
        return err
    }
}

exports.foreach = async function(model, fields, where){
    try{
        let result
        if (where){
            result = await pool.request().query(`select ${fields} from ${model.table} where ${where} order by ${model.primaryIndex.fields.toString()}`)
        }
        else{
            result = await pool.request().query(`select ${fields} from ${model.table} order by ${model.primaryIndex.fields.toString()}`)
        } 
        return result.recordset
    }catch(err){
        return err
    }
}

exports.create = async function(model, object){

    let campos = ""
    let values = ""
    let virg = ""
    
    for(var x in model.fields){
        campos += virg + model.fields[x].name
        if (model.fields[x].type == "string"){
            values += virg + "'" + object[model.fields[x].name] + "'"
        }else{
            values += virg + object[model.fields[x].name]
        }
        virg = ","
    }

    try {
        await pool.request().query(`insert into ${model.table} (${campos}) values (${values})`)
    } catch (err) {
        console.log(err)
    }
}

exports.assign = async function(model, object){
    let values = ""
    let virg = ""

    for(var x in model.fields){
        if (model.fields[x].type == "string"){
            values += virg + model.fields[x].name + " = '" + object[model.fields[x].name] + "'"
        }else{
            values += virg + model.fields[x].name + " = " + object[model.fields[x].name]
        }
        virg = ","
    }
    try {
        await pool.request().query(`update ${model.table} set ${values} where id = ${object["id"]}`)
    } catch (err) {
        console.log(err)
    }
}

exports.delete = async function(model, object){
    try {
        await pool.request().query(`delete ${model.table} where id = ${object["id"]}`)
    } catch (err) {
        console.log(err)
        return err
    }
}

