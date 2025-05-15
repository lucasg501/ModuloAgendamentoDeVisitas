var mysql = require('mysql2');

class Database {

    #conexao;

    get conexao() { return this.#conexao;} set conexao(conexao) { this.#conexao = conexao; }

    constructor() {

        this.#conexao = mysql.createPool({
            host: '127.0.0.1', //endereço do nosso banco de dados na nuvem
            port: 3306,
            database: 'hackatoon', //a database de cada um de vocês possui a nomenclatura DB_(RA)
            user: 'root', // usuario e senha de cada um de vocês é o RA
            password: 'ametis99',
        });
    }

    IniciarTransacao() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("START TRANSACTION", function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }

    Rollback() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("ROLLBACK", function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }

    Commit() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("COMMIT", function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }

    ExecutaComando(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }
    
    ExecutaComandoNonQuery(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results.affectedRows > 0);
            });
        })
    }

    ExecutaComandoLastInserted(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results.insertId);
            });
        })
    }

}

module.exports = Database;



