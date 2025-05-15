'use client'

import { useEffect, useState, useRef } from "react";
import { use } from 'react';
import httpClient from '@/app/utils/httpClient';

export default function Imovel(propsPromise) {
    const { idImovel } = use(propsPromise.params); // Desestrutura o params corretamente
    const [imovel, setImovel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [agendamentoEfetuado, setAgendamentoEfetuado] = useState(false);

    const nomeCliente = useRef(null);
    const telCliente = useRef(null);
    const emailCliente = useRef(null);
    const obsCliente = useRef(null);

    useEffect(() => {
        httpClient.get(`/imovel/obter/${idImovel}`)
            .then(res => res.json())
            .then(data => setImovel(data))
            .catch(err => console.error('Erro ao buscar imóvel:', err));
    }, [idImovel]);

    const fecharModal = () => setShowModal(false);
    const fecharFormModal = () => setShowFormModal(false);

    const abrirFormModal = (diaSemana, data, hora) => {
        setSelectedSchedule({ diaSemana, data, hora });
        setShowFormModal(true);
    };

    const cadastrarAgendamento = (e) => {
        e.preventDefault();
        // lógica para envio pode ser implementada aqui
        setAgendamentoEfetuado(true);
        fecharFormModal();
    };

    if (!imovel) return <p>Carregando dados do imóvel...</p>;

    return (
        <div style={{ marginTop: 50 }}>
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center">
                        <div className="col-xl-5 col-xxl-6 d-none d-xl-block">
                            <img style={{minWidth: '500px', minHeight: '300px', maxHeight: '300px', maxWidth: '500px'}} className="img-fluid rounded-3 my-5" src={imovel.foto} alt="Imagem da casa" />
                        </div>
                        <div className="col-lg-8 col-xl-7 col-xxl-6">
                            <div className="my-5 text-center text-xl-start">
                                <h1 className="display-5 fw-bolder text-white mb-2">{imovel.descImovel}</h1>
                                <p className="lead fw-normal text-white-50 mb-4">Quer comprar a casinha dos seus sonhos?</p>
                                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                    <button className="btn btn-primary btn-lg px-4 me-sm-3" onClick={() => setShowModal(true)}>
                                        Agende sua visita
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Disponibilidades</h5>
                                <button type="button" className="btn-close" onClick={fecharModal}></button>
                            </div>
                            <div className="modal-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Dia</th>
                                            <th>Data</th>
                                            <th>Horário</th>
                                            <th>Agendar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Simula dados de disponibilidade */}
                                        {["Segunda", "Terça"].map((dia, i) => (
                                            <tr key={i}>
                                                <td>{dia}</td>
                                                <td>20/05/2025</td>
                                                <td>10:00</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => abrirFormModal(dia, '20/05/2025', '10:00')}>
                                                        Agendar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={fecharModal}>Fechar</button>
                            </div>
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
                                <button className="btn-close" onClick={fecharFormModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={cadastrarAgendamento}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input ref={nomeCliente} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Telefone</label>
                                        <input ref={telCliente} maxLength={11} className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input ref={emailCliente} type="email" className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observação</label>
                                        <textarea ref={obsCliente} className="form-control" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Confirmar Agendamento</button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={fecharFormModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
