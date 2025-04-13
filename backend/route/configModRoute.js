const express = require('express');
const router = express.Router();
const configModController = require('../controller/configController.js');
let ctrl = new configModController();

router.get('/obter/:idCorretor', (req,res) =>{
    // #swagger.tags = ['Configurações']
    // #swagger.summary = 'Lista as configurações de um corretor'
    ctrl.obter(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Configurações']
    // #swagger.summary = 'Grava as configurações'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/config"
                    }
                }
            }
        }            
    */
    ctrl.gravar(req,res);
});

router.post('/alterar', (req,res) =>{
    // #swagger.tags = ['Configurações']
    // #swagger.summary = 'Altera as configurações'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/config"
                    }
                }
            }
        }            
    */
    ctrl.alterar(req,res);
});

module.exports = router;