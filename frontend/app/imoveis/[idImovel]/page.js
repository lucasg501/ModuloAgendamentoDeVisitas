'use client'

import { useState, useEffect, useRef } from "react";
import { use } from 'react';
import httpClient from '@/app/utils/httpClient';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function Imovel(propsPromise) {
    const { idImovel } = use(propsPromise.params);
    const { idCorretor } = use(propsPromise.searchParams);

    const [imovel, setImovel] = useState(null);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Estado dos inputs do formulário
    const [nomeCliente, setNomeCliente] = useState('');
    const [telefone, setTelefone] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [obsCliente, setObsCliente] = useState('');

    const [datasDisponiveis, setDatasDisponiveis] = useState([]);
    const [horariosPorData, setHorariosPorData] = useState({});
    const [horariosDoDiaSelecionado, setHorariosDoDiaSelecionado] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(null);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Função para formatar telefone manualmente
    function formatTelefone(value) {
        value = value.replace(/\D/g, '');           // Remove tudo que não é número
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');  // (99) 9...
        value = value.replace(/(\d{5})(\d)/, '$1-$2');       // (99) 99999-9999
        return value;
    }
    // 1. Atualize a função carregarDisponibilidade
    // Corrigido dentro da função carregarDisponibilidade
    function carregarDisponibilidade(idCorretor) {
        httpClient.get(`/disponibilidade/obter/${idCorretor}`)
            .then(res => res.json())
            .then(data => {
                const mapa = {};
                const datasUnicas = new Set();

                data.forEach(item => {
                    // Adiciona "T12:00:00" para evitar erro de timezone
                    const dateKey = new Date(item.diaSemana + 'T12:00:00').toDateString();
                    datasUnicas.add(dateKey);

                    if (!mapa[dateKey]) mapa[dateKey] = [];
                    mapa[dateKey].push(item.hora.slice(0, 5));
                });

                setHorariosPorData(mapa);
                setDatasDisponiveis([...datasUnicas].map(str => new Date(str)));
            })
            .catch(err => {
                console.error("Erro ao carregar disponibilidade:", err);
            });
    }


    // 2. Primeiro useEffect: Carrega o imóvel
    useEffect(() => {
        httpClient.get(`/imovel/obter/${idImovel}`)
            .then(res => res.json())
            .then(data => {
                const imovelData = Array.isArray(data) ? data[0] : data;
                setImovel(imovelData);
            })
            .catch(err => console.error('Erro ao buscar imóvel:', err));
    }, [idImovel]);

    // 3. Segundo useEffect: Carrega a disponibilidade somente após o imóvel
    useEffect(() => {
        if (imovel?.idCorretor) {
            carregarDisponibilidade(imovel.idCorretor);
        }
    }, [imovel]);


    function limparTelefone(valor) {
        return valor.replace(/\D/g, '');
    }

    const abrirFormModal = (data, hora) => {
        setSelectedSchedule({ data, hora });
        setShowFormModal(true);
        setShowCalendarModal(false);
    };

    const cadastrarAgendamento = async (e) => {
        e.preventDefault();

        if (!selectedSchedule || !selectedSchedule.data || !selectedSchedule.hora) {
            alert("Data ou horário não selecionados.");
            return;
        }

        try {
            // 1. Cadastrar cliente
            const clienteRes = await httpClient.post('/clientes/gravar', {
                nome: nomeCliente,
                tel: limparTelefone(telefone),  // envia só os números
                email: emailCliente,
                obs: obsCliente,
            });

            if (clienteRes.status !== 200) {
                alert("Erro ao cadastrar o cliente.");
                return;
            }

            const clienteData = await clienteRes.json();
            const idCliente = clienteData.id_cliente;

            // 2. Formatando data para o padrão 'YYYY-MM-DD'
            const dataFormatada = selectedSchedule.data.toISOString().split('T')[0];

            // 3. Cadastrar agendamento
            const agendamentoRes = await httpClient.post('/agendamento/gravar', {
                idCli: idCliente,
                idCorretor: imovel.idCorretor,
                idImovel: parseInt(idImovel),
                DtHr: `${dataFormatada} ${selectedSchedule.hora}`,
            });

            if (agendamentoRes.status === 200) {
                alert("Agendamento cadastrado com sucesso!");
                setShowFormModal(false);
                // Você pode limpar o formulário aqui se quiser
                setNomeCliente('');
                setTelefone('');
                setEmailCliente('');
                setObsCliente('');
            } else {
                alert("Erro ao cadastrar o agendamento.");
            }

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar. Detalhes: " + error.message);
        }
    };

    if (!imovel) return <p>Carregando dados do imóvel...</p>;

    return (
        <div style={{ marginTop: 50 }}>
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center">
                        <div className="col-xl-5 col-xxl-6 d-none d-xl-block">
                            <img style={{ minWidth: '500px', minHeight: '300px', maxHeight: '300px', maxWidth: '500px' }} className="img-fluid rounded-3 my-5" src={imovel.foto} alt="Imagem da casa" />
                        </div>
                        <div className="col-lg-8 col-xl-7 col-xxl-6">
                            <div className="my-5 text-center text-xl-start">
                                <h1 className="display-5 fw-bolder text-white mb-2">{imovel.descImovel}</h1>
                                <p className="lead fw-normal text-white-50 mb-4">Quer comprar a casinha dos seus sonhos?</p>
                                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                    {datasDisponiveis.length > 0 ? (
                                        <button className="btn btn-primary btn-lg px-4 me-sm-3" onClick={() => setShowCalendarModal(true)}>
                                            Agende sua visita
                                        </button>
                                    ) : (
                                        <p className="text-white-50">Visitas indisponíveis para esse imóvel</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {showCalendarModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1050
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            width: 'fit-content',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            maxWidth: '90%',
                        }}
                    >
                        <h3 className="mb-3 text-center">Escolha uma data</h3>

                        <Calendar
                            className="react-calendar"
                            locale="pt-BR"
                            firstDayOfWeek={1}
                            minDate={startOfMonth}
                            maxDate={endOfMonth}
                            activeStartDate={startOfMonth}
                            prevLabel={null}
                            nextLabel={null}
                            tileDisabled={({ date, view }) => {
                                if (view !== 'month') return false;
                                return !datasDisponiveis.some(d => d.toDateString() === date.toDateString());
                            }}
                            onClickDay={(value) => {
                                const dataStr = value.toDateString();
                                setDataSelecionada(value);
                                setHorariosDoDiaSelecionado(horariosPorData[dataStr] || []);
                            }}
                        />

                        <div className="mt-4">
                            <h5>Horários disponíveis:</h5>
                            {horariosDoDiaSelecionado.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {horariosDoDiaSelecionado.map((hora, idx) => (
                                        <button
                                            key={idx}
                                            className="btn btn-outline-primary"
                                            onClick={() => abrirFormModal(dataSelecionada, hora)}
                                        >
                                            {hora}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">Selecione uma data válida para ver os horários.</p>
                            )}
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-secondary" onClick={() => setShowCalendarModal(false)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFormModal && selectedSchedule && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Agende sua Visita</h5>
                                <button className="btn-close" onClick={() => setShowFormModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Data:</strong> {selectedSchedule.data.toLocaleDateString()}</p>
                                <p><strong>Horário:</strong> {selectedSchedule.hora}</p>
                                <form onSubmit={cadastrarAgendamento}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            value={nomeCliente}
                                            onChange={e => setNomeCliente(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Telefone</label>
                                        <input
                                            value={telefone}
                                            onChange={e => setTelefone(formatTelefone(e.target.value))}
                                            maxLength={15}
                                            className="form-control"
                                            placeholder="(99) 99999-9999"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            value={emailCliente}
                                            onChange={e => {
                                                const emailFormatado = e.target.value.toLowerCase().trim();
                                                setEmailCliente(emailFormatado);
                                            }}
                                            className="form-control"
                                            required
                                        />

                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observação</label>
                                        <textarea
                                            value={obsCliente}
                                            onChange={e => setObsCliente(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Confirmar Agendamento</button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowFormModal(false)}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
