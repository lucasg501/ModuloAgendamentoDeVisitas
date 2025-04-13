const AgendamentoModel = require('../model/agendamentosModel.js');

class AgendamentoController{

    async gravar(req,res){
        if(Object.keys(req.body).length > 0){
            let agendamentoModel = new AgendamentoModel();

            agendamentoModel.idAgendamento = 0;
            agendamentoModel.idCli = req.body.idCli;
            agendamentoModel.idCorretor = req.body.idCorretor;
            agendamentoModel.idImovel = req.body.idImovel;
            agendamentoModel.DtHr = req.body.DtHr;
            agendamentoModel.aceito = null;
            let ok = await agendamentoModel.gravar();
            if(ok){
                res.status(200).json({msg:'Agendamento gravado com sucesso'});
            }else{
                res.status(500).json({msg:'Erro ao agendar'});
            }
        }else{
            res.status(400).json({msg:"Parâmetros Inválidos"});
        }
    }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let agendamentoModel = new AgendamentoModel();

            agendamentoModel.idAgendamento = req.body.idAgendamento;
            agendamentoModel.aceito = req.body.aceito;
            let ok = await agendamentoModel.gravar();
            if(ok){
                res.status(200).json({msg:'Agendamento alterado com sucesso'});
            }else{
                res.status(500).json({msg:'Erro ao alterar agendamento'});
            }
        }else{
            res.status(400).json({msg:"Parâmetros Inválidos"});
        }
    }

    async listar(req,res){
        let agendamentoModel = new AgendamentoModel();
        let lista = await agendamentoModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

    async excluir(req,res){
        try{
            if(req.params.idAgendamento != null){
                let agendamentoModel = new AgendamentoModel();
                let ok = await agendamentoModel.excluir(req.params.idAgendamento);
                if(ok){
                    res.status(200).json({msg:"Agendamento excluido com sucesso"});
                }else{
                    res.status(400).json({msg:"Erro ao excluir agendamento"});
                }
            }
        }catch(e){
            res.status(500).json({msg:e.message});
        }
    }

    async obter(req,res){
        if(req.params.idAgendamento != undefined){
            let agendamentoModel = new AgendamentoModel();
            agendamentoModel = await agendamentoModel.obter(req.params.idAgendamento);
            if(agendamentoModel == null){
                res.status(400).json({msg:"Agendamento não encontrado"});
            }else{
                res.status(200).json(agendamentoModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parametros inválidos"});
        }
    }

}

module.exports = AgendamentoController;