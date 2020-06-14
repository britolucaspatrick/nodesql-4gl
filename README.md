# nodesql-4gl

A module to provide 4GL function for easy database access

## Installation

    npm i nodesql-4gl

## Models Examples

```javascript
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
```
## Documentation

### Examples

* [Open connection](#open-connection)
* [Close connection](#close-connection)
* [Find first](#find-first)
* [Find last](#find-last)
* [Can find](#cad-find)
* [Foreach](#foreach)
* [Create](#create)
* [Assign](#assign)
* [Delete](#delete)
* [Create table](#create-table)

## Examples

### Open connection
```javascript
var db = require("nodesql-4gl")
db.connect("mssql", 
    config = {
        user: '############',
        password: '############',
        server: '############',
        database: '############',
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
var db = require("nodesql-4gl")
db.close()
```

### Find first
```javascript
var db = require("nodesql-4gl")
let product = await db.findfirst(productModel, "*", "id_product = 2")
```

### Find last
```javascript
var db = require("nodesql-4gl")
let product3 = await db.findlast(sallesorderModel, "*", "id_order = 2")
```

### Can find
```javascript
var db = require("nodesql-4gl")
let boo = await db.canfind(sallesorderModel, "id_order = 1")
```

### Foreach
```javascript
var db = require("nodesql-4gl")
let product4 = await db.foreach(sallesorderModel, "*")
```

### Create
```javascript
var db = require("nodesql-4gl")
let product4 = await db.foreach(sallesorderModel, "*")
product4.id = null
db.create(productModel, product4)
```

### Assign
```javascript
var db = require("nodesql-4gl")
let product4 = await db.foreach(sallesorderModel, "*")
product4.product_name = "New Product name"
db.assign(productModel, product4)
```

### Delete
```javascript
var db = require("nodesql-4gl")
let product4 = await db.foreach(sallesorderModel, "*")
db.delete(productModel, product4)
```

### Create table
```javascript
let result = await db.createTable(productModel)
await db.close()
```


---
Copyright 2020 Patrick Brito & João Almeida

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.