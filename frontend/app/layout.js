'use client'
import { Nunito } from 'next/font/google';
import '../public/template/css/styles.css'
import '../public/template/css/styles.css'

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={nunito.className}>
        <main className="flex-shrink-0">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container px-5">
              <a className="navbar-brand" href="/">Projeto Hackaton</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Alternar navegação"><span className="navbar-toggler-icon"></span></button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item"><a className="nav-link" href="/configuracao">Configurações do Módulo/CRM</a></li>
                  <li className="nav-item"><a className="nav-link" href="/">Site do cliente</a></li>
                  <li className="nav-item"><a className="nav-link" href="/negocios">Aba de Negócios</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </main>

        <div className="container-fluid">
          <div style={{ minHeight: 800 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
