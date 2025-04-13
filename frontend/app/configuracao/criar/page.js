'use client'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);
import httpClient from '../../utils/httpClient';

export default function SetConfiguracao() {
  const [startDate, setStartDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState({}); // { '2025-04-13': ['08:00', '09:00'] }
  const [statusAtivo, setStatusAtivo] = useState(0); // 0 para 'inativo' e 1 para 'ativo'

  const hours = Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

  // Função para salvar as configurações
  const cadastrarConfig = () => {
    httpClient.post("/configMod/gravar", {
      statusAtivo: statusAtivo, // Envia 0 ou 1 para o backend
      idCorretor: 13
    })
    .then(r => {
      const status = r.status;
      if (status === 200) {
        alert("Configuração criada com sucesso!");
        window.location.href = "/configuracao";
      } else {
        alert("Erro ao criar a configuração.");
      }
    })
    .catch(error => {
      console.error('Erro ao criar configuração:', error);
      alert("Ocorreu um erro ao tentar criar a configuração.");
    });
  };

  // Função para cadastrar a disponibilidade
  const cadastrarDisponibilidade = () => {
    const diaTotal = [];

    if (statusAtivo === 1) {  // Verifica se está ativo (status 1)
      Object.keys(selectedTimes).forEach((dia) => {
        const horasSelecionadas = [];

        // Adiciona as horas selecionadas ao array de horas do dia
        selectedTimes[dia].forEach((selected, index) => {
          if (selected) {
            horasSelecionadas.push(6 + index);  // Adiciona as horas de 6h às 23h
          }
        });

        if (horasSelecionadas.length > 0) {
          diaTotal.push({
            dia,
            horas: horasSelecionadas,
          });
        }
      });

      if (diaTotal.length > 0) {
        console.log("Dados para enviar ao backend:", diaTotal); // Verifique os dados antes de enviar
        httpClient.post('/disponibilidade/gravar', {
          dias: diaTotal,
          idCorretor: 13, // ID do corretor
        })
        .then((response) => {
          alert('Disponibilidade cadastrada com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao salvar a disponibilidade:', error);
          alert('Erro ao salvar a disponibilidade');
        });
      } else {
        alert('Nenhuma disponibilidade selecionada.');
      }
    } else {
      alert('Status desativado. Ative o status para cadastrar a disponibilidade.');
    }
  };

  // Função de alterar o status
  const handleStatusChange = (newStatus) => {
    setStatusAtivo(newStatus === 'ativo' ? 1 : 0); // Define 1 para ativo e 0 para inativo
  };

  const handleDateClick = (date) => {
    setStartDate(date);
    setSelectedDay(date.toISOString().split('T')[0]);
    setShowModal(true);
  };

  const toggleTime = (time) => {
    setSelectedTimes((prev) => {
      const day = selectedDay;
      const current = prev[day] || [];
      const updated = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time];
      return { ...prev, [day]: updated };
    });
  };

  return (
    <div>
      <div className='container'>
        <h1>Configuração do Módulo de Visitas</h1>

        <div className='form form-control' style={{ width: "40%", margin: "auto" }}>
          <div style={{ display: 'column' }}>
            <label>Status:</label><br />
            <button
              onClick={() => handleStatusChange('ativo')}
              style={{
                marginRight: '1rem',
                backgroundColor: statusAtivo === 1 ? '#0d6efd' : '#f1f1f1',
                color: statusAtivo === 1 ? 'white' : 'black',
              }}
              className='btn'
            >
              Ativo
            </button>
            <button
              onClick={() => handleStatusChange('inativo')}
              style={{
                backgroundColor: statusAtivo === 0 ? '#dc3545' : '#f1f1f1',
                color: statusAtivo === 0 ? 'white' : 'black',
              }}
              className='btn'
            >
              Inativo
            </button>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #dee2e6'
            }}
          >
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Calendário:
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleDateClick}
              inline
              locale={'pt-BR'}
            />
          </div>
        </div>

        <button
          onClick={cadastrarConfig}
          className='btn btn-primary'
          style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        >
          Salvar Configuração
        </button>

        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
              <h3>Selecione os horários para {selectedDay}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => toggleTime(hour)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      backgroundColor:
                        selectedTimes[selectedDay]?.includes(hour) ? '#0d6efd' : '#f1f1f1',
                      color: selectedTimes[selectedDay]?.includes(hour) ? 'white' : 'black',
                      cursor: 'pointer'
                    }}
                  >
                    {hour}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className='btn btn-secondary'
                style={{ marginTop: '1rem', marginRight: 20 }}
              >
                Fechar
              </button>

              <button
                onClick={cadastrarDisponibilidade}
                className='btn btn-success'
                style={{ marginTop: '1rem' }}
              >
                Salvar Disponibilidade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
