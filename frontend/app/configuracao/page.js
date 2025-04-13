'use client'
import { useEffect, useState } from 'react';
import httpClient from '../utils/httpClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareWhatsapp, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Formulario() {

    const [listaAgendamentos, setListaAgendamentos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaCorretores, setListaCorretores] = useState([]);
    const [listaImoveis, setListaImoveis] = useState([]);
    const [filtro, setFiltro] = useState('todos');  // Estado para o filtro de visualização

    function listarAgendamentos() {
        httpClient.get("/agendamento/listar")
            .then(r => r.json())
            .then(r => {
                setListaAgendamentos(r);
            })
            .catch(error => console.error('Erro ao listar agendamentos:', error));
    }

    function listarClientes() {
        httpClient.get("/clientes/listar")
            .then(r => r.json())
            .then(r => {
                setListaClientes(r);
            })
            .catch(error => console.error('Erro ao listar clientes:', error));
    }

    function listarCorretores() {
        httpClient.get("/corretor/listar")
            .then(r => r.json())
            .then(r => {
                setListaCorretores(r);
            })
            .catch(error => console.error('Erro ao listar corretores:', error));
    }

    function listarImoveis() {
        httpClient.get("/imovel/listar")
            .then(r => r.json())
            .then(r => {
                setListaImoveis(r);
            })
            .catch(error => console.error('Erro ao listar imóveis:', error));
    }

    useEffect(() => {
        listarAgendamentos();
        listarClientes();
        listarCorretores();
        listarImoveis();

        if ('Notification' in window && navigator.serviceWorker) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Permissão para notificações concedida!');
                } else {
                    console.log('Permissão para notificações negada!');
                }
            });
        }
    }, []);

    // service-worker.js
    self.addEventListener('push', event => {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'icon.png', // ícone da notificação
            badge: 'badge.png',
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    });
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('Falha ao registrar o Service Worker:', error);
                });
        }
    }, []);

    useEffect(() => {
        // Função que verifica e envia notificações
        const verificarAgendamentosPendentes = () => {
            const agendamentosPendentes = listaAgendamentos.filter(agendamento => agendamento.aceito === null);
            if (agendamentosPendentes.length > 0) {
                // Envia a notificação para o usuário
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification("Há agendamentos pendentes para confirmação!", {
                        body: `Você tem ${agendamentosPendentes.length} agendamento(s) aguardando confirmação.`,
                        icon: 'icon.png',
                    });
                }
            }
        };

        verificarAgendamentosPendentes();
    }, [listaAgendamentos]);


    // Função para filtrar os agendamentos
    const agendamentosFiltrados = listaAgendamentos.filter(value => {
        if (filtro === 'todos') {
            return true; // Exibe todos
        } else if (filtro === 'finalizados') {
            return value.aceito !== null; // Exibe apenas os finalizados
        } else if (filtro === 'sem_aceito') {
            return value.aceito === null; // Exibe apenas os sem status de aceito
        }
        return true;
    });

    return (
        <div>
            <h1>Lista dos agendamentos</h1>
            <a href='/configuracao/criar' className='btn btn-primary'>Configurar Disponibilidade</a>

            <div className='form-group'>
                <label htmlFor="filtro">Filtrar:</label>
                <select style={{ width: '200px', }}
                    id="filtro"
                    className="form-control"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="finalizados">Finalizados</option>
                    <option value="sem_aceito">Sem Status de Aceito</option>
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
                        {
                            agendamentosFiltrados.map((value, index) => {
                                // Formatar data e hora
                                const dtHr = new Date(value.DtHr);
                                const data = dtHr.toLocaleDateString('pt-BR');
                                const hora = dtHr.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                                // Buscar os nomes correspondentes
                                const cliente = listaClientes.find(c => c.idCliente === value.idCli);
                                const corretor = listaCorretores.find(c => c.idCorretor === value.idCorretor);
                                const imovel = listaImoveis.find(i => i.idImovel === value.idImovel);

                                return (
                                    <tr key={index}>
                                        <td>{value.idAgendamento}</td>
                                        <td>{cliente ? cliente.nomeCliente : "Desconhecido"}</td>
                                        <td>{cliente ? cliente.emailCliente : "Desconhecido"}</td>
                                        <td>
                                            <span>{cliente ? cliente.telCliente : "Desconhecido"}</span>
                                            <a href={`https://wa.me/+55${cliente?.telCliente}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "15px" }}>
                                                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "green", height: 25 }} />
                                            </a>
                                        </td>

                                        <td>{cliente ? cliente.obsCliente : "Desconhecido"}</td>
                                        <td>{corretor ? corretor.nomeCorretor : "Desconhecido"}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden' }}>{imovel ? `${imovel.descImovel} (Referência: ${imovel.idImovel})` : "Desconhecido"}</td>
                                        <td>{data}</td>
                                        <td>{hora}</td>
                                        <td>
                                            {value.aceito === null ? (
                                                <>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            if (confirm('Tem certeza que deseja confirmar este agendamento como aceito?')) {
                                                                httpClient.put(`/agendamento/alterar`, { aceito: 'S', idAgendamento: value.idAgendamento })
                                                                    .then(r => r.json())
                                                                    .then(r => {
                                                                        alert(r.msg);
                                                                        listarAgendamentos();
                                                                        window.open(`https://wa.me/+55${cliente.telCliente}?text=Estamos entrando em contato para confirmar sua visita as ${hora} do dia ${data} `, "_blank");
                                                                    })
                                                                    .catch(error => console.error('Erro ao alterar agendamento:', error));
                                                            }
                                                        }}
                                                    >
                                                        Sim
                                                    </button>
                                                    <button
                                                        style={{ marginLeft: 10 }}
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            if (confirm('Tem certeza que deseja rejeitar este agendamento?')) {
                                                                httpClient.put(`/agendamento/alterar`, { aceito: 'N', idAgendamento: value.idAgendamento })
                                                                    .then(r => r.json())
                                                                    .then(r => {
                                                                        alert(r.msg);
                                                                        listarAgendamentos();
                                                                        window.open(`https://wa.me/+55${cliente.telCliente}?text=Infelizmente não será possível fazermos a visita hoje :/`, "_blank");
                                                                    })
                                                                    .catch(error => console.error('Erro ao alterar agendamento:', error));
                                                            }
                                                        }}
                                                    >
                                                        Não
                                                    </button>
                                                </>
                                            ) : (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Finalizado</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
