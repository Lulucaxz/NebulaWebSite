// Questões base para o curso Órbita (modulares por tema)
const questoesIniciantes = [
    { questao: 'Explique, com suas palavras, por que as estrelas parecem “nascer” no leste e “se pôr” no oeste ao longo da noite.', dissertativa: true },
    { questao: 'Cite duas constelações fáceis de reconhecer no céu e descreva um método simples para identificá-las.', dissertativa: true },
    { questao: 'Qual a melhor prática para observar o céu a olho nu em uma cidade grande? Comente sobre poluição luminosa e adaptação da visão ao escuro.', dissertativa: true },
    { questao: 'O movimento aparente diário do céu é causado principalmente por:', dissertativa: false, alternativas: ['Translação da Terra', 'Rotação da Terra', 'Movimento do Sol ao redor da Terra', 'Precessão dos equinócios'] }
];

const questoesSistemaSolar = [
    { questao: 'Descreva, em escala qualitativa, as diferenças de tamanho entre o Sol, planetas e luas.', dissertativa: true },
    { questao: 'Escolha um planeta do Sistema Solar e escreva três curiosidades sobre ele (rotação, atmosfera, luas, etc.).', dissertativa: true },
    { questao: 'O que são asteroides e cometas? Aponte uma diferença observável entre eles.', dissertativa: true },
    { questao: 'A ordem correta dos planetas a partir do Sol é:', dissertativa: false, alternativas: ['Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno', 'Mercúrio, Terra, Vênus, Marte, Júpiter, Saturno, Urano, Netuno', 'Vênus, Mercúrio, Terra, Marte, Júpiter, Saturno, Urano, Netuno', 'Terra, Marte, Mercúrio, Vênus, Júpiter, Saturno, Urano, Netuno'] }
];

const questoesEstrelas = [
    { questao: 'Explique a relação entre cor e temperatura das estrelas (ex.: azul x vermelha).', dissertativa: true },
    { questao: 'Como usar um mapa celeste (planisfério) para localizar uma estrela ou constelação em uma data e horário específicos?', dissertativa: true },
    { questao: 'Defina magnitude aparente e comente por que uma estrela mais brilhante nem sempre é a mais próxima.', dissertativa: true },
    { questao: 'Cores estelares indicam principalmente:', dissertativa: false, alternativas: ['Idade', 'Temperatura', 'Composição química única', 'Tamanho do sistema planetário'] }
];

const questoesTelescopios = [
    { questao: 'Compare telescópios refratores e refletores: principais vantagens e desvantagens para iniciantes.', dissertativa: true },
    { questao: 'O que é aumento útil e por que “mais aumento” nem sempre significa “melhor observação”?', dissertativa: true },
    { questao: 'Descreva duas boas práticas de segurança ao observar o Sol e por que elas são essenciais.', dissertativa: true },
    { questao: 'Filtros e oculares são usados principalmente para:', dissertativa: false, alternativas: ['Aumentar o brilho', 'Alterar a cor do astro', 'Realçar contraste e segurança', 'Focar automaticamente'] }
];

const questoesFenomenos = [
    { questao: 'Explique por que a Lua tem fases e por que não ocorre eclipse solar e lunar todos os meses.', dissertativa: true },
    { questao: 'Como se planejar para observar uma chuva de meteoros (horário, direção, condições do céu)?', dissertativa: true },
    { questao: 'O que diferencia um eclipse solar total de um anular? Descreva brevemente.', dissertativa: true },
    { questao: 'As fases da Lua são causadas principalmente por:', dissertativa: false, alternativas: ['Sombra da Terra', 'Posição relativa Sol–Terra–Lua', 'Rotação da Lua', 'Nuvens na atmosfera'] }
];

const questoesCicloEstelar = [
    { questao: 'Resuma as etapas principais do ciclo de vida estelar em linguagem simples.', dissertativa: true },
    { questao: 'O que é uma nebulosa planetária e em que fase de vida estelar ela ocorre?', dissertativa: true },
    { questao: 'Explique por que estrelas muito massivas têm vidas mais curtas do que estrelas como o Sol.', dissertativa: true },
    { questao: 'Uma supernova está associada geralmente a:', dissertativa: false, alternativas: ['Nascimento de estrelas', 'Morte de estrelas massivas', 'Planetas gigantes', 'Cometas brilhantes'] }
];

// Banco de questões: curso Universo
const questoesBBang = [
    { questao: 'Explique por que a expansão do Universo é uma conclusão observacional e não apenas teórica.', dissertativa: true },
    { questao: 'Descreva o papel da radiação cósmica de fundo na cosmologia moderna.', dissertativa: true },
    { questao: 'Resuma a nucleossíntese primordial e os elementos leves produzidos.', dissertativa: true },
    { questao: 'O desvio para o vermelho galáctico é interpretado como:', dissertativa: false, alternativas: ['Efeito Doppler local de estrelas', 'Expansão do espaço entre galáxias', 'Aproximação da Via Láctea', 'Erro sistemático instrumental'] }
];

const questoesMateriaEnergiaEscura = [
    { questao: 'Cite duas evidências independentes para a existência de matéria escura.', dissertativa: true },
    { questao: 'Explique o que são curvas de rotação galáctica e o que indicam.', dissertativa: true },
    { questao: 'Resuma a evidência da aceleração cósmica obtida com supernovas tipo Ia.', dissertativa: true },
    { questao: 'Lentes gravitacionais fortes e fracas são úteis para:', dissertativa: false, alternativas: ['Medir temperaturas de estrelas', 'Inferir distribuição de massa (visível e escura)', 'Calibrar espectros', 'Detectar ondas gravitacionais diretamente'] }
];

const questoesEstruturaUniverso = [
    { questao: 'Descreva a teia cósmica e como filamentos e vazios se organizam.', dissertativa: true },
    { questao: 'Qual o papel da gravidade no crescimento de estruturas a partir de flutuações primordiais?', dissertativa: true },
    { questao: 'Como levantamentos de galáxias mapeiam a estrutura em grande escala?', dissertativa: true },
    { questao: 'O espectro de potência da matéria fornece:', dissertativa: false, alternativas: ['Distribuição de temperaturas estelares', 'Distribuição estatística de flutuações em escalas', 'Histórico químico de galáxias', 'Idades de aglomerados globulares'] }
];

const questoesRelatividadeBuracosNegros = [
    { questao: 'Explique a curvatura do espaço-tempo e como ela afeta o movimento de corpos.', dissertativa: true },
    { questao: 'Defina horizonte de eventos e sua relevância observacional.', dissertativa: true },
    { questao: 'Comente sobre a detecção de ondas gravitacionais e o que elas nos dizem.', dissertativa: true },
    { questao: 'Um buraco negro pode ser detectado indiretamente por:', dissertativa: false, alternativas: ['Emissão de luz do interior', 'Efeito gravitacional sobre matéria vizinha', 'Sombra projetada por um planeta', 'Mudanças na cor do céu noturno'] }
];

const questoesCosmologiaObservacional = [
    { questao: 'Explique o conceito de vela padrão e dê um exemplo.', dissertativa: true },
    { questao: 'Descreva brevemente como se mede H0 e por que há tensões entre métodos.', dissertativa: true },
    { questao: 'Comente o papel de lentes gravitacionais na medição de parâmetros cosmológicos.', dissertativa: true },
    { questao: 'O parâmetro Ωm representa:', dissertativa: false, alternativas: ['Densidade de energia escura', 'Densidade de matéria (normal + escura)', 'Curvatura espacial', 'Temperatura média do CMB'] }
];

const questoesInflacao = [
    { questao: 'Explique o problema do horizonte e como a inflação o resolve.', dissertativa: true },
    { questao: 'Descreva o problema da planitude e a solução inflacionária.', dissertativa: true },
    { questao: 'Comente como flutuações quânticas geram anisotropias no CMB.', dissertativa: true },
    { questao: 'O espectro quase invariante de escala observado no CMB é consistente com:', dissertativa: false, alternativas: ['Ausência de inflação', 'Modelos inflacionários', 'Universo estático', 'Apenas matéria bariônica'] }
];

// Banco de questões: curso Galáxia
const questoesLuzMedidas = [
    { questao: 'Explique o que é um espectro e como ele revela composição de um astro.', dissertativa: true },
    { questao: 'Defina magnitude aparente e cor (índice de cor) em astronomia.', dissertativa: true },
    { questao: 'Descreva um método básico para estimar distâncias estelares.', dissertativa: true },
    { questao: 'A lei de Wien relaciona:', dissertativa: false, alternativas: ['Temperatura e pico do espectro', 'Massa e luminosidade', 'Idade e metalicidade', 'Velocidade radial e distância'] }
];

const questoesFormacaoEstelar = [
    { questao: 'Resuma o processo de colapso de nuvens moleculares até protoestrelas.', dissertativa: true },
    { questao: 'Explique feedback estelar e seus efeitos no meio interestelar.', dissertativa: true },
    { questao: 'Comente o papel da poeira na formação estelar e observações.', dissertativa: true },
    { questao: 'Regiões HII são:', dissertativa: false, alternativas: ['Nuvens de poeira fria', 'Gás ionizado por estrelas jovens', 'Aglomerados globulares antigos', 'Buracos negros supermassivos'] }
];

const questoesViaLactea = [
    { questao: 'Descreva as principais componentes da Via Láctea (disco, bojo, halo).', dissertativa: true },
    { questao: 'Explique como medimos a rotação galáctica.', dissertativa: true },
    { questao: 'Onde estamos localizados na galáxia e o que isso implica para observações?', dissertativa: true },
    { questao: 'A curva de rotação da Via Láctea indica:', dissertativa: false, alternativas: ['Somente matéria bariônica', 'Presença de matéria escura', 'Universo estático', 'Erro de medição sistemático'] }
];

const questoesExoplanetas = [
    { questao: 'Compare os métodos de trânsito e velocidade radial para detectar exoplanetas.', dissertativa: true },
    { questao: 'Explique o que podemos inferir sobre atmosferas de exoplanetas.', dissertativa: true },
    { questao: 'Comente limitações observacionais no estudo de habitabilidade.', dissertativa: true },
    { questao: 'O método de trânsito mede:', dissertativa: false, alternativas: ['Variações de velocidade da estrela', 'Queda no brilho quando o planeta passa à frente', 'Imagem direta do planeta', 'Emissão térmica do planeta'] }
];

const questoesMorfologiaEvolucao = [
    { questao: 'Descreva a classificação morfológica de galáxias (Hubble).', dissertativa: true },
    { questao: 'Explique como interações e fusões afetam a evolução galáctica.', dissertativa: true },
    { questao: 'Comente evidências observacionais de eventos de fusão.', dissertativa: true },
    { questao: 'Galáxias elípticas tendem a ser associadas a:', dissertativa: false, alternativas: ['Formação estelar intensa recente', 'Populações estelares mais velhas', 'Discos com braços espirais proeminentes', 'Altas taxas de gás frio'] }
];

const questoesCosmografia = [
    { questao: 'Explique o conceito de escada de distâncias cósmicas.', dissertativa: true },
    { questao: 'Descreva o diagrama HR e seu uso em estimar distâncias.', dissertativa: true },
    { questao: 'Comente o uso de múltiplos comprimentos de onda em cosmografia.', dissertativa: true },
    { questao: 'Cefeidas são importantes porque:', dissertativa: false, alternativas: ['Mede-se sua temperatura com precisão', 'São velas padrão para distâncias extragalácticas', 'São sempre parte de galáxias anãs', 'Têm brilho absolutamente constante'] }
];

export const initial_cursos = {
    universo: [
        {
            id: 4526672,
            terminado: false,
            template: {
                titulo: 'Cosmologia do Big Bang',
                descricao: 'Modelos de expansão, radiação cósmica de fundo e nucleossíntese primordial: como sabemos que o Universo está se expandindo.'
            },
            introducao: {
                descricao: `Esta introdução oferece uma visão geral detalhada sobre o tema do módulo, destacando os principais pontos que serão aprofundados nas videoaulas e atividades. 
        Ela serve para contextualizar o aprendizado e preparar o aluno para os desafios que virão, mostrando a relevância dos conteúdos para sua formação e aplicação futura. 
        Também apresentamos um panorama dos recursos que estarão disponíveis para auxiliar no estudo.`,
                pdf: '',
                videoBackground: '/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                {
                    id: 6134589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1 - Título Genérico',
                        descricao: `Nesta atividade inicial, você será convidado a aplicar os conceitos básicos abordados até agora por meio de exercícios práticos que reforçam o aprendizado. 
            Os desafios propostos visam estimular a reflexão crítica sobre o conteúdo e a capacidade de relacionar teoria e prática.`
                    },
                    questoes: questoesBBang
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2 - Título Genérico',
                        descricao: `A segunda atividade aprofunda os temas estudados, propondo desafios que exigem análise detalhada dos conceitos e a capacidade de conectar diferentes ideias para resolver problemas. 
            Essa etapa incentiva o desenvolvimento do raciocínio lógico.`
                    },
                    questoes: questoesBBang
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3 - Título Genérico',
                        descricao: `Esta atividade consiste em exercícios que estimulam a aplicação prática dos conhecimentos em situações simuladas, promovendo o desenvolvimento de habilidades específicas. 
            Ela tem como objetivo proporcionar uma experiência de.`
                    },
                    questoes: questoesBBang
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4 - Título Genérico',
                        descricao: `O objetivo desta atividade é consolidar o aprendizado por meio da resolução de casos práticos, incentivando a análise crítica e a criatividade na solução de problemas. 
            Você será desafiado a utilizar o conhecimento adquirido.`
                    },
                    questoes: questoesBBang
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5 - Título Genérico',
                        descricao: `Aqui você irá explorar diferentes perspectivas e aprofundar seu entendimento, utilizando técnicas e conceitos apresentados nas videoaulas anteriores. 
            Essa etapa visa desenvolver a capacidade de avaliação.`
                    },
                    questoes: questoesBBang
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6 - Título Genérico',
                        descricao: `Nesta última atividade do módulo, será feita uma revisão geral com exercícios integradores, preparando você para os próximos módulos e consolidando os conhecimentos adquiridos. 
            O foco é a aplicação integrada dos conceitos para.`
                    },
                    questoes: questoesBBang
                }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/videos/Aula_1.mp4',
                    titulo: 'Aula 1 — Expansão e Lei de Hubble',
                    subtitulo: 'Aula 1',
                    descricao: `Como o redshift e a lei de Hubble evidenciam a expansão do Universo. Medidas, incertezas e limites observacionais.`
                },
                {
                    id: 5623943,
                    video: '/videos/Aula_2.mp4',
                    titulo: 'Aula 2 — Radiação Cósmica de Fundo (CMB)',
                    subtitulo: 'Aula 2',
                    descricao: `Origem do CMB, isotropias e anisotropias, e o que aprendemos sobre as fases iniciais do cosmos.`
                },
                {
                    id: 5532743,
                    video: '/videos/Aula_3.mp4',
                    titulo: 'Aula 3 — Nucleossíntese Primordial',
                    subtitulo: 'Aula 3',
                    descricao: `Formação dos primeiros elementos leves, previsões do modelo e comparações com dados observacionais.`
                },
                {
                    id: 8528237,
                    video: '/videos/Aula_4.mp4',
                    titulo: 'Aula 4 — Evidências Complementares',
                    subtitulo: 'Aula 4',
                    descricao: `Idades estelares, distribuição de galáxias e outras linhas de evidência para o modelo do Big Bang.`
                },
                {
                    id: 5323723,
                    video: '/videos/Aula_5.mp4',
                    titulo: 'Aula 5 — Síntese e Implicações',
                    subtitulo: 'Aula 5',
                    descricao: `Revisão do módulo, principais implicações cosmológicas e perspectivas de pesquisa.`
                }
            ]
        },
        {
            id: 4526653,
            terminado: false,
            template: {
                titulo: 'Matéria Escura e Energia Escura',
                descricao: 'Evidências observacionais (curvas de rotação, lentes gravitacionais) e a aceleração cósmica; impactos na dinâmica do cosmos.'
            },
            introducao: {
                descricao: `A introdução do segundo módulo traz uma visão geral dos temas que serão abordados, destacando a importância de cada tópico para o desenvolvimento do aprendizado contínuo. 
        Também são apresentados os objetivos específicos do módulo e as competências que serão desenvolvidas, para orientar seus estudos.`
                ,
                pdf: '',
                videoBackground: '/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1243678
            },
            atividades: [
                {
                    id: 5141589,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 1 - Título Genérico',
                        descricao: `Nesta atividade, você será convidado a aplicar os conceitos intermediários em situações práticas, fortalecendo a capacidade de análise e solução de problemas. 
            Os exercícios são elaborados para incentivar a criatividade e a autonomia na busca por respostas fundamentadas.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 3534529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2 - Título Genérico',
                        descricao: `A segunda atividade traz desafios mais elaborados, que exigem uma compreensão aprofundada e a habilidade de integrar conhecimentos para alcançar resultados eficazes. 
            A proposta estimula o pensamento crítico e a capacidade de avaliação detalhada das situações apresentadas.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 5639283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3 - Título Genérico',
                        descricao: `Exercícios práticos que estimulam o raciocínio lógico e a aplicação dos conteúdos intermediários em contextos variados, ampliando o repertório do aluno. 
            Essa etapa tem como objetivo a consolidação do conhecimento em diferentes cenários.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 2557356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4 - Título Genérico',
                        descricao: `Nesta etapa, o foco é o desenvolvimento da autonomia na resolução de problemas, incentivando o uso crítico das informações para tomada de decisão. 
            Você será desafiado a pensar de forma estratégica e avaliar múltiplas possibilidades antes de escolher a melhor solução.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 6353456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5 - Título Genérico',
                        descricao: `Atividade que promove a reflexão sobre os conceitos aprendidos e a sua aplicação prática, conectando teoria e prática de forma integrada. 
            A meta é estimular a capacidade de comunicação e argumentação fundamentadas nos conteúdos estudados.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                },
                {
                    id: 8374434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6 - Título Genérico',
                        descricao: `Exercícios finais para revisão e fixação dos conteúdos intermediários, preparando o aluno para os próximos desafios do curso. 
            Esta etapa serve para consolidar a aprendizagem e identificar pontos que merecem maior atenção.`
                    },
                    questoes: questoesMateriaEnergiaEscura
                }
            ],
            videoAulas: [
                {
                    id: 5148943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — Curvas de Rotação e Matéria Escura',
                    subtitulo: 'Aula 1',
                    descricao: `O enigma das curvas de rotação e a evidência dinâmica para matéria escura em galáxias.`
                },
                {
                    id: 5633943,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Lentes Gravitacionais',
                    subtitulo: 'Aula 2',
                    descricao: `Como lentes gravitacionais revelam a distribuição de massa e ajudam a mapear matéria escura.`
                },
                {
                    id: 5542743,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Aceleração Cósmica e Energia Escura',
                    subtitulo: 'Aula 3',
                    descricao: `Supernovas do Tipo Ia e as evidências de aceleração da expansão do Universo.`
                },
                {
                    id: 8538237,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — Modelagem Cosmológica',
                    subtitulo: 'Aula 4',
                    descricao: `Parâmetros cosmológicos, equações de Friedmann e implicações dinâmicas.`
                },
                {
                    id: 5333723,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — Questões em Aberto',
                    subtitulo: 'Aula 5',
                    descricao: `O que ainda não entendemos sobre matéria e energia escuras e os desafios observacionais.`
                }
            ]
        },
        {
            id: 4526678,
            terminado: false,
            template: {
                titulo: 'Estrutura em Grande Escala do Universo',
                descricao: 'Redes cósmicas, filamentos e aglomerados; crescimento de estruturas a partir de flutuações primordiais e o papel da gravidade.'
            },
            introducao: {
                descricao: `A introdução do módulo 3 contextualiza os assuntos a serem tratados, destacando a relevância dos tópicos avançados para o desenvolvimento do conhecimento e habilidades específicas. 
        Também apresenta os objetivos do módulo e as expectativas para seu desempenho, preparando para um aprendizado intensivo e focado.`
                ,
                pdf: '',
                videoBackground: '/ceu-estrelado.jpg',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1246878
            },
            atividades: [
                { id: 6164589, terminado: false, template: { titulo: 'Atividade 1 - Título Genérico', descricao: `Esta atividade inicial do módulo avançado visa a aplicação de conceitos complexos por meio de exercícios que exigem análise crítica e raciocínio aprofundado. 
            Os desafios são pensados para estimular a criatividade, a inovação e o pensamento estratégico diante de problemas reais.` }, questoes: questoesEstruturaUniverso },
                { id: 3554529, terminado: false, template: { titulo: 'Atividade 2 - Título Genérico', descricao: `Desafios práticos que estimulam a capacidade de resolução de problemas complexos, incentivando o pensamento estratégico e inovador. 
            Você será encorajado a propor soluções originais e eficazes, fundamentadas em conhecimento técnico sólido.` }, questoes: questoesEstruturaUniverso },
                { id: 5699283, terminado: false, template: { titulo: 'Atividade 3 - Título Genérico', descricao: `Exercícios que combinam teoria e prática, proporcionando uma experiência rica para o desenvolvimento de competências avançadas. 
            A atividade estimula o pensamento interdisciplinar e a capacidade de adaptação a diferentes cenários.` }, questoes: questoesEstruturaUniverso },
                { id: 2577356, terminado: false, template: { titulo: 'Atividade 4 - Título Genérico', descricao: `Atividades que incentivam a reflexão crítica sobre os conteúdos estudados, promovendo o debate e a troca de ideias entre os participantes. 
            Essa etapa busca fortalecer a capacidade argumentativa e o entendimento aprofundado dos temas.` }, questoes: questoesEstruturaUniverso },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Título Genérico', descricao: `Neste momento, você será desafiado a aplicar os conhecimentos em projetos que simulam situações reais, promovendo a integração dos conceitos e habilidades adquiridos. 
            O objetivo é preparar para a prática profissional com segurança e eficácia.` }, questoes: questoesEstruturaUniverso },
                { id: 8384434, terminado: false, template: { titulo: 'Atividade 6 - Título Genérico', descricao: `Atividade final do módulo que revisa e consolida o aprendizado, incentivando o planejamento e a organização dos estudos para continuidade no curso. 
            Também promove a autoavaliação e o reconhecimento das áreas que necessitam de maior atenção.` }, questoes: questoesEstruturaUniverso }
            ],
            videoAulas: [
                {
                    id: 5168943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — Rede Cósmica',
                    subtitulo: 'Aula 1',
                    descricao: `Filamentos, nós e vazios: a teia de grande escala que estrutura o Universo.`
                },
                {
                    id: 5653943,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Crescimento de Estruturas',
                    subtitulo: 'Aula 2',
                    descricao: `De flutuações primordiais a aglomerados: o papel da gravidade e da matéria escura.`
                },
                {
                    id: 5562743,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Aglomerados e Halos',
                    subtitulo: 'Aula 3',
                    descricao: `Dinâmica de halos, perfis de densidade e observáveis (X, SZ, lentes).`
                },
                {
                    id: 8558237,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — Mapeamentos 3D do Universo',
                    subtitulo: 'Aula 4',
                    descricao: `Levantamentos espectroscópicos e fotométricos e a reconstrução da distribuição de matéria.`
                },
                {
                    id: 5353723,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — Síntese e Perspectivas',
                    subtitulo: 'Aula 5',
                    descricao: `Onde estão as maiores incertezas e como novos levantamentos podem resolvê-las.`
                }
            ]
        },
        {
            terminado: false,
            id: 2345567,
            template: {
                titulo: 'Relatividade Geral e Buracos Negros',
                descricao: 'Conceitos de espaço-tempo, horizonte de eventos e ondas gravitacionais aplicados a objetos compactos extremos.'
            },
            introducao: {
                descricao: 'Uma jornada pelos princípios da Relatividade Geral, horizontes de eventos e a física extrema dos buracos negros, incluindo a detecção de ondas gravitacionais.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Relatividade e curvatura do espaço-tempo.' }, questoes: questoesRelatividadeBuracosNegros },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Horizonte de eventos e sinais observáveis.' }, questoes: questoesRelatividadeBuracosNegros },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Ondas gravitacionais e fontes.' }, questoes: questoesRelatividadeBuracosNegros },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Buracos negros: detecções indiretas.' }, questoes: questoesRelatividadeBuracosNegros },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Teste gerais da Relatividade.' }, questoes: questoesRelatividadeBuracosNegros },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesRelatividadeBuracosNegros }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 1 — Espaço-tempo e Curvatura',
                    subtitulo: 'Aula 1',
                    descricao: 'Geometria do espaço-tempo e como a matéria curva o Universo segundo Einstein.'
                },
                {
                    id: 9196352,
                    video: '/VideosNebula/Video2ModuloCursoUniverso.mp4',
                    titulo: 'Aula 2 — Testes Clássicos da Relatividade',
                    subtitulo: 'Aula 2',
                    descricao: 'Periélio de Mercúrio, deflexão da luz e dilatação gravitacional do tempo.'
                },
                {
                    id: 2456935,
                    video: '/VideosNebula/Video3ModuloCursoUniverso.mp4',
                    titulo: 'Aula 3 — Buracos Negros e Horizonte de Eventos',
                    subtitulo: 'Aula 3',
                    descricao: 'Soluções de Schwarzschild e Kerr e sinais observacionais.'
                },
                {
                    id: 2625441,
                    video: '/VideosNebula/Video4ModuloCursoUniverso.mp4',
                    titulo: 'Aula 4 — Ondas Gravitacionais',
                    subtitulo: 'Aula 4',
                    descricao: 'Fontes, detecção (LIGO/Virgo) e o que aprendemos com esses sinais.'
                },
                {
                    id: 1584362,
                    video: '/VideosNebula/Video5ModuloCursoUniverso.mp4',
                    titulo: 'Aula 5 — Assinaturas Observacionais',
                    subtitulo: 'Aula 5',
                    descricao: 'Discos de acreção, jatos, sombras de buracos negros e medições indiretas.'
                },
                {
                    id: 2478533,
                    video: '/VideosNebula/Video1ModuloCursoUniverso.mp4',
                    titulo: 'Aula 6 — Revisão e Síntese',
                    subtitulo: 'Aula 6',
                    descricao: 'Amarração dos conceitos do módulo e problemas abertos da área.'
                }
            ]
        },
        {
            terminado: false,
            id: 7453453,
            template: {
                titulo: 'Cosmologia Observacional e Parâmetros',
                descricao: 'Como medimos H0, Ωm e ΩΛ; velas padrão, lentes gravitacionais e o tensionamento entre métodos locais e cosmológicos.'
            },
            introducao: {
                descricao: 'Como medimos parâmetros cosmológicos na prática: H0, Ωm e ΩΛ por meio de velas padrão, lentes gravitacionais e outros métodos, e por que há tensões entre técnicas.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Medindo o Universo: H0 e velas padrão.' }, questoes: questoesCosmologiaObservacional },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Lentes gravitacionais e parâmetros cosmológicos.' }, questoes: questoesCosmologiaObservacional },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Tensões entre métodos locais e globais.' }, questoes: questoesCosmologiaObservacional },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Ωm, ΩΛ e curvatura: interpretações.' }, questoes: questoesCosmologiaObservacional },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Dados observacionais e incertezas.' }, questoes: questoesCosmologiaObservacional },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão e síntese do módulo.' }, questoes: questoesCosmologiaObservacional }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — H0 e Velas Padrão',
                    subtitulo: 'Aula 1',
                    descricao: 'Cefeidas, supernovas Ia e a escada de distâncias.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Lentes e Parâmetros',
                    subtitulo: 'Aula 2',
                    descricao: 'Uso de lentes fortes e fracas na inferência cosmológica.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Tensões Cosmológicas',
                    subtitulo: 'Aula 3',
                    descricao: 'Por que medidas locais e de CMB não concordam e possíveis soluções.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Ωm, ΩΛ e Curvatura',
                    subtitulo: 'Aula 4',
                    descricao: 'Como diferentes sondas restringem os parâmetros e a curvatura do Universo.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Incertezas e Sistemáticos',
                    subtitulo: 'Aula 5',
                    descricao: 'Fontes de erro, calibração e tratamento de incertezas.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Revisão e Síntese',
                    subtitulo: 'Aula 6',
                    descricao: 'Resumo dos métodos observacionais e estado da arte.'
                }
            ]
        },
        {
            terminado: false,
            id: 2345253,
            template: {
                titulo: 'Inflação Cósmica e Flutuações Primordiais',
                descricao: 'Problemas do horizonte e da planitude, geradores quânticos de anisotropias no CMB e o espectro de potência.'
            },
            introducao: {
                descricao: 'Entenda por que a inflação é proposta para resolver o problema do horizonte e da planitude, e como flutuações quânticas geram anisotropias no CMB.',
                pdf: '',
                video: '/VideosNebula/IntroducaoUniverso.mp4',
                id: 1236478
            },
            atividades: [
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Problema do horizonte e inflação.' }, questoes: questoesInflacao },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Planitude e solução inflacionária.' }, questoes: questoesInflacao },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Flutuações quânticas e anisotropias.' }, questoes: questoesInflacao },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'CMB e espectro de potência.' }, questoes: questoesInflacao },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Observáveis e limitações.' }, questoes: questoesInflacao },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesInflacao }
            ],
            videoAulas: [
                {
                    id: 5138943,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 1 — Problema do Horizonte',
                    subtitulo: 'Aula 1',
                    descricao: 'Uniformidade do CMB e a necessidade de uma fase inflacionária.'
                },
                {
                    id: 9196352,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 2 — Planitude e Curvatura',
                    subtitulo: 'Aula 2',
                    descricao: 'Como a inflação resolve o ajuste fino da densidade crítica.'
                },
                {
                    id: 2456935,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 3 — Flutuações Quânticas',
                    subtitulo: 'Aula 3',
                    descricao: 'Sementes das estruturas e o espectro de potência.'
                },
                {
                    id: 2625441,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 4 — Assinaturas no CMB',
                    subtitulo: 'Aula 4',
                    descricao: 'Modos escalares e tensoriais e buscas por B-modes.'
                },
                {
                    id: 1584362,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 5 — Modelos de Inflação',
                    subtitulo: 'Aula 5',
                    descricao: 'Cenários simples e suas previsões observacionais.'
                },
                {
                    id: 2478533,
                    video: '/cursos/mod1-intro.mp4',
                    titulo: 'Aula 6 — Limitações e Testes Futuros',
                    subtitulo: 'Aula 6',
                    descricao: 'O que ainda falta confirmar e propostas de novas observações.'
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Espectros e propriedades da luz.' }, questoes: questoesLuzMedidas },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Magnitude, cor e distâncias básicas.' }, questoes: questoesLuzMedidas },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Medidas e incertezas em astronomia.' }, questoes: questoesLuzMedidas },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Aplicações observacionais.' }, questoes: questoesLuzMedidas },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Quiz e revisão.' }, questoes: questoesLuzMedidas },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Síntese do módulo.' }, questoes: questoesLuzMedidas }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Colapso e protoestrelas.' }, questoes: questoesFormacaoEstelar },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Feedback estelar e ventos.' }, questoes: questoesFormacaoEstelar },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Meio interestelar e poeira.' }, questoes: questoesFormacaoEstelar },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Regiões HII.' }, questoes: questoesFormacaoEstelar },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Observáveis da formação estelar.' }, questoes: questoesFormacaoEstelar },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesFormacaoEstelar }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Componentes da Via Láctea.' }, questoes: questoesViaLactea },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Rotação galáctica.' }, questoes: questoesViaLactea },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Bojo e halo: características.' }, questoes: questoesViaLactea },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Localização do Sol.' }, questoes: questoesViaLactea },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Matéria escura na Via Láctea.' }, questoes: questoesViaLactea },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesViaLactea }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Trânsito e velocidade radial.' }, questoes: questoesExoplanetas },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Atmosferas e espectroscopia de trânsito.' }, questoes: questoesExoplanetas },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Habitabilidade: critérios e desafios.' }, questoes: questoesExoplanetas },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Imagem direta: quando é possível?' }, questoes: questoesExoplanetas },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Limitações observacionais.' }, questoes: questoesExoplanetas },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesExoplanetas }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Classificação morfológica.' }, questoes: questoesMorfologiaEvolucao },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Interações e fusões.' }, questoes: questoesMorfologiaEvolucao },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Evolução ao longo do tempo cósmico.' }, questoes: questoesMorfologiaEvolucao },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Assinaturas observacionais.' }, questoes: questoesMorfologiaEvolucao },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Quiz do módulo.' }, questoes: questoesMorfologiaEvolucao },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesMorfologiaEvolucao }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1', descricao: 'Escada de distâncias cósmicas.' }, questoes: questoesCosmografia },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2', descricao: 'Diagrama HR e paralaxe.' }, questoes: questoesCosmografia },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3', descricao: 'Mapas do céu multiespectrais.' }, questoes: questoesCosmografia },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4', descricao: 'Limites e incertezas.' }, questoes: questoesCosmografia },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5', descricao: 'Quiz do módulo.' }, questoes: questoesCosmografia },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6', descricao: 'Revisão do módulo.' }, questoes: questoesCosmografia }
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
                        titulo: 'Atividade 1 - Observação do céu a olho nu',
                        descricao: 'Identificação de movimentos aparentes e primeiras constelações.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2 - Reconhecimento de constelações',
                        descricao: 'Prática guiada para localizar padrões no céu noturno.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3 - Poluição luminosa',
                        descricao: 'Como a iluminação urbana afeta a observação e como contornar.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4 - Adaptação da visão',
                        descricao: 'Técnicas de adaptação ao escuro e registros observacionais.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5 - Roteiro de observação',
                        descricao: 'Planeje um mini-roteiro para uma noite de observação.'
                    },
                    questoes: questoesIniciantes
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6 - Revisão do módulo',
                        descricao: 'Integração dos conceitos observacionais iniciais.'
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1 - Sistema Solar', descricao: 'Reconhecendo escalas e corpos do Sistema Solar.' }, questoes: questoesSistemaSolar },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2 - Planetas', descricao: 'Características e curiosidades dos planetas.' }, questoes: questoesSistemaSolar },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3 - Luas e pequenos corpos', descricao: 'Asteroides, cometas e luas notáveis.' }, questoes: questoesSistemaSolar },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4 - Escalas e distâncias', descricao: 'Comparando tamanhos e órbitas.' }, questoes: questoesSistemaSolar },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Quiz do Sistema Solar', descricao: 'Revisão dos principais conceitos.' }, questoes: questoesSistemaSolar },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6 - Revisão do módulo', descricao: 'Integração dos conteúdos essenciais.' }, questoes: questoesSistemaSolar }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1 - Cores e temperaturas', descricao: 'Entendendo cores, temperaturas e brilho.' }, questoes: questoesEstrelas },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2 - Mapas celestes', descricao: 'Uso prático de cartas e apps.' }, questoes: questoesEstrelas },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3 - Magnitude aparente', descricao: 'Brilho e distância na prática.' }, questoes: questoesEstrelas },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4 - Buscando constelações', descricao: 'Rotas e referências no céu.' }, questoes: questoesEstrelas },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Quiz de estrelas', descricao: 'Revisão dos conceitos estudados.' }, questoes: questoesEstrelas },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6 - Revisão do módulo', descricao: 'Integração geral do conteúdo.' }, questoes: questoesEstrelas }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1 - Tipos de telescópio', descricao: 'Refrator x refletor para iniciantes.' }, questoes: questoesTelescopios },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2 - Aumentos e limites', descricao: 'Aumento útil e seeing atmosférico.' }, questoes: questoesTelescopios },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3 - Acessórios e filtros', descricao: 'Filtros, oculares e alinhamento.' }, questoes: questoesTelescopios },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4 - Segurança na observação', descricao: 'Boas práticas e cuidados com o Sol.' }, questoes: questoesTelescopios },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Montagens e alinhamento', descricao: 'Azimutal, equatorial e polar alignment.', }, questoes: questoesTelescopios },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6 - Revisão do módulo', descricao: 'Checklist para primeira sessão prática.' }, questoes: questoesTelescopios }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1 - Fases e eclipses', descricao: 'Entendendo fases da Lua e eclipses.' }, questoes: questoesFenomenos },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2 - Chuvas de meteoros', descricao: 'Planejamento e observação segura.' }, questoes: questoesFenomenos },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3 - Previsão de fenômenos', descricao: 'Como usar calendários astronômicos.' }, questoes: questoesFenomenos },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4 - Observação prática', descricao: 'Registro e relato de um fenômeno.' }, questoes: questoesFenomenos },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Quiz do módulo', descricao: 'Revisando conceitos-chave.' }, questoes: questoesFenomenos },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6 - Revisão do módulo', descricao: 'Integração geral dos conteúdos.' }, questoes: questoesFenomenos }
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
                { id: 6134589, terminado: false, template: { titulo: 'Atividade 1 - Ciclo estelar', descricao: 'Panorama do nascimento à morte das estrelas.' }, questoes: questoesCicloEstelar },
                { id: 3514529, terminado: false, template: { titulo: 'Atividade 2 - Nebulosas e aglomerados', descricao: 'Identificando estágios e objetos.' }, questoes: questoesCicloEstelar },
                { id: 5679283, terminado: false, template: { titulo: 'Atividade 3 - Estrelas massivas', descricao: 'Por que vivem menos e brilham mais?' }, questoes: questoesCicloEstelar },
                { id: 2567356, terminado: false, template: { titulo: 'Atividade 4 - Remanescentes', descricao: 'Anãs brancas, pulsares e buracos negros.' }, questoes: questoesCicloEstelar },
                { id: 6393456, terminado: false, template: { titulo: 'Atividade 5 - Quiz do módulo', descricao: 'Revisão e checagem de entendimento.' }, questoes: questoesCicloEstelar },
                { id: 8354434, terminado: false, template: { titulo: 'Atividade 6 - Revisão do módulo', descricao: 'Integração dos aprendizados.' }, questoes: questoesCicloEstelar }
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