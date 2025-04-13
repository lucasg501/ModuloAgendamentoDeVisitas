const express = require('express');
const router = express.Router();
const corretorController = require('../controller/corretorController.js');
let ctrl = new corretorController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Corretor']
    // #swagger.summary = 'Lista todos os corretores'
    ctrl.listar(req,res);
});

module.exports = router;