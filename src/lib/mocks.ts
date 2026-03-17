export const mockLeads = [
  {
    id: '1',
    name: 'João Silva',
    status: 'Novo',
    date: '2023-10-25',
    interest: 'Alto',
    email: 'joao@example.com',
    phone: '(11) 99999-1111',
    notes: 'Interessado na linha Reserva.',
  },
  {
    id: '2',
    name: 'Maria Fernandes',
    status: 'Em Contato',
    date: '2023-10-24',
    interest: 'Médio',
    email: 'maria@example.com',
    phone: '(21) 98888-2222',
    notes: 'Aguardando retorno sobre degustação.',
  },
  {
    id: '3',
    name: 'Carlos Santos',
    status: 'Negociando',
    date: '2023-10-20',
    interest: 'Alto',
    email: 'carlos@example.com',
    phone: '(31) 97777-3333',
    notes: 'Quer fechar plano anual Gold.',
  },
  {
    id: '4',
    name: 'Ana Costa',
    status: 'Ganho',
    date: '2023-10-15',
    interest: 'Alto',
    email: 'ana@example.com',
    phone: '(41) 96666-4444',
    notes: 'Convertida para ALA Private.',
  },
  {
    id: '5',
    name: 'Pedro Alves',
    status: 'Perdido',
    date: '2023-10-10',
    interest: 'Baixo',
    email: 'pedro@example.com',
    phone: '(51) 95555-5555',
    notes: 'Achou o valor alto no momento.',
  },
]

export const mockMembers = [
  {
    id: '1',
    name: 'Roberto Almeida',
    tier: 'Reserva',
    joinedAt: '2021-05-12',
    cellarValue: 'R$ 15.400',
    nextAllocation: 'Novembro 2023',
    paymentStatus: 'Ativo',
  },
  {
    id: '2',
    name: 'Juliana Paes',
    tier: 'Ouro',
    joinedAt: '2022-08-03',
    cellarValue: 'R$ 8.200',
    nextAllocation: 'Dezembro 2023',
    paymentStatus: 'Pendente',
  },
  {
    id: '3',
    name: 'Fernando Costa',
    tier: 'Prata',
    joinedAt: '2023-01-15',
    cellarValue: 'R$ 3.500',
    nextAllocation: 'Outubro 2023',
    paymentStatus: 'Ativo',
  },
  {
    id: '4',
    name: 'Camila Rocha',
    tier: 'Bronze',
    joinedAt: '2023-06-20',
    cellarValue: 'R$ 1.200',
    nextAllocation: 'Novembro 2023',
    paymentStatus: 'Atrasado',
  },
  {
    id: '5',
    name: 'Marcos Lima',
    tier: 'Reserva',
    joinedAt: '2019-11-10',
    cellarValue: 'R$ 25.000',
    nextAllocation: 'Novembro 2023',
    paymentStatus: 'Ativo',
  },
]

export const mockInventory = [
  {
    id: '1',
    name: 'Casa Rosada Gran Reserva',
    vintage: '2018',
    type: 'Tinto',
    stock: 45,
    exclusive: true,
    img: 'https://img.usecurling.com/p/200/300?q=red%20wine%20bottle&color=red',
  },
  {
    id: '2',
    name: 'Casa Rosada Chardonnay',
    vintage: '2021',
    type: 'Branco',
    stock: 120,
    exclusive: false,
    img: 'https://img.usecurling.com/p/200/300?q=white%20wine%20bottle&color=yellow',
  },
  {
    id: '3',
    name: 'ALA Private Rosé',
    vintage: '2022',
    type: 'Rosé',
    stock: 15,
    exclusive: true,
    img: 'https://img.usecurling.com/p/200/300?q=rose%20wine%20bottle&color=pink',
  },
  {
    id: '4',
    name: 'Syrah de Terroir',
    vintage: '2019',
    type: 'Tinto',
    stock: 60,
    exclusive: false,
    img: 'https://img.usecurling.com/p/200/300?q=wine%20bottle&color=purple',
  },
]

export const mockChartData = [
  { month: 'Jan', members: 120, revenue: 15000 },
  { month: 'Fev', members: 135, revenue: 18000 },
  { month: 'Mar', members: 150, revenue: 22000 },
  { month: 'Abr', members: 180, revenue: 26000 },
  { month: 'Mai', members: 210, revenue: 31000 },
  { month: 'Jun', members: 250, revenue: 38000 },
]

export const mockChurnData = [
  { month: 'Jan', rate: 2.1 },
  { month: 'Fev', rate: 1.8 },
  { month: 'Mar', rate: 2.4 },
  { month: 'Abr', rate: 1.5 },
  { month: 'Mai', rate: 1.2 },
  { month: 'Jun', rate: 0.8 },
]

export const mockActivities = [
  { id: '1', user: 'Roberto A.', action: 'resgatou a cota mensal', time: 'Há 2 horas' },
  { id: '2', user: 'Juliana P.', action: 'atualizou o plano para Ouro', time: 'Há 5 horas' },
  { id: '3', user: 'Carlos S.', action: 'entrou como novo lead', time: 'Ontem' },
]

export const mockBillingHistory = [
  {
    id: 'INV-001',
    member: 'Roberto Almeida',
    plan: 'Reserva',
    amount: 'R$ 1.500',
    date: '2023-10-05',
    status: 'Pago',
  },
  {
    id: 'INV-002',
    member: 'Juliana Paes',
    plan: 'Ouro',
    amount: 'R$ 800',
    date: '2023-10-06',
    status: 'Pendente',
  },
  {
    id: 'INV-003',
    member: 'Fernando Costa',
    plan: 'Prata',
    amount: 'R$ 400',
    date: '2023-10-07',
    status: 'Pago',
  },
  {
    id: 'INV-004',
    member: 'Camila Rocha',
    plan: 'Bronze',
    amount: 'R$ 200',
    date: '2023-10-08',
    status: 'Atrasado',
  },
]

export const mockPlans = [
  {
    id: '1',
    name: 'Reserva',
    price: 'R$ 1.500/mês',
    features: [
      'Alocação de 6 garrafas premium',
      'Convites para eventos VIP',
      'Frete Grátis Nacional',
    ],
  },
  {
    id: '2',
    name: 'Ouro',
    price: 'R$ 800/mês',
    features: [
      'Alocação de 4 garrafas premium',
      'Acesso antecipado a safras',
      'Frete Grátis Sul/Sudeste',
    ],
  },
  {
    id: '3',
    name: 'Prata',
    price: 'R$ 400/mês',
    features: ['Alocação de 2 garrafas premium', '10% de desconto extra', 'Frete fixo subsidiado'],
  },
]

export const mockNotifications = [
  {
    id: '1',
    title: 'Lançamento Safra 2023',
    audience: 'Membros Reserva',
    sentAt: '2023-10-20',
    status: 'Enviado',
    opens: '85%',
  },
  {
    id: '2',
    title: 'Convite Degustação Exclusiva',
    audience: 'Membros Ouro',
    sentAt: '2023-10-18',
    status: 'Enviado',
    opens: '72%',
  },
  {
    id: '3',
    title: 'Lembrete de Pagamento',
    audience: 'Inadimplentes',
    sentAt: '2023-10-15',
    status: 'Enviado',
    opens: '40%',
  },
]

export const mockMemberCellar = [
  {
    id: 'c1',
    name: 'Casa Rosada Gran Reserva',
    vintage: '2018',
    type: 'Tinto',
    quantity: 4,
    img: 'https://img.usecurling.com/p/200/300?q=red%20wine%20bottle&color=red',
  },
  {
    id: 'c2',
    name: 'ALA Private Rosé',
    vintage: '2022',
    type: 'Rosé',
    quantity: 2,
    img: 'https://img.usecurling.com/p/200/300?q=rose%20wine%20bottle&color=pink',
  },
  {
    id: 'c3',
    name: 'Syrah de Terroir',
    vintage: '2019',
    type: 'Tinto',
    quantity: 6,
    img: 'https://img.usecurling.com/p/200/300?q=wine%20bottle&color=purple',
  },
]

export const mockMemberOrders = [
  {
    id: 'PED-1042',
    date: '2023-10-10',
    status: 'Em Trânsito',
    total: 'R$ 0,00 (Cota)',
    items: '6 garrafas',
  },
  {
    id: 'PED-0988',
    date: '2023-09-10',
    status: 'Entregue',
    total: 'R$ 0,00 (Cota)',
    items: '6 garrafas',
  },
  {
    id: 'PED-0912',
    date: '2023-08-25',
    status: 'Entregue',
    total: 'R$ 850,00',
    items: 'Compra Avulsa: 2 garrafas',
  },
]

export const mockSupportChats = [
  {
    id: '1',
    user: 'Roberto Almeida',
    lastMessage: 'Como faço para resgatar meus pontos?',
    time: '10:42',
    unread: true,
    status: 'online',
  },
  {
    id: '2',
    user: 'Juliana Paes',
    lastMessage: 'Obrigada pela ajuda!',
    time: 'Ontem',
    unread: false,
    status: 'offline',
  },
  {
    id: '3',
    user: 'Carlos Santos',
    lastMessage: 'Quando chega minha cota?',
    time: 'Ontem',
    unread: false,
    status: 'offline',
  },
]

export const mockChatMessages = [
  {
    id: 'm1',
    sender: 'user',
    text: 'Olá, gostaria de saber sobre a próxima safra.',
    time: '10:40',
  },
  {
    id: 'm2',
    sender: 'support',
    text: 'Olá Roberto! A próxima safra será liberada na primeira semana de Novembro.',
    time: '10:41',
  },
  { id: 'm3', sender: 'user', text: 'Como faço para resgatar meus pontos?', time: '10:42' },
]

export const mockBotRules = [
  {
    id: '1',
    keyword: 'Planos',
    response: 'Temos 3 planos: Reserva, Ouro e Prata. Qual deseja conhecer?',
  },
  {
    id: '2',
    keyword: 'Horário',
    response: 'Nosso horário de atendimento é de Seg a Sex, das 9h às 18h.',
  },
  {
    id: '3',
    keyword: 'Cota',
    response: 'Sua cota bimestral é enviada automaticamente até o dia 10 do mês vigente.',
  },
]

export const mockRewards = [
  { id: '1', title: '15% Off Vinhos Reserva', points: 1000 },
  { id: '2', title: 'Degustação Exclusiva (2 pax)', points: 1500 },
  { id: '3', title: 'Kit 2 Taças Casa Rosada', points: 2500 },
  { id: '4', title: 'Jantar Harmonizado na Vinícola', points: 5000 },
]
