/* ===== MOCK DATA MODULE ===== */
var MockData = (function () {
  var companies = [
    {
      id: 'solidez', name: 'Solidez Industrial', cnpj: '12.345.678/0001-90',
      segment: 'Indústria', size: 'Médio', city: 'Ribeirão Preto', state: 'SP',
      employees: 87, status: 'ativo', consultorId: 'mc',
      contact: { name: 'Roberto Tavares', email: 'roberto@solidez.com.br', phone: '(16) 99999-1234', role: 'Diretor Geral' }
    },
    {
      id: 'fazenda-itu', name: 'Fazenda Itú Agro', cnpj: '98.765.432/0001-10',
      segment: 'Agronegócio', size: 'Pequeno', city: 'Itu', state: 'SP',
      employees: 34, status: 'ativo', consultorId: 'mc',
      contact: { name: 'Carlos Henrique', email: 'ch@fazendaitu.com.br', phone: '(11) 98888-5678', role: 'Proprietário' }
    },
    {
      id: 'tavarnaro', name: 'Grupo Tavarnaro', cnpj: '11.222.333/0001-44',
      segment: 'Serviços', size: 'Médio', city: 'Campinas', state: 'SP',
      employees: 52, status: 'onboarding', consultorId: 'mc',
      contact: { name: 'Ana Paula Tavarnaro', email: 'ana@tavarnaro.com.br', phone: '(19) 97777-9012', role: 'CEO' }
    }
  ];

  var projects = [
    {
      id: 'proj-001', companyId: 'solidez', name: 'Reestruturação Comercial e Gerencial',
      scope: 'Profissionalização do processo comercial, reorganização da estrutura de liderança e implantação de rotina de indicadores.',
      trails: ['financeiro', 'comercial', 'gente'],
      status: 'em_andamento', consultorId: 'mc',
      startDate: '2026-01-15', endDate: '2026-07-15',
      actionsTotal: 24, actionsDone: 18, actionsOverdue: 2,
      score: { financeiro: 68, comercial: 74, gente: 70 }
    },
    {
      id: 'proj-002', companyId: 'fazenda-itu', name: 'Profissionalização da Gestão',
      scope: 'Implantação de controles financeiros, organização da equipe e definição de processos operacionais.',
      trails: ['financeiro', 'gente'],
      status: 'diagnostico', consultorId: 'mc',
      startDate: '2026-03-01', endDate: '2026-09-01',
      actionsTotal: 8, actionsDone: 3, actionsOverdue: 0,
      score: { financeiro: 48, gente: 55 }
    },
    {
      id: 'proj-003', companyId: 'tavarnaro', name: 'CRM e Liderança Comercial',
      scope: 'Implantação de CRM, estruturação do funil de vendas e desenvolvimento da liderança comercial.',
      trails: ['comercial'],
      status: 'planejamento', consultorId: 'mc',
      startDate: '2026-04-10', endDate: '2026-10-10',
      actionsTotal: 0, actionsDone: 0, actionsOverdue: 0,
      score: {}
    }
  ];

  var actions = [
    {
      id: 'act-001', projectId: 'proj-001', trail: 'comercial',
      title: 'Mapear e documentar as etapas do funil de vendas',
      desc: 'Reunir com equipe comercial para mapear todas as etapas atuais e definir nomenclaturas padronizadas.',
      priority: 'alta', responsible: 'Gerência Comercial', due: '2026-04-28', status: 'em_andamento',
      comments: [
        { author: 'Maurício Costa', text: 'Reunião inicial realizada. Mapeamos 6 etapas principais.', date: '2026-04-20' }
      ]
    },
    {
      id: 'act-002', projectId: 'proj-001', trail: 'financeiro',
      title: 'Implantar DRE gerencial mensal',
      desc: 'Estruturar modelo de DRE simplificada para leitura mensal dos resultados pela diretoria.',
      priority: 'alta', responsible: 'Diretoria Financeira', due: '2026-04-30', status: 'nao_iniciada',
      comments: []
    },
    {
      id: 'act-003', projectId: 'proj-001', trail: 'gente',
      title: 'Formalizar organograma e cargos',
      desc: 'Desenhar organograma atual e formalizar responsabilidades por cargo.',
      priority: 'media', responsible: 'RH', due: '2026-05-10', status: 'em_andamento',
      comments: []
    },
    {
      id: 'act-004', projectId: 'proj-001', trail: 'comercial',
      title: 'Implantar CRM comercial',
      desc: 'Selecionar e implantar ferramenta de CRM adequada ao volume de operações.',
      priority: 'alta', responsible: 'Maurício Costa', due: '2026-05-15', status: 'nao_iniciada',
      comments: []
    },
    {
      id: 'act-005', projectId: 'proj-001', trail: 'financeiro',
      title: 'Criar rotina de revisão do fluxo de caixa',
      desc: 'Definir responsável e frequência de atualização e revisão do fluxo de caixa.',
      priority: 'media', responsible: 'Gerência Financeira', due: '2026-04-25', status: 'concluida',
      comments: [{ author: 'Roberto Tavares', text: 'Rotina semanal implementada com sucesso.', date: '2026-04-22' }]
    },
    {
      id: 'act-006', projectId: 'proj-001', trail: 'gente',
      title: 'Realizar treinamento de liderança com coordenadores',
      desc: 'Trilha de liderança Academy para todos os coordenadores. Mínimo 80% de conclusão.',
      priority: 'media', responsible: 'RH + Persona', due: '2026-05-20', status: 'em_andamento',
      comments: []
    }
  ];

  var indicators = {
    'proj-001': [
      { name: 'Receita Mensal', trail: 'financeiro', unit: 'R$', base: 480000, current: 512000, history: [440000, 460000, 475000, 480000, 512000] },
      { name: 'Margem de Contribuição', trail: 'financeiro', unit: '%', base: 28, current: 31, history: [25, 26, 28, 29, 31] },
      { name: 'Taxa de Conversão', trail: 'comercial', unit: '%', base: 18, current: 23, history: [15, 17, 18, 20, 23] },
      { name: 'Leads Qualificados/mês', trail: 'comercial', unit: 'leads', base: 42, current: 58, history: [35, 38, 42, 49, 58] },
      { name: 'Turnover', trail: 'gente', unit: '%', base: 14, current: 10, history: [18, 16, 14, 12, 10] },
      { name: 'NPS Equipe', trail: 'gente', unit: 'pts', base: 52, current: 67, history: [45, 48, 52, 58, 67] }
    ]
  };

  var diagnostics = {
    'proj-001-financeiro': {
      status: 'concluido', score: 68, completedAt: '2026-02-10',
      aiSynthesis: '<h4>Síntese Executiva</h4><p>A Solidez Industrial apresenta maturidade financeira intermediária, com boas práticas em controle de pagamentos e recebimentos, mas ainda com lacunas relevantes na leitura gerencial de resultado e projeção de caixa. A empresa tem visibilidade razoável da receita, porém carece de uma DRE estruturada que permita análise de margem por produto ou linha de negócio.</p><p>O principal gargalo financeiro identificado é a ausência de uma rotina clara de análise de margens, que prejudica a tomada de decisão sobre precificação e mix de produtos.</p><h4>Principais Gargalos</h4><ul><li>Ausência de DRE gerencial mensal sistematizada</li><li>Falta de visibilidade de margem por produto/linha</li><li>Projeção de caixa limitada a 15 dias</li><li>Custos variáveis não totalmente mapeados por centro de resultado</li></ul><h4>Prioridades Recomendadas</h4><ul><li>Implantar DRE gerencial mensal com análise de margem</li><li>Estender projeção de caixa para 90 dias</li><li>Mapear e categorizar todos os custos variáveis</li><li>Criar rotina de análise financeira semanal</li></ul>',
      sections: { 'Clareza do Resultado': 72, 'Fluxo de Caixa': 65, 'Custos e Despesas': 60, 'Controles Financeiros': 75 }
    },
    'proj-001-comercial': {
      status: 'concluido', score: 74, completedAt: '2026-02-15',
      aiSynthesis: '<h4>Síntese Executiva</h4><p>A Solidez Industrial possui uma equipe comercial motivada e com histórico de crescimento consistente. No entanto, o processo comercial ainda depende fortemente de habilidades individuais dos vendedores, sem padronização suficiente das etapas de funil, cadência de contato e critérios de qualificação de oportunidades.</p><p>A ausência de CRM operacional é o ponto crítico que limita a escala do processo comercial e dificulta a gestão e previsibilidade de resultados.</p><h4>Principais Gargalos</h4><ul><li>Processo comercial não documentado e dependente de indivíduos</li><li>Ausência de CRM ou controle estruturado de pipeline</li><li>Sem cadência definida de contato com leads</li><li>Taxa de conversão não monitorada por etapa</li></ul><h4>Prioridades Recomendadas</h4><ul><li>Documentar e padronizar o funil de vendas</li><li>Implantar CRM adequado ao porte da operação</li><li>Criar rotina de reunião semanal de pipeline</li><li>Definir critérios claros de qualificação de leads</li></ul>',
      sections: { 'Processo Comercial': 70, 'Pipeline e CRM': 62, 'Gestão Comercial': 78, 'Captação e Marketing': 80 }
    }
  };

  var materials = [
    { id: 'mat-001', title: 'Guia de Implementação de DRE Gerencial', type: 'pdf', category: 'Financeiro', date: '2026-02-01', size: '2.4 MB' },
    { id: 'mat-002', title: 'Template: Funil de Vendas', type: 'xlsx', category: 'Comercial', date: '2026-02-10', size: '840 KB' },
    { id: 'mat-003', title: 'Playbook de Rotina Comercial', type: 'pdf', category: 'Comercial', date: '2026-03-05', size: '3.1 MB' },
    { id: 'mat-004', title: 'Modelo de Organograma', type: 'pptx', category: 'Gente & Gestão', date: '2026-02-18', size: '1.2 MB' },
    { id: 'mat-005', title: 'Framework de Feedback e PDI', type: 'pdf', category: 'Gente & Gestão', date: '2026-03-20', size: '1.8 MB' },
    { id: 'mat-006', title: 'Dashboard de Indicadores - Template', type: 'xlsx', category: 'Indicadores', date: '2026-03-28', size: '950 KB' }
  ];

  var academy = [
    {
      id: 'track-001', title: 'Liderança Aplicada', icon: '🎯',
      desc: 'Desenvolva habilidades essenciais de liderança para gestores do negócio.',
      progress: 82, modules: 8, completedModules: 6,
      contents: [
        { title: 'O papel do líder na empresa moderna', type: 'video', duration: '18 min', done: true },
        { title: 'Feedback de alta performance', type: 'video', duration: '24 min', done: true },
        { title: 'Condução de reuniões eficazes', type: 'pdf', pages: 12, done: true },
        { title: 'Gestão por indicadores', type: 'video', duration: '31 min', done: false },
        { title: 'Como construir e comunicar metas', type: 'pdf', pages: 8, done: false }
      ]
    },
    {
      id: 'track-002', title: 'Gestão Comercial', icon: '📈',
      desc: 'Estruture processos, funil e rotina para escalar seus resultados comerciais.',
      progress: 40, modules: 6, completedModules: 2,
      contents: [
        { title: 'Funil de vendas: conceitos e aplicação', type: 'video', duration: '22 min', done: true },
        { title: 'CRM: como escolher e implementar', type: 'pdf', pages: 16, done: true },
        { title: 'Cadência de prospecção', type: 'video', duration: '28 min', done: false },
        { title: 'Gestão de pipeline na prática', type: 'video', duration: '35 min', done: false }
      ]
    },
    {
      id: 'track-003', title: 'Clareza Financeira', icon: '💰',
      desc: 'Entenda os números do seu negócio e tome decisões com mais segurança.',
      progress: 20, modules: 5, completedModules: 1,
      contents: [
        { title: 'DRE para gestores não financeiros', type: 'video', duration: '26 min', done: true },
        { title: 'Fluxo de caixa na prática', type: 'pdf', pages: 10, done: false },
        { title: 'Precificação e margem de contribuição', type: 'video', duration: '34 min', done: false }
      ]
    }
  ];

  function getContext() {
    try {
      var raw = localStorage.getItem('persona_context');
      return raw ? JSON.parse(raw) : { companyId: 'solidez', projectId: 'proj-001', trail: null };
    } catch (e) {
      return { companyId: 'solidez', projectId: 'proj-001', trail: null };
    }
  }

  function setContext(ctx) {
    var current = getContext();
    localStorage.setItem('persona_context', JSON.stringify(Object.assign({}, current, ctx)));
  }

  function getCompany(id) { return companies.find(function (c) { return c.id === id; }); }
  function getProject(id) { return projects.find(function (p) { return p.id === id; }); }
  function getProjectActions(projectId, filter) {
    var list = actions.filter(function (a) { return a.projectId === projectId; });
    if (filter && filter !== 'all') list = list.filter(function (a) { return a.status === filter; });
    return list;
  }
  function getDiagnostic(projectId, trail) { return diagnostics[projectId + '-' + trail] || null; }
  function getIndicators(projectId) { return indicators[projectId] || []; }
  function getConsultorStats() {
    var activeCompanies = companies.filter(function (c) { return c.status === 'ativo' || c.status === 'onboarding'; }).length;
    var activeProjects = projects.filter(function (p) { return p.status !== 'concluido'; }).length;
    var overdueActions = actions.filter(function (a) { return a.status !== 'concluida' && new Date(a.due) < new Date(); }).length;
    return { companies: activeCompanies, projects: activeProjects, overdueActions: overdueActions, academy: 76 };
  }
  function getStatusLabel(status) {
    var map = { em_andamento: 'Em andamento', nao_iniciada: 'Não iniciada', concluida: 'Concluída', bloqueada: 'Bloqueada', diagnostico: 'Diagnóstico', planejamento: 'Planejamento', onboarding: 'Onboarding' };
    return map[status] || status;
  }
  function getStatusBadge(status) {
    var map = { em_andamento: 'badge-blue', nao_iniciada: 'badge-neutral', concluida: 'badge-green', bloqueada: 'badge-red', diagnostico: 'badge-yellow', planejamento: 'badge-neutral', onboarding: 'badge-purple' };
    return map[status] || 'badge-neutral';
  }
  function getPriorityBadge(p) { return { alta: 'badge-red', media: 'badge-yellow', baixa: 'badge-neutral' }[p] || 'badge-neutral'; }
  function getTrailLabel(t) { return { financeiro: 'Financeiro', comercial: 'Comercial', gente: 'Gente & Gestão' }[t] || t; }
  function getScoreClass(s) {
    if (s >= 85) return 'text-green';
    if (s >= 70) return 'text-accent';
    if (s >= 50) return 'text-yellow';
    return 'text-red';
  }
  function getScoreLabel(s) {
    if (s >= 85) return 'Referência';
    if (s >= 70) return 'Estruturado';
    if (s >= 50) return 'Em desenvolvimento';
    if (s >= 30) return 'Atenção';
    return 'Crítico';
  }
  function getScoreColor(s) {
    if (s >= 85) return '#22c55e';
    if (s >= 70) return '#42b574';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  }
  function saveDiagnosticResult(projectId, trail, result) {
    diagnostics[projectId + '-' + trail] = result;
  }
  function formatCurrency(v) { return 'R$ ' + v.toLocaleString('pt-BR'); }
  function formatDate(d) {
    if (!d) return '-';
    var parts = d.split('-');
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  return {
    companies: companies, projects: projects, actions: actions, materials: materials, academy: academy,
    getContext: getContext, setContext: setContext, getCompany: getCompany, getProject: getProject,
    getProjectActions: getProjectActions, getDiagnostic: getDiagnostic, getIndicators: getIndicators,
    getConsultorStats: getConsultorStats, getStatusLabel: getStatusLabel, getStatusBadge: getStatusBadge,
    getPriorityBadge: getPriorityBadge, getTrailLabel: getTrailLabel, getScoreClass: getScoreClass,
    getScoreLabel: getScoreLabel, getScoreColor: getScoreColor, saveDiagnosticResult: saveDiagnosticResult,
    formatCurrency: formatCurrency, formatDate: formatDate
  };
})();
