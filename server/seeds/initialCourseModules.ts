type QuestaoBase = {
    questao: string;
    dissertativa: boolean;
    alternativas?: string[];
    respostaCorreta?: string;
};

const selecionarQuestoes = <T extends QuestaoBase>(banco: T[], indices: number[]): T[] =>
    indices.map((index) => {
        const origem = banco[index];
        return {
            ...origem,
            alternativas: origem.alternativas ? [...origem.alternativas] : undefined
        } as T;
    });

// Questões base para o curso Órbita (modulares por tema)
const questoesIniciantes = [
    { questao: 'Explique, com suas palavras, por que as estrelas parecem “nascer” no leste e “se pôr” no oeste ao longo da noite.', dissertativa: true, respostaCorreta: 'Esse movimento aparente ocorre porque a Terra gira de oeste para leste em aproximadamente 24 horas, fazendo com que toda a abóbada celeste pareça deslocar-se de leste para oeste; portanto, vemos as estrelas surgirem no horizonte leste e desaparecerem no oeste.' },
    { questao: 'Cite duas constelações fáceis de reconhecer no céu e descreva um método simples para identificá-las.', dissertativa: true, respostaCorreta: 'Exemplos: Órion e Cruzeiro do Sul. Órion pode ser encontrado alinhando as três estrelas do Cinturão; o Cruzeiro é identificado pelas quatro estrelas brilhantes forma de cruz e pela linha prolongada do eixo maior apontando para o polo sul celeste.' },
    { questao: 'Qual a melhor prática para observar o céu a olho nu em uma cidade grande? Comente sobre poluição luminosa e adaptação da visão ao escuro.', dissertativa: true, respostaCorreta: 'Procure locais mais escuros, desligue ou bloqueie luzes diretas, use visão periférica e dê cerca de 20 a 30 minutos para os olhos se adaptarem; evitar telas e luzes brancas ajuda a minimizar os efeitos da poluição luminosa.' },
    { 
        questao: 'O movimento aparente diário do céu é causado principalmente por:', 
        dissertativa: false, 
        alternativas: ['Rotação da Terra', 'Precessão dos equinócios', 'Translação da Terra', 'Movimento do Sol ao redor da Terra'],
        respostaCorreta: 'Rotação da Terra'
    },
    { 
        questao: 'O que é a Estrela Polar e por que ela é importante para a navegação no Hemisfério Norte?', 
        dissertativa: true,
        respostaCorreta: 'A Estrela Polar é Polaris, localizada próxima ao polo norte celeste; por quase não mudar de posição no céu, ela indica com boa precisão a direção norte e serve como referência de latitude para navegadores do hemisfério norte.'
    },
    { 
        questao: 'Qual a diferença entre um planeta e uma estrela quando observados a olho nu?', 
        dissertativa: true,
        respostaCorreta: 'Estrelas emitem luz própria e normalmente cintilam devido à atmosfera; planetas refletem luz solar, costumam apresentar brilho contínuo e disco ligeiramente maior, além de se moverem lentamente em relação ao fundo de estrelas ao longo da eclíptica.'
    },
    { 
        questao: 'A "Estrela Dalva" é, na verdade, qual planeta?', 
        dissertativa: false, 
        alternativas: ['Júpiter', 'Saturno', 'Marte', 'Vênus'],
        respostaCorreta: 'Vênus'
    },
    {
        questao: 'Que instrumento simples pode ajudar a estimar a altura de uma estrela acima do horizonte?',
        dissertativa: false,
        alternativas: ['Cronômetro', 'Termômetro', 'Astrolábio', 'Bússola magnética'],
        respostaCorreta: 'Astrolábio'
    }
];

const questoesSistemaSolar = [
    { questao: 'Descreva, em escala qualitativa, as diferenças de tamanho entre o Sol, planetas e luas.', dissertativa: true, respostaCorreta: 'O Sol é um astro gigantesco com diâmetro cerca de 109 vezes maior que o da Terra; os planetas variam de gigantes gasosos como Júpiter, muito maiores que os planetas terrestres, até mundos rochosos como Mercúrio; as luas são corpos menores que orbitam planetas, geralmente muito menores que seus planetas hospedeiros.' },
    { questao: 'Escolha um planeta do Sistema Solar e escreva três curiosidades sobre ele (rotação, atmosfera, luas, etc.).', dissertativa: true, respostaCorreta: 'Exemplo Marte: rota aproximadamente 24h37min, atmosfera fina de CO2 com tempestades de poeira globais e duas pequenas luas irregulares, Fobos e Deimos.' },
    { questao: 'O que são asteroides e cometas? Aponte uma diferença observável entre eles.', dissertativa: true, respostaCorreta: 'Asteroides são corpos rochosos/metálicos que orbitam principalmente entre Marte e Júpiter, enquanto cometas são compostos por gelo e poeira e exibem coma e cauda brilhante quando se aproximam do Sol devido à sublimação dos voláteis.' },
    { 
        questao: 'A ordem correta dos planetas a partir do Sol é:', 
        dissertativa: false, 
        alternativas: ['Mercúrio, Terra, Vênus, Marte, Júpiter, Saturno, Urano, Netuno', 'Terra, Marte, Mercúrio, Vênus, Júpiter, Saturno, Urano, Netuno', 'Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno', 'Vênus, Mercúrio, Terra, Marte, Júpiter, Saturno, Urano, Netuno'],
        respostaCorreta: 'Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano, Netuno'
    },
    { 
        questao: 'O que é o Cinturão de Asteroides e onde ele se localiza?', 
        dissertativa: true,
        respostaCorreta: 'É uma região populada por pequenos corpos rochosos situada entre as órbitas de Marte e Júpiter, remanescentes da formação do Sistema Solar que nunca se aglutinaram em um planeta.' 
    },
    { 
        questao: 'Qual planeta é famoso por seus anéis?', 
        dissertativa: false, 
        alternativas: ['Júpiter', 'Urano', 'Netuno', 'Saturno'],
        respostaCorreta: 'Saturno'
    },
    {
        questao: 'Explique por que Plutão deixou de ser classificado como planeta principal em 2006.',
        dissertativa: true,
        respostaCorreta: 'A União Astronômica Internacional definiu que um planeta deve limpar a vizinhança orbital; Plutão não domina sua órbita no Cinturão de Kuiper, compartilhando-a com outros objetos, sendo reclassificado como planeta anão.'
    },
    {
        questao: 'Qual planeta possui o dia (rotação) mais longo do Sistema Solar?',
        dissertativa: false,
        alternativas: ['Mercúrio', 'Netuno', 'Vênus', 'Marte'],
        respostaCorreta: 'Vênus'
    }
];

const questoesEstrelas = [
    { questao: 'Explique a relação entre cor e temperatura das estrelas (ex.: azul x vermelha).', dissertativa: true, respostaCorreta: 'Estrelas azuladas são mais quentes, emitindo mais energia em comprimentos de onda menores, enquanto estrelas avermelhadas são mais frias e emitem mais em comprimentos maiores.' },
    { questao: 'Como usar um mapa celeste (planisfério) para localizar uma estrela ou constelação em uma data e horário específicos?', dissertativa: true, respostaCorreta: 'Ajusta-se o disco móvel para alinhar data e horário desejados; o mapa resultante mostra o céu visível, permitindo identificar a posição relativa das constelações em relação aos pontos cardeais.' },
    { questao: 'Defina magnitude aparente e comente por que uma estrela mais brilhante nem sempre é a mais próxima.', dissertativa: true, respostaCorreta: 'Magnitude aparente mede o brilho observado da Terra; uma estrela pode parecer brilhante por ser intrinsecamente luminosa, mesmo distante, enquanto outra próxima pode ser mais fraca devido à sua baixa luminosidade.' },
    { 
        questao: 'Cores estelares indicam principalmente:', 
        dissertativa: false, 
        alternativas: ['Composição química única', 'Tamanho do sistema planetário', 'Idade', 'Temperatura'],
        respostaCorreta: 'Temperatura'
    },
    { 
        questao: 'O que é uma estrela anã branca?', 
        dissertativa: true,
        respostaCorreta: 'É o resumo denso deixado por estrelas de baixa e média massa após expelirem suas camadas externas; consiste em matéria degenerada que esfria lentamente.' 
    },
    {
        questao: 'Resuma o que mostra o diagrama de Hertzsprung-Russell e como ele organiza as estrelas.',
        dissertativa: true,
        respostaCorreta: 'O diagrama relaciona temperatura ou cor com luminosidade, distribuindo as estrelas em sequências como a principal, gigantes e anãs brancas, indicando fases evolutivas.'
    },
    {
        questao: 'Estrelas variáveis Cefeidas são úteis porque permitem:',
        dissertativa: false,
        alternativas: ['Prever erupções solares', 'Medir campos magnéticos estelares', 'Determinar distâncias por relação período-luminosidade', 'Identificar atmosferas estelares'],
        respostaCorreta: 'Determinar distâncias por relação período-luminosidade'
    }
];

const questoesTelescopios = [
    { questao: 'Compare telescópios refratores e refletores: principais vantagens e desvantagens para iniciantes.', dissertativa: true, respostaCorreta: 'Refratores usam lentes, são robustos e exigem pouca manutenção, mas têm custo alto por abertura; refletores usam espelhos, oferecem grandes aberturas por preço menor, porém requerem colimação periódica.' },
    { questao: 'O que é aumento útil e por que “mais aumento” nem sempre significa “melhor observação”?', dissertativa: true, respostaCorreta: 'Aumento útil é o limite prático em que o telescópio ainda fornece imagem nítida; ampliá-lo demais degrada a visualização porque a pupila de saída fica pequena e turbulências atmosféricas borram os detalhes.' },
    { questao: 'Descreva duas boas práticas de segurança ao observar o Sol e por que elas são essenciais.', dissertativa: true, respostaCorreta: 'Usar filtro solar específico na frente do telescópio e nunca olhar diretamente sem proteção; além disso, verificar o equipamento antes de cada sessão evita danos aos olhos causados pela radiação intensa.' },
    { 
        questao: 'Filtros e oculares são usados principalmente para:', 
        dissertativa: false, 
        alternativas: ['Focar automaticamente', 'Realçar contraste e segurança', 'Alterar a cor do astro', 'Aumentar o brilho'],
        respostaCorreta: 'Realçar contraste e segurança'
    },
    { 
        questao: 'O que é a "abertura" de um telescópio e por que ela é considerada a característica mais importante?', 
        dissertativa: true,
        respostaCorreta: 'A abertura é o diâmetro da lente ou espelho principal e determina quanta luz o telescópio coleta; maior abertura aumenta resolução e brilho, permitindo observar objetos mais tênues.' 
    },
    { 
        questao: 'Para observar galáxias e nebulosas, que são objetos de brilho fraco, o ideal é um telescópio com:', 
        dissertativa: false, 
        alternativas: ['Filtro lunar', 'Lentes coloridas', 'Grande aumento', 'Grande abertura'],
        respostaCorreta: 'Grande abertura'
    },
    { 
        questao: 'Explique o que é a distância focal de um telescópio.', 
        dissertativa: true,
        respostaCorreta: 'É o comprimento entre o elemento óptico primário e o plano focal onde a imagem se forma; determina o campo de visão e, combinado com a ocular, o aumento final.' 
    },
    {
        questao: 'Qual prática melhora a nitidez da imagem em telescópios refletores?',
        dissertativa: false,
        alternativas: ['Observar apenas durante o dia', 'Retirar o espelho secundário', 'Usar lentes coloridas', 'Colimar os espelhos regularmente'],
        respostaCorreta: 'Colimar os espelhos regularmente'
    }
];

const questoesFenomenos = [
    { questao: 'Explique por que a Lua tem fases e por que não ocorre eclipse solar e lunar todos os meses.', dissertativa: true, respostaCorreta: 'As fases são causadas pela geometria Sol-Terra-Lua mudando ao longo da órbita mensal; eclipses não ocorrem sempre porque o plano orbital da Lua é inclinado cerca de 5° em relação ao plano da Terra, fazendo com que o alinhamento perfeito seja raro.' },
    { questao: 'Como se planejar para observar uma chuva de meteoros (horário, direção, condições do céu)?', dissertativa: true, respostaCorreta: 'Consultar a data de pico, observar após a meia-noite olhando na direção do radiante indicado e escolher local escuro com horizonte aberto e sem luzes intensas aumenta o número de meteoros visíveis.' },
    { questao: 'O que diferencia um eclipse solar total de um anular? Descreva brevemente.', dissertativa: true, respostaCorreta: 'No eclipse total a Lua cobre completamente o Sol, pois está mais próxima da Terra; no anular, a Lua está mais distante e o diâmetro aparente menor deixa um anel luminoso do Sol visível.' },
    { 
        questao: 'As fases da Lua são causadas principalmente por:', 
        dissertativa: false, 
        alternativas: ['Posição relativa Sol–Terra–Lua', 'Rotação da Lua', 'Sombra da Terra', 'Nuvens na atmosfera'],
        respostaCorreta: 'Posição relativa Sol–Terra–Lua'
    },
    { 
        questao: 'O que é uma aurora boreal/austral e o que a causa?', 
        dissertativa: true,
        respostaCorreta: 'Auroras são luzes atmosféricas em altas latitudes formadas quando partículas carregadas do vento solar interagem com o campo magnético terrestre e excitam átomos na alta atmosfera.' 
    },
    {
        questao: 'Por que as marés altas são mais intensas durante luas novas e cheias?',
        dissertativa: true,
        respostaCorreta: 'Nas fases nova e cheia o Sol, a Terra e a Lua ficam alinhados, somando as forças gravitacionais e produzindo marés de sizígia com amplitudes maiores.'
    },
    {
        questao: 'Qual fenômeno é responsável pelo “anel de fogo” visível em alguns eclipses solares?',
        dissertativa: false,
        alternativas: ['Reflexão na superfície lunar', 'Diâmetro aparente menor da Lua', 'Difração na atmosfera', 'Distância maior entre Terra e Sol'],
        respostaCorreta: 'Diâmetro aparente menor da Lua'
    }
];

const questoesCicloEstelar = [
    { questao: 'Resuma as etapas principais do ciclo de vida estelar em linguagem simples.', dissertativa: true, respostaCorreta: 'Estrelas nascem do colapso de nuvens de gás, passam pela sequência principal fundindo hidrogênio, evoluem para gigantes ou supergigantes e terminam como anãs brancas, estrelas de nêutrons ou buracos negros dependendo da massa.' },
    { questao: 'O que é uma nebulosa planetária e em que fase de vida estelar ela ocorre?', dissertativa: true, respostaCorreta: 'É uma casca de gás expelida por estrelas de baixa e média massa ao final da fase de gigante vermelha, logo antes do núcleo remanescente tornar-se uma anã branca.' },
    { questao: 'Explique por que estrelas muito massivas têm vidas mais curtas do que estrelas como o Sol.', dissertativa: true, respostaCorreta: 'Mais massa significa maior pressão central e taxa de fusão; elas consomem combustível rapidamente, encurtando a vida em comparação com estrelas menos massivas.' },
    { 
        questao: 'Uma supernova está associada geralmente a:', 
        dissertativa: false, 
        alternativas: ['Cometas brilhantes', 'Planetas gigantes', 'Nascimento de estrelas', 'Morte de estrelas massivas'],
        respostaCorreta: 'Morte de estrelas massivas'
    },
    { 
        questao: 'O que restará do nosso Sol no final de sua vida?', 
        dissertativa: false, 
        alternativas: ['Uma anã branca', 'Nada', 'Um buraco negro', 'Uma estrela de nêutrons'],
        respostaCorreta: 'Uma anã branca'
    },
    { 
        questao: 'O que são estrelas de nêutrons?', 
        dissertativa: true,
        respostaCorreta: 'São remanescentes ultradensos formados após supernovas de estrelas massivas, compostos principalmente por nêutrons degenerados.' 
    },
    { 
        questao: 'De onde vêm os elementos químicos mais pesados que o ferro, como ouro e platina?', 
        dissertativa: true,
        respostaCorreta: 'Eles são produzidos por processos de captura rápida de nêutrons em eventos de supernova ou fusões de estrelas de nêutrons, onde há fluxo intenso de nêutrons.' 
    },
    { 
        questao: 'Buracos negros estelares se formam a partir de:', 
        dissertativa: false, 
        alternativas: ['Nuvens de gás e poeira', 'Colisão de duas anãs brancas', 'Colapso de estrelas extremamente massivas', 'Estrelas de baixa massa como o Sol'],
        respostaCorreta: 'Colapso de estrelas extremamente massivas'
    }
];

// Banco de questões: curso Universo
const questoesBBang = [
    { questao: 'Explique por que a expansão do Universo é uma conclusão observacional e não apenas teórica.', dissertativa: true, respostaCorreta: 'Observações de galáxias mostram desvios para o vermelho proporcionais à distância (lei de Hubble), evidenciando que o espaço está expandindo em vez de galáxias moverem-se aleatoriamente.' },
    { questao: 'Descreva o papel da radiação cósmica de fundo na cosmologia moderna.', dissertativa: true, respostaCorreta: 'A radiação cósmica de fundo é o eco térmico do universo primordial, fornecendo instantâneo do plasma 380 mil anos após o Big Bang e permitindo inferir parâmetros cosmológicos com grande precisão.' },
    { questao: 'Resuma a nucleossíntese primordial e os elementos leves produzidos.', dissertativa: true, respostaCorreta: 'Nos primeiros minutos após o Big Bang, o universo quente e denso permitiu a fusão de prótons e nêutrons formando principalmente hidrogênio, hélio-4 e pequenas frações de deutério e lítio-7.' },
    { 
        questao: 'O desvio para o vermelho galáctico é interpretado como:', 
        dissertativa: false, 
        alternativas: ['Expansão do espaço entre galáxias', 'Efeito Doppler local de estrelas', 'Aproximação da Via Láctea', 'Erro sistemático instrumental'],
        respostaCorreta: 'Expansão do espaço entre galáxias'
    },
    { 
        questao: 'O que a uniformidade da Radiação Cósmica de Fundo em todas as direções nos diz sobre o universo primitivo?', 
        dissertativa: true,
        respostaCorreta: 'Indica que o universo primordial era extremamente homogêneo e isotrópico em grande escala, com pequenas flutuações de densidade que serviram de sementes para a formação de estruturas.' 
    },
    {
        questao: 'Resuma o papel das oscilações acústicas de bárions nos primeiros instantes do Big Bang.',
        dissertativa: true,
        respostaCorreta: 'Oscilações acústicas eram ondas de pressão no plasma de fótons e bárions; deixaram impressões na distribuição de galáxias e no espectro do CMB, servindo como régua padrão cosmológica.'
    },
    {
        questao: 'A temperatura média prevista para a radiação cósmica de fundo hoje é de aproximadamente:',
        dissertativa: false,
        alternativas: ['270 K', '2,7 K', '27 K', '2700 K'],
        respostaCorreta: '2,7 K'
    }
];

const questoesMateriaEnergiaEscura = [
    { questao: 'Cite duas evidências independentes para a existência de matéria escura.', dissertativa: true, respostaCorreta: 'Curvas de rotação galáctica planas e o comportamento de aglomerados de galáxias (dinâmica ou lentes gravitacionais) mostram massa adicional não luminosa.' },
    { questao: 'Explique o que são curvas de rotação galáctica e o que indicam.', dissertativa: true, respostaCorreta: 'São gráficos da velocidade de rotação estelar versus raio; em muitas galáxias permanecem altas em grandes distâncias, sugerindo um halo massivo invisível de matéria escura.' },
    { questao: 'Resuma a evidência da aceleração cósmica obtida com supernovas tipo Ia.', dissertativa: true, respostaCorreta: 'Supernovas Ia distantes aparecem mais fracas que o esperado em um universo desacelerado, implicando que a expansão acelerou recentemente, atribuída à energia escura.' },
    { 
        questao: 'Lentes gravitacionais fortes e fracas são úteis para:', 
        dissertativa: false, 
        alternativas: ['Inferir distribuição de massa (visível e escura)', 'Detectar ondas gravitacionais diretamente', 'Calibrar espectros', 'Medir temperaturas de estrelas'],
        respostaCorreta: 'Inferir distribuição de massa (visível e escura)'
    },
    { 
        questao: 'Qual a porcentagem aproximada do conteúdo de energia do universo que se acredita ser matéria escura?', 
        dissertativa: false, 
        alternativas: ['68%', '5%', '27%', '95%'],
        respostaCorreta: '27%'
    },
    { 
        questao: 'O que é energia escura e qual seu efeito na expansão do universo?', 
        dissertativa: true,
        respostaCorreta: 'Energia escura é um componente de energia de densidade quase constante que exerce pressão negativa, provocando a aceleração da expansão cósmica.' 
    },
    {
        questao: 'Explique a importância da observação do aglomerado “Bullet Cluster” para a matéria escura.',
        dissertativa: true,
        respostaCorreta: 'No Bullet Cluster, a matéria visível ficou atrás após a colisão, enquanto a massa dominante detectada por lentes gravitacionais passou adiante, evidenciando um componente não bariônico pouco interativo: a matéria escura.'
    },
    {
        questao: 'Qual destes candidatos é um exemplo de matéria escura bariônica?',
        dissertativa: false,
        alternativas: ['WIMPs', 'Áxions', 'Neutrinos estéreis', 'MACHOs'],
        respostaCorreta: 'MACHOs'
    }
];

const questoesEstruturaUniverso = [
    { questao: 'Descreva a teia cósmica e como filamentos e vazios se organizam.', dissertativa: true, respostaCorreta: 'A teia cósmica é formada por filamentos de matéria que conectam aglomerados e envolvem grandes vazios; resultam do crescimento gravitacional a partir de flutuações iniciais.' },
    { questao: 'Qual o papel da gravidade no crescimento de estruturas a partir de flutuações primordiais?', dissertativa: true, respostaCorreta: 'A gravidade amplifica pequenas diferenças de densidade no plasma primordial, atraindo matéria para regiões mais densas e gerando halos, galáxias e aglomerados.' },
    { questao: 'Como levantamentos de galáxias mapeiam a estrutura em grande escala?', dissertativa: true, respostaCorreta: 'Levantamentos registram posições e redshifts de milhões de galáxias, permitindo reconstruir o volume tridimensional e revelar filamentos, aglomerados e vazios.' },
    {
        questao: 'O espectro de potência da matéria fornece:',
        dissertativa: false,
        alternativas: ['Idades de aglomerados globulares', 'Histórico químico de galáxias', 'Distribuição estatística de flutuações em escalas', 'Distribuição de temperaturas estelares'],
        respostaCorreta: 'Distribuição estatística de flutuações em escalas'
    },
    { questao: 'Explique o conceito de “bias” entre distribuição de matéria e galáxias observadas.', dissertativa: true, respostaCorreta: 'Bias descreve como a distribuição de galáxias traça a matéria total: galáxias são formadas preferencialmente em regiões de maior densidade, portanto a densidade de galáxias precisa ser escalada para representar a matéria total.' },
    { questao: 'Resuma como o efeito Sunyaev-Zel’dovich ajuda a pesar aglomerados de galáxias.', dissertativa: true, respostaCorreta: 'O efeito SZ mede a distorção do CMB causada por elétrons quentes do gás intracluster; a intensidade da distorção está ligada à quantidade de gás e, combinada com modelos, fornece a massa total do aglomerado.' },
    {
        questao: 'O parâmetro σ₈ mede:',
        dissertativa: false,
        alternativas: ['A energia escura presente no universo', 'A fração de matéria bariônica', 'A amplitude das flutuações de densidade em 8 h⁻¹ Mpc', 'A taxa de expansão local'],
        respostaCorreta: 'A amplitude das flutuações de densidade em 8 h⁻¹ Mpc'
    },
    {
        questao: 'O que diferencia o regime linear do regime não-linear no crescimento de estruturas?',
        dissertativa: true,
        respostaCorreta: 'No regime linear as flutuações de densidade são pequenas e crescem proporcionalmente, permitindo tratamento analítico; no regime não-linear as flutuações tornam-se grandes, provocando colapso gravitacional e exigindo simulações complexas.'
    }
];

const questoesRelatividadeBuracosNegros = [
    { questao: 'Explique a curvatura do espaço-tempo e como ela afeta o movimento de corpos.', dissertativa: true, respostaCorreta: 'Na Relatividade Geral, massa e energia curvam o espaço-tempo; objetos seguem geodésicas nessa curvatura, o que percebemos como gravidade.' },
    { questao: 'Defina horizonte de eventos e sua relevância observacional.', dissertativa: true, respostaCorreta: 'O horizonte de eventos é a superfície limite de um buraco negro da qual nada pode escapar; define o tamanho observável do buraco negro e separa regiões causais.' },
    { questao: 'Comente sobre a detecção de ondas gravitacionais e o que elas nos dizem.', dissertativa: true, respostaCorreta: 'Ondas gravitacionais registradas por detectores como LIGO e Virgo confirmam previsões relativísticas e permitem medir massas, spins e distâncias de objetos compactos em fusão.' },
    { 
        questao: 'Um buraco negro pode ser detectado indiretamente por:', 
        dissertativa: false, 
        alternativas: ['Efeito gravitacional sobre matéria vizinha', 'Sombra projetada por um planeta', 'Mudanças na cor do céu noturno', 'Emissão de luz do interior'],
        respostaCorreta: 'Efeito gravitacional sobre matéria vizinha'
    },
    { 
        questao: 'O que é a "espaguetificação"?', 
        dissertativa: true,
        respostaCorreta: 'É o alongamento extremo de um objeto ao entrar em um campo gravitacional com forte gradiente, como o de um buraco negro, onde a diferença de força entre as extremidades estica o corpo.' 
    },
    { 
        questao: 'A primeira imagem de um buraco negro, divulgada em 2019, foi do buraco negro no centro de qual galáxia?', 
        dissertativa: false, 
        alternativas: ['Messier 87', 'Via Láctea', 'Galáxia do Triângulo', 'Andrômeda'],
        respostaCorreta: 'Messier 87'
    },
    {
        questao: 'Descreva o mecanismo de lente gravitacional forte e como ele pode revelar buracos negros.',
        dissertativa: true,
        respostaCorreta: 'Uma massa muito concentrada desvia intensamente a luz de objetos de fundo, criando múltiplas imagens ou anéis; a forma da lente indica a presença e a massa de buracos negros ou concentrações invisíveis.'
    },
    {
        questao: 'O primeiro evento de ondas gravitacionais observado (GW150914) foi resultado da fusão de:',
        dissertativa: false,
        alternativas: ['Dois buracos negros estelares', 'Um buraco negro e uma estrela de nêutrons', 'Dois buracos negros supermassivos', 'Duas estrelas de nêutrons'],
        respostaCorreta: 'Dois buracos negros estelares'
    }
];

const questoesCosmologiaObservacional = [
    { questao: 'Explique o conceito de vela padrão e dê um exemplo.', dissertativa: true, respostaCorreta: 'Velas padrão são objetos de luminosidade conhecida usados para medir distâncias; supernovas tipo Ia e Cefeidas são exemplos clássicos.' },
    { questao: 'Descreva brevemente como se mede H0 e por que há tensões entre métodos.', dissertativa: true, respostaCorreta: 'H0 pode ser obtido por escalas de distância locais usando Cefeidas e SN Ia ou por ajustes ao CMB; medições locais dão valores mais altos que os inferidos do Planck, gerando a tensão de H0.' },
    { questao: 'Comente o papel de lentes gravitacionais na medição de parâmetros cosmológicos.', dissertativa: true, respostaCorreta: 'Lentes gravitacionais fortes fornecem atrasos de tempo entre múltiplas imagens e a distribuição de massa, permitindo estimar distâncias angulares e restringir H0 e outros parâmetros.' },
    { 
        questao: 'O parâmetro Ωm representa:', 
        dissertativa: false, 
        alternativas: ['Curvatura espacial', 'Temperatura média do CMB', 'Densidade de energia escura', 'Densidade de matéria (normal + escura)'],
        respostaCorreta: 'Densidade de matéria (normal + escura)'
    },
    { 
        questao: 'O que são Oscilações Acústicas de Bárions (BAO) e como elas são usadas como uma "régua padrão"?', 
        dissertativa: true,
        respostaCorreta: 'BAO são impressões das ondas acústicas do plasma primordial na distribuição de galáxias; a escala característica atua como régua padrão para medir expansões relativas do universo em diferentes épocas.' 
    },
    {
        questao: 'Explique como cadeias de Markov Monte Carlo (MCMC) são usadas para ajustar parâmetros cosmológicos.',
        dissertativa: true,
        respostaCorreta: 'MCMC explora o espaço de parâmetros gerando amostras de acordo com a probabilidade posterior; isso permite estimar distribuições e incertezas de parâmetros cosmológicos combinando dados diversos.'
    },
    {
        questao: 'Qual combinação de sondas ajuda a quebrar a degenerescência entre H₀ e Ωₘ?',
        dissertativa: false,
        alternativas: ['CMB + BAO + SNe Ia', 'Somente lentes fracas', 'Somente CMB', 'Somente SNe Ia'],
        respostaCorreta: 'CMB + BAO + SNe Ia'
    }
];

const questoesInflacao = [
    { questao: 'Explique o problema do horizonte e como a inflação o resolve.', dissertativa: true, respostaCorreta: 'O problema do horizonte é que regiões opostas do céu têm temperaturas idênticas sem terem estado em contato causal; a inflação expande rapidamente uma região inicialmente em equilíbrio, permitindo essa uniformidade.' },
    { questao: 'Descreva o problema da planitude e a solução inflacionária.', dissertativa: true, respostaCorreta: 'A densidade crítica observada requer condição inicial ajustada; a inflação dilui quaisquer curvaturas, fazendo o universo parecer plano hoje.' },
    { questao: 'Comente como flutuações quânticas geram anisotropias no CMB.', dissertativa: true, respostaCorreta: 'Durante a inflação, flutuações quânticas do campo inflaton são esticadas a escalas cósmicas e servem como sementes de densidade, manifestando-se como anisotropias no CMB.' },
    { 
        questao: 'O espectro quase invariante de escala observado no CMB é consistente com:', 
        dissertativa: false, 
        alternativas: ['Universo estático', 'Ausência de inflação', 'Apenas matéria bariônica', 'Modelos inflacionários'],
        respostaCorreta: 'Modelos inflacionários'
    },
    { 
        questao: 'O que é o "multiverso" e como a teoria da inflação eterna pode levar a essa ideia?', 
        dissertativa: true,
        respostaCorreta: 'Inflacao eterna sugere que o processo inflacionário continua em bolsões do espaço, criando múltiplos universos-bolha com propriedades diferentes, interpretado como um possível multiverso.' 
    },
    { 
        questao: 'A inflação cósmica ocorreu:', 
        dissertativa: false, 
        alternativas: ['Antes do Big Bang', 'Nos primeiros 3 minutos do universo', 'Uma fração de segundo após o Big Bang', 'Junto com a formação das primeiras estrelas'],
        respostaCorreta: 'Uma fração de segundo após o Big Bang'
    },
    {
        questao: 'Descreva o processo de “reheating” (re-aquecimento) após o final da inflação.',
        dissertativa: true,
        respostaCorreta: 'Após a inflação, o campo inflaton oscila e decai em partículas comuns, convertendo energia potencial em radiação e reaquecer o universo para iniciar a fase quente do Big Bang.'
    },
    {
        questao: 'Um valor de índice espectral escalar (nₛ) ligeiramente menor que 1 indica:',
        dissertativa: false,
        alternativas: ['Espectro vermelho com mais potência em grandes escalas', 'Inconsistência com inflação', 'Espectro plano ideal', 'Espectro azul com mais potência em pequenas escalas'],
        respostaCorreta: 'Espectro vermelho com mais potência em grandes escalas'
    }
];

// Banco de questões: curso Galáxia
const questoesLuzMedidas = [
    { questao: 'Explique o que é um espectro e como ele revela composição de um astro.', dissertativa: true, respostaCorreta: 'O espectro é a decomposição da luz em comprimentos de onda; linhas de absorção ou emissão revelam elementos químicos presentes no astro.' },
    { questao: 'Defina magnitude aparente e cor (índice de cor) em astronomia.', dissertativa: true, respostaCorreta: 'Magnitude aparente mede brilho observado; índice de cor é a diferença de magnitude entre filtros, indicando temperatura e extinção.' },
    { questao: 'Descreva um método básico para estimar distâncias estelares.', dissertativa: true, respostaCorreta: 'A paralaxe trigonométrica mede o deslocamento aparente da estrela devido ao movimento da Terra; a distância é inversamente proporcional ao ângulo observado.' },
    { 
        questao: 'A lei de Wien relaciona:', 
        dissertativa: false, 
        alternativas: ['Idade e metalicidade', 'Temperatura e pico do espectro', 'Velocidade radial e distância', 'Massa e luminosidade'],
        respostaCorreta: 'Temperatura e pico do espectro'
    },
    { 
        questao: 'O que é o Efeito Doppler e como ele é usado em astronomia para medir a velocidade de objetos?', 
        dissertativa: true,
        respostaCorreta: 'O Efeito Doppler é o deslocamento de linhas espectrais causado pelo movimento radial; o sentido e magnitude do deslocamento revelam velocidades de aproximação ou afastamento.' 
    },
    {
        questao: 'Explique por que telescópios espaciais observam em infravermelho para estudar regiões com poeira.',
        dissertativa: true,
        respostaCorreta: 'A poeira interestelar absorve luz visível mas deixa passar infravermelho; observações nessa faixa atravessam nuvens de poeira e revelam regiões de formação estelar escondidas.'
    },
    {
        questao: 'Fotometria multibanda permite estimar qual propriedade estelar com maior precisão?',
        dissertativa: false,
        alternativas: ['Composição atmosférica', 'Idade individual', 'Momento angular', 'Temperatura efetiva e extinção'],
        respostaCorreta: 'Temperatura efetiva e extinção'
    }
];

const questoesFormacaoEstelar = [
    { questao: 'Resuma o processo de colapso de nuvens moleculares até protoestrelas.', dissertativa: true, respostaCorreta: 'Regiões densas em nuvens moleculares colapsam sob gravidade, formando núcleos que aquecem; material cai para um disco de acreção e surge uma protoestrela que evoluirá para estrela ao iniciar a fusão.' },
    { questao: 'Explique feedback estelar e seus efeitos no meio interestelar.', dissertativa: true, respostaCorreta: 'Feedback inclui ventos, radiação ionizante e supernovas de estrelas massivas, que comprimem ou dispersam gás, regulando a taxa de formação estelar e enriquecendo o meio com metais.' },
    { questao: 'Comente o papel da poeira na formação estelar e observações.', dissertativa: true, respostaCorreta: 'Poeira ajuda a resfriar o gás e facilita o colapso, mas também absorve luz visível, exigindo observações em infravermelho e rádio para estudar regiões embrionárias.' },
    { 
        questao: 'Regiões HII são:', 
        dissertativa: false, 
        alternativas: ['Nuvens de poeira fria', 'Aglomerados globulares antigos', 'Buracos negros supermassivos', 'Gás ionizado por estrelas jovens'],
        respostaCorreta: 'Gás ionizado por estrelas jovens'
    },
    { 
        questao: 'O que são "objetos de Herbig-Haro"?', 
        dissertativa: true,
        respostaCorreta: 'São nebulosidades brilhantes criadas quando jatos de protoestrelas jovens colidem com o meio interestelar, gerando choques e emissão visível.' 
    },
    { 
        questao: 'Qual é a principal fonte de energia de uma protoestrela?', 
        dissertativa: false, 
        alternativas: ['Fusão nuclear de hidrogênio', 'Aniquilação de matéria e antimatéria', 'Contração gravitacional', 'Fusão nuclear de hélio'],
        respostaCorreta: 'Contração gravitacional'
    },
    {
        questao: 'Como jatos bipolares influenciam o ambiente em volta de estrelas jovens?',
        dissertativa: true,
        respostaCorreta: 'Jatos removem excesso de momento angular e expulsam material, abrindo cavidades e impactando o meio circundante, podendo desencadear ou inibir nova formação estelar.'
    },
    {
        questao: 'Núcleos densos em nuvens moleculares podem ser detectados através de emissão em:',
        dissertativa: false,
        alternativas: ['Raios X', 'Raios gama', 'Luz visível', 'Infravermelho distante e rádio'],
        respostaCorreta: 'Infravermelho distante e rádio'
    }
];

const questoesViaLactea = [
    { questao: 'Descreva as principais componentes da Via Láctea (disco, bojo, halo).', dissertativa: true, respostaCorreta: 'A Via Láctea possui um disco fino com estrelas jovens e gás, um disco espesso com estrelas mais velhas, um bojo central denso e um halo esferoidal com matéria escura e aglomerados globulares.' },
    { questao: 'Explique como medimos a rotação galáctica.', dissertativa: true, respostaCorreta: 'Utilizamos velocidades radiais de nuvens de gás e estrelas via efeito Doppler e mapeamos curvas de rotação ao longo do disco.' },
    { questao: 'Onde estamos localizados na galáxia e o que isso implica para observações?', dissertativa: true, respostaCorreta: 'O Sistema Solar está a cerca de 8 kpc do centro, no braço de Órion; vemos a galáxia de dentro, o que dificulta observar o centro devido à poeira e exige múltiplos comprimentos de onda.' },
    { 
        questao: 'A curva de rotação da Via Láctea indica:', 
        dissertativa: false, 
        alternativas: ['Universo estático', 'Somente matéria bariônica', 'Erro de medição sistemático', 'Presença de matéria escura'],
        respostaCorreta: 'Presença de matéria escura'
    },
    { 
        questao: 'O que é Sagitário A* (Sgr A*)?', 
        dissertativa: true,
        respostaCorreta: 'É o buraco negro supermassivo no centro da Via Láctea, com cerca de quatro milhões de massas solares, identificado por órbitas estelares rápidas ao seu redor.' 
    },
    {
        questao: 'Quais evidências observacionais suportam a presença de barras (bar) na Via Láctea?',
        dissertativa: true,
        respostaCorreta: 'Mapas infravermelhos, distribuição assimétrica de estrelas e movimentos gasosos sugerem uma barra central alongada que organiza a dinâmica interna.'
    },
    {
        questao: 'A contagem de estrelas do disco fino é mais eficiente em que faixa espectral devido à extinção?',
        dissertativa: false,
        alternativas: ['Rádio de alta frequência', 'Ultravioleta', 'Óptico azul', 'Infravermelho próximo'],
        respostaCorreta: 'Infravermelho próximo'
    }
];

const questoesExoplanetas = [
    { questao: 'Compare os métodos de trânsito e velocidade radial para detectar exoplanetas.', dissertativa: true, respostaCorreta: 'Trânsito mede a queda de brilho e fornece raio planetário; velocidade radial mede oscilações da estrela e fornece massa mínima; combinados revelam densidade.' },
    { questao: 'Explique o que podemos inferir sobre atmosferas de exoplanetas.', dissertativa: true, respostaCorreta: 'Ao analisar espectros durante trânsitos ou eclipses, identificamos moléculas e nuvens, estimamos temperaturas e possível composição química da atmosfera.' },
    { questao: 'Comente limitações observacionais no estudo de habitabilidade.', dissertativa: true, respostaCorreta: 'Sinais são fracos, exigem longas séries temporais, variabilidade estelar atrapalha e habitabilidade depende de fatores não observáveis diretamente, como geologia e proteção magnética.' },
    { 
        questao: 'O método de trânsito mede:', 
        dissertativa: false, 
        alternativas: ['Queda no brilho quando o planeta passa à frente', 'Emissão térmica do planeta', 'Variações de velocidade da estrela', 'Imagem direta do planeta'],
        respostaCorreta: 'Queda no brilho quando o planeta passa à frente'
    },
    { 
        questao: 'O que é a "zona habitável" de uma estrela?', 
        dissertativa: true,
        respostaCorreta: 'É a região em torno da estrela onde a temperatura permitiria água líquida na superfície de um planeta, assumindo atmosfera adequada.' 
    },
    { 
        questao: 'Qual telescópio espacial foi um dos mais prolíficos na descoberta de exoplanetas usando o método de trânsito?', 
        dissertativa: false, 
        alternativas: ['Spitzer', 'Hubble', 'James Webb', 'Kepler'],
        respostaCorreta: 'Kepler'
    },
    {
        questao: 'Explique por que espectroscopia de transmissão é útil para detectar moléculas em atmosferas exoplanetárias.',
        dissertativa: true,
        respostaCorreta: 'Durante o trânsito, parte da luz estelar atravessa a atmosfera do planeta; as moléculas absorvem em comprimentos específicos, permitindo identificar suas assinaturas.'
    },
    {
        questao: 'O método de microlente gravitacional é especialmente sensível a planetas:',
        dissertativa: false,
        alternativas: ['Em sistemas binários brilhantes', 'Com atmosferas espessas', 'Muito próximos da estrela', 'Em órbitas largas, inclusive em galáxias distantes'],
        respostaCorreta: 'Em órbitas largas, inclusive em galáxias distantes'
    }
];

const questoesMorfologiaEvolucao = [
    { questao: 'Descreva a classificação morfológica de galáxias (Hubble).', dissertativa: true, respostaCorreta: 'O diagrama de Hubble organiza galáxias em elípticas, lenticulares e espirais (normais e barradas), além de irregulares, conforme a forma aparente e estrutura.' },
    { questao: 'Explique como interações e fusões afetam a evolução galáctica.', dissertativa: true, respostaCorreta: 'Interações podem distorcer discos, desencadear starbursts e redistribuir gás; fusões grandes podem transformar espirais em elípticas e alimentar buracos negros centrais.' },
    { questao: 'Comente evidências observacionais de eventos de fusão.', dissertativa: true, respostaCorreta: 'Caudas de maré, pontes de estrelas, núcleos duplos e distorções morfológicas são assinaturas de fusões em andamento ou recentes.' },
    {
        questao: 'Galáxias elípticas tendem a ser associadas a:',
        dissertativa: false,
        alternativas: ['Altas taxas de gás frio', 'Formação estelar intensa recente', 'Populações estelares mais velhas', 'Discos com braços espirais proeminentes'],
        respostaCorreta: 'Populações estelares mais velhas'
    },
    { questao: 'O que diferencia galáxias lenticulares (S0) de espirais clássicas?', dissertativa: true, respostaCorreta: 'Lenticulares possuem disco e bojo mas carecem de braços espirais proeminentes e têm pouco gás frio, indicando formação estelar reduzida.' },
    { questao: 'Explique o papel do quenching ambiental em aglomerados de galáxias.', dissertativa: true, respostaCorreta: 'Processos como pressão de arrasto, interações e falta de gás fresco removem ou aquecem o gás das galáxias em aglomerados, interrompendo a formação estelar.' },
    {
        questao: 'Assinale o mecanismo que pode transformar uma galáxia espiral em elíptica:',
        dissertativa: false,
        alternativas: ['Rotação diferencial isolada', 'Explosões de raios gama', 'Perda de gás por ventos solares', 'Fusão maior (major merger)'],
        respostaCorreta: 'Fusão maior (major merger)'
    },
    {
        questao: 'O que são galáxias “green valley” e por que são importantes?',
        dissertativa: true,
        respostaCorreta: 'São galáxias com cores intermediárias entre azuis (ativas) e vermelhas (passivas), indicando transição no ritmo de formação estelar e ajudando a entender mecanismos de quenching.'
    }
];

const questoesCosmografia = [
    { questao: 'Explique o conceito de escada de distâncias cósmicas.', dissertativa: true, respostaCorreta: 'A escada de distâncias usa métodos calibrados em sequência, da paralaxe às Cefeidas, supernovas e BAO, permitindo medir distâncias cada vez maiores com incertezas controladas.' },
    { questao: 'Descreva o diagrama HR e seu uso em estimar distâncias.', dissertativa: true, respostaCorreta: 'No diagrama HR, comparar a sequência principal observada de um aglomerado com a sequência padrão fornece o deslocamento em magnitude necessário para inferir a distância.' },
    { questao: 'Comente o uso de múltiplos comprimentos de onda em cosmografia.', dissertativa: true, respostaCorreta: 'Combinar observações em rádio, óptico e infravermelho ajuda a corrigir extinção, identificar populações específicas e obter distâncias mais robustas.' },
    { 
        questao: 'Cefeidas são importantes porque:', 
        dissertativa: false, 
        alternativas: ['São velas padrão para distâncias extragalácticas', 'Mede-se sua temperatura com precisão', 'Têm brilho absolutamente constante', 'São sempre parte de galáxias anãs'],
        respostaCorreta: 'São velas padrão para distâncias extragalácticas'
    },
    { 
        questao: 'O que é o "Grupo Local" de galáxias?', 
        dissertativa: true,
        respostaCorreta: 'Conjunto de galáxias ligado gravitacionalmente que inclui Via Láctea, Andrômeda, Triângulo e dezenas de anãs, estendendo-se por aproximadamente 1 Mpc.' 
    },
    { 
        questao: 'Qual é a galáxia espiral massiva mais próxima da Via Láctea?', 
        dissertativa: false, 
        alternativas: ['Grande Nuvem de Magalhães', 'Galáxia do Triângulo', 'Pequena Nuvem de Magalhães', 'Galáxia de Andrômeda'],
        respostaCorreta: 'Galáxia de Andrômeda'
    },
    {
        questao: 'Explique o que são padrões de fluxo peculiar e como eles ajudam em cosmografia.',
        dissertativa: true,
        respostaCorreta: 'Fluxos peculiares são velocidades adicionais à expansão de Hubble; mapear esses desvios revela distribuição de massa e permite ajustar distâncias em escalas intermediárias.'
    },
    {
        questao: 'A relação de Tully-Fisher conecta luminosidade com qual propriedade galáctica?',
        dissertativa: false,
        alternativas: ['Conteúdo de poeira', 'Metalicidade', 'Velocidade de rotação', 'Temperatura média'],
        respostaCorreta: 'Velocidade de rotação'
    }
];


// BANCOS DE QUESTÕES PARA OS NOVOS MÓDULOS (7, 8 e 9)

// Banco de questões: Astrofísica de Objetos Compactos (Módulo 7)
const questoesObjetosCompactos = [
    { questao: 'Explique o conceito de pressão de degenerescência eletrônica e o limite de Chandrasekhar.', dissertativa: true, respostaCorreta: 'Pressão de degenerescência vem do princípio de exclusão de Pauli e sustenta anãs brancas; o limite de Chandrasekhar (~1,4 M☉) é a massa máxima suportada por elétrons degenerados.' },
    { questao: 'Descreva a estrutura interna de uma estrela de nêutrons (crosta, núcleo) e a equação de estado (EoS) da matéria nuclear.', dissertativa: true, respostaCorreta: 'Estrelas de nêutrons possuem crosta sólida de núcleos e elétrons, camadas internas de nêutrons superfluídos e possível núcleo com partículas exóticas; a EoS relaciona pressão e densidade, ainda incerta em densidades extremas.' },
    { questao: 'O que é um pulsar? Explique o modelo do "farol" (lighthouse model) e a física da magnetosfera do pulsar.', dissertativa: true, respostaCorreta: 'Pulsar é uma estrela de nêutrons magnetizada em rápida rotação cujos feixes de radiação atravessam nosso campo de visão; partículas na magnetosfera seguem linhas de campo e produzem pulsos regulares.' },
    { questao: 'Compare os processos de resfriamento de uma anã branca e de uma estrela de nêutrons.', dissertativa: true, respostaCorreta: 'Anãs brancas esfriam lentamente emitindo radiação térmica; estrelas de nêutrons podem resfriar rápido por emissão de neutrinos no núcleo e depois por radiação térmica superficial.' },
    { 
        questao: 'A massa máxima de uma estrela de nêutrons (limite TOV) é determinada principalmente por:', 
        dissertativa: false, 
        alternativas: ['Pressão de degenerescência eletrônica', 'Taxa de rotação', 'Campo magnético', 'Equação de Estado da matéria nuclear'],
        respostaCorreta: 'Equação de Estado da matéria nuclear'
    },
    { 
        questao: 'O que são magnetares?', 
        dissertativa: true,
        respostaCorreta: 'Magnetares são estrelas de nêutrons com campos magnéticos extremamente intensos (~10¹⁴-10¹⁵ G) que alimentam emissões de raios X e gama.' 
    },
    {
        questao: 'Explique como pares binários de estrelas de nêutrons podem produzir kilonovas.',
        dissertativa: true,
        respostaCorreta: 'Quando duas estrelas de nêutrons se fundem, ejetam material rico em nêutrons que sofre processo r, produzindo elementos pesados e uma transiente luminosa chamada kilonova.'
    },
    {
        questao: 'Qual observável indica a presença de uma anã branca em um sistema binário?',
        dissertativa: false,
        alternativas: ['Linhas espectrais de hidrogênio amplas em UV', 'Emissão de raios gama persistente', 'Absorção de raios cósmicos', 'Oscilações de neutrinos'],
        respostaCorreta: 'Linhas espectrais de hidrogênio amplas em UV'
    }
];

// Banco de questões: Física Avançada de Buracos Negros (Módulo 8)
const questoesFisicaBN = [
    { questao: 'Discuta o Teorema "No-Hair" (Sem Cabelo) e seus três parâmetros (Massa, Carga, Spin).', dissertativa: true, respostaCorreta: 'O teorema no-hair afirma que um buraco negro estacionário é descrito apenas por massa, carga elétrica e momento angular; todos os outros detalhes da matéria colapsada desaparecem.' },
    { questao: 'Explique o que é a Radiação Hawking e o processo físico de criação de pares no horizonte de eventos.', dissertativa: true, respostaCorreta: 'Radiação Hawking surge de pares partícula-antipartícula criados próximo ao horizonte; uma cai, a outra escapa, levando energia e causando evaporação térmica do buraco negro.' },
    { questao: 'Descreva o Paradoxo da Informação do Buraco Negro. Por que ele representa um conflito entre a Relatividade Geral e a Mecânica Quântica?', dissertativa: true, respostaCorreta: 'A evaporação térmica sugere perda de informação, violando unitariedade quântica, enquanto relatividade permite horizonte sem fuga; resolver essa tensão exige nova física.' },
    { questao: 'Diferencie a singularidade de um buraco negro de Schwarzschild (ponto) da singularidade de um buraco negro de Kerr (anel).', dissertativa: true, respostaCorreta: 'Schwarzschild tem singularidade pontual não rotante; Kerr possui singularidade em forma de anel devido ao spin, com região interna permitindo trajetórias evitáveis.' },
    { 
        questao: 'A "Termodinâmica do Buraco Negro" relaciona a área do horizonte de eventos com qual propriedade física?', 
        dissertativa: false, 
        alternativas: ['Momento Angular', 'Carga', 'Massa', 'Entropia'],
        respostaCorreta: 'Entropia'
    },
    { 
        questao: 'O que é a ergosfera de um buraco negro de Kerr?', 
        dissertativa: true,
        respostaCorreta: 'A ergosfera é a região externa ao horizonte onde o arrastamento de referenciais força tudo a co-rotar; nela é possível extrair energia do buraco negro.' 
    },
    { 
        questao: 'O processo de Penrose é um mecanismo teórico para:', 
        dissertativa: false, 
        alternativas: ['Extrair energia de um buraco negro em rotação', 'Criar um buraco de minhoca', 'Medir a massa de um buraco negro', 'Destruir um buraco negro'],
        respostaCorreta: 'Extrair energia de um buraco negro em rotação'
    },
    {
        questao: 'Compare qualitativamente as diferenças entre as soluções de Kerr e Kerr-Newman.',
        dissertativa: true,
        respostaCorreta: 'Kerr descreve buracos negros rotantes sem carga; Kerr-Newman inclui carga elétrica, alterando métricas, horizontes e campos eletromagnéticos associados.'
    }
];

// Banco de questões: Física da Formação de Galáxias (Módulo 9)
const questoesFormacaoGalaxias = [
    { questao: 'Explique o conceito de "fricção dinâmica" (dynamical friction) de Chandrasekhar e seu papel em fusões de galáxias.', dissertativa: true, respostaCorreta: 'Fricção dinâmica é o arrasto gravitacional causado por estrelas e partículas do halo; desacelera objetos massivos e facilita a coalescência em fusões.' },
    { questao: 'Compare "feedback estelar" (supernovas) e "feedback de AGN". Qual é mais eficaz em "apagar" (quenching) a formação estelar em galáxias massivas?', dissertativa: true, respostaCorreta: 'Feedback de AGN injeta energia em grande escala e é mais eficaz em galáxias massivas; feedback estelar domina em sistemas menores.' },
    { questao: 'O que é o "downsizing" cosmológico e como ele desafia modelos simples de formação hierárquica?', dissertativa: true, respostaCorreta: 'Downsizing é a observação de que galáxias massivas formaram estrelas cedo e agora são passivas, desafiando previsões de que objetos maiores deveriam se formar mais tarde.' },
    { questao: 'Descreva o formalismo de Press-Schechter e como ele estima a função de massa de halos de matéria escura.', dissertativa: true, respostaCorreta: 'Press-Schechter estima a fração de massa colapsada integrando a distribuição gaussiana de densidades acima de um limiar crítico, produzindo função de massa de halos.' },
    { 
        questao: 'O processo que impede o gás de se resfriar e formar estrelas em halos muito massivos (M > 10^12 Msol) é dominado por:', 
        dissertativa: false, 
        alternativas: ['Decaimento da matéria escura', 'Radiação UV de fundo', 'Feedback de supernovas', 'Aquecimento por choque (shock heating) e feedback de AGN'],
        respostaCorreta: 'Aquecimento por choque (shock heating) e feedback de AGN'
    },
    { questao: 'Explique o papel de fluxos frios (cold flows) na alimentação de galáxias em alto redshift.', dissertativa: true, respostaCorreta: 'Fluxos frios canalizam gás não aquecido diretamente ao disco, mantendo altas taxas de formação estelar em galáxias jovens.' },
    { questao: 'Como os halos de matéria escura definem o potencial onde as galáxias crescem?', dissertativa: true, respostaCorreta: 'Halos de matéria escura fornecem o poço gravitacional que captura gás e regula a dinâmica e morfologia das galáxias em formação.' },
    {
        questao: 'AGN do tipo quasar são caracterizados por:',
        dissertativa: false,
        alternativas: ['Linhas largas e luminosidade extrema', 'Rotação lenta', 'Ausência de disco de acreção', 'Emissão fraca em todas as bandas'],
        respostaCorreta: 'Linhas largas e luminosidade extrema'
    }
];

export const initialCourseModules = {
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
                    questoes: selecionarQuestoes(questoesBBang, [0, 1, 4, 6])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Física do Desacoplamento',
                        descricao: 'Com base na Aula 2, explique o processo termodinâmico que tornou o Universo transparente e deu origem ao CMB.'
                    },
                    questoes: selecionarQuestoes(questoesBBang, [2, 3, 5, 0, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Prevendo os Elementos Leves',
                        descricao: 'Discuta o processo da BBN (Aula 3). Por que a nucleossíntese parou no Lítio e não produziu elementos mais pesados?'
                    },
                    questoes: selecionarQuestoes(questoesBBang, [1, 2, 4, 5, 6, 3])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Testes de Consistência',
                        descricao: 'Resolva problemas comparando as idades e abundâncias previstas pelo modelo padrão com dados observacionais (Aula 4).'
                    },
                    questoes: selecionarQuestoes(questoesBBang, [0, 2, 4])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Análise dos Pilares',
                        descricao: 'Discuta por que a Radiação Cósmica de Fundo é considerada a evidência mais forte do Big Bang.'
                    },
                    questoes: selecionarQuestoes(questoesBBang, [3, 5, 6, 1, 2, 0, 4])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Cosmologia Primordial',
                        descricao: 'Uma avaliação integradora (Aula 5) que conecta a Relatividade Geral à termodinâmica e física nuclear.'
                    },
                    questoes: selecionarQuestoes(questoesBBang, [6, 4, 1, 3, 0])
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
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [0, 1, 4, 6, 7])
                },
                {
                    id: 3534529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Mapeando Massa com Lentes',
                        descricao: 'Explique como o "cisalhamento" (shear) de lentes fracas (Aula 2) permite mapear a matéria escura, independentemente da dinâmica.'
                    },
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [2, 5, 1, 3])
                },
                {
                    id: 5639283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Diagrama de Hubble de SNe Ia',
                        descricao: 'Interprete o diagrama de Hubble (Aula 3) e explique por que a aceleração é a conclusão preferida.'
                    },
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [0, 2, 6, 4, 5, 7])
                },
                {
                    id: 2557356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Resolvendo as Equações de Friedmann',
                        descricao: 'Discuta o papel do parâmetro de equação de estado (w) (Aula 4). O que acontece se w < -1/3?'
                    },
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [3, 0, 6])
                },
                {
                    id: 6353456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Debate: CDM vs. MOND',
                        descricao: 'Cite duas evidências independentes para Matéria Escura Fria (CDM) que são difíceis de explicar com gravidade modificada (MOND).'
                    },
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [1, 2, 3, 4, 5, 6, 7])
                },
                {
                    id: 8374434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Setor Escuro',
                        descricao: 'Avaliação final (Aula 5) sobre os modelos teóricos para a matéria escura e a energia escura.'
                    },
                    questoes: selecionarQuestoes(questoesMateriaEnergiaEscura, [0, 5, 7, 2, 4])
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
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [0, 1, 4, 6])
                },
                {
                    id: 3554529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Colapso e Viralização',
                        descricao: 'Descreva o modelo de colapso "top-hat" (Aula 2) e como ele prevê a densidade de halos viralizados.'
                    },
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [2, 3, 5])
                },
                {
                    id: 5699283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Física de Aglomerados (Observáveis)',
                        descricao: 'Compare como a massa de um aglomerado pode ser medida usando Lentes (Aula 3), Raio-X e o Efeito SZ.'
                    },
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [1, 2, 4, 7, 5])
                },
                {
                    id: 2577356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Interpretando o Espectro de Potência',
                        descricao: 'O que o P(k) (Aula 4) nos informa? O que é o "turnover" no espectro de potência e o que o causa?'
                    },
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [3, 6, 0, 7, 2, 4])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: O Papel das Simulações',
                        descricao: 'Por que simulações de N-Corpos (Aula 5) são necessárias? Por que não podemos resolver o crescimento não-linear analiticamente?'
                    },
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [5, 7, 1, 0, 6, 4, 2])
                },
                {
                    id: 8384434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Formação de Estruturas',
                        descricao: 'Teste final integrando a teoria de perturbações com a física de fluidos e a estatística de grande escala.'
                    },
                    questoes: selecionarQuestoes(questoesEstruturaUniverso, [0, 3, 2, 5])
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
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [0, 1, 6, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Métrica de Kerr',
                        descricao: 'Diferencie a métrica de Kerr da de Schwarzschild (Aula 3). O que é a ergoesfera e como ela permite a extração de energia?'
                    },
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [2, 3, 5, 0, 4])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Fontes de Ondas Gravitacionais',
                        descricao: 'Comente sobre a detecção de ondas gravitacionais (Aula 4). O que o "chirp" de uma fusão nos diz sobre as massas dos objetos?'
                    },
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [2, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Física da Acreção',
                        descricao: 'Descreva como um buraco negro (que não emite luz) pode ser a fonte dos objetos mais luminosos do universo (Quasares) (Aula 5).'
                    },
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [0, 3, 4, 6, 1])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Problemas Abertos',
                        descricao: 'Discuta o conceito de singularidade e o paradoxo da informação (Aula 6).'
                    },
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [4, 6, 7, 2, 5, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Avaliação final sobre as soluções e implicações astrofísicas das Equações de Campo de Einstein.'
                    },
                    questoes: selecionarQuestoes(questoesRelatividadeBuracosNegros, [1, 2, 3, 5, 6, 7, 4])
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
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [0, 4, 5])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Tensão em H0',
                        descricao: 'Descreva a tensão de Hubble (Aula 3). Por que ela é um problema tão sério para o modelo ΛCDM?'
                    },
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [1, 3, 6, 0])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Geometria vs. Crescimento',
                        descricao: 'Diferencie sondas de "geometria" (como BAO/SNe) de sondas de "crescimento de estrutura" (como RSD/Lensing) (Aula 5).'
                    },
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [2, 4, 5, 1, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Estatística Cosmológica',
                        descricao: 'O que é "Likelihood" (Aula 4)? Explique por que a análise combinada (Aula 6) é tão poderosa para quebrar degenerescências de parâmetros.'
                    },
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [3, 5, 0, 2, 4, 6])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Erros Sistemáticos',
                        descricao: 'Discuta possíveis fontes de erro sistemático (Aula 1, Aula 3) na calibração de SNe Ia que poderiam impactar a medida de H0.'
                    },
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [4, 6, 1, 0, 5, 2, 3])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Avaliação final sobre o arsenal de sondas observacionais e os métodos estatísticos usados para definir o modelo cosmológico.'
                    },
                    questoes: selecionarQuestoes(questoesCosmologiaObservacional, [2, 3, 5, 6])
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
                    questoes: selecionarQuestoes(questoesInflacao, [0, 5, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Campo "Inflaton"',
                        descricao: 'Descreva as condições de "slow-roll" (Aula 2) e como elas garantem um período de inflação e uma saída "graciosa".'
                    },
                    questoes: selecionarQuestoes(questoesInflacao, [1, 2, 4, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Das Flutuações Quânticas às Galáxias',
                        descricao: 'Explique a conexão entre flutuações quânticas microscópicas (Aula 3) e a estrutura em grande escala do universo (Módulo 3).'
                    },
                    questoes: selecionarQuestoes(questoesInflacao, [2, 3, 5, 6, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Modos B Primordiais',
                        descricao: 'O que são Modos-B (Aula 5) no CMB? Por que sua detecção (associada a ondas gravitacionais primordiais) seria a "bala de prata" da inflação?'
                    },
                    questoes: selecionarQuestoes(questoesInflacao, [3, 4, 7, 1, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Restringindo Modelos de Inflação',
                        descricao: 'Como os observáveis ns e r (Aula 5) nos ajudam a diferenciar entre diferentes "potenciais" inflacionários (ex: m²Φ², Φ⁴)?'
                    },
                    questoes: selecionarQuestoes(questoesInflacao, [4, 6, 7, 2, 0, 5])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Inflação e TQC',
                        descricao: 'Avaliação final sobre a aplicação da Teoria Quântica de Campos para resolver os problemas fundamentais da cosmologia (Aula 6).'
                    },
                    questoes: selecionarQuestoes(questoesInflacao, [1, 3, 2, 4, 5, 6, 7])
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
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [0, 1, 5, 6])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Equação de Estado (EoS) Nuclear',
                        descricao: 'Discuta a estrutura interna de uma Estrela de Nêutrons (Aula 2) e a incerteza na EoS da matéria nuclear.'
                    },
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [2, 3, 4, 7, 0, 5])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Limite TOV',
                        descricao: 'Explique como o limite de Tolman-Oppenheimer-Volkoff (Aula 2) estabelece a massa máxima para uma estrela de nêutrons.'
                    },
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [1, 2, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Eletrodinâmica de Pulsares',
                        descricao: 'Descreva o modelo do "farol" (Aula 3) e a física da magnetosfera que gera a emissão coerente de rádio.'
                    },
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [3, 4, 5, 7])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Magnetares e Surtos de Raios Gama',
                        descricao: 'Investigue a física dos Magnetares (Aula 4), objetos com os campos magnéticos mais intensos do universo.'
                    },
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [0, 2, 4, 6, 7, 1, 5])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Matéria Extrema',
                        descricao: 'Avaliação final (Aula 5) comparando os processos físicos que sustentam Anãs Brancas e Estrelas de Nêutrons.'
                    },
                    questoes: selecionarQuestoes(questoesObjetosCompactos, [5, 6, 7, 3, 1])
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
                    questoes: selecionarQuestoes(questoesFisicaBN, [0, 1, 5, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: As Leis da Termodinâmica de BN',
                        descricao: 'Explique as quatro leis da termodinâmica de buracos negros (Aula 2), focando na relação entre área do horizonte e entropia.'
                    },
                    questoes: selecionarQuestoes(questoesFisicaBN, [2, 3, 4, 6, 0])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: A Evaporação Quântica (Radiação Hawking)',
                        descricao: 'Descreva o processo de criação de pares (Aula 3) que leva à Radiação Hawking. Qual a temperatura de um BN?'
                    },
                    questoes: selecionarQuestoes(questoesFisicaBN, [1, 2, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Paradoxo da Informação',
                        descricao: 'Explique por que a evaporação de buracos negros (Aula 4) viola a unitariedade da Mecânica Quântica.'
                    },
                    questoes: selecionarQuestoes(questoesFisicaBN, [3, 4, 5, 6])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: A Natureza da Singularidade',
                        descricao: 'Compare a singularidade de ponto (Schwarzschild) com a singularidade de anel (Kerr) (Aula 5). O que é a Hipótese da Censura Cósmica?'
                    },
                    questoes: selecionarQuestoes(questoesFisicaBN, [0, 2, 4, 6, 7, 1])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão: RG vs. MQ',
                        descricao: 'Avaliação final (Aula 6) sobre os pontos de conflito e sinergia entre a Relatividade Geral e a Mecânica Quântica na física de buracos negros.'
                    },
                    questoes: selecionarQuestoes(questoesFisicaBN, [5, 6, 7, 3, 1, 0])
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
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [0, 1, 4, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Física das Fusões (Mergers)',
                        descricao: 'Explique o conceito de "fricção dinâmica" (Aula 2) e como ela determina o tempo de escala para a fusão de galáxias satélites.'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [2, 3, 5, 6, 1])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: A Batalha do Gás (Resfriamento vs. Aquecimento)',
                        descricao: 'Descreva a "função de resfriamento" (cooling function) do gás (Aula 3) e por que ela leva a uma formação de estrelas ineficiente em halos massivos.'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [0, 2, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Feedback Estelar (Supernovas)',
                        descricao: 'Como o "feedback" de supernovas (Aula 4) regula a formação estelar, especialmente em galáxias de baixa massa?'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [3, 4, 5, 7, 1, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Feedback de AGN e "Quenching"',
                        descricao: 'Compare o modo "Quasar" e o modo "Rádio/Jet" (Aula 5). Por que o feedback de AGN (Aula 6) é essencial para explicar o "quenching" de galáxias massivas?'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [5, 6, 7, 2, 3, 1, 4])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão da Evolução de Galáxias',
                        descricao: 'Avaliação final sobre o modelo hierárquico e os processos físicos (fusões, feedback) que definem a evolução das galáxias.'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoGalaxias, [1, 3, 5, 7])
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
                    questoes: selecionarQuestoes(questoesLuzMedidas, [0, 1, 4])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Magnitude e Índice de Cor',
                        descricao: 'Aplique os conceitos da Aula 3. Responda questões sobre a escala de magnitudes e como a cor se relaciona com a temperatura.'
                    },
                    questoes: selecionarQuestoes(questoesLuzMedidas, [2, 3, 5, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Medindo Distâncias',
                        descricao: 'Use o que aprendeu na Aula 4 sobre paralaxe e velas padrão para resolver problemas de estimativa de distância.'
                    },
                    questoes: selecionarQuestoes(questoesLuzMedidas, [1, 2, 4, 5])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: A Lei de Wien',
                        descricao: 'Concentre-se na relação entre a temperatura de um corpo negro e o pico de seu espectro de emissão.'
                    },
                    questoes: selecionarQuestoes(questoesLuzMedidas, [0, 3, 6, 2, 5])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Incertezas na Prática',
                        descricao: 'Discuta os desafios e fontes de erro em medições astronômicas, como visto na Aula 5.'
                    },
                    questoes: selecionarQuestoes(questoesLuzMedidas, [4, 5, 6, 1, 0, 2])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão de Fotometria e Espectroscopia',
                        descricao: 'Questionário final do módulo (Aula 6), integrando todos os conceitos sobre como medimos as propriedades dos astros.'
                    },
                    questoes: selecionarQuestoes(questoesLuzMedidas, [3, 5, 0, 6, 2, 1, 4])
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
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [0, 2, 5, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Regulando o Nascimento: Feedback',
                        descricao: 'Explique o que é "feedback estelar" (ventos, radiação) e como ele afeta o meio interestelar (Aula 3).'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [1, 3, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Papel da Poeira e Gás',
                        descricao: 'Comente o papel da poeira na observação da formação estelar (extinção) e o que são Regiões HII (Aula 4).'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [0, 1, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Medindo a Formação Estelar',
                        descricao: 'Quais são os "observáveis" (Aula 5) usados para medir a taxa de formação estelar em galáxias?'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [2, 3, 4, 6, 7, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Propriedades do ISM',
                        descricao: 'Descreva os diferentes componentes do Meio Interestelar (gás ionizado, neutro, molecular).'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [5, 6, 7, 1, 2, 3])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 2',
                        descricao: 'Questionário final (Aula 6) integrando os processos de formação estelar e a física do ISM.'
                    },
                    questoes: selecionarQuestoes(questoesFormacaoEstelar, [0, 4, 5, 7, 2, 3, 1])
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
                    questoes: selecionarQuestoes(questoesViaLactea, [0, 2, 5])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Enigma da Rotação',
                        descricao: 'Explique como medimos a rotação galáctica (Aula 2) e o que a curva de rotação indica sobre a matéria escura (Aula 4).'
                    },
                    questoes: selecionarQuestoes(questoesViaLactea, [1, 3, 6, 4])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Onde Estamos?',
                        descricao: 'Qual a nossa localização na galáxia (Aula 3) e o que isso implica para as observações (ex: "Zona de Evitamento")?'
                    },
                    questoes: selecionarQuestoes(questoesViaLactea, [0, 1, 4, 5, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Fósseis Galácticos',
                        descricao: 'O que são correntes estelares e subestruturas (Aula 5)? O que elas nos dizem sobre o passado da Via Láctea?'
                    },
                    questoes: selecionarQuestoes(questoesViaLactea, [2, 3, 5, 6, 0, 1])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Propriedades da Vizinhança',
                        descricao: 'Discuta as características da vizinhança solar e como ela se compara a outras regiões da galáxia.'
                    },
                    questoes: selecionarQuestoes(questoesViaLactea, [4, 6, 0, 2, 3, 5, 1])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 3',
                        descricao: 'Consolide seu conhecimento (Aula 6) sobre a estrutura, dinâmica e composição da Via Láctea.'
                    },
                    questoes: selecionarQuestoes(questoesViaLactea, [1, 2, 4, 6])
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
                    questoes: selecionarQuestoes(questoesExoplanetas, [0, 1, 6, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Fotografando Mundos Distantes',
                        descricao: 'Quais são os desafios e limitações da imagem direta de exoplanetas? (Aula 3)'
                    },
                    questoes: selecionarQuestoes(questoesExoplanetas, [2, 3, 4])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Analisando Atmosferas',
                        descricao: 'Explique como a espectroscopia de trânsito (Aula 4) nos permite inferir a composição da atmosfera de um exoplaneta.'
                    },
                    questoes: selecionarQuestoes(questoesExoplanetas, [1, 2, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O que é "Habitabilidade"?',
                        descricao: 'Discuta o conceito de "Zona Habitável" (Aula 5) e comente as limitações observacionais no estudo da habitabilidade.'
                    },
                    questoes: selecionarQuestoes(questoesExoplanetas, [3, 5, 6, 0, 2, 4])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Viés Observacional',
                        descricao: 'Discuta por que os primeiros métodos de detecção encontraram tantos "Júpiteres Quentes". O que é viés de seleção?'
                    },
                    questoes: selecionarQuestoes(questoesExoplanetas, [4, 6, 7, 1, 2, 3, 5])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Teste final (Aula 6) sobre os métodos de detecção e caracterização de exoplanetas.'
                    },
                    questoes: selecionarQuestoes(questoesExoplanetas, [0, 2, 3, 5])
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
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [0, 1, 4, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Estruturas Internas',
                        descricao: 'Qual o papel de barras, braços espirais e bojos na dinâmica e formação estelar de uma galáxia? (Aula 2)'
                    },
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [2, 3, 5])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Canibalismo Galáctico',
                        descricao: 'Explique como interações e fusões (Aula 3) afetam a evolução galáctica e cite evidências observacionais (ex: caudas de maré).'
                    },
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [1, 2, 4, 5, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Universo Jovem',
                        descricao: 'Como a população de galáxias muda com o redshift (Aula 4)? As galáxias de hoje são iguais às do passado?'
                    },
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [3, 4, 6, 7, 0, 2])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Galáxias Ativas (Starburst e AGN)',
                        descricao: 'Diferencie um surto de formação estelar (Starburst) de um Núcleo Ativo de Galáxia (AGN) (Aula 5).'
                    },
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [5, 7, 1, 0, 6, 4, 2])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Consolide (Aula 6) a conexão entre morfologia, ambiente e evolução das galáxias.'
                    },
                    questoes: selecionarQuestoes(questoesMorfologiaEvolucao, [0, 2, 3, 5])
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
                    questoes: selecionarQuestoes(questoesCosmografia, [0, 1, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Velas Padrão: Cefeidas',
                        descricao: 'Por que as Cefeidas (Aula 1) são tão importantes como velas padrão para distâncias extragalácticas?'
                    },
                    questoes: selecionarQuestoes(questoesCosmografia, [2, 3, 5, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Diagrama HR como Ferramenta',
                        descricao: 'Descreva como o Diagrama HR (Aula 2) pode ser usado para estimar distâncias de aglomerados estelares (main-sequence fitting).'
                    },
                    questoes: selecionarQuestoes(questoesCosmografia, [1, 2, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Céu em Múltiplos Comprimentos',
                        descricao: 'O que diferentes faixas do espectro (ex: Rádio, Raio-X) revelam sobre o universo que o visível não mostra? (Aula 3)'
                    },
                    questoes: selecionarQuestoes(questoesCosmografia, [3, 4, 6, 0, 7])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Limites da Observação',
                        descricao: 'Discuta os desafios da cosmografia, como extinção (reddening) e vieses de seleção (Aula 4).'
                    },
                    questoes: selecionarQuestoes(questoesCosmografia, [5, 6, 7, 1, 2, 3, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 6',
                        descricao: 'Teste final (Aula 6) sobre as técnicas de mapeamento e medição de escalas no Universo.'
                    },
                    questoes: selecionarQuestoes(questoesCosmografia, [0, 4, 5, 7, 2, 3])
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
                    questoes: selecionarQuestoes(questoesIniciantes, [0, 2, 4])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Reconhecimento de Constelações',
                        descricao: 'Teste sua habilidade de identificar padrões no céu. Use o que aprendeu na Aula 3 para descrever como localizar constelações famosas.'
                    },
                    questoes: selecionarQuestoes(questoesIniciantes, [1, 3, 6, 7])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Desafio da Poluição Luminosa',
                        descricao: 'A Aula 4 discutiu o céu urbano. Explique os desafios da poluição luminosa e as técnicas para adaptar a visão ao escuro.'
                    },
                    questoes: selecionarQuestoes(questoesIniciantes, [0, 1, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Planejando sua Observação',
                        descricao: 'Com base na Aula 5, crie um pequeno roteiro de observação. O que você procuraria em sua primeira noite?'
                    },
                    questoes: selecionarQuestoes(questoesIniciantes, [2, 3, 5, 6, 7, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Prática de Orientação',
                        descricao: 'Resolva questões dissertativas sobre como a rotação da Terra afeta o que vemos e quando vemos.'
                    },
                    questoes: selecionarQuestoes(questoesIniciantes, [4, 5, 6, 1, 2, 3, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 1',
                        descricao: 'Um questionário final (Aula 6) para consolidar todo o aprendizado sobre observação a olho nu, movimentos e constelações.'
                    },
                    questoes: selecionarQuestoes(questoesIniciantes, [1, 2, 5, 7])
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
                    questoes: selecionarQuestoes(questoesSistemaSolar, [0, 1, 5])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Vizinhança Rochosa',
                        descricao: 'Explore os planetas rochosos (Aula 2). Compare as superfícies e atmosferas de Mercúrio, Vênus, Terra e Marte.'
                    },
                    questoes: selecionarQuestoes(questoesSistemaSolar, [2, 3, 4, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Os Gigantes do Sistema',
                        descricao: 'Foco nas Aulas 3 e 4. Descreva as características dos gigantes gasosos (Júpiter, Saturno) e de gelo (Urano, Netuno).'
                    },
                    questoes: selecionarQuestoes(questoesSistemaSolar, [1, 2, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Pequenos Corpos, Grandes Histórias',
                        descricao: 'O que são asteroides e cometas? (Aula 5). Aponte as diferenças observáveis.'
                    },
                    questoes: selecionarQuestoes(questoesSistemaSolar, [3, 4, 6, 0, 7])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Colocando em Escala',
                        descricao: 'Descreva, em escala qualitativa, as diferenças de tamanho e distância entre os corpos do Sistema Solar (Aula 6).'
                    },
                    questoes: selecionarQuestoes(questoesSistemaSolar, [5, 6, 7, 1, 2, 3, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 2',
                        descricao: 'Teste final: Verifique seu conhecimento sobre a ordem, características e escalas do Sistema Solar.'
                    },
                    questoes: selecionarQuestoes(questoesSistemaSolar, [0, 2, 3, 5])
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
                    questoes: selecionarQuestoes(questoesEstrelas, [0, 2, 4])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Magnitude Aparente vs. Realidade',
                        descricao: 'Defina magnitude aparente (Aula 2) e comente por que uma estrela mais brilhante nem sempre é a mais próxima.'
                    },
                    questoes: selecionarQuestoes(questoesEstrelas, [1, 3, 5, 6])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Navegando com Mapas Celestes',
                        descricao: 'Descreva como usar um planisfério ou app (Aula 3) para localizar uma constelação em uma data específica.'
                    },
                    questoes: selecionarQuestoes(questoesEstrelas, [0, 1, 4, 5])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: O Céu de Cada Estação',
                        descricao: 'Cite constelações visíveis em diferentes estações (Aula 4) e como identificá-las.'
                    },
                    questoes: selecionarQuestoes(questoesEstrelas, [2, 3, 6, 0, 5])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Guia de Observação Inicial',
                        descricao: 'Liste alguns dos objetos fáceis (Aula 5) para iniciantes e o que esperar ver.'
                    },
                    questoes: selecionarQuestoes(questoesEstrelas, [4, 5, 6, 1, 0, 2])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 3',
                        descricao: 'Consolide seu conhecimento (Aula 6) sobre como ler o céu e entender as propriedades básicas das estrelas.'
                    },
                    questoes: selecionarQuestoes(questoesEstrelas, [0, 1, 2, 3, 4, 5, 6])
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
                    questoes: selecionarQuestoes(questoesTelescopios, [0, 2, 5])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: O Mito do "Aumento Infinito"',
                        descricao: 'O que é aumento útil (Aula 2)? Por que "mais aumento" nem sempre é melhor?'
                    },
                    questoes: selecionarQuestoes(questoesTelescopios, [1, 3, 6, 7])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Montagem e Alinhamento',
                        descricao: 'Descreva os princípios básicos das montagens azimutal e equatorial e a importância do alinhamento (Aulas 3 e 4).'
                    },
                    questoes: selecionarQuestoes(questoesTelescopios, [0, 1, 4, 5, 7])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Observação Solar: Segurança Primeiro!',
                        descricao: 'Descreva DUAS boas práticas de segurança ao observar o Sol (Aula 5) e por que são essenciais.'
                    },
                    questoes: selecionarQuestoes(questoesTelescopios, [2, 3, 5, 6, 7, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Acessórios: Oculares e Filtros',
                        descricao: 'Explique o papel das oculares e filtros para realçar o contraste e garantir a segurança.'
                    },
                    questoes: selecionarQuestoes(questoesTelescopios, [4, 5, 6, 1, 2, 3, 7])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 4',
                        descricao: 'Prepare seu checklist para a primeira sessão prática com um telescópio (Aula 6).'
                    },
                    questoes: selecionarQuestoes(questoesTelescopios, [0, 3, 4, 6])
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
                    questoes: selecionarQuestoes(questoesFenomenos, [0, 1, 5])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: Quando a Sombra Cobre o Céu',
                        descricao: 'Por que não ocorrem eclipses solares e lunares todos os meses? (Aula 2). Diferencie um eclipse total de um anular.'
                    },
                    questoes: selecionarQuestoes(questoesFenomenos, [2, 3, 6, 4])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: Planejando uma Chuva de Meteoros',
                        descricao: 'Como se planejar para observar uma chuva de meteoros (Aula 3)? Considere horário, direção e condições.'
                    },
                    questoes: selecionarQuestoes(questoesFenomenos, [0, 2, 4, 5, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Encontros Cósmicos',
                        descricao: 'O que são conjunções e ocultações? (Aula 4). Como elas diferem de eclipses?'
                    },
                    questoes: selecionarQuestoes(questoesFenomenos, [1, 3, 4, 6, 0, 2])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Usando Calendários Astronômicos',
                        descricao: 'Pratique o uso de efemérides (Aula 5) para prever o próximo fenômeno visível em sua região.'
                    },
                    questoes: selecionarQuestoes(questoesFenomenos, [4, 5, 6, 1, 2, 3, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 5',
                        descricao: 'Teste seu conhecimento (Aula 6) sobre os principais fenômenos celestes e sua previsibilidade.'
                    },
                    questoes: selecionarQuestoes(questoesFenomenos, [0, 3, 5, 6])
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
                    questoes: selecionarQuestoes(questoesCicloEstelar, [0, 2, 4, 7])
                },
                {
                    id: 3514529,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 2: A Longa Vida na Sequência Principal',
                        descricao: 'O que define a sequência principal? (Aula 2). Por que estrelas como o Sol são estáveis por bilhões de anos?'
                    },
                    questoes: selecionarQuestoes(questoesCicloEstelar, [1, 3, 5])
                },
                {
                    id: 5679283,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 3: O Fim das Estrelas como o Sol',
                        descricao: 'Descreva o que é uma nebulosa planetária e uma anã branca (Aula 3).'
                    },
                    questoes: selecionarQuestoes(questoesCicloEstelar, [0, 1, 4, 5, 6])
                },
                {
                    id: 2567356,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 4: Morte Explosiva: Supernovas',
                        descricao: 'Explique por que estrelas massivas têm vidas curtas e estão associadas a supernovas (Aula 4).'
                    },
                    questoes: selecionarQuestoes(questoesCicloEstelar, [2, 3, 6, 7, 0])
                },
                {
                    id: 6393456,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 5: Vendo o Ciclo no Céu',
                        descricao: 'Cite exemplos de objetos no céu (Aula 5) que ilustram diferentes estágios da vida estelar (ex: Nebulosa de Órion, Pleiades, etc.).'
                    },
                    questoes: selecionarQuestoes(questoesCicloEstelar, [4, 5, 6, 7, 1, 2, 0])
                },
                {
                    id: 8354434,
                    terminado: false,
                    template: {
                        titulo: 'Atividade 6: Revisão do Módulo 6',
                        descricao: 'Consolide o panorama geral do ciclo de vida estelar (Aula 6).'
                    },
                    questoes: selecionarQuestoes(questoesCicloEstelar, [3, 5, 7, 2, 0, 4])
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