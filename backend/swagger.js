const swaggerAutogen = require("swagger-autogen")({openapi: "3.0.0"});
const clienteModel = require('./model/cliente.js');
const corretorModel = require('./model/corretor.js');
const configModel = require('./model/configMod.js');
const dispoModel = require('./model/disponibilidadeModel.js');
const agendamentoModel = require('./model/agendamentosModel.js');


const doc = {
    info:{

    },
    host: 'localhost:4000',
    securityDefinitions:{
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'chaveapi',
            description: 'chave para aut da api'
        }
    },
    components:{
        schemas:{
            cliente: new clienteModel(0, 'Roberval', '18996670055', 'robervalgatao@gmail.com','n/a').toJSON(),
            corretor: new corretorModel(0, 'Cabecinha de guidão').toJSON(),
            config: new configModel(0, 'S', 'A', 13, 0).toJSON(),
            disponibilidade: new dispoModel(0, 'Segunda', '08:00', 1, 'S').toJSON(),
            agendamento: new agendamentoModel(0, 0, 0, 0, '2021-01-01 00:00:00', 'S').toJSON()
        }
    }
}

let outputJson = "./outputSwagger.json";
let endpoins = ["./server.js"];

swaggerAutogen(outputJson, endpoins, doc)
.then(r=>{
    require('./server.js');
});