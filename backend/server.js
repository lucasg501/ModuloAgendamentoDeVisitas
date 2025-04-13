const express = require('express');
const swaggerJson = require('./outputSwagger.json');
const swaggerUi = require('swagger-ui-express');
const clientes = require('./route/clienteRoute.js');
const corretor = require('./route/corretorRoute.js');
const imovel = require('./route/imovelRoute.js');
const configMod = require('./route/configModRoute.js');
const disponibilidade = require('./route/disponibilidadeRoute.js');
const agendamento = require('./route/agendamentoRoute.js');

const cors = require('cors');

const app = express();
const porta = "4000";

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials:true}));
app.use('/clientes', clientes);
app.use('/corretor', corretor);
app.use('/imovel', imovel);
app.use('/configMod', configMod);
app.use('/disponibilidade', disponibilidade);
app.use('/agendamento', agendamento);

app.listen(porta,()=>{
    console.log(`Servidor rodando em http://localhost:${porta}\n`);
    console.log(`Consultar documentação em http://localhost:${porta}/docs\n`);
})