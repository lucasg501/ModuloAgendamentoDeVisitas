'use client'
import { useEffect, useRef, useState } from "react";
import httpClient from '@/app/utils/httpClient';  // Supondo que você tenha um httpClient configurado

export default function Home({ children }) {

    const [listaDisponibilidade, setListaDisponibilidade] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [agendamentoEfetuado, setAgendamentoEfetuado] = useState(false); // Novo estado


    const nomeCliente = useRef('');
    const telCliente = useRef('');
    const emailCliente = useRef('');
    const obsCliente = useRef('');

    // Função para calcular as datas da semana com base na resposta da API
    // Função para calcular as datas da semana com base nas disponibilidades
    function calcularDatasSemana(disponibilidades) {
        const hoje = new Date();  // Data atual
        const diaDaSemana = hoje.getDay();  // Dia da semana (0 a 6, sendo 0 = Domingo)

        // Determinar a quantidade de dias para voltar até a segunda-feira
        const diasParaSegunda = (diaDaSemana === 0 ? 6 : diaDaSemana - 1);  // Se for domingo (0), volta 6 dias, caso contrário, volta até o dia da segunda-feira

        // Calculando a data de segunda-feira da semana atual
        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() - diasParaSegunda);

        // Mapear os dias da semana que vieram da API (em minúsculas)
        const diasSemanaApi = disponibilidades.map(dia => dia.diaSemana.toLowerCase());  // Exemplo: "segunda", "terça", "quarta", etc.

        // Mapeia os dias da API para suas datas corretas
        let datasCorrespondentes = diasSemanaApi.map(dia => {
            const dataDia = new Date(segundaFeira);  // Copiar a data da segunda-feira
            const diasDaSemana = { "segunda": 0, "terca": 1, "quarta": 2, "quinta": 3, "sexta": 4, "sabado": 5, "domingo": 6 }; // Mapeamento de dias da semana
            const offsetDia = diasDaSemana[dia];  // Obter o número do dia da semana (0 = segunda, 1 = terça, etc.)

            // Ajustar a data para o dia da semana correto
            dataDia.setDate(segundaFeira.getDate() + offsetDia);

            return {
                diaSemana: dia,
                data: dataDia.toLocaleDateString()  // Formato local da data
            };
        });

        return datasCorrespondentes;
    }

    // Função para listar as disponibilidades
    function listarDisponibilidade() {
        httpClient.get("/disponibilidade/listar")
            .then(r => r.json())
            .then(r => {
                // Calcular as datas correspondentes aos dias da semana
                const disponibilidadesComDatas = calcularDatasSemana(r);

                // Agora, associamos as informações da API com as datas calculadas
                const disponibilidadesCompletas = r.map((dispo, index) => {
                    return {
                        ...dispo, // Mantém todas as propriedades da API
                        data: disponibilidadesComDatas[index]?.data || 'Data não disponível', // Adiciona a data calculada
                    };
                });

                setListaDisponibilidade(disponibilidadesCompletas); // Atualiza o estado com as disponibilidades e datas
                setShowModal(true);  // Abre o modal de disponibilidades
            })
            .catch(error => console.error('Erro ao listar disponibilidade:', error));
    }

    // Função para cadastrar o agendamento
    function cadastrarAgendamento(event) {
        event.preventDefault(); // Evita o reload da página

        let status = 0;

        httpClient.post('/clientes/gravar', {
            nome: nomeCliente.current.value,
            tel: telCliente.current.value,
            email: emailCliente.current.value,
            obs: obsCliente.current.value
        })
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status === 200) {
                    const id_cliente = r.id_cliente;

                    // Criando a data correta no formato yyyy-MM-dd HH:mm:ss
                    const partesData = selectedSchedule.data.split("/"); // Supondo "DD/MM/AAAA"
                    const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`; // Convertendo para "AAAA-MM-DD"
                    const dataHoraAgendada = `${dataFormatada} ${selectedSchedule.hora}`; // Montando "YYYY-MM-DD HH:mm:ss"

                    httpClient.post('/agendamento/gravar', {
                        idCli: id_cliente,
                        idCorretor: 13,
                        idImovel: 2,
                        DtHr: dataHoraAgendada, // Enviando a data correta
                    })
                        .then(agendamentoResponse => {
                            if (agendamentoResponse.status === 200) {
                                setAgendamentoEfetuado(true);
                                alert("Agendamento cadastrado com sucesso!");
                                fecharFormModal();
                                window.location.reload();
                            } else {
                                alert("Erro ao cadastrar o agendamento.");
                            }
                        })
                        .catch(error => {
                            alert("Erro ao cadastrar o agendamento. Detalhes: " + error);
                        });
                } else {
                    alert("Erro ao cadastrar o cliente.");
                }
            })
            .catch(error => {
                alert("Erro ao cadastrar o cliente. Detalhes: " + error);
            });
    }

    // Função para fechar o modal de disponibilidades
    const fecharModal = () => {
        setShowModal(false);
    };

    // Função para abrir o modal do formulário de agendamento
    const abrirFormModal = (dia, data, hora) => {
        setSelectedSchedule({ dia, data, hora }); // Agora armazenamos a data correta
        setShowFormModal(true);
    };


    // Função para fechar o modal do formulário
    const fecharFormModal = () => {
        setShowFormModal(false);
        setSelectedSchedule(null);  // Limpa o horário selecionado
    };

    const [listaConfig, setListaConfig] = useState([]);

    function listarConfig() {
        httpClient.get("/configMod/obter/13")
            .then(r => r.json())
            .then(r => {
                setListaConfig(r);
            })
            .catch(error => console.error('Erro ao listar disponibilidade:', error));
    }

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes borderAnimation {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            .rainbow-border {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 270px;
                height: 270px;
                border-radius: 50%;
                border: 25px solid transparent;
                animation: borderAnimation 3s linear infinite;
                background-image: linear-gradient(white, white), 
                                  linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
                background-origin: border-box;
                background-clip: content-box, border-box;
            }
        `;
        document.head.appendChild(style);
        listarConfig();
    }, []);

    return (
        <div style={{ marginTop: 50 }}>
            <header className="bg-dark py-5">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center">
                        <div className="col-xl-5 col-xxl-6 d-none d-xl-block">
                            <img className="img-fluid rounded-3 my-5"
                                src="https://www.geracaoimoveis.com.br/foto_/2022/11178/sao-jose-dos-campos-casa-condominio-condominio-residencial-alphaville-ii-23-05-2024_14-27-13-16.webp"
                                alt="Imagem da casa" />
                        </div>
                        <div className="col-lg-8 col-xl-7 col-xxl-6">
                            <div className="my-5 text-center text-xl-start">
                                <h1 className="display-5 fw-bolder text-white mb-2">Casa em Jacarépagua</h1>
                                <p className="lead fw-normal text-white-50 mb-4">Quer comprar a casinha dos seus sonhos?</p>
                                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                    {
                                        listaConfig.ativo == 0 ?
                                            <button
                                                className="btn btn-primary btn-lg px-4 me-sm-3"
                                                onClick={listarDisponibilidade}>
                                                Agende sua visita
                                            </button>
                                            :
                                            <div className="rainbow-border">
                                                <img
                                                    src="https://pbs.twimg.com/media/E_-yM2JVUAoI0WU.jpg"
                                                    alt="Imagem"
                                                    style={{ width: 250, height: 250, borderRadius: "100%", padding: 20 }}
                                                />
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal para exibir as disponibilidades */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Disponibilidades</h5>
                                <button type="button" className="btn-close" onClick={fecharModal} aria-label="Close"></button>
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
                                        {listaDisponibilidade.map((value, index) => {
                                            // Verifica o formato da data e ajusta conforme necessário
                                            const partesData = value.data.split("/"); // Supondo formato "DD/MM/AAAA"
                                            const dataDisponibilidade = new Date(partesData[2], partesData[1] - 1, partesData[0]); // Ano, Mês (base 0), Dia

                                            const hoje = new Date();
                                            hoje.setSeconds(0);
                                            hoje.setMilliseconds(0);

                                            // Extrair a hora da disponibilidade e configurá-la na data
                                            const [hora, minuto] = value.hora.split(":");
                                            const dataHoraDisponibilidade = new Date(dataDisponibilidade);
                                            dataHoraDisponibilidade.setHours(hora, minuto, 0, 0); // Ajustar para a hora da disponibilidade

                                            const dataPassou = dataHoraDisponibilidade < hoje;

                                            return (
                                                <tr key={index}>
                                                    <td>{value.diaSemana}</td>
                                                    <td>{value.data}</td>
                                                    <td>{value.hora}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => abrirFormModal(value.diaSemana, value.data, value.hora)} // Passando a data correta
                                                            disabled={agendamentoEfetuado || dataPassou}
                                                        >
                                                            Agendar
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para o formulário de agendamento */}
            {showFormModal && selectedSchedule && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="formModalLabel">Agende sua Visita</h5>
                                <button type="button" className="btn-close" onClick={fecharFormModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="nome" className="form-label">Nome</label>
                                        <input ref={nomeCliente} type="text" className="form-control" id="nome" placeholder="Seu nome" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="telefone" className="form-label">Telefone</label>
                                        <input maxLength={11} ref={telCliente} type="tel" className="form-control" id="telefone" placeholder="Seu telefone" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input ref={emailCliente} type="email" className="form-control" id="email" placeholder="Seu email" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="observacao" className="form-label">Observação</label>
                                        <textarea ref={obsCliente} className="form-control" id="observacao" placeholder="Observações" />
                                    </div>
                                    <button type="submit" className="btn btn-primary" onClick={cadastrarAgendamento}>Confirmar Agendamento</button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharFormModal}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
