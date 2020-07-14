const mssql = require('mssql')
let pool

// getDescItens = function(list){
//     let stringDesc = ""
//     let virg = ""

//     for(var k in list) {
//         stringDesc += virg + list[k] + " desc" 
//         virg = ","
//     }

//     return stringDesc
// }

// createWhere = function(model, result, operador){
//     let string = ""

//     model.primaryIndex.fields.foreach(r => {
//         //varrer o model, comparando o nome r com os fields do model
//         //para saber o tipo do campo
//         //se irá colocar aspas ou não
//         model.fields.foreach(y => {
//             if (y.name == r){
//                 if (y.type == 'string'){
//                     string += " " + r + " " + operador + " " + "'" + result[r] + "' "
//                 }else{
//                     string += " " + r + " " + operador + " " + result[r]
//                 }
//             }
//         })
//     })

//     return string
// }

//Validar se nome dos campos na list2 estão igual a list1
isEquals = function(list1, list2){
    let count
    list1.foreach(r => {
        list2.foreach(y => {
            if (r.name == y.name){
                count++;
            }
        })
    })

    return count == list1.lenght
}

exports.connect = async function(typeDatabase, config) {
    try {
        pool = new mssql.ConnectionPool(config)
        await pool.connect()
        console.log("db connected")
    } catch (error) {
        return error
    }
}

exports.close = async function(){
    try {
        await pool.close()
        console.log("db disconnected")
    } catch (error) {
        
    }
}

//Buscar o primeiro registro
exports.findfirst = async function(model, fields, where){
    try{
        let result
        if (where){
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} where ${where} order by ${model._descItens}`)
        }
        else{
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} order by ${model._descItens} `)
        }
        return result.recordset[0]
    }catch(err){
        return err
    }
}

//Buscar o ultimo registro
exports.findlast = async function(model, fields, where){
    try{
        let result
        if (where){
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} where ${where} order by ${model._descItens}`)
        }
        else{
            result = await pool.request().query(`select top 1 ${fields} from ${model.table} order by ${model._descItens}`)
        } 
        return result.recordset[0]
    }catch(err){
        return err
    }
}

//Buscar o registro anterior ao rowid informado
exports.findprev =  async function(model, fields, rowid){
    try{
        let result
        result = findfirst(model , `${model.primaryIndex.fields.toString()}` , `rowid = ${rowid}`)
        
        result = await pool.request().query(`select top 2 from ${model.table} where ${createWhere(model, result, "<=")} order by ${model._descItens}`)
        return result.recordset[0]
    }catch(err){
        return err
    }
}

//Buscar o registro depois do rowid informado
exports.findnext =  async function(model, fields, rowid){
    try{
        let result
        result = findfirst(model , `${model.primaryIndex.fields.toString()}` , `rowid = ${rowid}`)
        
        result = await pool.request().query(`select top 2 from ${model.table} where ${createWhere(model, result, ">=")} order by ${model.primaryIndex.fields.toString()}`)
        
        return result.recordset[0]
    }catch(err){
        return err
    }
}

//Validar[bool] se objeto existe
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

//Buscar um registro por lista de keys
exports.gotokey = async function(model, fields, keys){
    try{

        //verificar se keys recebidas então de acordo com as primary key do model
        if (isEquals(model.primaryIndex.fields, keys)){
            let result
            //TODO: Validar como deve ser obtido o where, através do modelo, solicitado ao João
            result = await pool.request().query(`select ${fields} from ${model.table} where ${where}`)
                
            return result.recordset[0]
        }else{
            throw new Exception('Keys diferentes')
        }
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
        await pool.request().query(`delete ${model.table} where rowid = ${object["rowid"]}`)
    } catch (err) {
        console.log(err)
        return err
    }
}

exports.createTable = async function (model) {
    let qry = `CREATE TABLE [${model.table}] ( \n`
    virg = ""
    qry += `  [rowid] [int] IDENTITY(1,1) NOT NULL,\n`
    model.fields.forEach((f) => {
        if(f.type == "integer") {
            qry += virg + `  [${f.name}] [int] NOT NULL`
        }
        else if(f.type == "string") {
            qry += virg + `  [${f.name}] [nvarchar](${f.format}) NOT NULL`
        }
        else if(f.type == "bit") {
            qry += virg + `  [${f.name}] [bit] NULL`
        }
        else if(f.type == "char") {
            qry += virg + `  [${f.name}] [char](${f.format}) NULL`
        }
        else if(f.type == "date") {
            qry += virg + `  [${f.name}] [date] NULL`
        }
        else if(f.type == "datetime") {
            qry += virg + `  [${f.name}] [datetime] NULL`
        }
        else if(f.type == "decimal") {
            qry += virg + `  [${f.name}] [decimal](${f.format}) NULL`
        }
        else if(f.type == "float") {
            qry += virg + `  [${f.name}] [float] NULL`
        }
        else if(f.type == "timestamp") {
            qry += virg + `  [${f.name}] [timestamp] NULL`
        }
        
        
        virg = ',\n'
    })
    qry += ') \n'
    
    qry += `CREATE NONCLUSTERED INDEX [${model.primaryIndex.name}] ON [${model.table}] ( \n`
    virg = ""
    model.primaryIndex.fields.forEach((f) => {
        qry += virg + `  [${f}] ASC`
        virg = ',\n'
    })
    qry += ') \n'
    
    model.indexes.forEach((i) => {
        qry += `CREATE NONCLUSTERED INDEX [${i.name}] ON [${model.table}] ( \n`
        virg = ""
        i.fields.forEach((f) => {
            qry += virg + `  [${f}] ASC`
            virg = ',\n'
        })
        qry += ') \n'
    })
    
    try {
        await pool.request().query(qry)
        console.log(`Created Table [${model.table}]`)
        return true
    }
    catch(e) {
        throw e
    }
}

