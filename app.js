// =========================================================================
// EDUCLY.APP — ENGINE DO FUNIL INTERATIVO COM RAMIFICAÇÃO DINÂMICA REAL
// 100% Vanilla JS • Zero Dependências • Persistência LocalStorage • Painel Admin
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Estado Global da Aplicação
  let currentLang = 'pt';
  let currentStep = 0; // 0 = intro, 1..4 = perguntas ramificadas, 5 = processing, 6 = resultado
  let branchProfile = null; // 'b2c' | 'b2b' | 'lead'
  let forcedMode = 'auto'; // 'auto' | 'checkout' | 'whatsapp' | 'lead'
  
  // Respostas coletadas
  const sessionData = {
    startedAt: new Date().toISOString(),
    profile: null,
    answers: {},
    resultType: null,
    leadInfo: null
  };

  // -------------------------------------------------------------------------
  // ARQUITETURA DE PERGUNTAS RAMIFICADAS (Árvore Condicional Real)
  // -------------------------------------------------------------------------
  const quizTree = {
    // Pergunta 1: Comum a todos (Define a ramificação)
    q1: {
      pt: {
        eyebrow: 'Etapa 1 de 4 • Ponto de Partida',
        title: 'Qual é o seu objetivo principal com Inteligência Artificial hoje?',
        desc: 'Sua resposta calibrará a trilha de micro-aulas e as ferramentas práticas prioritárias:',
        options: [
          {
            id: 'b2c',
            icon: 'fa-user-astronaut',
            title: 'Acelerar Minha Rotina & Carreira Individual',
            sub: 'Quero dominar ChatGPT, Claude e Prompts para economizar até 20 horas por semana em tarefas pessoais e profissionais.',
            branch: 'b2c'
          },
          {
            id: 'b2b',
            icon: 'fa-building',
            title: 'Capacitar Minha Equipe / Empresa (B2B)',
            sub: 'Quero treinar meus colaboradores, gestores ou equipe para multiplicar a produtividade do negócio com IA.',
            branch: 'b2b'
          },
          {
            id: 'lead',
            icon: 'fa-seedling',
            title: 'Sou Iniciante e Quero Começar do Zero com Segurança',
            sub: 'Ainda me sinto inseguro ou perdido com tantas ferramentas e quero um material básico, direto e mastigado.',
            branch: 'lead'
          }
        ]
      },
      en: {
        eyebrow: 'Step 1 of 4 • Starting Point',
        title: 'What is your main goal with Artificial Intelligence today?',
        desc: 'Your answer will tailor your daily micro-lessons and key practical tools:',
        options: [
          {
            id: 'b2c',
            icon: 'fa-user-astronaut',
            title: 'Boost My Individual Routine & Career',
            sub: 'Master ChatGPT, Claude and Prompts to save up to 20 hours/week on personal and work tasks.',
            branch: 'b2c'
          },
          {
            id: 'b2b',
            icon: 'fa-building',
            title: 'Train My Team / Company (B2B)',
            sub: 'Upskill employees and managers to scale business productivity with AI workflows.',
            branch: 'b2b'
          },
          {
            id: 'lead',
            icon: 'fa-seedling',
            title: 'I am a Beginner and Want to Start Safely',
            sub: 'Feeling overwhelmed by so many tools and want simple, step-by-step guidance.',
            branch: 'lead'
          }
        ]
      },
      es: {
        eyebrow: 'Paso 1 de 4 • Punto de Partida',
        title: '¿Cuál es tu objetivo principal con la Inteligencia Artificial hoy?',
        desc: 'Tu respuesta calibrará el itinerario de microlecciones y las herramientas clave:',
        options: [
          {
            id: 'b2c',
            icon: 'fa-user-astronaut',
            title: 'Acelerar Mi Rutina y Carrera Individual',
            sub: 'Dominar ChatGPT, Claude y Prompts para ahorrar hasta 20 horas por semana.',
            branch: 'b2c'
          },
          {
            id: 'b2b',
            icon: 'fa-building',
            title: 'Capacitar a Mi Equipo / Empresa (B2B)',
            sub: 'Formar a colaboradores y directivos para multiplicar la productividad empresarial con IA.',
            branch: 'b2b'
          },
          {
            id: 'lead',
            icon: 'fa-seedling',
            title: 'Soy Principiante y Quiero Empezar desde Cero',
            sub: 'Me siento confundido con tantas herramientas y busco una guía sencilla y directa.',
            branch: 'lead'
          }
        ]
      },
      fr: {
        eyebrow: 'Étape 1 sur 4 • Point de Départ',
        title: 'Quel est votre objectif principal avec l\'Intelligence Artificielle ?',
        desc: 'Votre réponse adaptera vos micro-leçons quotidiennes et les outils prioritaires :',
        options: [
          {
            id: 'b2c',
            icon: 'fa-user-astronaut',
            title: 'Accélérer ma Routine et ma Carrière Individuelle',
            sub: 'Maîtriser ChatGPT, Claude et les Prompts pour économiser jusqu\'à 20 heures par semaine.',
            branch: 'b2c'
          },
          {
            id: 'b2b',
            icon: 'fa-building',
            title: 'Former Mon Équipe / Entreprise (B2B)',
            sub: 'Former collaborateurs et managers pour décupler la productivité de l\'entreprise.',
            branch: 'b2b'
          },
          {
            id: 'lead',
            icon: 'fa-seedling',
            title: 'Je Suis Débutant et Souhaite Démarrer de Zéro',
            sub: 'Je me sens perdu avec tant d\'outils et je souhaite un guide simple et structuré.',
            branch: 'lead'
          }
        ]
      },
      de: {
        eyebrow: 'Schritt 1 von 4 • Ausgangspunkt',
        title: 'Was ist Ihr Hauptziel mit Künstlicher Intelligenz heute?',
        desc: 'Ihre Antwort passt Ihre täglichen Mikrolektionen und praktischen Werkzeuge an:',
        options: [
          {
            id: 'b2c',
            icon: 'fa-user-astronaut',
            title: 'Meine individuelle Routine & Karriere beschleunigen',
            sub: 'ChatGPT, Claude und Prompts beherrschen, um bis zu 20 Stunden pro Woche zu sparen.',
            branch: 'b2c'
          },
          {
            id: 'b2b',
            icon: 'fa-building',
            title: 'Mein Team / Unternehmen weiterbilden (B2B)',
            sub: 'Mitarbeiter und Führungskräfte schulen, um die Produktivität mit KI zu multiplizieren.',
            branch: 'b2b'
          },
          {
            id: 'lead',
            icon: 'fa-seedling',
            title: 'Ich bin Anfänger und möchte sicher bei Null anfangen',
            sub: 'Überwältigt von zu vielen Tools – ich möchte eine einfache, direkte Anleitung.',
            branch: 'lead'
          }
        ]
      }
    },

    // RAMIFICAÇÃO 1: VERTENTE B2C (Foco: Produtividade Individual, Ferramentas, Ritmo)
    b2c: [
      {
        id: 'b2c_q2',
        pt: {
          eyebrow: 'Etapa 2 de 4 • Gargalo de Produtividade',
          title: 'Qual tarefa manual mais consome o seu tempo no trabalho hoje?',
          desc: 'Identificamos os pontos críticos que o Educly vai automatizar nas primeiras 48h:',
          options: [
            { id: 'reports', icon: 'fa-file-alt', title: 'Redação de relatórios, resumos e e-mails longos', sub: 'Passo horas ajustando tom de voz, estruturando ideias e revisando textos.' },
            { id: 'spreadsheets', icon: 'fa-table', title: 'Análise de planilhas e conferência de dados', sub: 'Dificuldade para cruzar tabelas, criar fórmulas complexas e extrair insights.' },
            { id: 'content', icon: 'fa-bullhorn', title: 'Criação de conteúdo, posts e apresentações visuais', sub: 'Bloqueio criativo constante e lentidão para produzir roteiros e designs.' },
            { id: 'research', icon: 'fa-search', title: 'Pesquisa aprofundada e triagem de documentos', sub: 'Muito tempo lendo PDFs longos e procurando respostas pontuais.' }
          ]
        },
        en: {
          eyebrow: 'Step 2 of 4 • Productivity Bottleneck',
          title: 'Which manual task takes up most of your time at work today?',
          desc: 'We identify key friction points that Educly automates within the first 48 hours:',
          options: [
            { id: 'reports', icon: 'fa-file-alt', title: 'Writing reports, summaries and lengthy emails', sub: 'Hours spent fine-tuning tone, organizing thoughts and editing drafts.' },
            { id: 'spreadsheets', icon: 'fa-table', title: 'Spreadsheet analysis and data validation', sub: 'Struggling with formulas, data joins and extracting fast insights.' },
            { id: 'content', icon: 'fa-bullhorn', title: 'Content creation, social posts and presentations', sub: 'Creative blocks and sluggish production of scripts and visual decks.' },
            { id: 'research', icon: 'fa-search', title: 'Deep web research and document screening', sub: 'Too much time reading lengthy PDFs and finding pinpoint answers.' }
          ]
        }
      },
      {
        id: 'b2c_q3',
        pt: {
          eyebrow: 'Etapa 3 de 4 • Ferramentas de Interesse',
          title: 'Qual ecossistema de IA você mais precisa dominar na prática?',
          desc: 'O método Educly foca em aplicações práticas imediatas:',
          options: [
            { id: 'chatgpt_claude', icon: 'fa-robot', title: 'ChatGPT Plus & Claude 3.5 Sonnet', sub: 'Prompts avançados, raciocínio lógico profundo e automações de texto.' },
            { id: 'midjourney', icon: 'fa-palette', title: 'Midjourney & Geração Visual de Alta Fidelidade', sub: 'Imagens hiper-realistas para marcas, campanhas e materiais publicitários.' },
            { id: 'gemini_google', icon: 'fa-google', title: 'Google Gemini integrado ao Workspace', sub: 'Conexão nativa com Docs, Sheets, Drive e fluxos corporativos.' },
            { id: 'all_round', icon: 'fa-layer-group', title: 'Visão Geral Completa de Todas as Ferramentas', sub: 'Quero saber exatamente quando usar cada uma sem perder tempo.' }
          ]
        },
        en: {
          eyebrow: 'Step 3 of 4 • Target Tools',
          title: 'Which AI ecosystem do you need to master most urgently?',
          desc: 'The Educly method focuses on immediate hands-on practice:',
          options: [
            { id: 'chatgpt_claude', icon: 'fa-robot', title: 'ChatGPT Plus & Claude 3.5 Sonnet', sub: 'Advanced prompts, deep reasoning and automated text workflows.' },
            { id: 'midjourney', icon: 'fa-palette', title: 'Midjourney & High-Fidelity Visual Generation', sub: 'Hyper-realistic assets for brand, campaigns and presentation decks.' },
            { id: 'gemini_google', icon: 'fa-google', title: 'Google Gemini integrated into Workspace', sub: 'Native sync with Docs, Sheets, Drive and corporate workflows.' },
            { id: 'all_round', icon: 'fa-layer-group', title: 'Comprehensive 360° Multi-Tool Overview', sub: 'Know precisely which tool to pick without wasting minutes.' }
          ]
        }
      },
      {
        id: 'b2c_q4',
        pt: {
          eyebrow: 'Etapa 4 de 4 • Ritmo & Comprometimento',
          title: 'Quanto tempo diário você pode dedicar ao Desafio de 28 Dias?',
          desc: 'Todas as lições são micro-learning pensadas para quem tem rotina corrida:',
          options: [
            { id: '15min', icon: 'fa-coffee', title: '15 minutos por dia (Ritmo Ideal do App)', sub: '1 micro-aula prática pelo celular durante o café ou trajeto.' },
            { id: '30min', icon: 'fa-laptop-code', title: '30 minutos por dia (Aplicação Imediata)', sub: 'Estudo e aplicação simultânea nos seus projetos no computador.' },
            { id: 'turbo', icon: 'fa-fire', title: '1 hora ou mais por dia (Modo Turbo)', sub: 'Quero finalizar o desafio e receber a certificação no menor tempo possível.' }
          ]
        },
        en: {
          eyebrow: 'Step 4 of 4 • Rhythm & Commitment',
          title: 'How much daily time can you commit to the 28-Day Challenge?',
          desc: 'All lessons are micro-learning designed for busy working professionals:',
          options: [
            { id: '15min', icon: 'fa-coffee', title: '15 minutes per day (Official App Pace)', sub: '1 practical bite-sized lesson on mobile over coffee or commute.' },
            { id: '30min', icon: 'fa-laptop-code', title: '30 minutes per day (Direct Work Application)', sub: 'Hands-on practice directly inside your current workplace projects.' },
            { id: 'turbo', icon: 'fa-fire', title: '1 hour or more per day (Turbo Speed)', sub: 'Complete the track and claim the official certificate ASAP.' }
          ]
        }
      }
    ],

    // RAMIFICAÇÃO 2: VERTENTE B2B (Foco: Empresas, Equipes, Gargalos Corporativos)
    b2b: [
      {
        id: 'b2b_q2',
        pt: {
          eyebrow: 'Etapa 2 de 4 • Porte Corporativo',
          title: 'Quantos colaboradores você pretende capacitar com IA?',
          desc: 'Isso determina o pacote de licenças e a esteira de acompanhamento executivo:',
          options: [
            { id: 'small', icon: 'fa-users', title: 'Pequena Equipe (3 a 10 colaboradores)', sub: 'Capacitação rápida para setores-chave como Marketing, Vendas e Suporte.' },
            { id: 'medium', icon: 'fa-user-friends', title: 'Média Empresa (11 a 50 colaboradores)', sub: 'Múltiplos setores integrando ferramentas de produtividade e IA generativa.' },
            { id: 'enterprise', icon: 'fa-city', title: 'Grande Porte (Mais de 50 colaboradores)', sub: 'Governança de IA, segurança de dados corporativos e métricas de ROI.' }
          ]
        },
        en: {
          eyebrow: 'Step 2 of 4 • Organization Size',
          title: 'How many team members do you intend to upskill with AI?',
          desc: 'This calculates enterprise tier licenses and executive tracking seats:',
          options: [
            { id: 'small', icon: 'fa-users', title: 'Small Squad (3 to 10 team members)', sub: 'Fast upskilling for core squads like Marketing, Sales and Operations.' },
            { id: 'medium', icon: 'fa-user-friends', title: 'Mid-Sized Team (11 to 50 team members)', sub: 'Multiple departments integrating genAI and shared workflow templates.' },
            { id: 'enterprise', icon: 'fa-city', title: 'Enterprise (50+ team members)', sub: 'AI governance, enterprise data privacy and measurable ROI dashboards.' }
          ]
        }
      },
      {
        id: 'b2b_q3',
        pt: {
          eyebrow: 'Etapa 3 de 4 • Gargalo Operacional',
          title: 'Qual é o maior desafio atual da sua equipe em relação à IA?',
          desc: 'Direcionaremos a demonstração do Educly Enterprise para a sua dor real:',
          options: [
            { id: 'lack_standard', icon: 'fa-exclamation-triangle', title: 'Falta de padrão e segurança no uso de IA', sub: 'Cada funcionário usa ferramentas por conta própria sem diretrizes ou prompts validados.' },
            { id: 'slow_onboarding', icon: 'fa-stopwatch', title: 'Lentidão em entregas e rotinas operacionais repetitivas', sub: 'O time gasta muito tempo em tarefas mecânicas que a IA resolveria em segundos.' },
            { id: 'resistance', icon: 'fa-user-shield', title: 'Resistência cultural e medo da tecnologia', sub: 'Colaboradores receosos ou sem saber como aplicar a IA na rotina diária.' }
          ]
        },
        en: {
          eyebrow: 'Step 3 of 4 • Operational Pain',
          title: 'What is your team’s single biggest hurdle regarding AI adoption?',
          desc: 'We will target the executive Educly Enterprise demo directly at your bottleneck:',
          options: [
            { id: 'lack_standard', icon: 'fa-exclamation-triangle', title: 'No governance or standardized prompt guidelines', sub: 'Staff using ad-hoc tools without corporate data guardrails or proven templates.' },
            { id: 'slow_onboarding', icon: 'fa-stopwatch', title: 'Slow delivery on repetitive operational routines', sub: 'Team bogged down by mechanical work that AI can streamline instantly.' },
            { id: 'resistance', icon: 'fa-user-shield', title: 'Cultural friction and anxiety towards new tech', sub: 'Employees unsure how to practically weave AI into daily tasks.' }
          ]
        }
      },
      {
        id: 'b2b_q4',
        pt: {
          eyebrow: 'Etapa 4 de 4 • Formato de Implementação',
          title: 'Qual modelo de capacitação corporativa é mais viável para vocês?',
          desc: 'O Educly oferece implementação sob medida com painel de progresso:',
          options: [
            { id: 'self_paced', icon: 'fa-mobile-screen', title: 'Acesso por App Individual com Painel de Gestão de RH', sub: 'Cada colaborador faz suas 15 min diárias no celular com métricas para a liderança.' },
            { id: 'hybrid', icon: 'fa-chalkboard-teacher', title: 'Treinamento Híbrido (Workshop ao Vivo + Desafio 28 Dias)', sub: 'Sessão prática de abertura com especialista Educly seguida do desafio no app.' },
            { id: 'custom_prompts', icon: 'fa-sliders', title: 'Customização de Biblioteca de Prompts Exclusivos da Empresa', sub: 'Desenvolvimento de prompts proprietários adaptados aos processos internos.' }
          ]
        },
        en: {
          eyebrow: 'Step 4 of 4 • Deployment Format',
          title: 'Which corporate rollout model best fits your company schedule?',
          desc: 'Educly offers tailored deployment with centralized tracking dashboards:',
          options: [
            { id: 'self_paced', icon: 'fa-mobile-screen', title: 'Individual App Seats with Manager/HR Analytics', sub: 'Each staff member completes 15 min/day with team completion metrics.' },
            { id: 'hybrid', icon: 'fa-chalkboard-teacher', title: 'Hybrid Onboarding (Live Kickoff + 28-Day App Access)', sub: 'Hands-on live kickoff with an Educly strategist followed by app tracks.' },
            { id: 'custom_prompts', icon: 'fa-sliders', title: 'Proprietary Company Prompt Repository Buildout', sub: 'Custom workflows and tailored prompt vaults mapped to internal operations.' }
          ]
        }
      }
    ],

    // RAMIFICAÇÃO 3: VERTENTE INICIANTE / LEAD CAPTURE (Foco: Desmistificação, Segurança, Guia Prático)
    lead: [
      {
        id: 'lead_q2',
        pt: {
          eyebrow: 'Etapa 2 de 4 • Nível de Conforto',
          title: 'Qual é o seu maior receio ou dúvida ao usar ferramentas de IA?',
          desc: 'Vamos personalizar o seu Guia de Prompts para eliminar essa insegurança:',
          options: [
            { id: 'complex_prompts', icon: 'fa-comments', title: 'Não sei como escrever o prompt para ter boas respostas', sub: 'Sinto que o ChatGPT só me devolve textos robóticos ou superficiais.' },
            { id: 'privacy', icon: 'fa-lock', title: 'Medo de errar, expor dados ou parecer desatualizado', sub: 'Preocupação com segurança da informação e precisão das respostas.' },
            { id: 'many_tools', icon: 'fa-compass', title: 'Não sei qual ferramenta usar para cada situação', sub: 'ChatGPT, Gemini, Claude, Copilot... é muita novidade ao mesmo tempo.' }
          ]
        },
        en: {
          eyebrow: 'Step 2 of 4 • Comfort Level',
          title: 'What is your biggest concern when working with AI tools?',
          desc: 'We will curate your 100 Prompts Guide to dissolve this friction immediately:',
          options: [
            { id: 'complex_prompts', icon: 'fa-comments', title: 'I do not know how to prompt for high-quality answers', sub: 'Responses feel robotic, generic or unhelpful for my real problems.' },
            { id: 'privacy', icon: 'fa-lock', title: 'Fear of making mistakes or feeling left behind', sub: 'Worries about factual accuracy, data privacy and modern relevance.' },
            { id: 'many_tools', icon: 'fa-compass', title: 'Uncertain which tool fits each specific scenario', sub: 'ChatGPT, Gemini, Claude, Copilot... too many tools launching weekly.' }
          ]
        }
      },
      {
        id: 'lead_q3',
        pt: {
          eyebrow: 'Etapa 3 de 4 • Experiência Anterior',
          title: 'Você já tentou fazer outros cursos ou tutoriais na internet antes?',
          desc: 'Entender seu histórico nos ajuda a entregar a experiência certa:',
          options: [
            { id: 'gave_up', icon: 'fa-times-circle', title: 'Sim, mas desisti por serem muito longos e teóricos', sub: 'Aulas cansativas de 40 minutos em vídeo que não ensinam o que fazer na prática.' },
            { id: 'youtube', icon: 'fa-play', title: 'Só vi vídeos soltos no YouTube ou TikTok', sub: 'Conteúdos fragmentados que não formam uma base estruturada de aprendizado.' },
            { id: 'never', icon: 'fa-sparkles', title: 'Nunca fiz nenhum curso. O Educly será o meu primeiro', sub: 'Quero um método confiável e direto ao ponto para começar do jeito certo.' }
          ]
        },
        en: {
          eyebrow: 'Step 3 of 4 • Past Experience',
          title: 'Have you attempted other courses or internet tutorials before?',
          desc: 'Understanding your background ensures we deliver the exact right experience:',
          options: [
            { id: 'gave_up', icon: 'fa-times-circle', title: 'Yes, but dropped out because they were too long and theoretical', sub: 'Tedious 40-minute lectures that never showed real everyday workflows.' },
            { id: 'youtube', icon: 'fa-play', title: 'Only watched scattered YouTube or social media clips', sub: 'Fragmented tips that failed to provide a cohesive learning path.' },
            { id: 'never', icon: 'fa-sparkles', title: 'Never taken any course. Educly will be my first', sub: 'I want a trusted, structured, bite-sized foundation right from day one.' }
          ]
        }
      },
      {
        id: 'lead_q4',
        pt: {
          eyebrow: 'Etapa 4 de 4 • Primeiro Aprendizado Desejado',
          title: 'O que você mais gostaria de conseguir fazer já nesta semana com IA?',
          desc: 'Vamos destacar isso no seu resumo de diagnóstico gratuito:',
          options: [
            { id: 'instant_emails', icon: 'fa-envelope-open-text', title: 'Responder mensagens e escrever e-mails profissionais em segundos', sub: 'Acabar com a procrastinação na frente da tela em branco.' },
            { id: 'summarize_docs', icon: 'fa-file-invoice', title: 'Resumir artigos, livros e documentos longos com precisão', sub: 'Extrair tópicos cruciais sem precisar ler centenas de páginas.' },
            { id: 'organize_ideas', icon: 'fa-lightbulb', title: 'Organizar ideias, metas e planejar minha rotina com clareza', sub: 'Usar a IA como um mentor pessoal de produtividade e foco.' }
          ]
        },
        en: {
          eyebrow: 'Step 4 of 4 • Instant Milestone',
          title: 'What would you like to achieve using AI this very week?',
          desc: 'We will highlight this practical quick-win in your free diagnostic report:',
          options: [
            { id: 'instant_emails', icon: 'fa-envelope-open-text', title: 'Draft crisp emails and messages in seconds', sub: 'End blank-screen procrastination when typing to colleagues and clients.' },
            { id: 'summarize_docs', icon: 'fa-file-invoice', title: 'Summarize articles and long documents accurately', sub: 'Distill critical takeaways without reading hundreds of dense pages.' },
            { id: 'organize_ideas', icon: 'fa-lightbulb', title: 'Structure ideas and organize weekly goals with clarity', sub: 'Use AI as a personal productivity and brainstorming sparring partner.' }
          ]
        }
      }
    ]
  };

  // -------------------------------------------------------------------------
  // DICIONÁRIO DE TRADUÇÃO DAS TELAS ESTÁTICAS E LABELS
  // -------------------------------------------------------------------------
  const i18n = {
    pt: {
      langLabel: 'PT',
      simLabel: 'Trilha Ativa:',
      simAuto: 'Ramificação Dinâmica',
      simB2c: '1. Trilha B2C (Checkout)',
      simB2b: '2. Trilha B2B (WhatsApp)',
      simLead: '3. Trilha Lead (Guia)',
      introBadge: 'DESAFIO DE 28 DIAS DE IA',
      introTitle: 'Descubra qual é o seu <span class="highlight-orange">nível real de IA</span> e quanto tempo você pode economizar.',
      introLead: 'Faça o teste prático de 2 minutos para receber seu plano guiado de micro-lições diárias de 15 minutos com <strong>ChatGPT, Claude, Gemini, Midjourney</strong> e automações de fluxos de trabalho no Educly.',
      introProof: '<strong>Mais de 50.000 alunos</strong> em 150 países já transformaram suas rotinas de trabalho com o método Educly.',
      chip1: '<i class="fas fa-clock text-orange"></i> 15 min por dia',
      chip2: '<i class="fas fa-certificate text-orange"></i> Certificado Oficial',
      chip3: '<i class="fas fa-mobile-alt text-orange"></i> Prática Direto no App',
      btnStart: 'COMEÇAR TESTE DE NÍVEL',
      introSecure: '<i class="fas fa-lock"></i> Avaliação confidencial • Resultado imediato na tela',
      procH3: 'Montando sua Trilha Educly...',
      procP: 'Calculando seu nível de maturidade em IA e gerando sua projeção de economia de horas.',
      proc1: 'Analisando perfil e área de atuação...',
      proc2: 'Selecionando os prompts e templates prioritários...',
      proc3: 'Gerando plano de 28 dias personalizado...',
      stepProgress: 'Pergunta {step} de 4',
      stepCalib: 'Calibragem Educly'
    },
    en: {
      langLabel: 'EN',
      simLabel: 'Active Track:',
      simAuto: 'Dynamic Branching',
      simB2c: '1. B2C Track (Checkout)',
      simB2b: '2. B2B Track (WhatsApp)',
      simLead: '3. Lead Track (Free Guide)',
      introBadge: '28-DAY AI CHALLENGE',
      introTitle: 'Discover your <span class="highlight-orange">real AI level</span> and how many hours you can save.',
      introLead: 'Take the 2-minute hands-on diagnostic to unlock your 15-minute daily micro-lessons with <strong>ChatGPT, Claude, Gemini, Midjourney</strong> and workflows on Educly.',
      introProof: '<strong>Over 50,000 learners</strong> across 150 countries have upgraded their work skills with the Educly method.',
      chip1: '<i class="fas fa-clock text-orange"></i> 15 min per day',
      chip2: '<i class="fas fa-certificate text-orange"></i> Official Certificate',
      chip3: '<i class="fas fa-mobile-alt text-orange"></i> Hands-on in App',
      btnStart: 'START LEVEL TEST',
      introSecure: '<i class="fas fa-lock"></i> Confidential assessment • Instant on-screen report',
      procH3: 'Building your Educly Track...',
      procP: 'Calculating AI maturity score and projecting weekly time savings.',
      proc1: 'Analyzing role and operational friction...',
      proc2: 'Curating target prompts and templates...',
      proc3: 'Assembling customized 28-day challenge...',
      stepProgress: 'Question {step} of 4',
      stepCalib: 'Educly Calibration'
    },
    es: {
      langLabel: 'ES',
      simLabel: 'Ruta Activa:',
      simAuto: 'Ramificación Dinámica',
      simB2c: '1. Ruta B2C (Checkout)',
      simB2b: '2. Ruta B2B (WhatsApp)',
      simLead: '3. Ruta Lead (Guía Gratis)',
      introBadge: 'RETO DE 28 DÍAS DE IA',
      introTitle: 'Descubre tu <span class="highlight-orange">nivel real de IA</span> y cuántas horas puedes ahorrar.',
      introLead: 'Realiza el test práctico de 2 minutos para recibir tu plan de microlecciones de 15 minutos diarios con <strong>ChatGPT, Claude, Gemini, Midjourney</strong> en Educly.',
      introProof: '<strong>Más de 50.000 alumnos</strong> en 150 países ya han transformado su productividad con Educly.',
      chip1: '<i class="fas fa-clock text-orange"></i> 15 min al día',
      chip2: '<i class="fas fa-certificate text-orange"></i> Certificado Oficial',
      chip3: '<i class="fas fa-mobile-alt text-orange"></i> Práctica en la App',
      btnStart: 'EMPEZAR TEST DE NIVEL',
      introSecure: '<i class="fas fa-lock"></i> Evaluación confidencial • Resultado inmediato en pantalla',
      procH3: 'Construyendo tu Ruta Educly...',
      procP: 'Calculando tu nivel de madurez en IA y tu ahorro proyectado.',
      proc1: 'Analizando perfil y prioridades...',
      proc2: 'Seleccionando prompts y plantillas clave...',
      proc3: 'Generando tu reto de 28 días personalizado...',
      stepProgress: 'Pregunta {step} de 4',
      stepCalib: 'Calibración Educly'
    },
    fr: {
      langLabel: 'FR',
      simLabel: 'Parcours Actif :',
      simAuto: 'Branchement Dynamique',
      simB2c: '1. B2C (Commande)',
      simB2b: '2. B2B (WhatsApp)',
      simLead: '3. Lead (Guide Gratuit)',
      introBadge: 'DÉFI IA DE 28 JOURS',
      introTitle: 'Découvrez votre <span class="highlight-orange">vrai niveau en IA</span> et le temps que vous pouvez économiser.',
      introLead: 'Faites le test de 2 minutes pour obtenir votre plan de micro-leçons quotidiennes de 15 minutes avec <strong>ChatGPT, Claude, Gemini, Midjourney</strong>.',
      introProof: '<strong>Plus de 50 000 apprenants</strong> dans 150 pays ont perfectionné leurs compétences avec Educly.',
      chip1: '<i class="fas fa-clock text-orange"></i> 15 min par jour',
      chip2: '<i class="fas fa-certificate text-orange"></i> Certificat Officiel',
      chip3: '<i class="fas fa-mobile-alt text-orange"></i> Pratique sur l\'App',
      btnStart: 'COMMENCER LE TEST',
      introSecure: '<i class="fas fa-lock"></i> Évaluation confidentielle • Résultat instantané',
      procH3: 'Création de votre parcours Educly...',
      procP: 'Calcul de votre score de maturité en IA et projection des gains de temps.',
      proc1: 'Analyse du profil et des besoins...',
      proc2: 'Sélection des prompts et modèles prioritaires...',
      proc3: 'Génération du plan de 28 jours...',
      stepProgress: 'Question {step} sur 4',
      stepCalib: 'Calibrage Educly'
    },
    de: {
      langLabel: 'DE',
      simLabel: 'Aktiver Pfad:',
      simAuto: 'Dynamische Verzweigung',
      simB2c: '1. B2C (Checkout)',
      simB2b: '2. B2B (WhatsApp)',
      simLead: '3. Lead (Leitfaden)',
      introBadge: '28-TAGE KI-CHALLENGE',
      introTitle: 'Finden Sie Ihr <span class="highlight-orange">wahres KI-Niveau</span> heraus und wie viel Zeit Sie sparen können.',
      introLead: 'Machen Sie den 2-minütigen Test für Ihren Plan täglicher 15-Minuten-Mikrolektionen mit <strong>ChatGPT, Claude, Gemini, Midjourney</strong>.',
      introProof: '<strong>Über 50.000 Teilnehmer</strong> in 150 Ländern nutzen die Educly-Methode.',
      chip1: '<i class="fas fa-clock text-orange"></i> 15 Min pro Tag',
      chip2: '<i class="fas fa-certificate text-orange"></i> Offizielles Zertifikat',
      chip3: '<i class="fas fa-mobile-alt text-orange"></i> Praxis in der App',
      btnStart: 'TEST JETZT STARTEN',
      introSecure: '<i class="fas fa-lock"></i> Vertrauliche Bewertung • Sofortiges Ergebnis',
      procH3: 'Erstelle Ihren Educly-Pfad...',
      procP: 'Berechne KI-Reifegrad und prognostizierte Zeitersparnis.',
      proc1: 'Analysiere Profil und Engpässe...',
      proc2: 'Wähle vorrangige Prompts und Vorlagen...',
      proc3: 'Erstelle maßgeschneiderten 28-Tage-Plan...',
      stepProgress: 'Frage {step} von 4',
      stepCalib: 'Educly Kalibrierung'
    }
  };

  // -------------------------------------------------------------------------
  // GERENCIAMENTO DE PERSISTÊNCIA LOCALSTORAGE (Painel de Leads)
  // -------------------------------------------------------------------------
  const STORAGE_KEY = 'educly_quiz_leads_v1';

  function getStoredLeads() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return [];
    }
  }

  function saveLeadRecord(record) {
    try {
      const leads = getStoredLeads();
      leads.unshift(record); // mais recente primeiro
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      updateAdminDashboardUI();
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  function clearAllStoredLeads() {
    localStorage.removeItem(STORAGE_KEY);
    updateAdminDashboardUI();
  }

  // -------------------------------------------------------------------------
  // ATUALIZAÇÃO DA INTERFACE DO PAINEL ADMINISTRATIVO DE LEADS
  // -------------------------------------------------------------------------
  function updateAdminDashboardUI() {
    const leads = getStoredLeads();
    const countBadge = document.getElementById('leadsCounterBadge');
    const astatTotal = document.getElementById('astatTotal');
    const astatB2C = document.getElementById('astatB2C');
    const astatB2B = document.getElementById('astatB2B');
    const astatLead = document.getElementById('astatLead');
    const tbody = document.getElementById('adminLeadsTbody');
    const jsonViewer = document.getElementById('jsonViewer');

    if (countBadge) countBadge.textContent = leads.length;
    if (astatTotal) astatTotal.textContent = leads.length;

    let b2cCount = 0;
    let b2bCount = 0;
    let leadCount = 0;

    leads.forEach(l => {
      if (l.resultType === 'b2c' || l.resultType === 'checkout') b2cCount++;
      else if (l.resultType === 'b2b' || l.resultType === 'whatsapp') b2bCount++;
      else if (l.resultType === 'lead') leadCount++;
    });

    if (astatB2C) astatB2C.textContent = b2cCount;
    if (astatB2B) astatB2B.textContent = b2bCount;
    if (astatLead) astatLead.textContent = leadCount;

    // Atualiza tabela
    if (tbody) {
      if (leads.length === 0) {
        tbody.innerHTML = `
          <tr class="empty-row">
            <td colspan="5">Nenhum dado capturado ainda. Complete o teste para ver os dados gerados em tempo real!</td>
          </tr>
        `;
      } else {
        tbody.innerHTML = leads.map((lead, idx) => {
          const dateStr = new Date(lead.timestamp || lead.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + new Date(lead.timestamp || lead.startedAt).toLocaleDateString('pt-BR') + ')';
          
          let branchBadge = '';
          if (lead.resultType === 'b2c' || lead.resultType === 'checkout') {
            branchBadge = '<span class="status-approved" style="background:#FFF7ED;color:#C2410C;border-color:#FDBA74;"><i class="fas fa-shopping-cart"></i> B2C Checkout</span>';
          } else if (lead.resultType === 'b2b' || lead.resultType === 'whatsapp') {
            branchBadge = '<span class="status-approved" style="background:#F0FDF4;color:#166534;border-color:#86EFAC;"><i class="fab fa-whatsapp"></i> B2B WhatsApp</span>';
          } else {
            branchBadge = '<span class="status-approved" style="background:#EFF6FF;color:#1E40AF;border-color:#93C5FD;"><i class="fas fa-gift"></i> Isca Digital</span>';
          }

          let contactStr = '—';
          if (lead.leadInfo) {
            contactStr = `<strong>${lead.leadInfo.name || 'Anônimo'}</strong><br><small style="color:#64748B;">${lead.leadInfo.email || ''}<br>${lead.leadInfo.phone || ''}</small>`;
          } else if (lead.resultType === 'b2b') {
            contactStr = `<small style="color:#64748B;">Sessão WhatsApp iniciada</small>`;
          } else {
            contactStr = `<small style="color:#64748B;">Checkout Educly visualizado</small>`;
          }

          const ansKeys = Object.keys(lead.answers || {}).length;
          const scoreStr = `<span class="code-tag">${ansKeys} respostas gravadas</span>`;

          return `
            <tr>
              <td><small style="font-family:'Geist Mono',monospace;color:#64748B;">${dateStr}</small></td>
              <td>${branchBadge}</td>
              <td>${contactStr}</td>
              <td>${scoreStr}</td>
              <td>
                <button type="button" class="btn-copy-payload" style="padding:4px 8px;font-size:11px;" onclick="window.inspectLeadJson(${idx})">
                  <i class="fas fa-eye"></i> Ver JSON
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Atualiza JSON Viewer com o registro mais recente ou template estruturado
    if (jsonViewer) {
      if (leads.length > 0) {
        jsonViewer.textContent = JSON.stringify(leads[0], null, 2);
      } else {
        jsonViewer.textContent = JSON.stringify({
          info: "Faça o quiz para gerar o primeiro payload estruturado em tempo real!",
          schema: {
            id: "lead_uuid_v4",
            timestamp: new Date().toISOString(),
            profileBranch: "b2c | b2b | lead",
            answers: { q1: "...", q2: "...", q3: "...", q4: "..." },
            resultType: "checkout | whatsapp | lead",
            leadInfo: { name: "...", email: "...", phone: "..." }
          }
        }, null, 2);
      }
    }
  }

  // Permite inspeção de item específico da tabela
  window.inspectLeadJson = function(idx) {
    const leads = getStoredLeads();
    const jsonViewer = document.getElementById('jsonViewer');
    if (leads[idx] && jsonViewer) {
      jsonViewer.textContent = JSON.stringify(leads[idx], null, 2);
      jsonViewer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------------------------
  // TROCA DE IDIOMA E INTERNACIONALIZAÇÃO (i18n)
  // -------------------------------------------------------------------------
  function applyLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang] || i18n.pt;

    // Atualiza label do seletor
    const currentLangLabel = document.getElementById('currentLangLabel');
    if (currentLangLabel) currentLangLabel.textContent = t.langLabel;

    // Atualiza opções do dropdown
    document.querySelectorAll('.lang-btn-opt').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
        if (!btn.querySelector('.fa-check')) {
          btn.innerHTML = btn.textContent + ' <i class="fas fa-check"></i>';
        }
      } else {
        btn.classList.remove('active');
        const check = btn.querySelector('.fa-check');
        if (check) check.remove();
      }
    });

    // Atualiza textos estáticos da Home/Intro
    const setText = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    setText('i18nSimLabel', `<i class="fas fa-code-branch"></i> ${t.simLabel}`);
    setText('simBtnAuto', t.simAuto);
    setText('simBtnCheckout', t.simB2c);
    setText('simBtnWpp', t.simB2b);
    setText('simBtnLead', t.simLead);

    setText('tIntroBadge', t.introBadge);
    setText('tIntroTitle', t.introTitle);
    setText('tIntroLead', t.introLead);
    setText('tIntroProof', t.introProof);
    setText('tChip1', t.chip1);
    setText('tChip2', t.chip2);
    setText('tChip3', t.chip3);
    setText('tBtnStart', t.btnStart);
    setText('tIntroSecure', t.introSecure);

    setText('tProcH3', t.procH3);
    setText('tProcP', t.procP);
    setText('tProc1', t.proc1);
    setText('tProc2', t.proc2);
    setText('tProc3', t.proc3);

    // Se estiver em uma tela de pergunta, re-renderiza a pergunta no novo idioma
    if (currentStep >= 1 && currentStep <= 4) {
      renderCurrentQuestion();
    }
  }

  // Dropdown de Idioma Toggle
  const btnLangToggle = document.getElementById('btnLangToggle');
  const langDropdown = document.getElementById('langDropdown');

  if (btnLangToggle && langDropdown) {
    btnLangToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.style.display === 'block';
      langDropdown.style.display = isOpen ? 'none' : 'block';
      const chevron = document.getElementById('chevronLang');
      if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    });

    document.querySelectorAll('.lang-btn-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
        langDropdown.style.display = 'none';
        const chevron = document.getElementById('chevronLang');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      });
    });

    document.addEventListener('click', () => {
      if (langDropdown.style.display === 'block') {
        langDropdown.style.display = 'none';
        const chevron = document.getElementById('chevronLang');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Simulador de Vertentes (Pills na barra do Header)
  document.querySelectorAll('.sim-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sim-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      forcedMode = btn.dataset.mode;
      
      if (forcedMode !== 'auto') {
        branchProfile = forcedMode === 'checkout' ? 'b2c' : forcedMode === 'whatsapp' ? 'b2b' : 'lead';
        sessionData.profile = branchProfile;
      }
      
      // Se já estiver na tela de resultado, atualiza imediatamente
      if (currentStep === 6) {
        showFinalResultView();
      }
    });
  });

  // -------------------------------------------------------------------------
  // NAVEGAÇÃO DO QUIZ E RENDERIZAÇÃO DE PERGUNTAS RAMIFICADAS
  // -------------------------------------------------------------------------
  const screenIntro = document.getElementById('screenIntro');
  const screenQuestion = document.getElementById('screenQuestion');
  const screenProcessing = document.getElementById('screenProcessing');
  const progressModule = document.getElementById('progressModule');
  const progBarFill = document.getElementById('progBarFill');
  const progStepText = document.getElementById('progStepText');
  const qEyebrow = document.getElementById('qEyebrow');
  const qTitle = document.getElementById('qTitle');
  const qDesc = document.getElementById('qDesc');
  const choicesContainer = document.getElementById('choicesContainer');
  const btnPrevQuestion = document.getElementById('btnPrevQuestion');

  // Iniciar Quiz
  const btnStartQuiz = document.getElementById('btnStartQuiz');
  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      currentStep = 1;
      sessionData.startedAt = new Date().toISOString();
      if (screenIntro) screenIntro.classList.remove('active');
      if (progressModule) progressModule.style.display = 'block';
      renderCurrentQuestion();
    });
  }

  // Voltar Pergunta
  if (btnPrevQuestion) {
    btnPrevQuestion.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        renderCurrentQuestion();
      } else if (currentStep === 1) {
        currentStep = 0;
        if (progressModule) progressModule.style.display = 'none';
        if (screenQuestion) screenQuestion.classList.remove('active');
        if (screenIntro) screenIntro.classList.add('active');
      }
    });
  }

  // Renderizar a Pergunta Atual de acordo com o branchProfile
  function renderCurrentQuestion() {
    if (!screenQuestion || !choicesContainer) return;

    // Transição suave
    screenQuestion.classList.add('active');

    // Atualiza barra de progresso (1 a 4)
    const pct = Math.round((currentStep / 4) * 100);
    if (progBarFill) progBarFill.style.width = `${pct}%`;
    const t = i18n[currentLang] || i18n.pt;
    if (progStepText) progStepText.textContent = t.stepProgress.replace('{step}', currentStep);

    let qData = null;

    if (currentStep === 1) {
      // Pergunta 1: Sempre a raiz de ramificação
      const rootQ = quizTree.q1;
      qData = rootQ[currentLang] || rootQ.pt;
    } else {
      // Perguntas 2, 3 e 4: Puxadas da ramificação ativa (b2c, b2b ou lead)
      const branchKey = branchProfile || 'b2c';
      const branchList = quizTree[branchKey] || quizTree.b2c;
      const stepIndex = currentStep - 2; // q2 = 0, q3 = 1, q4 = 2
      const stepItem = branchList[stepIndex];
      if (stepItem) {
        qData = stepItem[currentLang] || stepItem.pt || stepItem.en;
      }
    }

    if (!qData) {
      goToProcessing();
      return;
    }

    // Aplica cabeçalho da pergunta
    if (qEyebrow) qEyebrow.textContent = qData.eyebrow;
    if (qTitle) qTitle.innerHTML = qData.title;
    if (qDesc) qDesc.innerHTML = qData.desc;

    // Renderiza opções
    choicesContainer.innerHTML = '';
    qData.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'choice-card';

      // Marca se já foi respondida
      const currentAns = sessionData.answers[`q${currentStep}`];
      if (currentAns && currentAns.id === opt.id) {
        card.classList.add('selected');
      }

      card.innerHTML = `
        <div class="c-icon-circle">
          <i class="fas ${opt.icon}"></i>
        </div>
        <div class="c-info">
          <div class="c-title">${opt.title}</div>
          <div class="c-sub">${opt.sub}</div>
        </div>
        <div class="c-check-circle">
          <i class="fas fa-check"></i>
        </div>
      `;

      card.addEventListener('click', () => {
        handleOptionSelect(opt, card);
      });

      choicesContainer.appendChild(card);
    });
  }

  // Tratar Seleção de Opção
  function handleOptionSelect(option, cardElement) {
    // Efeito visual imediato
    document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // Salva resposta
    sessionData.answers[`q${currentStep}`] = {
      id: option.id,
      title: option.title,
      sub: option.sub
    };

    // Se for a Pergunta 1, define a ramificação ativa
    if (currentStep === 1) {
      branchProfile = option.branch || 'b2c';
      sessionData.profile = branchProfile;
    }

    // Aguarda micro-delay para feedback tátil e avança
    setTimeout(() => {
      if (currentStep < 4) {
        currentStep++;
        renderCurrentQuestion();
      } else {
        goToProcessing();
      }
    }, 280);
  }

  // -------------------------------------------------------------------------
  // TELA DE PROCESSAMENTO COM ANIMAÇÃO PROGRESSIVA
  // -------------------------------------------------------------------------
  function goToProcessing() {
    currentStep = 5;
    if (screenQuestion) screenQuestion.classList.remove('active');
    if (screenProcessing) screenProcessing.classList.add('active');

    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const p3 = document.getElementById('p3');
    const t = i18n[currentLang] || i18n.pt;

    if (p1) { p1.className = 'proc-step-line active'; p1.querySelector('span').textContent = t.proc1; }
    if (p2) { p2.className = 'proc-step-line'; p2.querySelector('span').textContent = t.proc2; }
    if (p3) { p3.className = 'proc-step-line'; p3.querySelector('span').textContent = t.proc3; }

    setTimeout(() => {
      if (p1) p1.className = 'proc-step-line done';
      if (p2) p2.className = 'proc-step-line active';
    }, 700);

    setTimeout(() => {
      if (p2) p2.className = 'proc-step-line done';
      if (p3) p3.className = 'proc-step-line active';
    }, 1500);

    setTimeout(() => {
      if (p3) p3.className = 'proc-step-line done';
    }, 2200);

    setTimeout(() => {
      currentStep = 6;
      showFinalResultView();
    }, 2700);
  }

  // -------------------------------------------------------------------------
  // EXIBIÇÃO DO RESULTADO FINAL DE ACORDO COM A VERTENTE
  // -------------------------------------------------------------------------
  function showFinalResultView() {
    const screenProc = document.getElementById('screenProcessing');
    const resCheckout = document.getElementById('resultCheckout');
    const resWpp = document.getElementById('resultWhatsApp');
    const resLead = document.getElementById('resultLead');

    [screenProc, resCheckout, resWpp, resLead].forEach(v => {
      if (v) {
        v.classList.remove('active');
        v.style.display = 'none';
      }
    });

    // Determina vertente final
    let target = forcedMode !== 'auto' ? forcedMode : (branchProfile || 'b2c');
    sessionData.resultType = target;

    if (target === 'checkout' || target === 'b2c') {
      if (resCheckout) {
        resCheckout.style.display = 'block';
        setTimeout(() => resCheckout.classList.add('active'), 20);
        startCountdownTimer();
      }
      // Salva snapshot no localStorage
      saveLeadRecord({
        id: 'quiz_' + Date.now(),
        timestamp: new Date().toISOString(),
        profileBranch: 'B2C Individual',
        resultType: 'checkout',
        answers: sessionData.answers,
        leadInfo: null
      });

    } else if (target === 'whatsapp' || target === 'b2b') {
      if (resWpp) {
        resWpp.style.display = 'block';
        setTimeout(() => resWpp.classList.add('active'), 20);

        // Preenche resumo executivo na tela
        const b2bModel = document.getElementById('b2bModel');
        const b2bTeam = document.getElementById('b2bTeam');
        const b2bPain = document.getElementById('b2bPain');
        const b2bFormat = document.getElementById('b2bFormat');

        const ans2 = sessionData.answers['q2'] ? sessionData.answers['q2'].title : 'Média Empresa (11 a 50)';
        const ans3 = sessionData.answers['q3'] ? sessionData.answers['q3'].title : 'Gargalo Operacional & Lentidão';
        const ans4 = sessionData.answers['q4'] ? sessionData.answers['q4'].title : 'App Individual + Painel de Gestão';

        if (b2bModel) b2bModel.textContent = 'Treinamento de Equipe / B2B';
        if (b2bTeam) b2bTeam.textContent = ans2;
        if (b2bPain) b2bPain.textContent = ans3;
        if (b2bFormat) b2bFormat.textContent = ans4;

        // Configura link do WhatsApp com mensagem pré-formatada
        const btnGoToWhatsApp = document.getElementById('btnGoToWhatsApp');
        if (btnGoToWhatsApp) {
          const textWpp = encodeURIComponent(
            `*Olá Equipe Educly! Concluí o diagnóstico corporativo no Quiz:*\n\n` +
            `• *Perfil:* Capacitação de Equipe (B2B)\n` +
            `• *Porte:* ${ans2}\n` +
            `• *Gargalo:* ${ans3}\n` +
            `• *Formato Desejado:* ${ans4}\n\n` +
            `Gostaria de agendar uma demonstração do Painel Educly Enterprise.`
          );
          btnGoToWhatsApp.href = `https://wa.me/5511999999999?text=${textWpp}`;
        }
      }

      // Salva snapshot no localStorage
      saveLeadRecord({
        id: 'quiz_' + Date.now(),
        timestamp: new Date().toISOString(),
        profileBranch: 'B2B Corporativo',
        resultType: 'whatsapp',
        answers: sessionData.answers,
        leadInfo: null
      });

    } else {
      // Vertente Lead
      if (resLead) {
        resLead.style.display = 'block';
        setTimeout(() => resLead.classList.add('active'), 20);
      }
    }
  }

  // -------------------------------------------------------------------------
  // TIMER DE OFERTA DE BOAS-VINDAS (VERTENTE CHECKOUT)
  // -------------------------------------------------------------------------
  let timerInterval = null;
  function startCountdownTimer() {
    if (timerInterval) clearInterval(timerInterval);
    let secondsLeft = 14 * 60 + 59;
    const timerElem = document.getElementById('countdownTimer');

    timerInterval = setInterval(() => {
      const min = Math.floor(secondsLeft / 60);
      const sec = secondsLeft % 60;
      if (timerElem) {
        timerElem.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
      }
      if (--secondsLeft < 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }

  // -------------------------------------------------------------------------
  // FORMULÁRIO DE CAPTURA DE LEADS (VERTENTE GUIA DE PROMPTS)
  // -------------------------------------------------------------------------
  const leadCaptureForm = document.getElementById('leadCaptureForm');
  const leadSuccessFeedback = document.getElementById('leadSuccessFeedback');

  if (leadCaptureForm) {
    leadCaptureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName').value.trim();
      const email = document.getElementById('leadEmail').value.trim();
      const phone = document.getElementById('leadPhone').value.trim();

      const btn = document.getElementById('btnSubmitLead');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando seu envio...';

      const leadRecord = {
        id: 'lead_' + Date.now(),
        timestamp: new Date().toISOString(),
        profileBranch: 'Iniciante / Lead Capture',
        resultType: 'lead',
        answers: sessionData.answers,
        leadInfo: { name, email, phone }
      };

      setTimeout(() => {
        // Salva localmente
        saveLeadRecord(leadRecord);

        // Feedback de sucesso
        leadCaptureForm.style.display = 'none';
        if (leadSuccessFeedback) {
          leadSuccessFeedback.style.display = 'block';
        }
      }, 750);
    });
  }

  // -------------------------------------------------------------------------
  // MODAL DA CENTRAL ADMINISTRATIVA DE LEADS & COPIAR JSON
  // -------------------------------------------------------------------------
  const btnOpenAdmin = document.getElementById('btnOpenAdmin');
  const adminModal = document.getElementById('adminModal');
  const btnCloseAdmin = document.getElementById('btnCloseAdmin');
  const btnDoneAdmin = document.getElementById('btnDoneAdmin');
  const btnClearLeads = document.getElementById('btnClearLeads');
  const btnCopyPayload = document.getElementById('btnCopyPayload');

  function openAdmin() {
    updateAdminDashboardUI();
    if (adminModal) adminModal.style.display = 'flex';
  }

  function closeAdmin() {
    if (adminModal) adminModal.style.display = 'none';
  }

  if (btnOpenAdmin) btnOpenAdmin.addEventListener('click', openAdmin);
  if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', closeAdmin);
  if (btnDoneAdmin) btnDoneAdmin.addEventListener('click', closeAdmin);

  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdmin();
    });
  }

  if (btnClearLeads) {
    btnClearLeads.addEventListener('click', () => {
      if (confirm('Deseja limpar todos os dados de leads gravados no navegador?')) {
        clearAllStoredLeads();
      }
    });
  }

  if (btnCopyPayload) {
    btnCopyPayload.addEventListener('click', () => {
      const jsonViewer = document.getElementById('jsonViewer');
      if (jsonViewer) {
        navigator.clipboard.writeText(jsonViewer.textContent).then(() => {
          const original = btnCopyPayload.innerHTML;
          btnCopyPayload.innerHTML = '<i class="fas fa-check"></i> JSON Copiado!';
          setTimeout(() => {
            btnCopyPayload.innerHTML = original;
          }, 2000);
        });
      }
    });
  }

  // Inicialização inicial com dados existentes
  updateAdminDashboardUI();
  applyLanguage('pt');
});
