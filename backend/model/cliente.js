const Database = require('../utils/database.js');
const banco = new Database();

class clienteModel{
    #idCliente;
    #nomeCLiente;
    #telCliente;
    #emailCliente;
    #obsCliente;

    get idCliente(){ return this.#idCliente;} set idCliente(idCliente){this.#idCliente = idCliente};
    get nomeCliente(){return this.#nomeCLiente;} set nomeCliente(nomeCliente){this.#nomeCLiente = nomeCliente};
    get telCliente(){return this.#telCliente;} set telCliente(telCliente){this.#telCliente = telCliente};
    get emailCliente(){return this.#emailCliente;} set emailCliente(emailCliente){this.#emailCliente = emailCliente};
    get obsCliente(){return this.#obsCliente;} set obsCliente(obsCliente){this.#obsCliente = obsCliente};

    constructor(idCliente, nomeCliente, telCliente, emailCliente, obsCliente){
        this.#idCliente = idCliente;
        this.#nomeCLiente = nomeCliente;
        this.#telCliente = telCliente;
        this.#emailCliente = emailCliente;
        this.#obsCliente = obsCliente;
    }

    toJSON(){
        return{
            'idCliente': this.#idCliente,
            'nomeCliente': this.#nomeCLiente,
            'telCliente': this.#telCliente,
            'emailCliente': this.#emailCliente,
            'obsCliente': this.#obsCliente
        }
    }


    async listar(){
        let sql = "select * from cliente";
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i = 0; i<rows.length; i++){
            lista.push(new clienteModel(rows[i]['id_cliente'], rows[i]['nome_cliente'], rows[i]['telefone_cliente'], rows[i]['email_cliente'], rows[i]['observacao']));
        }
        return lista;
    }

    async gravar() {
        if(this.#idCliente == 0) {
            // Inserção de um novo cliente
            let sql = "insert into cliente (nome_cliente, telefone_cliente, email_cliente, observacao) values (?,?,?,?)";
            let valores = [this.#nomeCLiente, this.#telCliente, this.#emailCliente, this.#obsCliente];
            let ok = await banco.ExecutaComando(sql, valores);
    
            // Retorna o id_cliente gerado pelo banco de dados
            if (ok) {
                // Supondo que o banco de dados suporte a operação LAST_INSERT_ID() para retornar o id gerado
                let idClienteSql = "SELECT LAST_INSERT_ID() as id_cliente";
                let resultado = await banco.ExecutaComando(idClienteSql);
                return resultado[0].id_cliente; // Retorna o id_cliente gerado
            }
            return ok;
        } else {
            // Atualização de um cliente existente
            let sql = "update cliente set nome_cliente = ?, telefone_cliente = ?, email_cliente = ?, observacao = ? where id_cliente = ?";
            let valores = [this.#nomeCLiente, this.#telCliente, this.#emailCliente, this.#obsCliente, this.#idCliente];
            let ok = await banco.ExecutaComando(sql, valores);
            return ok;
        }
    }
    

}

module.exports = clienteModel;