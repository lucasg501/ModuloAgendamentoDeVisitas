const CorretorModel = require('../model/corretor.js');

class CorretorController{

    async listar (req,res){
        try{
            let corretorModel = new CorretorModel();
            let lista = await corretorModel.listar();
            let listaRetorno = [];
            for(let i = 0; i<lista.length; i++){
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        }catch(ex){
            res.status(500).json({msg:"Erro ao listar corretor"});
        }
    }

}

module.exports = CorretorController;