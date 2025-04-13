'use client'

import { useEffect, useState } from "react"
import httpClient from "../utils/httpClient";

export default function negocios() {

    const [listaAgendamentos, setListaAgendamentos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaImovel, setListaImovel] = useState([]);

    function listarImoveis() {
        httpClient.get("/imovel/listar")
            .then(r => r.json())
            .then(r => {
                setListaImovel(r);
            })
    }

    function listarClientes() {
        httpClient.get("/clientes/listar")
            .then(r => r.json())
            .then(r => {
                setListaClientes(r);
            })
    }

    function listarAgendamentos() {
        httpClient.get("/agendamento/listar")
            .then(r => r.json())
            .then(r => {
                setListaAgendamentos(r);
            })
    }

    useEffect(() => {
        listarAgendamentos();
        listarClientes();
        listarImoveis();
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .table-container {
                width: 100%;
                border-collapse: collapse;
            }

            .flex-container {
                display: flex;
                justify-content: space-between; /* Espaçamento entre as divs */
                width: 100%;
            }

            .flex-item {
                flex: 1 0 20%; /* Faz com que cada div ocupe 20% da largura */
                padding: 10px;
                text-align: center;
                align-items: center;
            }

            ul {
                list-style-type: none;
            }

            .card{
                width: 60%;
                padding: 5px;
                margin: 5px;
                border: none;
                background-color: #ADD8E6;
            }
        `;
        document.head.appendChild(style);
    }, []);

    return (
        <div>
            <div className="flex-container">
                <div className="flex-item">
                    <h3>Contato</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
                        {
                            listaAgendamentos.map((agendamento, index) => {
                                // Encontre o nome do cliente usando o idCli
                                const cliente = listaClientes.find(cliente => cliente.idCliente === agendamento.idCli);
                                const imovel = listaImovel.find(imovel => imovel.idImovel === agendamento.idImovel);
                                return (
                                    agendamento.aceito === "S" ?
                                    <div key={index} className="card">
                                        {/* Exibe o nome do cliente ao invés do idCli */}
                                        <h5>{cliente ? cliente.nomeCliente : 'Cliente não encontrado'}</h5>
                                        {/* Exibe a descrição do imóvel ao invés do idImovel */}
                                        <p>{imovel ? imovel.descImovel : 'Imóvel não encontrado'}</p>
                                    </div>
                                    :
                                    null
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-item">
                    <h3>Revisar</h3>
                    <div>
                        <div>
                        </div>
                    </div>
                </div>
                <div className="flex-item">
                    <h3>Visita</h3>
                    <div>
                        <div>
                        </div>
                    </div>
                </div>
                <div className="flex-item">
                    <h3>Proposta</h3>
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </div>
                <div className="flex-item">
                    <h3>Negociação</h3>
                    <div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
