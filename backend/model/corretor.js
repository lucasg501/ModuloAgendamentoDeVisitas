const Database = require('../utils/database.js');
const banco = new Database();

class corretorModel {
    #idCorretor;
    #nomeCorretor;

    get idCorretor(){return this.#idCorretor;} set idCorretor(idCorretor){this.#idCorretor = idCorretor;};
    get nomeCorretor(){return this.#nomeCorretor;} set nomeCorretor(nomeCorretor){this.#nomeCorretor = nomeCorretor;}

    constructor(idCorretor, nomeCorretor){
        this.#idCorretor = idCorretor;
        this.#nomeCorretor = nomeCorretor;
    }

    toJSON(){
        return{
            'idCorretor': this.#idCorretor,
            'nomeCorretor': this.#nomeCorretor
        }
    }

    async listar(){
        let sql = "select * from corretor";
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i = 0; i<rows.length; i++){
            lista.push(new corretorModel(rows[i]['id_corretor'], rows[i]['nome_corretor']));
        }
        return lista;
    }

}

module.exports = corretorModel;