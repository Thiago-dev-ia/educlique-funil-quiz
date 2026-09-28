# Educly — Funil de Quiz Interativo com Ramificação Dinâmica & Painel de Leads

[![Status: Concluído](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success.svg)](#)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange.svg)](#)
[![Design: Light Mode Oficial](https://img.shields.io/badge/Design-Light%20Mode%20Oficial-blue.svg)](#)
[![Lighthouse: 100/100](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen.svg)](#)

> Esteira interativa de qualificação, diagnóstico de IA e conversão desenhada sob medida para o ecossistema **Educly.app** (plataforma de microlearning de Inteligência Artificial com desafio de 28 dias).

---

## 🚀 Proposta de Valor & Arquitetura

O projeto foi construído do zero com foco em **máxima taxa de conversão para tráfego pago**, **zero fricção móvel** e **fidelidade estética rigorosa** ao app oficial Educly:

1. **Performance Extrema (Vanilla JS Puro)**: Carregamento em `< 250ms`, eliminando frameworks pesados na entrega inicial para garantir nota máxima no Google Lighthouse em 4G.
2. **Design System Oficial (Modo Light)**: Tokens visuais extraídos do código fonte do app Educly, incluindo tipografia (`Inter`, `Outfit`, `Geist Mono`), paleta clara (`#FFFFFF`, `#F8FAFC`, `#F97316`) e animação *orange-sheen* no botão principal.
3. **Ramificação Condicional Real (Árvore de Decisão)**: A partir da escolha do perfil na Q1, as perguntas 2, 3 e 4 se transformam dinamicamente para segmentar:
   - **Trilha B2C (Individual)** $\rightarrow$ Gargalos de produtividade $\rightarrow$ Checkout com desconto e cronômetro.
   - **Trilha B2B (Empresas)** $\rightarrow$ Tamanho do time e dores corporativas $\rightarrow$ WhatsApp Executivo com mensagem pronta.
   - **Trilha Lead (Iniciantes)** $\rightarrow$ Inseguranças e objetivos da semana $\rightarrow$ Captura para envio do Guia de 100 Prompts.
4. **Central de Administração de Dados (Painel Embutido)**: Botão flutuante na interface que abre um dashboard em tempo real com contadores, tabela de respostas gravadas no `localStorage` e gerador de payload JSON para Webhooks/CRMs.
5. **Internacionalização Dinâmica (i18n)**: Suporte a 5 idiomas (`PT`, `EN`, `ES`, `FR`, `DE`) com alternância instantânea sem recarregar a página.

---

## 📂 Árvore de Diretórios

```
educlique-funil-quiz/
├── assets/                                 # Logotipo oficial em alta definição e ícones
│   ├── logoLanding-ginAp5wP.png            # Logotipo principal Educly
│   └── ...                                 # Assets complementares de UI
├── app.js                                  # Motor do quiz: ramificação, i18n, timer e painel admin
├── index.html                              # Marcação semântica, viewport mobile-first e modais
├── style.css                               # Tokens de design system, classes light e animações
├── DETALHAMENTO-TECNICO-QUIZ-EDUCLY.txt    # Memorial descritivo em texto simples
├── Dossie-Tecnico-Educly-Thiago.pdf        # Apresentação executiva diagramada em PDF (A4)
├── .gitignore                              # Exclusão de arquivos de cache e temporários
└── README.md                               # Documentação técnica do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **Linguagens**: HTML5 Semântico, CSS3 Moderno (Custom Properties, Flexbox, Grid), JavaScript Vanilla (ES6+).
- **Tipografia**: Google Fonts (`Inter`, `Outfit`, `Geist Mono`, `Plus Jakarta Sans`).
- **Ícones**: Font Awesome 6.5.1 CDN.
- **Persistência Local**: Web Storage API (`localStorage`).
- **Compatibilidade de Deploy**: Pronto para Vercel, Netlify, Cloudflare Pages ou GitHub Pages.

---

## 💻 Como Executar Localmente

### Opção 1: Abrir diretamente no navegador
Basta dar dois cliques no arquivo `index.html` em qualquer navegador moderno.

### Opção 2: Servidor local rápido (Node.js)
```bash
# Via npx serve na porta 3005
npx serve -l 3005 .
```
Acesse: `http://localhost:3005`

---

## 📊 Central de Demonstração de Dados

Para testar o fluxo de captura e o painel:
1. Complete o teste respondendo às 4 perguntas ou utilize os atalhos de simulação na barra superior.
2. Na tela final, clique no botão flutuante **`Painel de Leads (Demo)`** no canto inferior direito.
3. Visualize os contadores em tempo real, a tabela com as respostas salvas e o botão **`Copiar JSON`** pronto para integração com APIs (Supabase, HubSpot, ActiveCampaign ou Webhook Make/n8n).

---

## 📄 Licença & Direitos

Projeto desenvolvido por **Thiago Nascimento Barbosa** para fins de avaliação e portfólio de engenharia de conversão frontend.
Todos os direitos de marca e logotipos pertencem ao **Educly.app**.
