# nodesql-4gl

A module to provide 4GL function for easy database access

## Installation

    npm i nodesql-4gl

## Quick Example

```javascript
const mssql = require('mssql')
let pool

exports.connect = async function(typeDatabase, config) {
    try {
        pool = new mssql.ConnectionPool(config)
        await pool.connect()
        console.log("connected")
    } catch (error) {
        // ... error checks
    }
}
```
## Documentation

### Examples

* [Close connection](#close-connection)
* [Find first](#find-first)
* [Find last](#find-last)
* [Can find](#cad-find)
* [Foreach](#foreach)
* [Create](#create)
* [Assign](#assign)
* [Delete](#delete)

## Examples

### Config

```javascript
await db.connect("mssql", 
    config = {
        user: '########',
        password: '########',
        server: '########',
        database: '########',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    } 
)
```


### Close connection
```javascript
exports.close = async function(){
    try {
        await pool.close()
    } catch (error) {
        
    }
}
```

### Find first
```javascript
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
```

### Find last
```javascript
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
```

### Can find
```javascript
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
```

### Foreach
```javascript
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
```

### Create
```javascript
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
```

### Assign
```javascript
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
```

### Delete
```javascript
exports.delete = async function(model, object){
    try {
        await pool.request().query(`delete ${model.table} where id = ${object["id"]}`)
    } catch (err) {
        console.log(err)
        return err
    }
}
```

---
Copyright 2020 Patrick Brito & João Almeida

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.