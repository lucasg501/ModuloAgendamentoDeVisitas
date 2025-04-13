const express = require('express');
const AgendamentoController = require('../controller/agendamentoController.js');

const router = express.Router();

let ctrl = new AgendamentoController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Agendamentos']
    // #swagger.summary = 'Lista todos os agendamentos'
    ctrl.listar(req,res);
});

router.get('/obter/:idAgendamento', (req,res) =>{
    // #swagger.tags = ['Agendamentos']
    // #swagger.summary = 'Obtem um agendamento'
    ctrl.obter(req,res);
})

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Agendamentos']
    // #swagger.summary = 'Grava um novo agendamento'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/agendamento"
                    }
                }
            }
        }            
    */
    ctrl.gravar(req,res);
});

router.put('/alterar', (req,res) =>{
    // #swagger.tags = ['Agendamentos']
    // #swagger.summary = 'Altera um agendamento'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/agendamento"
                    }
                }
            }
        }            
    */
    ctrl.alterar(req,res);
});
   
router.delete('/excluir/:idAgendamento', (req,res) =>{
    // #swagger.tags = ['Agendamentos']
    // #swagger.summary = 'Exclui um agendamento'
    ctrl.excluir(req,res);
});

module.exports = router;