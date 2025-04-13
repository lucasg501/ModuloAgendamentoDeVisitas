const ConfigModel = require('../model/configMod.js');

class configController{

    async gravar(req,res){
        if(Object.keys(req.body).length > 0){
            let configModel = new ConfigModel();
            
            configModel.idConfig = 0;
            configModel.ativo = req.body.statusAtivo;
            configModel.idCorretor = req.body.idCorretor;
            let ok = await configModel.gravar();
            if(ok){
                res.status(200).json({msg:"Configurações gravadas com sucesso"});
            }else{
                res.status(500).json({msg:"Erro ao gravar configurações"});
            }
        }else{
            res.status(400).json({msg:"Erro Interno do servidor"});
        }
    }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let configModel = new ConfigModel();
            
            configModel.idConfig = req.body.idConfig;
            configModel.ativo = req.body.ativo;
            configModel.modo = req.body.modo;
            configModel.idCorretor = req.body.idCorretor;
            configModel.idDispo = req.body.idDispo;
            let ok = await configModel.gravar();
            if(ok){
                res.status(200).json({msg:"Configurações alteradas com sucesso"});
            }else{
                res.status(500).json({msg:"Erro ao alterar configurações"});
            }
        }else{
            res.status(400).json({msg:"Erro Interno do servidor"});
        }
    }

    async obter(req,res){
        if(req.params.idCorretor != undefined){
            let configModel = new ConfigModel();
            configModel = await configModel.obter(req.params.idCorretor);
            if(configModel == null){
                res.status(400).json({msg:"Erro ao obter configurações"});
            }else{
                res.status(200).json(configModel);
            }
        }else{
            res.status(400).json({msg:"Erro Interno do servidor"});
        }
    }
        

}

module.exports = configController;