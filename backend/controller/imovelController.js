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

    async obter(req,res){
        try{
            if(req.params.idImovel != undefined){
                let imovelModel = new ImovelModel();
                let imovel = await imovelModel.obter(req.params.idImovel);
                if(imovel == null){
                    res.status(400).json({msg:"Erro ao obter imovel"});
                }else{
                    res.status(200).json(imovel);
                }
            }else{
                res.status(400).json({msg:"Erro Interno do servidor"});
            }
        }catch(ex){
            res.status(500).json({msg:"Erro ao obter imovel"});
        }
    }


}

module.exports = ImovelController;