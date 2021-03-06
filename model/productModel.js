module.exports = {
    "name": "product",
    "table": "product",
    "fields": [
        {"name": "product_id", "type": "integer", "format": ">>>>>>>>>9", "label": "ID Produto"},
        {"name": "product_name", "type": "string", "format": "40", "label": "Nome Produto"},
        {"name": "product_description", "type": "string", "format": "1024", "label": "Desc Produto"},
        {"name": "width", "type": "decimal", "format": "18,0", "label": "Width"},
        {"name": "height", "type": "decimal", "format": "8,0", "label": "Height"},
        {"name": "weight", "type": "decimal", "format": "8,0", "label": "Weight"},
        {"name": "dt_cad", "type": "datetime", "format": "", "label": "Data cadastro"},
        {"name": "dt_alt", "type": "datetime", "format": "", "label": "Data alteração"},
        {"name": "status_product", "type": "char", "format": "1", "label": "Status registro"},
        {"name": "isIntegrated", "type": "bit", "format": "", "label": "Integrado"},
    ],
    "primaryIndex": {"name": "idx_key", "fields": ["product_id"]},
    "indexes":[
        {"name": "idx_product_name", "fields": ["product_name"]}
    ],
    "_descItens": "[product_id, product_name] desc",
    "_where": "[]"
}