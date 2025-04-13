const ImovelModel = require('../model/imovel.js');

class ImovelController{

    async listar(req,res){
        try{
            let imovelModel = new ImovelModel();
            let lista = await imovelModel.listar();
            let listaRetorno = [];
            for(let i = 0; i<lista.length; i++){
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        }catch(ex){
            res.status(500).json({msg:"Erro ao listar imoveis"});
        }
    }


}

module.exports = ImovelController;