const express = require('express');
const clienteController = require('../controller/clienteController.js');
const router = express.Router();
let ctrl = new clienteController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Lista todos os clientes'
    ctrl.listar(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Cria um novo cliente'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/cliente"
                    }
                }
            }
        }
    */
    ctrl.gravar(req,res);
});

module.exports = router;