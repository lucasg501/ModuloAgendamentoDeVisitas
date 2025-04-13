const Database = require('../utils/database.js');
const banco = new Database();

class AgendamentosModel{
    #idAgendamento;
    #idCli;
    #idCorretor;
    #idImovel;
    #DtHr;
    #aceito;
    #agendado;

    get idAgendamento(){return this.#idAgendamento;} set idAgendamento(idAgendamento){this.#idAgendamento = idAgendamento;}
    get idCli(){return this.#idCli;} set idCli(idCli){this.#idCli = idCli;}
    get idCorretor(){return this.#idCorretor;} set idCorretor(idCorretor){this.#idCorretor = idCorretor;}    
    get idImovel(){return this.#idImovel;} set idImovel(idImovel){this.#idImovel = idImovel;}
    get DtHr(){return this.#DtHr;} set DtHr(DtHr){this.#DtHr = DtHr;}
    get aceito(){return this.#aceito;} set aceito(aceito){this.#aceito = aceito;}

    constructor(idAgendamento, idCli, idCorretor, idImovel, DtHr, aceito){
        this.#idAgendamento = idAgendamento;
        this.#idCli = idCli;
        this.#idCorretor = idCorretor;
        this.#idImovel = idImovel;
        this.#DtHr = DtHr;
        this.#aceito = aceito;
    }

    toJSON(){
        return{
            'idAgendamento': this.#idAgendamento,
            'idCli': this.#idCli,
            'idCorretor': this.#idCorretor,
            'idImovel': this.#idImovel,
            'DtHr': this.#DtHr,
            'aceito': this.#aceito
        }
    }

    async gravar(){
        if(this.#idAgendamento == 0){
            let sql = "insert into agendamentos (id_cliente, id_corretor, id_imovel, data_hora_agendamento, aceito) values (?,?,?,?,?)";
            let valores = [this.idCli, this.#idCorretor, this.#idImovel, this.#DtHr, this.#aceito];
            let ok = await banco.ExecutaComandoNonQuery(sql,valores);
            return ok;
        }else{
            let sql = "UPDATE agendamentos SET aceito = ? WHERE id_agendamento = ?";
            let valores = [this.#aceito, this.#idAgendamento];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }
    }

    async listar(){
        let sql = "select * from agendamentos order by id_agendamento desc";
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new AgendamentosModel(rows[i]['id_agendamento'], rows[i]['id_cliente'], rows[i]['id_corretor'], rows[i]['id_imovel'], rows[i]['data_hora_agendamento'], rows[i]['aceito']));
        }
        return lista;
    }

    async obter(idAgendamento){
        let sql = "select * from agendamentos where id_agendamento = ?";
        let valores = [idAgendamento];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];
        if(rows.length>0){
            for(let i=0; i<rows.length; i++){
                lista.push(new AgendamentosModel(rows[i]['id_agendamento'], rows[i]['id_cliente'], rows[i]['id_corretor'], rows[i]['id_imovel'], rows[i]['data_hora_agendamentos'], rows[i]['aceito']));
            }
            return lista;
        }
    }

    async excluir(idAgendamento){
        try{
            let sql = "delete from agendamentos where id_agendamento = ?";
            let valores = [idAgendamento];
            let ok = await banco.ExecutaComando(sql, valores);
            return ok;
        }catch(e){
            alert('Erro ao excluir agendamento');
        }
    }

}

module.exports = AgendamentosModel;