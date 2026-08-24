import type { ServiceDefinition } from "../types/lead";

export const SERVICES: ServiceDefinition[] = [
  {
    id: "landing-page",
    label: "Landing Page",
    icon: "Globe",
    description: "Página única para capturar leads ou divulgar um produto/serviço",
    briefingQuestions: [
      { key: "hasVisualIdentity", label: "Já possui identidade visual definida?", required: false },
      { key: "references", label: "Tem referências ou inspirações de outras landing pages?", required: false },
      { key: "mainGoal", label: "Qual o objetivo principal da landing page?", required: true },
    ],
  },
  {
    id: "institutional-site",
    label: "Site Institucional",
    icon: "Building2",
    description: "Site completo para apresentar sua empresa e serviços",
    briefingQuestions: [
      { key: "pageCount", label: "Quantas páginas aproximadamente o site terá?", required: true },
      { key: "needsBlog", label: "Precisa de blog ou área de notícias?", required: false },
      { key: "needsAdmin", label: "Precisa de painel administrativo para gerenciar conteúdo?", required: false },
    ],
  },
  {
    id: "custom-system",
    label: "Sistema Próprio",
    icon: "Cpu",
    description: "Sistema web sob medida para automatizar processos do seu negócio",
    briefingQuestions: [
      { key: "problem", label: "Qual problema o sistema precisa resolver?", required: true },
      { key: "users", label: "Quem vai usar o sistema e quantos usuários?", required: true },
      { key: "mainFeatures", label: "Quais as funcionalidades principais que você imagina?", required: true },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: "Store",
    description: "Plataforma de venda conectando vendedores e compradores",
    briefingQuestions: [
      { key: "productType", label: "Que tipo de produtos ou serviços serão vendidos?", required: true },
      { key: "sellersAndBuyers", label: "Quem são os vendedores e compradores?", required: false },
      { key: "paymentIntegration", label: "Precisa de integração com gateways de pagamento?", required: true },
    ],
  },
  {
    id: "freelance",
    label: "Freelance",
    icon: "Briefcase",
    description: "Contratação avulsa para desenvolvimento de funcionalidades específicas",
    briefingQuestions: [
      { key: "projectType", label: "Qual o tipo de projeto?", required: true },
      { key: "estimatedDuration", label: "Duração estimada do projeto?", required: false },
      { key: "preferredStack", label: "Stack tecnológica preferida (se houver)?", required: false },
    ],
  },
  {
    id: "it-services",
    label: "Serviços de T.I",
    icon: "Wrench",
    description: "Suporte técnico, manutenção de equipamentos e infraestrutura",
    briefingQuestions: [
      { key: "equipmentType", label: "Qual tipo de equipamento precisa de suporte?", required: true },
      { key: "quantity", label: "Quantidade de equipamentos?", required: false },
      { key: "onSite", label: "Atendimento presencial ou remoto?", required: true },
    ],
  },
  {
    id: "other",
    label: "Outro",
    icon: "Ellipsis",
    description: "Não encontrou o que precisa? Conte-nos seu projeto",
    briefingQuestions: [
      { key: "description", label: "Descreva seu projeto ou necessidade", required: true },
    ],
  },
];

export const AI_TEMPLATES: Record<string, string[]> = {
  greeting: [
    "Olá! Me conte sobre o que você precisa e eu vou te ajudar a preencher o briefing. Qual serviço você tem em mente?",
    "Oi! Vamos descobrir juntos qual a melhor solução para o seu projeto. Pode me contar um pouco sobre o que você precisa?",
    "Olá! Sou o assistente virtual do Leonardo. Me fale sobre seu projeto que eu vou te ajudar a organizar as informações.",
  ],
  askName: [
    "Perfeito! Para começar, qual o seu nome?",
    "Ótimo! E como posso te chamar?",
    "Entendi! Primeiro, me diz seu nome?",
  ],
  askPhone: [
    "Qual o melhor telefone para entrarmos em contato?",
    "Me passa seu WhatsApp ou telefone para contato?",
    "E qual telefone podemos usar para falar com você?",
  ],
  askService: [
    "Qual desses serviços mais se encaixa no que você precisa?\n\n• Landing Page\n• Site Institucional\n• Sistema Próprio\n• Marketplace\n• Freelance\n• Serviços de T.I\n• Outro",
    "Temos várias opções de serviços. Qual delas combina mais com seu projeto?\n\n• Landing Page\n• Site Institucional\n• Sistema Próprio\n• Marketplace\n• Freelance\n• Serviços de T.I\n• Outro",
  ],
  askPreference: [
    "Como você prefere que a gente entre em contato?\n\n• Ligação Telefônica\n• WhatsApp\n• Ambos",
    "Prefere receber uma ligação ou falar por WhatsApp? Ou tanto faz?",
  ],
  collectInfo: [
    "Vou anotando as informações. Pode ir me contando mais detalhes do seu projeto...",
    "Legal! Vou organizar tudo aqui. Tem mais alguma informação que você acha importante?",
    "Entendi! Deixa eu anotar esses detalhes. Mais alguma coisa que você queira acrescentar?",
  ],
  finalize: [
    "Perfeito! Já tenho todas as informações necessárias. Vou transferir os dados para o formulário para você revisar. Pode conferir se está tudo certo?",
    "Ótimo! Reuni tudo que precisamos. Dá uma olhada no formulário preenchido e confirma se as informações estão corretas.",
    "Show! Capturei todas as informações. Revise o formulário e é só enviar quando estiver pronto!",
  ],
};
