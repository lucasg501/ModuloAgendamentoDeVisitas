const Database = require('../utils/database.js');
const banco = new Database();

class imovelModel{
    #idImovel;
    #descImovel;

    get idImovel(){return this.#idImovel;} set idImovel(idImovel){this.#idImovel = idImovel;}
    get descImovel(){return this.#descImovel;} set descImovel(descImovel){this.#descImovel = descImovel;}

    constructor(idImovel, descImovel){
        this.#idImovel = idImovel;
        this.#descImovel = descImovel;
    }

    toJSON(){
        return{
            'idImovel': this.#idImovel,
            'descImovel': this.#descImovel
        }
    }

    async listar(){
        let sql = 'select * from imovel';
        let lista = await banco.ExecutaComando(sql);
        let listaRetorno = [];
        for(let i = 0; i<lista.length; i++){
            listaRetorno.push(new imovelModel(lista[i]['id_imovel'], lista[i]['desc_imovel']));
        }
        return listaRetorno;
    }

}

module.exports = imovelModel;