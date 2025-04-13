const express = require('express');
const router = express.Router();
const disponibilidadeController = require('../controller/disponibilidadaController.js');
let ctrl = new disponibilidadeController();

router.get('/listar', (req,res) =>{ 
    // #swagger.tags = ['Disponibilidade']
    // #swagger.summary = 'Lista as disponibilidades'
    ctrl.listar(req,res); 
});

router.get('/obter/:idCorretor', (req,res) =>{ 
    // #swagger.tags = ['Disponibilidade']
    // #swagger.summary = 'Obtem uma disponibilidade'
    ctrl.obter(req,res); 
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Disponibilidade']
    // #swagger.summary = 'Grava uma nova disponibilidade'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/disponibilidade"
                    }
                }
            }
        }
    */            
    ctrl.gravar(req,res);
}); 

router.put('/alterar', (req,res) =>{
    // #swagger.tags = ['Disponibilidade']
    // #swagger.summary = 'Altera uma disponibilidade'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/disponibilidade"
                    }
                }
            }
        }
    */            
    ctrl.alterar(req,res);
});

router.delete('/excluir/:idDispo', (req,res) =>{
    // #swagger.tags = ['Disponibilidade']
    // #swagger.summary = 'Exclui uma disponibilidade'
    ctrl.excluir(req,res);
});

module.exports = router;