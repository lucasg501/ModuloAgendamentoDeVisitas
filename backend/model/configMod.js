const { config } = require('process');
const Database = require('../utils/database.js');
const banco = new Database();

class configMod{

    #idConfig;
    #ativo;
    #modo;
    #idCorretor;

    get idConfig(){return this.#idConfig;} set idConfig(idConfig){this.#idConfig = idConfig;}
    get ativo(){return this.#ativo;} set ativo(ativo){this.#ativo = ativo;}
    get modo(){return this.#modo;} set modo(modo){this.#modo = modo;}
    get idCorretor(){return this.#idCorretor;} set idCorretor(idCorretor){this.#idCorretor = idCorretor;}

    constructor(idConfig, ativo, modo, idCorretor) {
        this.#idConfig = idConfig;
        this.#ativo = ativo;
        this.#modo = modo;    
        this.#idCorretor = idCorretor;
    }   

    toJSON(){
        return{
            'idConfig': this.#idConfig,
            'ativo': this.#ativo,
            'modo': this.#modo,
            'idCorretor': this.#idCorretor
        }
    }

    async obter(idCorretor){
        let sql = "select * from configuracao where id_corretor = ?";
        let valores = [idCorretor];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            let config = new configMod(rows[0]['id_configuracao'], rows[0]['ativo'], rows[0]['id_corretor']);
            return config;
        }
        return null;
    }

    async gravar(){
        let sql = "delete from configuracao where id_corretor = 13";
        let ok = await banco.ExecutaComando(sql);
        if(ok){
            sql = "insert into configuracao (ativo, id_corretor) values (?,?)";
            let valores = [this.#ativo, this.#idCorretor];
            ok = await banco.ExecutaComando(sql, valores);
        }
        return ok;
    }
}

module.exports = configMod;