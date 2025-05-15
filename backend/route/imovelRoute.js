const express = require('express');
const router = express.Router();
const ImovelController =require('../controller/imovelController.js');
let ctrl = new ImovelController();

router.get('/listar', (req,res) =>{ 
    // #swagger.tags = ['Imovel']
    // #swagger.summary = 'Lista os imóveis'
    ctrl.listar(req,res); 
});

router.get('/obter/:idImovel', (req,res) =>{ 
    // #swagger.tags = ['Imovel']
    // #swagger.summary = 'Obtem um imovel'
    ctrl.obter(req,res); 
});

module.exports = router;