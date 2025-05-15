'use client'

import { useEffect, useState, useRef } from "react";
import { use } from 'react';
import httpClient from '@/app/utils/httpClient';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

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

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);


    function carregarDisponibilidade(){
        let status = 0;
        httpClient.get(`/disponibilidade/listar`)
            .then(r=>{
                status = r.status;
            })
            .then(r=>{
                if(status === 200){
                    return r.json();
                }
            })
    }

    useEffect(() => {
        carregarDisponibilidade();
    },[]);


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
                            <img style={{ minWidth: '500px', minHeight: '300px', maxHeight: '300px', maxWidth: '500px' }} className="img-fluid rounded-3 my-5" src={imovel.foto} alt="Imagem da casa" />
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
                        <h3 className="mb-3 text-center">Selecione uma Data</h3>
                        <Calendar style={{borderRadius: 25 }}
                            className="react-calendar"
                            locale="pt-BR"
                            firstDayOfWeek={1}
                            minDate={startOfMonth}
                            maxDate={endOfMonth}
                            activeStartDate={startOfMonth}
                            prevLabel={null}
                            nextLabel={null}
                        />
                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-secondary" onClick={fecharModal}>
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
