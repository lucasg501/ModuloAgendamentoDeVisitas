const Database = require('../utils/database.js');
const banco = new Database();

class imovelModel{
    #idImovel;
    #descImovel;
    #foto;

    get idImovel(){return this.#idImovel;} set idImovel(idImovel){this.#idImovel = idImovel;}
    get descImovel(){return this.#descImovel;} set descImovel(descImovel){this.#descImovel = descImovel;}
    get foto(){return this.#foto;} set foto(foto){this.#foto = foto;}

    constructor(idImovel, descImovel, foto){
        this.#idImovel = idImovel;
        this.#descImovel = descImovel;
        this.#foto = foto;
    }

    toJSON(){
        return{
            'idImovel': this.#idImovel,
            'descImovel': this.#descImovel,
            'foto': this.#foto
        }
    }

    async listar(){
        let sql = 'select * from imovel';
        let lista = await banco.ExecutaComando(sql);
        let listaRetorno = [];
        for(let i = 0; i<lista.length; i++){
            listaRetorno.push(new imovelModel(lista[i]['id_imovel'], lista[i]['desc_imovel'], lista[i]['foto']));
        }
        return listaRetorno;
    }

    async obter(idImovel){
        let sql = "select * from imovel where id_imovel = ?";
        let valores = [idImovel];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            return new imovelModel(rows[0]['id_imovel'], rows[0]['desc_imovel'], rows[0]['foto']);
        }
    }

}

module.exports = imovelModel;