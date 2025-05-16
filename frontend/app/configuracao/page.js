'use client'
import { useEffect, useState } from 'react';
import httpClient from '../utils/httpClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Formulario() {
    const [listaAgendamentos, setListaAgendamentos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaCorretores, setListaCorretores] = useState([]);
    const [listaImoveis, setListaImoveis] = useState([]);
    const [filtro, setFiltro] = useState('todos');
    const [filtroCorretor, setFiltroCorretor] = useState('todos');

    function listarAgendamentos() {
        httpClient.get("/agendamento/listar")
            .then(r => r.json())
            .then(r => setListaAgendamentos(r))
            .catch(error => console.error('Erro ao listar agendamentos:', error));
    }

    function listarClientes() {
        httpClient.get("/clientes/listar")
            .then(r => r.json())
            .then(r => setListaClientes(r))
            .catch(error => console.error('Erro ao listar clientes:', error));
    }

    function listarCorretores() {
        httpClient.get("/corretor/listar")
            .then(r => r.json())
            .then(r => setListaCorretores(r))
            .catch(error => console.error('Erro ao listar corretores:', error));
    }

    function listarImoveis() {
        httpClient.get("/imovel/listar")
            .then(r => r.json())
            .then(r => setListaImoveis(r))
            .catch(error => console.error('Erro ao listar imóveis:', error));
    }

    useEffect(() => {
        listarAgendamentos();
        listarClientes();
        listarCorretores();
        listarImoveis();

        if ('Notification' in window && navigator.serviceWorker) {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker registrado:', registration))
                .catch(error => console.log('Falha ao registrar o Service Worker:', error));
        }
    }, []);

    useEffect(() => {
        const verificarAgendamentosPendentes = () => {
            const pendentes = listaAgendamentos.filter(a => a.aceito === null);
            if (pendentes.length > 0 && Notification.permission === 'granted') {
                new Notification("Há agendamentos pendentes para confirmação!", {
                    body: `Você tem ${pendentes.length} agendamento(s) aguardando confirmação.`,
                    icon: 'icon.png',
                });
            }
        };
        verificarAgendamentosPendentes();
    }, [listaAgendamentos]);

    const agendamentosFiltrados = listaAgendamentos.filter(agendamento => {
        const statusOk =
            filtro === 'todos' ? true :
            filtro === 'finalizados' ? agendamento.aceito !== null :
            filtro === 'sem_aceito' ? agendamento.aceito === null : true;

        const corretorOk =
            filtroCorretor === 'todos' ? true :
            agendamento.idCorretor === parseInt(filtroCorretor);

        return statusOk && corretorOk;
    });

    return (
        <div>
            <h1>Lista dos agendamentos</h1>
            <a href='/configuracao/criar' className='btn btn-primary'>Configurar Disponibilidade</a>

            <div className='form-group' style={{ marginTop: 10 }}>
                <label htmlFor="filtro">Filtrar por status:</label>
                <select
                    id="filtro"
                    className="form-control"
                    style={{ width: '200px' }}
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="finalizados">Finalizados</option>
                    <option value="sem_aceito">Sem Status de Aceito</option>
                </select>
            </div>

            <div className='form-group' style={{ marginTop: 10 }}>
                <label htmlFor="filtroCorretor">Filtrar por corretor:</label>
                <select
                    id="filtroCorretor"
                    className="form-control"
                    style={{ width: '200px' }}
                    value={filtroCorretor}
                    onChange={(e) => setFiltroCorretor(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    {listaCorretores.map(corretor => (
                        <option key={corretor.idCorretor} value={corretor.idCorretor}>
                            {corretor.nomeCorretor}
                        </option>
                    ))}
                </select>
            </div>

            <div className='table-responsive'>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>ID Agendamento</th>
                            <th>Nome do cliente</th>
                            <th>Email Cliente</th>
                            <th>Telefone Cliente</th>
                            <th>Observação Cliente</th>
                            <th>Corretor responsável</th>
                            <th>Imóvel</th>
                            <th>Data do agendamento</th>
                            <th>Horário</th>
                            <th>Aceito</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendamentosFiltrados.map((agendamento, index) => {
                            const dtHr = new Date(agendamento.DtHr);
                            const data = dtHr.toLocaleDateString('pt-BR');
                            const hora = dtHr.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                            const cliente = listaClientes.find(c => c.idCliente === agendamento.idCli);
                            const corretor = listaCorretores.find(c => c.idCorretor === agendamento.idCorretor);
                            const imovel = listaImoveis.find(i => i.idImovel === agendamento.idImovel);

                            return (
                                <tr key={index}>
                                    <td>{agendamento.idAgendamento}</td>
                                    <td>{cliente?.nomeCliente || "Desconhecido"}</td>
                                    <td>{cliente?.emailCliente || "Desconhecido"}</td>
                                    <td>
                                        <span>{cliente?.telCliente || "Desconhecido"}</span>
                                        {cliente?.telCliente && (
                                            <a
                                                href={`https://wa.me/+55${cliente.telCliente}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ marginLeft: "15px" }}
                                            >
                                                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "green", height: 25 }} />
                                            </a>
                                        )}
                                    </td>
                                    <td>{cliente?.obsCliente || "Desconhecido"}</td>
                                    <td>{corretor?.nomeCorretor || "Desconhecido"}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden' }}>
                                        {imovel ? `${imovel.descImovel} (Referência: ${imovel.idImovel})` : "Desconhecido"}
                                    </td>
                                    <td>{data}</td>
                                    <td>{hora}</td>
                                    <td>
                                        {agendamento.aceito === null ? (
                                            <>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja confirmar este agendamento como aceito?')) {
                                                            httpClient.put(`/agendamento/alterar`, { aceito: 'S', idAgendamento: agendamento.idAgendamento })
                                                                .then(r => r.json())
                                                                .then(r => {
                                                                    alert(r.msg);
                                                                    listarAgendamentos();
                                                                    window.open(`https://wa.me/+55${cliente.telCliente}?text=Estamos entrando em contato para confirmar sua visita às ${hora} do dia ${data}.`, "_blank");
                                                                });
                                                        }
                                                    }}
                                                >Sim</button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja rejeitar este agendamento?')) {
                                                            httpClient.put(`/agendamento/alterar`, { aceito: 'N', idAgendamento: agendamento.idAgendamento })
                                                                .then(r => r.json())
                                                                .then(r => {
                                                                    alert(r.msg);
                                                                    listarAgendamentos();
                                                                    window.open(`https://wa.me/+55${cliente.telCliente}?text=Infelizmente não será possível fazermos a visita hoje :/`, "_blank");
                                                                });
                                                        }
                                                    }}
                                                >Não</button>
                                            </>
                                        ) : (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>Finalizado</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
