// Questões base para o curso Órbita (modulares por tema)
const questoesIniciantes = [
    { questao: 'Explique, com suas palavras, por que as estrelas parecem “nascer” no leste e “se pôr” no oeste ao longo da noite.', dissertativa: true },
    { questao: 'Cite duas constelações fáceis de reconhecer no céu e descreva um método simples para identificá-las.', dissertativa: true },
    { questao: 'Qual a melhor prática para observar o céu a olho nu em uma cidade grande? Comente sobre poluição luminosa e adaptação da visão ao escuro.', dissertativa: true },
    { 
        questao: 'O movimento aparente diário do céu é causado principalmente por:', 
        dissertativa: false, 
        alternativas: ['Translação da Terra', 'Rotação da Terra', 'Movimento do Sol ao redor da Terra', 'Precessão dos equinócios'],
        respostaCorreta: 'Rotação da Terra'
    }
];

const questoesSistemaSolar = [
    { questao: 'Descreva, em escala qualitativa, as diferenças de tamanho entre o Sol, planetas e luas.', dissertativa: true },
    { questao: 'Escolha um planeta do Sistema Solar e escreva três curiosidades sobre ele (rotação, atmosfera, luas, etc.).', dissertativa: true },
    { questao: 'O que são asteroides e cometas? Aponte uma diferença observável entre eles.', dissertativa: true },
    { 
        questao: 'A ordem correta dos planetas a partir do Sol é:', 
        dissertativa: false, 
        alternativas: ['Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno', 'Mercúrio, Terra, Vênus, Marte, Júpiter, Saturno, Urano, Netuno', 'Vênus, Mercúrio, Terra, Marte, Júpiter, Saturno, Urano, Netuno', 'Terra, Marte, Mercúrio, Vênus, Júpiter, Saturno, Urano, Netuno'],
        respostaCorreta: 'Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno'
    }
];

const questoesEstrelas = [
    { questao: 'Explique a relação entre cor e temperatura das estrelas (ex.: azul x vermelha).', dissertativa: true },
    { questao: 'Como usar um mapa celeste (planisfério) para localizar uma estrela ou constelação em uma data e horário específicos?', dissertativa: true },
    { questao: 'Defina magnitude aparente e comente por que uma estrela mais brilhante nem sempre é a mais próxima.', dissertativa: true },
    { 
        questao: 'Cores estelares indicam principalmente:', 
        dissertativa: false, 
        alternativas: ['Idade', 'Temperatura', 'Composição química única', 'Tamanho do sistema planetário'],
        respostaCorreta: 'Temperatura'
    }
];

const questoesTelescopios = [
    { questao: 'Compare telescópios refratores e refletores: principais vantagens e desvantagens para iniciantes.', dissertativa: true },
    { questao: 'O que é aumento útil e por que “mais aumento” nem sempre significa “melhor observação”?', dissertativa: true },
    { questao: 'Descreva duas boas práticas de segurança ao observar o Sol e por que elas são essenciais.', dissertativa: true },
    { 
        questao: 'Filtros e oculares são usados principalmente para:', 
        dissertativa: false, 
        alternativas: ['Aumentar o brilho', 'Alterar a cor do astro', 'Realçar contraste e segurança', 'Focar automaticamente'],
        respostaCorreta: 'Realçar contraste e segurança'
    }
];

const questoesFenomenos = [
    { questao: 'Explique por que a Lua tem fases e por que não ocorre eclipse solar e lunar todos os meses.', dissertativa: true },
    { questao: 'Como se planejar para observar uma chuva de meteoros (horário, direção, condições do céu)?', dissertativa: true },
    { questao: 'O que diferencia um eclipse solar total de um anular? Descreva brevemente.', dissertativa: true },
    { 
        questao: 'As fases da Lua são causadas principalmente por:', 
        dissertativa: false, 
        alternativas: ['Sombra da Terra', 'Posição relativa Sol–Terra–Lua', 'Rotação da Lua', 'Nuvens na atmosfera'],
        respostaCorreta: 'Posição relativa Sol–Terra–Lua'
    }
];

const questoesCicloEstelar = [
    { questao: 'Resuma as etapas principais do ciclo de vida estelar em linguagem simples.', dissertativa: true },
    { questao: 'O que é uma nebulosa planetária e em que fase de vida estelar ela ocorre?', dissertativa: true },
    { questao: 'Explique por que estrelas muito massivas têm vidas mais curtas do que estrelas como o Sol.', dissertativa: true },
    { 
        questao: 'Uma supernova está associada geralmente a:', 
        dissertativa: false, 
        alternativas: ['Nascimento de estrelas', 'Morte de estrelas massivas', 'Planetas gigantes', 'Cometas brilhantes'],
        respostaCorreta: 'Morte de estrelas massivas'
    }
];

// Banco de questões: curso Universo
const questoesBBang = [
    { questao: 'Explique por que a expansão do Universo é uma conclusão observacional e não apenas teórica.', dissertativa: true },
    { questao: 'Descreva o papel da radiação cósmica de fundo na cosmologia moderna.', dissertativa: true },
    { questao: 'Resuma a nucleossíntese primordial e os elementos leves produzidos.', dissertativa: true },
    { 
        questao: 'O desvio para o vermelho galáctico é interpretado como:', 
        dissertativa: false, 
        alternativas: ['Efeito Doppler local de estrelas', 'Expansão do espaço entre galáxias', 'Aproximação da Via Láctea', 'Erro sistemático instrumental'],
        respostaCorreta: 'Expansão do espaço entre galáxias'
    }
];

const questoesMateriaEnergiaEscura = [
    { questao: 'Cite duas evidências independentes para a existência de matéria escura.', dissertativa: true },
    { questao: 'Explique o que são curvas de rotação galáctica e o que indicam.', dissertativa: true },
    { questao: 'Resuma a evidência da aceleração cósmica obtida com supernovas tipo Ia.', dissertativa: true },
    { 
        questao: 'Lentes gravitacionais fortes e fracas são úteis para:', 
        dissertativa: false, 
        alternativas: ['Medir temperaturas de estrelas', 'Inferir distribuição de massa (visível e escura)', 'Calibrar espectros', 'Detectar ondas gravitacionais diretamente'],
        respostaCorreta: 'Inferir distribuição de massa (visível e escura)'
    }
];

const questoesEstruturaUniverso = [
    { questao: 'Descreva a teia cósmica e como filamentos e vazios se organizam.', dissertativa: true },
    { questao: 'Qual o papel da gravidade no crescimento de estruturas a partir de flutuações primordiais?', dissertativa: true },
    { questao: 'Como levantamentos de galáxias mapeiam a estrutura em grande escala?', dissertativa: true },
    { 
        questao: 'O espectro de potência da matéria fornece:', 
        dissertativa: false, 
        alternativas: ['Distribuição de temperaturas estelares', 'Distribuição estatística de flutuações em escalas', 'Histórico químico de galáxias', 'Idades de aglomerados globulares'],
        respostaCorreta: 'Distribuição estatística de flutuações em escalas'
    }
];

const questoesRelatividadeBuracosNegros = [
    { questao: 'Explique a curvatura do espaço-tempo e como ela afeta o movimento de corpos.', dissertativa: true },
    { questao: 'Defina horizonte de eventos e sua relevância observacional.', dissertativa: true },
    { questao: 'Comente sobre a detecção de ondas gravitacionais e o que elas nos dizem.', dissertativa: true },
    { 
        questao: 'Um buraco negro pode ser detectado indiretamente por:', 
        dissertativa: false, 
        alternativas: ['Emissão de luz do interior', 'Efeito gravitacional sobre matéria vizinha', 'Sombra projetada por um planeta', 'Mudanças na cor do céu noturno'],
        respostaCorreta: 'Efeito gravitacional sobre matéria vizinha'
    }
];

const questoesCosmologiaObservacional = [
    { questao: 'Explique o conceito de vela padrão e dê um exemplo.', dissertativa: true },
    { questao: 'Descreva brevemente como se mede H0 e por que há tensões entre métodos.', dissertativa: true },
    { questao: 'Comente o papel de lentes gravitacionais na medição de parâmetros cosmológicos.', dissertativa: true },
    { 
        questao: 'O parâmetro Ωm representa:', 
        dissertativa: false, 
        alternativas: ['Densidade de energia escura', 'Densidade de matéria (normal + escura)', 'Curvatura espacial', 'Temperatura média do CMB'],
        respostaCorreta: 'Densidade de matéria (normal + escura)'
    }
];

const questoesInflacao = [
    { questao: 'Explique o problema do horizonte e como a inflação o resolve.', dissertativa: true },
    { questao: 'Descreva o problema da planitude e a solução inflacionária.', dissertativa: true },
    { questao: 'Comente como flutuações quânticas geram anisotropias no CMB.', dissertativa: true },
    { 
        questao: 'O espectro quase invariante de escala observado no CMB é consistente com:', 
        dissertativa: false, 
        alternativas: ['Ausência de inflação', 'Modelos inflacionários', 'Universo estático', 'Apenas matéria bariônica'],
        respostaCorreta: 'Modelos inflacionários'
    }
];

// Banco de questões: curso Galáxia
const questoesLuzMedidas = [
    { questao: 'Explique o que é um espectro e como ele revela composição de um astro.', dissertativa: true },
    { questao: 'Defina magnitude aparente e cor (índice de cor) em astronomia.', dissertativa: true },
    { questao: 'Descreva um método básico para estimar distâncias estelares.', dissertativa: true },
    { 
        questao: 'A lei de Wien relaciona:', 
        dissertativa: false, 
        alternativas: ['Temperatura e pico do espectro', 'Massa e luminosidade', 'Idade e metalicidade', 'Velocidade radial e distância'],
        respostaCorreta: 'Temperatura e pico do espectro'
    }
];

const questoesFormacaoEstelar = [
    { questao: 'Resuma o processo de colapso de nuvens moleculares até protoestrelas.', dissertativa: true },
    { questao: 'Explique feedback estelar e seus efeitos no meio interestelar.', dissertativa: true },
    { questao: 'Comente o papel da poeira na formação estelar e observações.', dissertativa: true },
    { 
        questao: 'Regiões HII são:', 
        dissertativa: false, 
        alternativas: ['Nuvens de poeira fria', 'Gás ionizado por estrelas jovens', 'Aglomerados globulares antigos', 'Buracos negros supermassivos'],
        respostaCorreta: 'Gás ionizado por estrelas jovens'
    }
];

const questoesViaLactea = [
    { questao: 'Descreva as principais componentes da Via Láctea (disco, bojo, halo).', dissertativa: true },
    { questao: 'Explique como medimos a rotação galáctica.', dissertativa: true },
    { questao: 'Onde estamos localizados na galáxia e o que isso implica para observações?', dissertativa: true },
    { 
        questao: 'A curva de rotação da Via Láctea indica:', 
        dissertativa: false, 
        alternativas: ['Somente matéria bariônica', 'Presença de matéria escura', 'Universo estático', 'Erro de medição sistemático'],
        respostaCorreta: 'Presença de matéria escura'
    }
];

const questoesExoplanetas = [
    { questao: 'Compare os métodos de trânsito e velocidade radial para detectar exoplanetas.', dissertativa: true },
    { questao: 'Explique o que podemos inferir sobre atmosferas de exoplanetas.', dissertativa: true },
    { questao: 'Comente limitações observacionais no estudo de habitabilidade.', dissertativa: true },
    { 
        questao: 'O método de trânsito mede:', 
        dissertativa: false, 
        alternativas: ['Variações de velocidade da estrela', 'Queda no brilho quando o planeta passa à frente', 'Imagem direta do planeta', 'Emissão térmica do planeta'],
        respostaCorreta: 'Queda no brilho quando o planeta passa à frente'
    }
];

const questoesMorfologiaEvolucao = [
    { questao: 'Descreva a classificação morfológica de galáxias (Hubble).', dissertativa: true },
    { questao: 'Explique como interações e fusões afetam a evolução galáctica.', dissertativa: true },
    { questao: 'Comente evidências observacionais de eventos de fusão.', dissertativa: true },
    { 
        questao: 'Galáxias elípticas tendem a ser associadas a:', 
        dissertativa: false, 
        alternativas: ['Formação estelar intensa recente', 'Populações estelares mais velhas', 'Discos com braços espirais proeminentes', 'Altas taxas de gás frio'],
        respostaCorreta: 'Populações estelares mais velhas'
    }
];

const questoesCosmografia = [
    { questao: 'Explique o conceito de escada de distâncias cósmicas.', dissertativa: true },
    { questao: 'Descreva o diagrama HR e seu uso em estimar distâncias.', dissertativa: true },
    { questao: 'Comente o uso de múltiplos comprimentos de onda em cosmografia.', dissertativa: true },
    { 
        questao: 'Cefeidas são importantes porque:', 
        dissertativa: false, 
        alternativas: ['Mede-se sua temperatura com precisão', 'São velas padrão para distâncias extragalácticas', 'São sempre parte de galáxias anãs', 'Têm brilho absolutamente constante'],
        respostaCorreta: 'São velas padrão para distâncias extragalácticas'
    }
];


// BANCOS DE QUESTÕES PARA OS NOVOS MÓDULOS (7, 8 e 9)

// Banco de questões: Astrofísica de Objetos Compactos (Módulo 7)
const questoesObjetosCompactos = [
    { questao: 'Explique o conceito de pressão de degenerescência eletrônica e o limite de Chandrasekhar.', dissertativa: true },
    { questao: 'Descreva a estrutura interna de uma estrela de nêutrons (crosta, núcleo) e a equação de estado (EoS) da matéria nuclear.', dissertativa: true },
    { questao: 'O que é um pulsar? Explique o modelo do "farol" (lighthouse model) e a física da magnetosfera do pulsar.', dissertativa: true },
    { questao: 'Compare os processos de resfriamento de uma anã branca e de uma estrela de nêutrons.', dissertativa: true },
    { 
        questao: 'A massa máxima de uma estrela de nêutrons (limite TOV) é determinada principalmente por:', 
        dissertativa: false, 
        alternativas: ['Pressão de degenerescência eletrônica', 'Equação de Estado da matéria nuclear', 'Taxa de rotação', 'Campo magnético'],
        respostaCorreta: 'Equação de Estado da matéria nuclear'
    }
];

// Banco de questões: Física Avançada de Buracos Negros (Módulo 8)
const questoesFisicaBN = [
    { questao: 'Discuta o Teorema "No-Hair" (Sem Cabelo) e seus três parâmetros (Massa, Carga, Spin).', dissertativa: true },
    { questao: 'Explique o que é a Radiação Hawking e o processo físico de criação de pares no horizonte de eventos.', dissertativa: true },
    { questao: 'Descreva o Paradoxo da Informação do Buraco Negro. Por que ele representa um conflito entre a Relatividade Geral e a Mecânica Quântica?', dissertativa: true },
    { questao: 'Diferencie a singularidade de um buraco negro de Schwarzschild (ponto) da singularidade de um buraco negro de Kerr (anel).', dissertativa: true },
    { 
        questao: 'A "Termodinâmica do Buraco Negro" relaciona a área do horizonte de eventos com qual propriedade física?', 
        dissertativa: false, 
        alternativas: ['Carga', 'Entropia', 'Massa', 'Momento Angular'],
        respostaCorreta: 'Entropia'
    }
];

// Banco de questões: Física da Formação de Galáxias (Módulo 9)
const questoesFormacaoGalaxias = [
    { questao: 'Explique o conceito de "fricção dinâmica" (dynamical friction) de Chandrasekhar e seu papel em fusões de galáxias.', dissertativa: true },
    { questao: 'Compare "feedback estelar" (supernovas) e "feedback de AGN". Qual é mais eficaz em "apagar" (quenching) a formação estelar em galáxias massivas?', dissertativa: true },
    { questao: 'O que é o "downsizing" cosmológico e como ele desafia modelos simples de formação hierárquica?', dissertativa: true },
    { questao: 'Descreva o formalismo de Press-Schechter e como ele estima a função de massa de halos de matéria escura.', dissertativa: true },
    { 
        questao: 'O processo que impede o gás de se resfriar e formar estrelas em halos muito massivos (M > 10^12 Msol) é dominado por:', 
        dissertativa: false, 
        alternativas: ['Feedback de supernovas', 'Aquecimento por choque (shock heating) e feedback de AGN', 'Radiação UV de fundo', 'Decaimento da matéria escura'],
        respostaCorreta: 'Aquecimento por choque (shock heating) e feedback de AGN'
    }
];

export const initial_cursos = {
    universo: [
        {
            id: 4526672,
            terminado: false,
            template: {
                titulo: 'Cosmologia do Big Bang',
                descricao: 'A física da métrica FLRW, termodinâmica primordial e nucleossíntese de partículas.'
            },
            introducao: {
                descricao: 'Uma introdução à cosmologia moderna, focando na derivação da expansão do espaço, na termodinâmica do plasma primordial que gerou o CMB e na física de partículas por trás da Nucleossíntese Primordial.',
                pdf: '',
                videoBackground: '/img/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Geometria da Expansão',
                        descricao: 'Aplique a métrica FLRW (Aula 1) para explicar o conceito de "desvio para o vermelho cosmológico" em oposição ao Doppler.'
                    },
                    questoes: questoesBBang
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Física do Desacoplamento',
                        descricao: 'Com base na Aula 2, explique o processo termodinâmico que tornou o Universo transparente e deu origem ao CMB.'
                    },
                    questoes: questoesBBang
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Prevendo os Elementos Leves',
                        descricao: 'Discuta o processo da BBN (Aula 3). Por que a nucleossíntese parou no Lítio e não produziu elementos mais pesados?'
                    },
                    questoes: questoesBBang
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Testes de Consistência',
                        descricao: 'Resolva problemas comparando as idades e abundâncias previstas pelo modelo padrão com dados observacionais (Aula 4).'
                    },
                    questoes: questoesBBang
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Análise dos Pilares',
                        descricao: 'Discuta por que a Radiação Cósmica de Fundo é considerada a evidência mais forte do Big Bang.'
                    },
                    questoes: questoesBBang
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Cosmologia Primordial',
                        descricao: 'Uma avaliação integradora (Aula 5) que conecta a Relatividade Geral à termodinâmica e física nuclear.'
                    },
                    questoes: questoesBBang
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/videos/Aula_1.mp4',
                    titulo: 'Aula 1 — Métricas de Expansão (FLRW) e a Lei de Hubble',
                    subtitulo: 'Aula 1',
                    descricao: 'Derivando a expansão do espaço a partir da Relatividade Geral. A métrica de Friedmann-Lemaître-Robertson-Walker.'
                },
                {
                    id: 5623943,
                    video: '/videos/Aula_2.mp4',
                    titulo: 'Aula 2 — Termodinâmica do Universo Primordial e o CMB',
                    subtitulo: 'Aula 2',
                    descricao: 'O plasma primordial, equilíbrio térmico, desacoplamento de fótons e a física do espectro de corpo negro do CMB.'
                },
                {
                    id: 5532743,
                    video: '/videos/Aula_3.mp4',
                    titulo: 'Aula 3 — Nucleossíntese Primordial (BBN) e Física de Partículas',
                    subtitulo: 'Aula 3',
                    descricao: 'As reações nucleares nos primeiros minutos. Como as abundâncias de H, He, Li dependem da física de partículas (ex: N_eff).'
                },
                {
                    id: 8528237,
                    video: '/videos/Aula_4.mp4',
                    titulo: 'Aula 4 — Consistência de Idades e Abundâncias',
                    subtitulo: 'Aula 4',
                    descricao: 'Testando o modelo: comparando a idade do Universo (derivada de H0) com idades estelares e dados de abundâncias.'
                },
                {
                    id: 5323723,
                    video: '/videos/Aula_5.mp4',
                    titulo: 'Aula 5 — Pilares do Modelo ΛCDM: Síntese',
                    subtitulo: 'Aula 5',
                    descricao: 'Revisão dos três pilares observacionais (Expansão, CMB, BBN) e como eles se encaixam no modelo cosmológico padrão.'
                }
            ]
        },
        {
            id: 4526653,
            terminado: false,
            template: {
                titulo: 'Matéria Escura e Energia Escura',
                descricao: 'Dinâmica Galáctica, Lentes Gravitacionais e as Equações de Friedmann para o Setor Escuro.'
            },
            introducao: {
                descricao: 'Uma investigação sobre os 95% do universo que não entendemos. Este módulo aborda as evidências dinâmicas (curvas de rotação), geométricas (lentes) e de expansão (SNe Ia) para o setor escuro, e explora os candidatos teóricos.',
                pdf: '',
                videoBackground: '/img/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1243678
            },
            atividades: [
                {
                    id: 5141589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Dinâmica de Galáxias',
                        descricao: 'Use o Teorema do Virial (Aula 1) para estimar a massa de um aglomerado de galáxias. Compare com a massa luminosa.'
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 3534529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Mapeando Massa com Lentes',
                        descricao: 'Explique como o "cisalhamento" (shear) de lentes fracas (Aula 2) permite mapear a matéria escura, independentemente da dinâmica.'
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 5639283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Diagrama de Hubble de SNe Ia',
                        descricao: 'Interprete o diagrama de Hubble (Aula 3) e explique por que a aceleração é a conclusão preferida.'
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 2557356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Resolvendo as Equações de Friedmann',
                        descricao: 'Discuta o papel do parâmetro de equação de estado (w) (Aula 4). O que acontece se w < -1/3?'
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 6353456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Debate: CDM vs. MOND',
                        descricao: 'Cite duas evidências independentes para Matéria Escura Fria (CDM) que são difíceis de explicar com gravidade modificada (MOND).'
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 8374434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Setor Escuro',
                        descricao: 'Avaliação final (Aula 5) sobre os modelos teóricos para a matéria escura e a energia escura.'
                    },
                    questoes: questoesMateriaEnergiaEscura
                }
            ],
            videoAulas: [
                {
                    id: 5148943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — Dinâmica Galáctica e Evidências de Matéria Escura',
                    subtitulo: 'Aula 1',
                    descricao: 'O problema da massa faltante: curvas de rotação e o Teorema do Virial em aglomerados. Dinâmica Newtoniana vs. GR.'
                },
                {
                    id: 5633943,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Lentes Gravitacionais: Teoria e Observáveis',
                    subtitulo: 'Aula 2',
                    descricao: 'A deflexão da luz pela Relatividade Geral. Lentes fortes, fracas (weak lensing shear) e micro-lentes como sondas de massa.'
                },
                {
                    id: 5542743,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Supernovas (SNe Ia) como Velas Padrão',
                    subtitulo: 'Aula 3',
                    descricao: 'A física das SNe Tipo Ia e sua calibração (relação de Phillips). Evidências para a aceleração cósmica.'
                },
                {
                    id: 8538237,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — As Equações de Friedmann e o Conteúdo de Energia',
                    subtitulo: 'Aula 4',
                    descricao: 'Resolvendo as equações de Friedmann para diferentes componentes (matéria, radiação, Λ) e o parâmetro de equação de estado (w).'
                },
                {
                    id: 5333723,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — A Natureza do Setor Escuro (Candidatos e Modelos)',
                    subtitulo: 'Aula 5',
                    descricao: 'Candidatos a CDM (WIMPs, Áxions) e modelos de Energia Escura (Constante Cosmológica, Quintessência, Gravidade Modificada).'
                }
            ]
        },
        {
            id: 4526678,
            terminado: false,
            template: {
                titulo: 'Estrutura em Grande Escala do Universo',
                descricao: 'Teoria de perturbações, colapso gravitacional e a física da Teia Cósmica.'
            },
            introducao: {
                descricao: 'Da suavidade do CMB à complexa Teia Cósmica. Este módulo explora a Teoria de Perturbações Cosmológicas, o colapso gravitacional, a física de fluidos em aglomerados (Efeito SZ) e a estatística (P(k)) que descreve a rede de filamentos e vazios.',
                pdf: '',
                videoBackground: '/img/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1246878
            },
            atividades: [
                {
                    id: 6164589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Crescimento Linear de Estruturas',
                        descricao: 'Explique por que a matéria escura é essencial para o crescimento de estruturas (Aula 1). O que aconteceria em um universo só de bários?'
                    },
                    questoes: questoesEstruturaUniverso
                },
                {
                    id: 3554529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Colapso e Viralização',
                        descricao: 'Descreva o modelo de colapso "top-hat" (Aula 2) e como ele prevê a densidade de halos viralizados.'
                    },
                    questoes: questoesEstruturaUniverso
                },
                {
                    id: 5699283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Física de Aglomerados (Observáveis)',
                        descricao: 'Compare como a massa de um aglomerado pode ser medida usando Lentes (Aula 3), Raio-X e o Efeito SZ.'
                    },
                    questoes: questoesEstruturaUniverso
                },
                {
                    id: 2577356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Interpretando o Espectro de Potência',
                        descricao: 'O que o P(k) (Aula 4) nos informa? O que é o "turnover" no espectro de potência e o que o causa?'
                    },
                    questoes: questoesEstruturaUniverso
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: O Papel das Simulações',
                        descricao: 'Por que simulações de N-Corpos (Aula 5) são necessárias? Por que não podemos resolver o crescimento não-linear analiticamente?'
                    },
                    questoes: questoesEstruturaUniverso
                },
                {
                    id: 8384434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Formação de Estruturas',
                        descricao: 'Teste final integrando a teoria de perturbações com a física de fluidos e a estatística de grande escala.'
                    },
                    questoes: questoesEstruturaUniverso
                }
            ],
            videoAulas: [
                {
                    id: 5168943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — Teoria de Perturbações Cosmológicas (Linear)',
                    subtitulo: 'Aula 1',
                    descricao: 'A física do crescimento de perturbações de densidade no regime linear. O papel da matéria escura na formação de estruturas.'
                },
                {
                    id: 5653943,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Colapso Gravitacional e Crescimento Não-Linear',
                    subtitulo: 'Aula 2',
                    descricao: 'O modelo de "top-hat collapse". Como as estruturas se formam e se desacoplam da expansão de Hubble (viralização).'
                },
                {
                    id: 5562743,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Física de Aglomerados (Gás, Lentes e Efeito SZ)',
                    subtitulo: 'Aula 3',
                    descricao: 'O Meio Intracluster (ICM) como um fluido. Emissão em Raio-X (Bremsstrahlung) e o Efeito Sunyaev-Zeldovich (SZ).'
                },
                {
                    id: 8558237,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — Estatística de Grande Escala (Espectro de Potência)',
                    subtitulo: 'Aula 4',
                    descricao: 'Quantificando a teia cósmica: A função de correlação de 2 pontos e o Espectro de Potência da matéria (P(k)).'
                },
                {
                    id: 5353723,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — Simulações de N-Corpos e Hidrodinâmicas',
                    subtitulo: 'Aula 5',
                    descricao: 'Como testamos a teoria: A física por trás das simulações cosmológicas (ex: Illustris, Millennium).'
                }
            ]
        },
        {
            terminado: false,
            id: 2345567,
            template: {
                titulo: 'Relatividade Geral e Astrofísica de Buracos Negros',
                descricao: 'Geometria Diferencial, soluções de Einstein (Kerr) e a física de acreção e jatos relativísticos.'
            },
            introducao: {
                descricao: 'Uma jornada pelos princípios da Relatividade Geral, as soluções de Schwarzschild e Kerr, a detecção de Ondas Gravitacionais e a física de plasmas extremos em discos de acreção e jatos.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Curvatura e Movimento',
                        descricao: 'Explique o ditado "matéria diz ao espaço como se curvar, espaço diz à matéria como se mover" (Aula 1) usando um dos testes clássicos (Aula 2).'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Métrica de Kerr',
                        descricao: 'Diferencie a métrica de Kerr da de Schwarzschild (Aula 3). O que é a ergoesfera e como ela permite a extração de energia?'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Fontes de Ondas Gravitacionais',
                        descricao: 'Comente sobre a detecção de ondas gravitacionais (Aula 4). O que o "chirp" de uma fusão nos diz sobre as massas dos objetos?'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Física da Acreção',
                        descricao: 'Descreva como um buraco negro (que não emite luz) pode ser a fonte dos objetos mais luminosos do universo (Quasares) (Aula 5).'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Problemas Abertos',
                        descricao: 'Discuta o conceito de singularidade e o paradoxo da informação (Aula 6).'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Avaliação final sobre as soluções e implicações astrofísicas das Equações de Campo de Einstein.'
                    },
                    questoes: questoesRelatividadeBuracosNegros
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — O Princípio da Equivalência e a Geometria do Espaço-Tempo',
                    subtitulo: 'Aula 1',
                    descricao: 'As equações de campo de Einstein. Como a matéria/energia curva o espaço-tempo e como o espaço-tempo dita o movimento.'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Testes Clássicos da Relatividade Geral',
                    subtitulo: 'Aula 2',
                    descricao: 'Periélio de Mercúrio, deflexão da luz e redshift gravitacional como testes experimentais da teoria.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Soluções de Schwarzschild e Kerr (Horizontes)',
                    subtitulo: 'Aula 3',
                    descricao: 'A física do horizonte de eventos. A métrica de Schwarzschild (estático) vs. a métrica de Kerr (rotacional) e a ergoesfera.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — Ondas Gravitacionais: Teoria e Detecção',
                    subtitulo: 'Aula 4',
                    descricao: 'A física das ondas gravitacionais como perturbações na métrica. Fontes (binárias compactas) e detecção (LIGO/Virgo).'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — Astrofísica de Buracos Negros: Acreção e Jatos',
                    subtitulo: 'Aula 5',
                    descricao: 'Física de plasmas em discos de acreção (modelo de Shakura-Sunyaev) e a produção de jatos relativísticos (Mecanismo B-Z).'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 6 — Revisão e Síntese da Gravidade Extrema',
                    subtitulo: 'Aula 6',
                    descricao: 'Amarração dos conceitos do módulo e problemas abertos (singularidades, informação do buraco negro).'
                }
            ]
        },
        {
            terminado: false,
            id: 7453453,
            template: {
                titulo: 'Cosmologia Observacional e Parâmetros',
                descricao: 'A física das Sondas (SNe, BAO, CMB), Estatística Bayesiana e a Tensão de Hubble.'
            },
            introducao: {
                descricao: 'Como medimos os parâmetros do universo (H0, Ωm, σ8). Este módulo foca na física de cada sonda (SNe, BAO, Lensing), nos métodos estatísticos (Bayes, MCMC) e no maior problema da cosmologia moderna: a Tensão de Hubble.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: A Física das BAO',
                        descricao: 'Explique a origem física das Oscilações Acústicas de Bárions (BAO) (Aula 2) e por que ela atua como uma "régua padrão".'
                    },
                    questoes: questoesCosmologiaObservacional
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Tensão em H0',
                        descricao: 'Descreva a tensão de Hubble (Aula 3). Por que ela é um problema tão sério para o modelo ΛCDM?'
                    },
                    questoes: questoesCosmologiaObservacional
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Geometria vs. Crescimento',
                        descricao: 'Diferencie sondas de "geometria" (como BAO/SNe) de sondas de "crescimento de estrutura" (como RSD/Lensing) (Aula 5).'
                    },
                    questoes: questoesCosmologiaObservacional
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Estatística Cosmológica',
                        descricao: 'O que é "Likelihood" (Aula 4)? Explique por que a análise combinada (Aula 6) é tão poderosa para quebrar degenerescências de parâmetros.'
                    },
                    questoes: questoesCosmologiaObservacional
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Erros Sistemáticos',
                        descricao: 'Discuta possíveis fontes de erro sistemático (Aula 1, Aula 3) na calibração de SNe Ia que poderiam impactar a medida de H0.'
                    },
                    questoes: questoesCosmologiaObservacional
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Avaliação final sobre o arsenal de sondas observacionais e os métodos estatísticos usados para definir o modelo cosmológico.'
                    },
                    questoes: questoesCosmologiaObservacional
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — A Escada de Distâncias Cósmicas e H0',
                    subtitulo: 'Aula 1',
                    descricao: 'A física dos calibradores (Cefeidas, TRGB) e a ancoragem da escala de distância para medir H0.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Sondas de Geometria: BAO e SNe Ia',
                    subtitulo: 'Aula 2',
                    descricao: 'A física das Oscilações Acústicas de Bárions (BAO) como régua padrão. Combinando com SNe Ia (velas padrão).'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — A Tensão de Hubble: Sistemáticos vs. Nova Física',
                    subtitulo: 'Aula 3',
                    descricao: 'Análise detalhada da discrepância (4-6σ) entre medidas locais (Aula 1) e primordiais (CMB). Erros sistemáticos ou falha do ΛCDM?'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Análise Bayesiana e Ajuste de Parâmetros (MCMC)',
                    subtitulo: 'Aula 4',
                    descricao: 'A estatística por trás da cosmologia. Teorema de Bayes, Likelihood e métodos de Monte Carlo (MCMC) para restringir parâmetros.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Sondas de Crescimento de Estrutura',
                    subtitulo: 'Aula 5',
                    descricao: 'Usando Lentes Fracas, Efeito SZ e Redshift-Space Distortions (RSD) para medir Ωm e σ8.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — O Estado da Arte: Análise Combinada',
                    subtitulo: 'Aula 6',
                    descricao: 'Combinando todas as sondas (CMB+BAO+SNe+Lensing) para obter as restrições mais fortes sobre os 6 parâmetros do ΛCDM.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345253,
            template: {
                titulo: 'Inflação Cósmica e Flutuações Primordiais',
                descricao: 'Teoria Quântica de Campos em Espaço Curvo, Campos Escalares e a origem quântica das estruturas.'
            },
            introducao: {
                descricao: 'Por que o universo é tão grande, plano e homogêneo? Este módulo explora a Teoria da Inflação, o campo "inflaton", e como flutuações quânticas microscópicas foram esticadas para escalas cosmológicas, semeando todas as estruturas que vemos hoje.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Os Problemas do Big Bang Padrão',
                        descricao: 'Explique detalhadamente o problema do horizonte (Aula 1). Por que a uniformidade do CMB é um problema?'
                    },
                    questoes: questoesInflacao
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Campo "Inflaton"',
                        descricao: 'Descreva as condições de "slow-roll" (Aula 2) e como elas garantem um período de inflação e uma saída "graciosa".'
                    },
                    questoes: questoesInflacao
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Das Flutuações Quânticas às Galáxias',
                        descricao: 'Explique a conexão entre flutuações quânticas microscópicas (Aula 3) e a estrutura em grande escala do universo (Módulo 3).'
                    },
                    questoes: questoesInflacao
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Modos B Primordiais',
                        descricao: 'O que são Modos-B (Aula 5) no CMB? Por que sua detecção (associada a ondas gravitacionais primordiais) seria a "bala de prata" da inflação?'
                    },
                    questoes: questoesInflacao
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Restringindo Modelos de Inflação',
                        descricao: 'Como os observáveis ns e r (Aula 5) nos ajudam a diferenciar entre diferentes "potenciais" inflacionários (ex: m²Φ², Φ⁴)?'
                    },
                    questoes: questoesInflacao
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Inflação e TQC',
                        descricao: 'Avaliação final sobre a aplicação da Teoria Quântica de Campos para resolver os problemas fundamentais da cosmologia (Aula 6).'
                    },
                    questoes: questoesInflacao
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Problemas Clássicos do Big Bang',
                    subtitulo: 'Aula 1',
                    descricao: 'A física detalhada dos problemas do horizonte, planitude e monopolos magnéticos no modelo padrão.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — A Física da Inflação: Campos Escalares e "Slow-Roll"',
                    subtitulo: 'Aula 2',
                    descricao: 'O "Inflaton" como um campo escalar. Condições de "slow-roll" e como a inflação resolve os problemas da Aula 1.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — A Origem Quântica das Estruturas',
                    subtitulo: 'Aula 3',
                    descricao: 'Flutuações quânticas do Inflaton esticadas para escalas cosmológicas, gerando o espectro de potência primordial.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Anisotropias do CMB: Modos Escalares e Tensoriais',
                    subtitulo: 'Aula 4',
                    descricao: 'Como as flutuações primordiais (Aula 3) se imprimem no CMB. Perturbações escalares (densidade) e tensoriais (ondas gravitacionais).'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Observáveis Inflacionários (ns, r) e Modos B',
                    subtitulo: 'Aula 5',
                    descricao: 'O índice espectral (ns) e a razão tensor-escalar (r). A busca por Modos-B primordiais como prova da inflação.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Modelos de Inflação e o Multiverso',
                    subtitulo: 'Aula 6',
                    descricao: 'Caos inflacionário, inflação eterna e a conexão teórica com a hipótese do Multiverso.'
                }
            ]
        },
        {
            terminado: false,
            id: 8000001,
            template: {
                titulo: 'Astrofísica de Objetos Compactos',
                descricao: 'A física da matéria degenerada: Anãs Brancas (limite de Chandrasekhar) e Estrelas de Nêutrons (limite TOV, pulsares e magnetares).'
            },
            introducao: {
                descricao: 'Mergulhe na física extrema da matéria degenerada. Este módulo explora o equilíbrio hidrostático em Anãs Brancas, o Limite de Chandrasekhar, e a física nuclear por trás das Estrelas de Nêutrons, incluindo suas Equações de Estado (EoS), pulsares e campos magnéticos extremos.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Pressão de Degenerescência Eletrônica',
                        descricao: 'Analise a física da pressão de degenerescência (Aula 1) e derive (qualitativamente) o Limite de Chandrasekhar.'
                    },
                    questoes: questoesObjetosCompactos
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Equação de Estado (EoS) Nuclear',
                        descricao: 'Discuta a estrutura interna de uma Estrela de Nêutrons (Aula 2) e a incerteza na EoS da matéria nuclear.'
                    },
                    questoes: questoesObjetosCompactos
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Limite TOV',
                        descricao: 'Explique como o limite de Tolman-Oppenheimer-Volkoff (Aula 2) estabelece a massa máxima para uma estrela de nêutrons.'
                    },
                    questoes: questoesObjetosCompactos
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Eletrodinâmica de Pulsares',
                        descricao: 'Descreva o modelo do "farol" (Aula 3) e a física da magnetosfera que gera a emissão coerente de rádio.'
                    },
                    questoes: questoesObjetosCompactos
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Magnetares e Surtos de Raios Gama',
                        descricao: 'Investigue a física dos Magnetares (Aula 4), objetos com os campos magnéticos mais intensos do universo.'
                    },
                    questoes: questoesObjetosCompactos
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Matéria Extrema',
                        descricao: 'Avaliação final (Aula 5) comparando os processos físicos que sustentam Anãs Brancas e Estrelas de Nêutrons.'
                    },
                    questoes: questoesObjetosCompactos
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Matéria Degenerada: Anãs Brancas e o Limite de Chandrasekhar',
                    subtitulo: 'Aula 1',
                    descricao: 'A física estatística da pressão de degenerescência eletrônica (relativística e não-relativística).'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Estrelas de Nêutrons: EoS Nuclear e o Limite TOV',
                    subtitulo: 'Aula 2',
                    descricao: 'A Equação de Estado (EoS) da matéria nuclear densa e o limite de massa Tolman-Oppenheimer-Volkoff.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Pulsares e o Modelo do "Farol"',
                    subtitulo: 'Aula 3',
                    descricao: 'Eletrodinâmica de um dipolo magnético rotativo. A física da magnetosfera e mecanismos de emissão.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Magnetares e Surtos de Raios Gama (SGRs)',
                    subtitulo: 'Aula 4',
                    descricao: 'A física de campos magnéticos extremos (B > 10^14 G), "starquakes" e rajadas gama suaves.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Revisão Comparativa: Anãs Brancas vs. Estrelas de Nêutrons',
                    subtitulo: 'Aula 5',
                    descricao: 'Comparando mecanismos de formação, sustentação (degenerescência) e resfriamento (neutrinos vs. fótons).'
                }
            ]
        },
        {
            terminado: false,
            id: 8000002,
            template: {
                titulo: 'Física Avançada de Buracos Negros',
                descricao: 'A fronteira da física teórica: Teorema No-Hair, Termodinâmica, Radiação Hawking, Singularidades e o Paradoxo da Informação.'
            },
            introducao: {
                descricao: 'Este módulo avança além da astrofísica para explorar os buracos negros como laboratórios teóricos. Investigamos o que a RG diz sobre suas propriedades (Teorema No-Hair), a conexão surpreendente com a termodinâmica, e o conflito com a Mecânica Quântica (Radiação Hawking e Paradoxo da Informação).',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: O Teorema "No-Hair" (Sem Cabelo)',
                        descricao: 'Discuta as implicações do Teorema No-Hair (Aula 1). Por que um buraco negro é definido apenas por M, Q e J?'
                    },
                    questoes: questoesFisicaBN
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: As Leis da Termodinâmica de BN',
                        descricao: 'Explique as quatro leis da termodinâmica de buracos negros (Aula 2), focando na relação entre área do horizonte e entropia.'
                    },
                    questoes: questoesFisicaBN
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: A Evaporação Quântica (Radiação Hawking)',
                        descricao: 'Descreva o processo de criação de pares (Aula 3) que leva à Radiação Hawking. Qual a temperatura de um BN?'
                    },
                    questoes: questoesFisicaBN
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Paradoxo da Informação',
                        descricao: 'Explique por que a evaporação de buracos negros (Aula 4) viola a unitariedade da Mecânica Quântica.'
                    },
                    questoes: questoesFisicaBN
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: A Natureza da Singularidade',
                        descricao: 'Compare a singularidade de ponto (Schwarzschild) com a singularidade de anel (Kerr) (Aula 5). O que é a Hipótese da Censura Cósmica?'
                    },
                    questoes: questoesFisicaBN
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão: RG vs. MQ',
                        descricao: 'Avaliação final (Aula 6) sobre os pontos de conflito e sinergia entre a Relatividade Geral e a Mecânica Quântica na física de buracos negros.'
                    },
                    questoes: questoesFisicaBN
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — O Teorema "No-Hair": Classificando Buracos Negros',
                    subtitulo: 'Aula 1',
                    descricao: 'As soluções de Schwarzschild, Reissner-Nordström e Kerr. O que a RG permite que um buraco negro "seja".'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Termodinâmica de Buracos Negros (Bekenstein-Hawking)',
                    subtitulo: 'Aula 2',
                    descricao: 'As leis da mecânica de buracos negros e sua analogia com a termodinâmica. Entropia como área do horizonte.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Radiação Hawking e Evaporação de Buracos Negros',
                    subtitulo: 'Aula 3',
                    descricao: 'Teoria Quântica de Campos em espaço-tempo curvo. O processo de criação de pares e a temperatura do horizonte.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — O Paradoxo da Informação e o "Firewall"',
                    subtitulo: 'Aula 4',
                    descricao: 'O conflito between unitariedade (MQ) e o princípio da equivalência (RG). Possíveis soluções (ex: Holografia, Firewalls).'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — A Estrutura Interna: Singularidades e Censura Cósmica',
                    subtitulo: 'Aula 5',
                    descricao: 'A natureza da singularidade (ponto vs. anel). A Hipótese da Censura Cósmica de Penrose.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Fronteiras: Gravidade Quântica e Holografia (AdS/CFT)',
                    subtitulo: 'Aula 6',
                    descricao: 'Uma visão geral das tentativas de resolver os paradoxos (Teoria de Cordas, Gravidade Quântica em Loop) e o Princípio Holográfico.'
                }
            ]
        },
        {
            terminado: false,
            id: 8000003,
            template: {
                titulo: 'Física da Formação de Galáxias',
                descricao: 'A física de fusões (mergers), fricção dinâmica e os mecanismos de "feedback" de Supernovas e AGNs.'
            },
            introducao: {
                descricao: 'Como galáxias como a Via Láctea se formam? Este módulo foca na física da formação de galáxias: o modelo hierárquico, a fricção dinâmica que guia fusões, e a batalha crucial entre o resfriamento do gás e os mecanismos de "feedback" (Supernovas e AGNs) que regulam o crescimento.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: A Função de Massa de Halos',
                        descricao: 'Discuta o formalismo de Press-Schechter (Aula 1) e como ele prevê a abundância de halos de matéria escura em diferentes massas e redshifts.'
                    },
                    questoes: questoesFormacaoGalaxias
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Física das Fusões (Mergers)',
                        descricao: 'Explique o conceito de "fricção dinâmica" (Aula 2) e como ela determina o tempo de escala para a fusão de galáxias satélites.'
                    },
                    questoes: questoesFormacaoGalaxias
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: A Batalha do Gás (Resfriamento vs. Aquecimento)',
                        descricao: 'Descreva a "função de resfriamento" (cooling function) do gás (Aula 3) e por que ela leva a uma formação de estrelas ineficiente em halos massivos.'
                    },
                    questoes: questoesFormacaoGalaxias
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Feedback Estelar (Supernovas)',
                        descricao: 'Como o "feedback" de supernovas (Aula 4) regula a formação estelar, especialmente em galáxias de baixa massa?'
                    },
                    questoes: questoesFormacaoGalaxias
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Feedback de AGN e "Quenching"',
                        descricao: 'Compare o modo "Quasar" e o modo "Rádio/Jet" (Aula 5). Por que o feedback de AGN (Aula 6) é essencial para explicar o "quenching" de galáxias massivas?'
                    },
                    questoes: questoesFormacaoGalaxias
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Evolução de Galáxias',
                        descricao: 'Avaliação final sobre o modelo hierárquico e os processos físicos (fusões, feedback) que definem a evolução das galáxias.'
                    },
                    questoes: questoesFormacaoGalaxias
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Modelo Hierárquico e a Função de Massa do Halo',
                    subtitulo: 'Aula 1',
                    descricao: 'A base do ΛCDM: O formalismo de Press-Schechter e o crescimento hierárquico de halos de matéria escura.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Fricção Dinâmica e Fusões de Galáxias',
                    subtitulo: 'Aula 2',
                    descricao: 'A física da "fricção dinâmica" de Chandrasekhar e o "timing" de fusões (mergers) e interações.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — A Física do Gás: Resfriamento vs. Aquecimento',
                    subtitulo: 'Aula 3',
                    descricao: 'Resfriamento radiativo (cooling function), aquecimento por choque (shock heating) e o "cooling flow problem" em aglomerados.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Feedback Estelar (Supernovas e Ventos)',
                    subtitulo: 'Aula 4',
                    descricao: 'Como a energia de supernovas e ventos estelares impulsiona "ventos galácticos" e regula a formação estelar.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Feedback de AGN (Modo Quasar e Modo Rádio)',
                    subtitulo: 'Aula 5',
                    descricao: 'A física do feedback de buracos negros supermassivos: modo "quasar" (alta acreção) e modo "rádio/jet" (baixa acreção).'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — "Quenching" de Galáxias e a Bimodalidade',
                    subtitulo: 'Aula 6',
                    descricao: 'Juntando tudo: por que as galáxias são "vermelhas e mortas" ou "azuis e vivas"? O papel do "quenching" na bimodalidade galáctica.'
                }
            ]
        }
    ],
    galaxia: [
        {
            id: 4526672,
            terminado: false,
            template: {
                titulo: 'Física da Luz e Medidas em Astronomia',
                descricao: 'Espectros, magnitude, cor e distâncias básicas: como a luz revela propriedades dos astros.'
            },
            introducao: {
                descricao: 'Como a luz carrega informações sobre temperatura, composição e distância. Conceitos de magnitude, cor e técnicas básicas de medição.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Decifrando a Luz',
                        descricao: 'Com base nas Aulas 1 e 2, explique como a espectroscopia revela a composição e o movimento de um astro.'
                    },
                    questoes: questoesLuzMedidas
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Magnitude e Índice de Cor',
                        descricao: 'Aplique os conceitos da Aula 3. Responda questões sobre a escala de magnitudes e como a cor se relaciona com a temperatura.'
                    },
                    questoes: questoesLuzMedidas
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Medindo Distâncias',
                        descricao: 'Use o que aprendeu na Aula 4 sobre paralaxe e velas padrão para resolver problemas de estimativa de distância.'
                    },
                    questoes: questoesLuzMedidas
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: A Lei de Wien',
                        descricao: 'Concentre-se na relação entre a temperatura de um corpo negro e o pico de seu espectro de emissão.'
                    },
                    questoes: questoesLuzMedidas
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Incertezas na Prática',
                        descricao: 'Discuta os desafios e fontes de erro em medições astronômicas, como visto na Aula 5.'
                    },
                    questoes: questoesLuzMedidas
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Fotometria e Espectroscopia',
                        descricao: 'Questionário final do módulo (Aula 6), integrando todos os conceitos sobre como medimos as propriedades dos astros.'
                    },
                    questoes: questoesLuzMedidas
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 1 — Natureza da Luz',
                    subtitulo: 'Aula 1',
                    descricao: 'Comprimento de onda, frequência e energia. Espectros contínuos e de linhas.'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 2 — Espectroscopia',
                    subtitulo: 'Aula 2',
                    descricao: 'Linhas de absorção/emissão e o que revelam sobre composição e movimento.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 3 — Magnitudes e Cores',
                    subtitulo: 'Aula 3',
                    descricao: 'Escala de magnitudes, índice de cor e estimativas de temperatura.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 4 — Distâncias Básicas',
                    subtitulo: 'Aula 4',
                    descricao: 'Paralaxe, velas padrão e limitações.'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 5 — Erros e Incertezas',
                    subtitulo: 'Aula 5',
                    descricao: 'Como estimar e comunicar incertezas em astronomia observacional.'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 6 — Revisão e Aplicações',
                    subtitulo: 'Aula 6',
                    descricao: 'Aplicando os conceitos de fotometria e espectroscopia em casos reais.'
                }
            ]
        },
        {
            terminado: false,
            id: 5334546,
            template: {
                titulo: 'Formação Estelar e Meio Interestelar',
                descricao: 'Nuvens moleculares, protoestrelas, feedback estelar e o papel do gás e da poeira.'
            },
            introducao: {
                descricao: 'Da contração de nuvens moleculares ao nascimento de estrelas: fases, mecanismos de aquecimento e o impacto do feedback no meio interestelar.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Do Colapso à Protoestrela',
                        descricao: 'Resuma o processo de colapso de nuvens moleculares (Aula 1) até a formação de protoestrelas (Aula 2).'
                    },
                    questoes: questoesFormacaoEstelar
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Regulando o Nascimento: Feedback',
                        descricao: 'Explique o que é "feedback estelar" (ventos, radiação) e como ele afeta o meio interestelar (Aula 3).'
                    },
                    questoes: questoesFormacaoEstelar
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Papel da Poeira e Gás',
                        descricao: 'Comente o papel da poeira na observação da formação estelar (extinção) e o que são Regiões HII (Aula 4).'
                    },
                    questoes: questoesFormacaoEstelar
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Medindo a Formação Estelar',
                        descricao: 'Quais são os "observáveis" (Aula 5) usados para medir a taxa de formação estelar em galáxias?'
                    },
                    questoes: questoesFormacaoEstelar
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Propriedades do ISM',
                        descricao: 'Descreva os diferentes componentes do Meio Interestelar (gás ionizado, neutro, molecular).'
                    },
                    questoes: questoesFormacaoEstelar
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 2',
                        descricao: 'Questionário final (Aula 6) integrando os processos de formação estelar e a física do ISM.'
                    },
                    questoes: questoesFormacaoEstelar
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 1 — Nuvens Moleculares',
                    subtitulo: 'Aula 1',
                    descricao: 'Propriedades físicas, resfriamento e critérios de colapso (Jeans).'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 2 — Protoestrelas',
                    subtitulo: 'Aula 2',
                    descricao: 'Fases de formação e evolução inicial.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 3 — Feedback Estelar',
                    subtitulo: 'Aula 3',
                    descricao: 'Ventos, radiação e supernovas regulando a formação de estrelas.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 4 — Meio Interestelar',
                    subtitulo: 'Aula 4',
                    descricao: 'Gás ionizado, neutro e molecular; poeira e regiões HII.'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 5 — Observáveis',
                    subtitulo: 'Aula 5',
                    descricao: 'Taxa de formação estelar, linhas de emissão e calibradores.'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoGalaxia.mp4',
                    titulo: 'Aula 6 — Revisão do Módulo',
                    subtitulo: 'Aula 6',
                    descricao: 'Consolidação dos conceitos de formação estelar e ISM.'
                }
            ]
        },
        {
            terminado: false,
            id: 1468523,
            template: {
                titulo: 'Estrutura da Via Láctea',
                descricao: 'Disco, bojo e halo; rotação galáctica e a localização do Sistema Solar.'
            },
            introducao: {
                descricao: 'Um tour pela nossa galáxia: componentes estruturais, rotação, matéria escura e onde nos encontramos no disco galáctico.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Anatomia da Galáxia',
                        descricao: 'Descreva as principais componentes da Via Láctea (disco, bojo, halo) e suas populações estelares (Aula 1).'
                    },
                    questoes: questoesViaLactea
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Enigma da Rotação',
                        descricao: 'Explique como medimos a rotação galáctica (Aula 2) e o que a curva de rotação indica sobre a matéria escura (Aula 4).'
                    },
                    questoes: questoesViaLactea
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Onde Estamos?',
                        descricao: 'Qual a nossa localização na galáxia (Aula 3) e o que isso implica para as observações (ex: "Zona de Evitamento")?'
                    },
                    questoes: questoesViaLactea
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Fósseis Galácticos',
                        descricao: 'O que são correntes estelares e subestruturas (Aula 5)? O que elas nos dizem sobre o passado da Via Láctea?'
                    },
                    questoes: questoesViaLactea
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Propriedades da Vizinhança',
                        descricao: 'Discuta as características da vizinhança solar e como ela se compara a outras regiões da galáxia.'
                    },
                    questoes: questoesViaLactea
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 3',
                        descricao: 'Consolide seu conhecimento (Aula 6) sobre a estrutura, dinâmica e composição da Via Láctea.'
                    },
                    questoes: questoesViaLactea
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Disco, Bojo e Halo',
                    subtitulo: 'Aula 1',
                    descricao: 'Características e populações estelares de cada componente.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Rotação Galáctica',
                    subtitulo: 'Aula 2',
                    descricao: 'Curvas de rotação, velocidade diferencial e implicações.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Vizinhança Solar',
                    subtitulo: 'Aula 3',
                    descricao: 'Onde estamos no disco e como inferimos a posição do Sol.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Matéria Escura na Via Láctea',
                    subtitulo: 'Aula 4',
                    descricao: 'Evidências dinâmicas e modelos de halo.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Subestruturas e Correntes Estelares',
                    subtitulo: 'Aula 5',
                    descricao: 'Evidências de eventos de acreção e rastros no halo.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Revisão do Módulo',
                    subtitulo: 'Aula 6',
                    descricao: 'Consolidando a visão da Via Láctea e suas dinâmicas.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345567,
            template: {
                titulo: 'Exoplanetas e Métodos de Detecção',
                descricao: 'Trânsito, velocidade radial e imagem direta; o que inferimos sobre atmosferas e habitabilidade.'
            },
            introducao: {
                descricao: 'Detectando mundos além do Sistema Solar: técnicas de trânsito, velocidade radial e imagem direta, e o que elas revelam sobre atmosferas e habitabilidade.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Métodos Indiretos: Trânsito e Velocidade Radial',
                        descricao: 'Compare os métodos de trânsito (Aula 1) e velocidade radial (Aula 2). O que cada um mede e o que inferimos (raio vs. massa mínima)?'
                    },
                    questoes: questoesExoplanetas
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Fotografando Mundos Distantes',
                        descricao: 'Quais são os desafios e limitações da imagem direta de exoplanetas? (Aula 3)'
                    },
                    questoes: questoesExoplanetas
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Analisando Atmosferas',
                        descricao: 'Explique como a espectroscopia de trânsito (Aula 4) nos permite inferir a composição da atmosfera de um exoplaneta.'
                    },
                    questoes: questoesExoplanetas
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O que é "Habitabilidade"?',
                        descricao: 'Discuta o conceito de "Zona Habitável" (Aula 5) e comente as limitações observacionais no estudo da habitabilidade.'
                    },
                    questoes: questoesExoplanetas
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Viés Observacional',
                        descricao: 'Discuta por que os primeiros métodos de detecção encontraram tantos "Júpiteres Quentes". O que é viés de seleção?'
                    },
                    questoes: questoesExoplanetas
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Teste final (Aula 6) sobre os métodos de detecção e caracterização de exoplanetas.'
                    },
                    questoes: questoesExoplanetas
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Método do Trânsito',
                    subtitulo: 'Aula 1',
                    descricao: 'Curvas de luz, raio planetário e efemérides.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Velocidade Radial',
                    subtitulo: 'Aula 2',
                    descricao: 'Deslocamento Doppler, massa mínima e limitações.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Imagem Direta',
                    subtitulo: 'Aula 3',
                    descricao: 'Contraste, coronógrafos e aplicações atuais.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Atmosferas Exoplanetárias',
                    subtitulo: 'Aula 4',
                    descricao: 'Espectroscopia de trânsito, composição e nuvens.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Habitabilidade',
                    subtitulo: 'Aula 5',
                    descricao: 'Zonas habitáveis e condições para vida.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Revisão do Módulo',
                    subtitulo: 'Aula 6',
                    descricao: 'Integração das técnicas e casos emblemáticos.'
                }
            ]
        },
        {
            terminado: false,
            id: 7453453,
            template: {
                titulo: 'Galáxias: Morfologia e Evolução',
                descricao: 'Classificação (espirais, elípticas, irregulares), interações e fusões ao longo do tempo.'
            },
            introducao: {
                descricao: 'Como classificamos galáxias e o que interações e fusões nos contam sobre sua evolução no tempo cósmico.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: O Zoológico Galáctico de Hubble',
                        descricao: 'Descreva a classificação morfológica de galáxias (Aula 1), diferenciando espirais, elípticas e irregulares.'
                    },
                    questoes: questoesMorfologiaEvolucao
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Estruturas Internas',
                        descricao: 'Qual o papel de barras, braços espirais e bojos na dinâmica e formação estelar de uma galáxia? (Aula 2)'
                    },
                    questoes: questoesMorfologiaEvolucao
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Canibalismo Galáctico',
                        descricao: 'Explique como interações e fusões (Aula 3) afetam a evolução galáctica e cite evidências observacionais (ex: caudas de maré).'
                    },
                    questoes: questoesMorfologiaEvolucao
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Universo Jovem',
                        descricao: 'Como a população de galáxias muda com o redshift (Aula 4)? As galáxias de hoje são iguais às do passado?'
                    },
                    questoes: questoesMorfologiaEvolucao
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Galáxias Ativas (Starburst e AGN)',
                        descricao: 'Diferencie um surto de formação estelar (Starburst) de um Núcleo Ativo de Galáxia (AGN) (Aula 5).'
                    },
                    questoes: questoesMorfologiaEvolucao
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Consolide (Aula 6) a conexão entre morfologia, ambiente e evolução das galáxias.'
                    },
                    questoes: questoesMorfologiaEvolucao
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Morfologias Clássicas',
                    subtitulo: 'Aula 1',
                    descricao: 'Espirais, elípticas, irregulares e a sequência de Hubble.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Barreiras, Discos e Bojos',
                    subtitulo: 'Aula 2',
                    descricao: 'Estruturas internas e correlações com formação estelar.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Interações e Fusões',
                    subtitulo: 'Aula 3',
                    descricao: 'Assinaturas observacionais e impactos na morfologia.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Evolução com o Redshift',
                    subtitulo: 'Aula 4',
                    descricao: 'Como a população de galáxias muda ao longo do tempo.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Estágios de Atividade',
                    subtitulo: 'Aula 5',
                    descricao: 'Starbursts e AGNs no contexto evolutivo.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Revisão do Módulo',
                    subtitulo: 'Aula 6',
                    descricao: 'Conexões entre morfologia, ambiente e evolução.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345253,
            template: {
                titulo: 'Cosmografia e Escalas do Universo',
                descricao: 'Velas padrão, diagrama HR e a escada de distâncias; mapas do céu em múltiplos comprimentos de onda.'
            },
            introducao: {
                descricao: 'Mapeando o cosmos: escada de distâncias, diagrama HR, paralaxe e o uso de múltiplos comprimentos de onda para construir mapas do céu.',
                pdf: '',
                video: '/VideosNebula/IntroducaoGalaxia.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: A Escada de Distâncias Cósmicas',
                        descricao: 'Explique o conceito da escada de distâncias (Aula 1). Por que precisamos de múltiplos "degraus" (calibradores)?'
                    },
                    questoes: questoesCosmografia
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Velas Padrão: Cefeidas',
                        descricao: 'Por que as Cefeidas (Aula 1) são tão importantes como velas padrão para distâncias extragalácticas?'
                    },
                    questoes: questoesCosmografia
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Diagrama HR como Ferramenta',
                        descricao: 'Descreva como o Diagrama HR (Aula 2) pode ser usado para estimar distâncias de aglomerados estelares (main-sequence fitting).'
                    },
                    questoes: questoesCosmografia
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Céu em Múltiplos Comprimentos',
                        descricao: 'O que diferentes faixas do espectro (ex: Rádio, Raio-X) revelam sobre o universo que o visível não mostra? (Aula 3)'
                    },
                    questoes: questoesCosmografia
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Limites da Observação',
                        descricao: 'Discuta os desafios da cosmografia, como extinção (reddening) e vieses de seleção (Aula 4).'
                    },
                    questoes: questoesCosmografia
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 6',
                        descricao: 'Teste final (Aula 6) sobre as técnicas de mapeamento e medição de escalas no Universo.'
                    },
                    questoes: questoesCosmografia
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Escada de Distâncias',
                    subtitulo: 'Aula 1',
                    descricao: 'De paralaxe a supernovas Ia: encadeando calibradores.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Diagrama HR e Padrões',
                    subtitulo: 'Aula 2',
                    descricao: 'Isócronas, paralaxe e estimativas de distância.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Mapas do Céu Multiespectrais',
                    subtitulo: 'Aula 3',
                    descricao: 'Do rádio ao raio-X: o que cada faixa revela.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Sistemáticos e Limites',
                    subtitulo: 'Aula 4',
                    descricao: 'Reddening, seleção e profundidade de levantamentos.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Catálogos e Ferramentas',
                    subtitulo: 'Aula 5',
                    descricao: 'Uso de catálogos e bancos de dados astronômicos.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Revisão do Módulo',
                    subtitulo: 'Aula 6',
                    descricao: 'Consolidação das técnicas de cosmografia e aplicações.'
                }
            ]
        }
    ],
    orbita: [
        {
            id: 4526672,
            terminado: false,
            template: {
                titulo: 'Astronomia para Iniciantes: o céu a olho nu',
                descricao: 'Conceitos básicos, movimentos aparentes e como reconhecer constelações no céu noturno.'
            },
            introducao: {
                descricao: 'Neste módulo você vai aprender a se orientar no céu noturno, entender por que os astros parecem nascer no leste e se pôr no oeste, reconhecer constelações e asterismos famosos e montar um roteiro simples para sua primeira noite de observação, mesmo em áreas com poluição luminosa.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Se Localizando no Céu',
                        descricao: 'Com base nas Aulas 1 e 2, aplique seu conhecimento sobre pontos cardeais e o movimento aparente do céu para responder às questões.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Reconhecimento de Constelações',
                        descricao: 'Teste sua habilidade de identificar padrões no céu. Use o que aprendeu na Aula 3 para descrever como localizar constelações famosas.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Desafio da Poluição Luminosa',
                        descricao: 'A Aula 4 discutiu o céu urbano. Explique os desafios da poluição luminosa e as técnicas para adaptar a visão ao escuro.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Planejando sua Observação',
                        descricao: 'Com base na Aula 5, crie um pequeno roteiro de observação. O que você procuraria em sua primeira noite?'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Prática de Orientação',
                        descricao: 'Resolva questões dissertativas sobre como a rotação da Terra afeta o que vemos e quando vemos.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 1',
                        descricao: 'Um questionário final (Aula 6) para consolidar todo o aprendizado sobre observação a olho nu, movimentos e constelações.'
                    },
                    questoes: questoesIniciantes
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoOrbita.mp4',
                    titulo: 'Orientação no céu: pontos cardeais e eclíptica',
                    subtitulo: 'Aula 1',
                    descricao: 'Como identificar pontos cardeais, a eclíptica e referências fáceis para se localizar sob o céu noturno.'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoOrbita.mp4',
                    titulo: 'Movimentos aparentes: rotação x translação',
                    subtitulo: 'Aula 2',
                    descricao: 'Entenda o que causa o movimento aparente diário e anual dos astros e como isso afeta suas observações.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoOrbita.mp4',
                    titulo: 'Constelações e asterismos: leitura do céu',
                    subtitulo: 'Aula 3',
                    descricao: 'Padrões mais conhecidos do céu, dicas práticas para reconhecer constelações e usar o céu como mapa.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoOrbita.mp4',
                    titulo: 'Céu urbano: poluição luminosa e adaptações',
                    subtitulo: 'Aula 4',
                    descricao: 'Como minimizar os efeitos da poluição luminosa e adaptar sua visão ao escuro para observar melhor.'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoOrbita.mp4',
                    titulo: 'Primeira observação: um roteiro simples',
                    subtitulo: 'Aula 5',
                    descricao: 'Planeje sua primeira noite: o que observar, horários e um checklist prático.'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoOrbita.mp4',
                    titulo: 'Revisão e boas práticas de observação',
                    subtitulo: 'Aula 6',
                    descricao: 'Resumo do módulo e práticas recomendadas para continuar evoluindo.'
                }
            ]
        },
        {
            terminado: false,
            id: 5334546,
            template: {
                titulo: 'Sistema Solar Essencial',
                descricao: 'Sol, planetas, luas e pequenos corpos: tamanhos, escalas e curiosidades do nosso quintal cósmico.'
            },
            introducao: {
                descricao: 'Um passeio guiado pelo Sistema Solar: do Sol aos planetas rochosos e gigantes gasosos, passando por luas, asteroides e cometas. Você vai comparar escalas, aprender curiosidades e entender por que nosso “quintal cósmico” é tão diverso.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: O Sol, Nossa Estrela',
                        descricao: 'Com base na Aula 1, descreva a estrutura básica do Sol e sua influência no Sistema Solar.'
                    },
                    questoes: questoesSistemaSolar
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Vizinhança Rochosa',
                        descricao: 'Explore os planetas rochosos (Aula 2). Compare as superfícies e atmosferas de Mercúrio, Vênus, Terra e Marte.'
                    },
                    questoes: questoesSistemaSolar
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Os Gigantes do Sistema',
                        descricao: 'Foco nas Aulas 3 e 4. Descreva as características dos gigantes gasosos (Júpiter, Saturno) e de gelo (Urano, Netuno).'
                    },
                    questoes: questoesSistemaSolar
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Pequenos Corpos, Grandes Histórias',
                        descricao: 'O que são asteroides e cometas? (Aula 5). Aponte as diferenças observáveis.'
                    },
                    questoes: questoesSistemaSolar
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Colocando em Escala',
                        descricao: 'Descreva, em escala qualitativa, as diferenças de tamanho e distância entre os corpos do Sistema Solar (Aula 6).'
                    },
                    questoes: questoesSistemaSolar
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 2',
                        descricao: 'Teste final: Verifique seu conhecimento sobre a ordem, características e escalas do Sistema Solar.'
                    },
                    questoes: questoesSistemaSolar
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoOrbita.mp4',
                    titulo: 'O Sol: nossa estrela',
                    subtitulo: 'Aula 1',
                    descricao: 'Estrutura básica, atividade solar e sua influência no Sistema Solar.'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoOrbita.mp4',
                    titulo: 'Planetas rochosos',
                    subtitulo: 'Aula 2',
                    descricao: 'Mercúrio, Vênus, Terra e Marte: superfícies, atmosferas e particularidades.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoOrbita.mp4',
                    titulo: 'Gigantes gasosos e anéis',
                    subtitulo: 'Aula 3',
                    descricao: 'Júpiter e Saturno, seus anéis e luas marcantes.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoOrbita.mp4',
                    titulo: 'Urano, Netuno e o limite do Sistema Solar',
                    subtitulo: 'Aula 4',
                    descricao: 'Características dos planetas de gelo e as fronteiras do nosso sistema.'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoOrbita.mp4',
                    titulo: 'Luas, asteroides e cometas',
                    subtitulo: 'Aula 5',
                    descricao: 'Pequenos corpos e grandes histórias: de Europa a cometas periódicos.'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoOrbita.mp4',
                    titulo: 'Escalas e distâncias do Sistema Solar',
                    subtitulo: 'Aula 6',
                    descricao: 'Modelos em escala e comparações para visualizar o tamanho do Sistema Solar.'
                }
            ]
        },
        {
            terminado: false,
            id: 1468523,
            template: {
                titulo: 'Estrelas e Constelações',
                descricao: 'Brilho, cor e tipos de estrelas; como ler cartas celestes e usar aplicativos de observação.'
            },
            introducao: {
                descricao: 'Você vai descobrir como as cores das estrelas se relacionam com a temperatura, o que é magnitude aparente e como usar cartas celestes e aplicativos para localizar constelações em diferentes épocas do ano.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Cor e Temperatura Estelar',
                        descricao: 'Explique a relação entre a cor de uma estrela (ex: azul vs. vermelha) e sua temperatura (Aula 1).'
                    },
                    questoes: questoesEstrelas
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Magnitude Aparente vs. Realidade',
                        descricao: 'Defina magnitude aparente (Aula 2) e comente por que uma estrela mais brilhante nem sempre é a mais próxima.'
                    },
                    questoes: questoesEstrelas
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Navegando com Mapas Celestes',
                        descricao: 'Descreva como usar um planisfério ou app (Aula 3) para localizar uma constelação em uma data específica.'
                    },
                    questoes: questoesEstrelas
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Céu de Cada Estação',
                        descricao: 'Cite constelações visíveis em diferentes estações (Aula 4) e como identificá-las.'
                    },
                    questoes: questoesEstrelas
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Guia de Observação Inicial',
                        descricao: 'Liste alguns dos objetos fáceis (Aula 5) para iniciantes e o que esperar ver.'
                    },
                    questoes: questoesEstrelas
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 3',
                        descricao: 'Consolide seu conhecimento (Aula 6) sobre como ler o céu e entender as propriedades básicas das estrelas.'
                    },
                    questoes: questoesEstrelas
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Cores e temperaturas estelares',
                    subtitulo: 'Aula 1',
                    descricao: 'Por que estrelas azuis são mais quentes que as vermelhas e como isso aparece no céu.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Magnitude e brilho aparente',
                    subtitulo: 'Aula 2',
                    descricao: 'Como comparamos o brilho das estrelas e por que brilho não indica distância.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Cartas celestes e aplicativos',
                    subtitulo: 'Aula 3',
                    descricao: 'Lendo mapas do céu e usando apps para localizar objetos com precisão.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Constelações sazonais',
                    subtitulo: 'Aula 4',
                    descricao: 'Quais constelações observar em cada estação e como encontrá-las.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Objetos fáceis para iniciantes',
                    subtitulo: 'Aula 5',
                    descricao: 'Estrelas e asterismos ideais para as primeiras sessões, a olho nu ou com binóculos.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Revisão e prática guiada',
                    subtitulo: 'Aula 6',
                    descricao: 'Revisão do módulo com um roteiro de prática para a semana.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345567,
            template: {
                titulo: 'Telescópios e Observação',
                descricao: 'Tipos de instrumentos, aumentos, filtros e boas práticas para observar o céu com segurança.'
            },
            introducao: {
                descricao: 'Conheça os tipos de telescópios, diferenças entre refratores e refletores, como escolher oculares e entender aumentos, além de montagens, alinhamento e regras essenciais de segurança para observar o céu — especialmente o Sol.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: Escolhendo seu Instrumento',
                        descricao: 'Compare telescópios refratores e refletores (Aula 1), listando vantagens e desvantagens para iniciantes.'
                    },
                    questoes: questoesTelescopios
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Mito do "Aumento Infinito"',
                        descricao: 'O que é aumento útil (Aula 2)? Por que "mais aumento" nem sempre é melhor?'
                    },
                    questoes: questoesTelescopios
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Montagem e Alinhamento',
                        descricao: 'Descreva os princípios básicos das montagens azimutal e equatorial e a importância do alinhamento (Aulas 3 e 4).'
                    },
                    questoes: questoesTelescopios
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Observação Solar: Segurança Primeiro!',
                        descricao: 'Descreva DUAS boas práticas de segurança ao observar o Sol (Aula 5) e por que são essenciais.'
                    },
                    questoes: questoesTelescopios
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Acessórios: Oculares e Filtros',
                        descricao: 'Explique o papel das oculares e filtros para realçar o contraste e garantir a segurança.'
                    },
                    questoes: questoesTelescopios
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Prepare seu checklist para a primeira sessão prática com um telescópio (Aula 6).'
                    },
                    questoes: questoesTelescopios
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Tipos de telescópio: refrator x refletor',
                    subtitulo: 'Aula 1',
                    descricao: 'Como cada tipo funciona e qual faz mais sentido para começar.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Oculares, aumentos e campo de visão',
                    subtitulo: 'Aula 2',
                    descricao: 'Escolha de oculares e por que aumento “infinito” não existe.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Montagens: azimutal e equatorial',
                    subtitulo: 'Aula 3',
                    descricao: 'Princípios de operação e quando preferir cada uma.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Alinhamento polar e rastreio',
                    subtitulo: 'Aula 4',
                    descricao: 'Passo a passo para um alinhamento rápido e eficaz.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Segurança na observação (Sol incluso)',
                    subtitulo: 'Aula 5',
                    descricao: 'Regras indispensáveis de segurança e uso de filtros.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Checklist de observação',
                    subtitulo: 'Aula 6',
                    descricao: 'Do preparo do equipamento ao registro da sessão.'
                }
            ]
        },
        {
            terminado: false,
            id: 7453453,
            template: {
                titulo: 'Fenômenos do Céu',
                descricao: 'Fases da Lua, eclipses e chuvas de meteoros: quando acontecem e como acompanhar.'
            },
            introducao: {
                descricao: 'Entenda as fases da Lua, por que os eclipses são raros e como se preparar para observar chuvas de meteoros, conjunções e outros eventos astronômicos ao longo do ano.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: As Faces da Lua',
                        descricao: 'Explique por que a Lua tem fases, baseando-se na geometria Sol-Terra-Lua (Aula 1).'
                    },
                    questoes: questoesFenomenos
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Quando a Sombra Cobre o Céu',
                        descricao: 'Por que não ocorrem eclipses solares e lunares todos os meses? (Aula 2). Diferencie um eclipse total de um anular.'
                    },
                    questoes: questoesFenomenos
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Planejando uma Chuva de Meteoros',
                        descricao: 'Como se planejar para observar uma chuva de meteoros (Aula 3)? Considere horário, direção e condições.'
                    },
                    questoes: questoesFenomenos
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Encontros Cósmicos',
                        descricao: 'O que são conjunções e ocultações? (Aula 4). Como elas diferem de eclipses?'
                    },
                    questoes: questoesFenomenos
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Usando Calendários Astronômicos',
                        descricao: 'Pratique o uso de efemérides (Aula 5) para prever o próximo fenômeno visível em sua região.'
                    },
                    questoes: questoesFenomenos
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Teste seu conhecimento (Aula 6) sobre os principais fenômenos celestes e sua previsibilidade.'
                    },
                    questoes: questoesFenomenos
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Fases da Lua',
                    subtitulo: 'Aula 1',
                    descricao: 'Geometria Sol–Terra–Lua e como prever as fases.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Eclipses solares e lunares',
                    subtitulo: 'Aula 2',
                    descricao: 'Por que não temos eclipses todos os meses e como acompanhá-los com segurança.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Chuvas de meteoros',
                    subtitulo: 'Aula 3',
                    descricao: 'Como se formam e como planejar a melhor observação.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Conjunções e ocultações',
                    subtitulo: 'Aula 4',
                    descricao: 'O que são e como prever esses alinhamentos aparentes.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Efemérides e calendários astronômicos',
                    subtitulo: 'Aula 5',
                    descricao: 'Fontes confiáveis para acompanhar eventos ao longo do ano.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Revisão e planejamento de observações',
                    subtitulo: 'Aula 6',
                    descricao: 'Como escolher eventos, horários e locais para observar com sucesso.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345253,
            template: {
                titulo: 'Ciclo de Vida das Estrelas (visão geral)',
                descricao: 'Da formação à morte estelar em linguagem acessível, com exemplos marcantes no céu.'
            },
            introducao: {
                descricao: 'Uma visão ampla do ciclo de vida estelar: do nascimento em nuvens moleculares à sequência principal e aos diferentes finais, como anãs brancas e supernovas. Exemplos fáceis de relacionar com objetos do céu noturno.',
                pdf: '',
                video: '/VideosNebula/IntroducaoOrbita.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1: O Berçário Estelar',
                        descricao: 'Resuma como estrelas nascem a partir de nuvens de gás e poeira (Aula 1).'
                    },
                    questoes: questoesCicloEstelar
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Longa Vida na Sequência Principal',
                        descricao: 'O que define a sequência principal? (Aula 2). Por que estrelas como o Sol são estáveis por bilhões de anos?'
                    },
                    questoes: questoesCicloEstelar
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Fim das Estrelas como o Sol',
                        descricao: 'Descreva o que é uma nebulosa planetária e uma anã branca (Aula 3).'
                    },
                    questoes: questoesCicloEstelar
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Morte Explosiva: Supernovas',
                        descricao: 'Explique por que estrelas massivas têm vidas curtas e estão associadas a supernovas (Aula 4).'
                    },
                    questoes: questoesCicloEstelar
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Vendo o Ciclo no Céu',
                        descricao: 'Cite exemplos de objetos no céu (Aula 5) que ilustram diferentes estágios da vida estelar (ex: Nebulosa de Órion, Pleiades, etc.).'
                    },
                    questoes: questoesCicloEstelar
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 6',
                        descricao: 'Consolide o panorama geral do ciclo de vida estelar (Aula 6).'
                    },
                    questoes: questoesCicloEstelar
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Nascimento: nuvens e protoestrelas',
                    subtitulo: 'Aula 1',
                    descricao: 'Colapso de nuvens, discos e os primeiros passos de uma estrela.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Sequência principal: equilíbrio estelar',
                    subtitulo: 'Aula 2',
                    descricao: 'Fusão nuclear e estabilidade: por que o Sol está estável há bilhões de anos.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Finais de baixa massa: gigantes e anãs brancas',
                    subtitulo: 'Aula 3',
                    descricao: 'Evolução pós-sequência principal e nebulosas planetárias.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Finais de alta massa: supernovas e remanescentes',
                    subtitulo: 'Aula 4',
                    descricao: 'Quando a morte é explosiva: pulsares, nebulosas de supernova e buracos negros.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Exemplos no céu para observar',
                    subtitulo: 'Aula 5',
                    descricao: 'Objetos e regiões do céu noturno que ilustram cada etapa.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Revisão do ciclo estelar',
                    subtitulo: 'Aula 6',
                    descricao: 'Amarrando conceitos e preparando-se para observar e ensinar.'
                }
            ]
        }
    ]
}