'use client'
import { useEffect, useState } from "react";
import httpClient from '@/app/utils/httpClient';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [listaImoveis, setListaImoveis] = useState([]);
    const router = useRouter();

    function listarImoveis() {
        httpClient.get("/imovel/listar")
            .then(r => r.json())
            .then(r => setListaImoveis(r));
    }

    useEffect(() => {
        listarImoveis();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Tela dos imóveis</h1>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center', // Centraliza os cards dentro do container
                    margin: '0 auto',
                    maxWidth: '1400px',        // Maior largura para suportar os cards maiores
                    gap: '20px',               // Espaço uniforme entre os cards
                }}
            >
                {listaImoveis.map((value, index) => (
                    <div
                        key={index}
                        onClick={() => router.push(`/imoveis/${value.idImovel}`)}
                        className="card"
                        style={{
                            width: '22%',           // Aumenta o tamanho dos cards (cabe 4 por linha)
                            cursor: 'pointer',
                        }}
                    >
                        <img style={{ maxHeight: '200px', minHeight: '200px' }} src={value.foto} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <p className="card-text">{value.descImovel}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
