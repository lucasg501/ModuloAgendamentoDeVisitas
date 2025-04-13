const DispoModel = require('../model/disponibilidadeModel.js');

class dispoController {

    async gravar(req, res) {
        if (Object.keys(req.body).length > 0) {
            // O corpo da requisição deve conter os dias e as horas
            const { dias, idCorretor } = req.body; // dias é um array contendo os dias e suas horas
            let dispoModel = new DispoModel();
            let ok = await dispoModel.excluirAntes();

            if(ok){
                // Para cada dia, gravar as horas correspondentes
            for (let dia of dias) {
                // Para cada hora dentro de um dia
                for (let hora of dia.horas) {
                    dispoModel.idDispo = 0;
                    dispoModel.diaSemana = dia.dia;
                    dispoModel.hora = hora;
                    dispoModel.idCorretor = idCorretor;
                    dispoModel.ocupado = null;

                    // Tente gravar cada disponibilidade
                    let ok = await dispoModel.gravar(dia, idCorretor, hora);
                    if (!ok) {
                        return res.status(500).json({ msg: "Erro ao gravar disponibilidade" });
                    }
                }
            } res.status(200).json({ msg: "Disponibilidade gravada com sucesso" });
            }
        } else {
            res.status(400).json({ msg: "Erro Interno do servidor" });
        }
    }

    async alterar(req, res) {
        if (Object.keys(req.body).length > 0) {
            const { idDispo, dias, idCorretor, ocupado } = req.body;
            let dispoModel = new DispoModel();

            // Para cada dia e cada hora, altere a disponibilidade
            for (let dia of dias) {
                for (let hora of dia.horas) {
                    dispoModel.idDispo = idDispo;
                    dispoModel.diaSemana = dia.dia;
                    dispoModel.hora = hora;
                    dispoModel.idCorretor = idCorretor;
                    dispoModel.ocupado = ocupado;

                    // Tente gravar a alteração
                    let ok = await dispoModel.gravar();
                    if (!ok) {
                        return res.status(500).json({ msg: "Erro ao alterar disponibilidade" });
                    }
                }
            }

            res.status(200).json({ msg: "Disponibilidade alterada com sucesso" });
        } else {
            res.status(400).json({ msg: "Erro Interno do servidor" });
        }
    }


    async obter(req, res) {
        try {
            if (req.params.idCorretor != undefined) {
                let dispoModel = new DispoModel();
                let lista = await dispoModel.obter(req.params.idCorretor);
                let listaRetorno = [];
                for (let i = 0; i < lista.length; i++) {
                    listaRetorno.push(lista[i].toJSON());
                } res.status(200).json(listaRetorno);
            } else {
                res.status(400).json({ msg: "Erro Interno do servidor" });
            }
        } catch (ex) {
            res.status(500).json({ msg: "Erro ao obter disponibilidade" });
        }
    }

    async listar(req, res) {
        try {
            let dispoModel = new DispoModel();
            let lista = await dispoModel.listar();
            let listaRetorno = [];
            for (let i = 0; i < lista.length; i++) {
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        } catch (ex) {
            res.status(500).json({ msg: "Erro ao listar disponibilidade" });
        }
    }

    async excluir(req, res) {
        try {
            if (req.params.idDispo != undefined) {
                let dispoModel = new DispoModel();
                let ok = await dispoModel.excluir(req.params.idDispo);
                if (ok) {
                    res.status(200).json({ msg: "Disponibilidade excluída com sucesso" });
                } else {
                    res.status(500).json({ msg: "Erro ao excluir disponibilidade" });
                }
            } else {
                res.status(400).json({ msg: "Erro Interno do servidor" });
            }
        } catch (ex) {
            res.staatus(500).json({ msg: ex.message });
        }
    }

}

module.exports = dispoController;