const ClienteModel = require('../model/cliente');

class clienteController{
    async listar(req,res){
        try{
            let clienteModel = new ClienteModel();
            let lista = await clienteModel.listar();
            let listaRetorno = [];
            for(let i = 0; i<lista.length; i++){
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        }catch(ex){
            res.status(500).json({msg:"Erro ao listar clientes"});
        }
    }
    async gravar(req, res) {
        if (Object.keys(req.body).length > 0) {
            let clienteModel = new ClienteModel();
    
            // Atribuindo valores ao modelo
            clienteModel.idCliente = 0;  // Para novos clientes
            clienteModel.nomeCliente = req.body.nome;
            clienteModel.telCliente = req.body.tel;
            clienteModel.emailCliente = req.body.email;
            clienteModel.obsCliente = req.body.obs;
    
            // Chama a função gravar, que pode retornar o ID do novo cliente
            let idCliente = await clienteModel.gravar();
    
            if (idCliente) {
                res.status(200).json({ 
                    msg: "Cliente gravado com sucesso", 
                    id_cliente: idCliente  // Retorna o id_cliente gerado
                });
            } else {
                res.status(500).json({ msg: "Erro ao gravar cliente" });
            }
        } else {
            res.status(400).json({ msg: "Erro Interno do servidor" });
        }
    }
}    

module.exports = clienteController;