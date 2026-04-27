/* ===== VIEW TEMPLATES MODULE ===== */
var Views = (function () {

  function renderScoreCircle(score, size) {
    size = size || 120;
    var r = size / 2 - 10;
    var circ = 2 * Math.PI * r;
    var offset = circ - (score / 100) * circ;
    var color = MockData.getScoreColor(score);
    return '<div class="score-circle" style="width:' + size + 'px;height:' + size + 'px;">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle class="score-circle-track" cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '"/>' +
      '<circle class="score-circle-fill" cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '"' +
      ' stroke="' + color + '"' +
      ' stroke-dasharray="' + circ.toFixed(1) + '"' +
      ' stroke-dashoffset="' + offset.toFixed(1) + '"/>' +
      '</svg>' +
      '<div class="score-center"><span class="score-value" style="color:' + color + '">' + score + '</span><span class="score-label">Score</span></div>' +
      '</div>';
  }

  function renderSectionBars(sections) {
    return Object.keys(sections).map(function (name) {
      var val = sections[name];
      var color = val >= 75 ? 'green' : val >= 50 ? '' : 'red';
      return '<div class="score-row">' +
        '<div class="score-row-header"><span class="score-row-name">' + name + '</span>' +
        '<span class="score-row-value ' + MockData.getScoreClass(val) + '">' + val + '</span></div>' +
        '<div class="progress-bar"><div class="progress-fill ' + color + '" style="width:' + val + '%"></div></div>' +
        '</div>';
    }).join('');
  }

  function dashboardConsultor(session, stats, ctx) {
    var project = MockData.getProject(ctx.projectId);
    var recentProjects = MockData.projects.slice(0, 4);
    var criticalActions = MockData.actions.filter(function (a) { return a.status !== 'concluida'; }).slice(0, 4);

    var projectRows = recentProjects.map(function (p) {
      var company = MockData.getCompany(p.companyId);
      var scores = Object.values(p.score || {});
      var avgScore = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : '-';
      return '<tr>' +
        '<td><span class="fw-500">' + (company ? company.name : '-') + '</span></td>' +
        '<td>' + p.name + '</td>' +
        '<td>' + p.trails.map(function(t){return '<span class="badge badge-neutral" style="margin-right:4px;font-size:.7rem">' + MockData.getTrailLabel(t) + '</span>';}).join('') + '</td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(p.status) + '">' + MockData.getStatusLabel(p.status) + '</span></td>' +
        '<td>' + (scores.length ? '<span class="' + MockData.getScoreClass(avgScore) + ' fw-600">' + avgScore + '</span>' : '-') + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'projeto\',{projectId:\'' + p.id + '\',companyId:\'' + p.companyId + '\'})">Abrir →</button></td>' +
        '</tr>';
    }).join('');

    var taskItems = criticalActions.map(function (a) {
      var isDone = a.status === 'concluida';
      return '<div class="task-item">' +
        '<div class="task-check ' + (isDone ? 'done' : '') + '">' + (isDone ? '✓' : '') + '</div>' +
        '<div class="task-content"><div class="task-title">' + a.title + '</div>' +
        '<div class="task-meta">' + a.responsible + ' · ' + MockData.getTrailLabel(a.trail) + '</div></div>' +
        '<span class="badge ' + MockData.getPriorityBadge(a.priority) + '">' + a.priority + '</span>' +
        '<span class="task-due ' + (new Date(a.due) < new Date() && !isDone ? 'overdue' : '') + '">' + MockData.formatDate(a.due) + '</span>' +
        '</div>';
    }).join('');

    return '<div class="page-header">' +
      '<div><div class="page-title">Bom dia, ' + session.name.split(' ')[0] + ' 👋</div>' +
      '<div class="page-sub">Visão operacional da sua carteira de projetos</div></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-secondary btn-sm" onclick="App.navigate(\'empresas\')">Nova Empresa</button>' +
      '<button class="btn btn-primary btn-sm" onclick="App.openNewProjectModal()">+ Novo Projeto</button>' +
      '</div></div>' +
      '<div class="stats-row">' +
      '<div class="stat-card"><div class="stat-label">Empresas ativas</div><div class="stat-value">' + stats.companies + '</div><div class="stat-meta up">↑ 1 este mês</div></div>' +
      '<div class="stat-card"><div class="stat-label">Projetos em curso</div><div class="stat-value">' + stats.projects + '</div><div class="stat-meta">2 em diagnóstico</div></div>' +
      '<div class="stat-card"><div class="stat-label">Ações críticas</div><div class="stat-value ' + (stats.overdueActions > 0 ? 'text-red' : 'text-green') + '">' + stats.overdueActions + '</div><div class="stat-meta ' + (stats.overdueActions > 0 ? 'down' : '') + '">' + (stats.overdueActions > 0 ? '↓ com prazo vencido' : '✓ Em dia') + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Academy (conclusão média)</div><div class="stat-value">' + stats.academy + '%</div><div class="stat-meta up">↑ 6% no ciclo</div></div>' +
      '</div>' +
      '<div class="content-grid two-col">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Projetos em foco</span><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'projetos\')">Ver todos</button></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Empresa</th><th>Projeto</th><th>Trilhas</th><th>Status</th><th>Score</th><th></th></tr></thead>' +
      '<tbody>' + projectRows + '</tbody></table></div></div>' +
      '<div class="panel ai-box" style="border-color:rgba(168,85,247,.2);background:linear-gradient(135deg,rgba(168,85,247,.06),rgba(66,181,116,.06))">' +
      '<div class="panel-header"><span class="panel-title" style="display:flex;align-items:center;gap:8px"><span style="font-size:1rem">✨</span>Leitura assistida por IA + time Persona</span></div>' +
      '<div class="panel-body">' +
      '<p class="badge badge-purple" style="margin-bottom:12px">Sugestão priorizada</p>' +
      '<h4 style="font-size:.9375rem;margin-bottom:8px">Concentre o próximo ciclo em rotina comercial e visibilidade financeira.</h4>' +
      '<p style="font-size:.875rem;color:var(--text-2);line-height:1.65;margin-bottom:14px">4 dos 5 projetos ativos compartilham dois padrões: ausência de CRM operacional e baixa leitura de margem por centro de resultado. A leitura de IA segue base prática acumulada em mais de 30 anos de consultoria empresarial, com supervisão frequente do time.</p>' +
      '<ul class="solution-features"><li>Padronizar funil comercial em 2 clientes prioritários</li><li>Revisar DRE gerencial em 3 clientes</li><li>Publicar trilha de liderança para equipes críticas</li></ul>' +
      '</div></div></div>' +
      '<div class="content-grid equal">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Plano de ação crítico</span><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'plano-acao\')">Ver todos</button></div>' +
      '<div class="task-list">' + taskItems + '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Acesso rápido</span></div>' +
      '<div class="panel-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      '<button class="btn btn-secondary" style="flex-direction:column;padding:16px;height:auto;gap:6px;font-size:.8125rem" onclick="App.navigate(\'empresas\')"><span style="font-size:1.25rem">🏢</span>Empresas</button>' +
      '<button class="btn btn-secondary" style="flex-direction:column;padding:16px;height:auto;gap:6px;font-size:.8125rem" onclick="App.navigate(\'diagnostico\')"><span style="font-size:1.25rem">📊</span>Diagnóstico</button>' +
      '<button class="btn btn-secondary" style="flex-direction:column;padding:16px;height:auto;gap:6px;font-size:.8125rem" onclick="App.navigate(\'indicadores\')"><span style="font-size:1.25rem">📈</span>Indicadores</button>' +
      '<button class="btn btn-secondary" style="flex-direction:column;padding:16px;height:auto;gap:6px;font-size:.8125rem" onclick="App.navigate(\'relatorios\')"><span style="font-size:1.25rem">📄</span>Relatórios</button>' +
      '</div></div></div>';
  }

  function dashboardCliente(session) {
    var project = MockData.getProject('proj-001');
    var company = MockData.getCompany(session.companyId || 'solidez');
    var actions = MockData.getProjectActions('proj-001');
    var pending = actions.filter(function(a){return a.status !== 'concluida';}).slice(0, 4);
    var scoreAvg = Math.round((68 + 74 + 70) / 3);

    var pendingItems = pending.map(function (a) {
      return '<div class="task-item">' +
        '<div class="task-check"></div>' +
        '<div class="task-content"><div class="task-title">' + a.title + '</div>' +
        '<div class="task-meta">' + a.responsible + '</div></div>' +
        '<span class="badge ' + MockData.getStatusBadge(a.status) + '">' + MockData.getStatusLabel(a.status) + '</span>' +
        '<span class="task-due">' + MockData.formatDate(a.due) + '</span></div>';
    }).join('');

    return '<div class="page-header">' +
      '<div><div class="page-title">' + (company ? company.name : 'Empresa') + '</div>' +
      '<div class="page-sub">' + (project ? project.name : 'Projeto') + '</div></div>' +
      '<span class="badge badge-green" style="font-size:.8125rem;padding:6px 14px">Projeto saudável</span>' +
      '</div>' +
      '<div class="stats-row">' +
      '<div class="stat-card"><div class="stat-label">Score geral</div><div class="stat-value text-accent">' + scoreAvg + '</div><div class="stat-meta">Fin ' + 68 + ' · Com ' + 74 + ' · G&G ' + 70 + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Ações em aberto</div><div class="stat-value">' + pending.length + '</div><div class="stat-meta down">3 com alta prioridade</div></div>' +
      '<div class="stat-card"><div class="stat-label">Concluídas no ciclo</div><div class="stat-value text-green">18</div><div class="stat-meta up">↑ 6 desde a última reunião</div></div>' +
      '<div class="stat-card"><div class="stat-label">Academy (equipe)</div><div class="stat-value">82%</div><div class="stat-meta">Liderança em destaque</div></div>' +
      '</div>' +
      '<div class="content-grid two-col">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Prioridade do momento</span></div>' +
      '<div class="panel-body">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">' +
      '<div><p style="font-size:.75rem;color:var(--accent);font-weight:600;margin-bottom:6px">FOCO ATUAL</p>' +
      '<h4 style="font-size:1rem;margin-bottom:8px">Padronizar rotina comercial e gestão de pipeline</h4>' +
      '<p style="font-size:.875rem;color:var(--text-2);line-height:1.6">A maior alavanca de curto prazo é reduzir perda de oportunidades entre contato, proposta e fechamento.</p></div>' +
      '<div style="text-align:right;flex-shrink:0"><small style="color:var(--text-3);font-size:.75rem">Próxima entrega</small>' +
      '<div style="font-weight:600;margin-top:4px">Funil estruturado</div>' +
      '<div style="font-size:.8125rem;color:var(--text-2)">29/04</div></div></div>' +
      '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">💬 Insight do consultor</span></div>' +
      '<div class="panel-body"><p style="font-size:.875rem;color:var(--text-2);line-height:1.65">O projeto avançou bem em organização interna. O próximo ganho de resultado depende de disciplina comercial e leitura semanal dos indicadores de conversão.</p>' +
      '<p style="margin-top:12px;font-size:.8125rem;color:var(--text-3)">— Maurício Costa, Persona Consultoria</p>' +
      '</div></div></div>' +
      '<div class="content-grid equal">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Próximas ações</span><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'plano-acao\')">Ver todas</button></div>' +
      '<div class="task-list">' + pendingItems + '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Academy</span><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'academy\')">Acessar</button></div>' +
      '<div class="panel-body">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:.875rem;font-weight:500">Liderança aplicada</span><span style="font-size:.875rem;color:var(--green);font-weight:600">82%</span></div>' +
      '<div class="progress-bar" style="margin-bottom:16px"><div class="progress-fill green" style="width:82%"></div></div>' +
      '<ul class="solution-features"><li>Feedback e PDI</li><li>Condução de rotina</li><li>Gestão por indicadores</li></ul>' +
      '</div></div></div>';
  }

  function empresas() {
    var rows = MockData.companies.map(function (c) {
      var proj = MockData.projects.filter(function (p) { return p.companyId === c.id; });
      return '<tr>' +
        '<td><div class="fw-500">' + c.name + '</div><div style="font-size:.75rem;color:var(--text-3)">' + c.city + ', ' + c.state + '</div></td>' +
        '<td>' + c.segment + '</td>' +
        '<td>' + c.employees + ' colaboradores</td>' +
        '<td>' + proj.length + '</td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(c.status) + '">' + MockData.getStatusLabel(c.status) + '</span></td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'empresa\',{companyId:\'' + c.id + '\'})">Abrir →</button></td>' +
        '</tr>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Empresas</div><div class="page-sub">Sua carteira de clientes</div></div>' +
      '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.openNewCompanyModal()">+ Nova Empresa</button></div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">' + MockData.companies.length + ' empresas</span>' +
      '<div class="flex gap-2"><input class="form-input" style="width:220px;padding:6px 12px" placeholder="Buscar..." /></div></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Empresa</th><th>Segmento</th><th>Porte</th><th>Projetos</th><th>Status</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function empresa(ctx) {
    var company = MockData.getCompany(ctx.companyId);
    if (!company) return '<div class="empty-state"><div class="icon">🔍</div><h4>Empresa não encontrada</h4></div>';
    var projects = MockData.projects.filter(function (p) { return p.companyId === company.id; });
    var projRows = projects.map(function (p) {
      return '<tr><td><span class="fw-500">' + p.name + '</span></td>' +
        '<td>' + p.trails.map(function(t){return MockData.getTrailLabel(t);}).join(', ') + '</td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(p.status) + '">' + MockData.getStatusLabel(p.status) + '</span></td>' +
        '<td>' + MockData.formatDate(p.startDate) + ' – ' + MockData.formatDate(p.endDate) + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'projeto\',{projectId:\'' + p.id + '\',companyId:\'' + company.id + '\'})">Abrir →</button></td></tr>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">' + company.name + '</div>' +
      '<div class="page-sub">' + company.segment + ' · ' + company.city + ', ' + company.state + '</div></div>' +
      '<div class="page-actions"><button class="btn btn-secondary btn-sm" onclick="App.navigate(\'empresas\')">← Voltar</button>' +
      '<button class="btn btn-primary btn-sm" onclick="App.openNewProjectModal()">+ Novo Projeto</button></div></div>' +
      '<div class="content-grid equal">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Dados da empresa</span></div><div class="panel-body">' +
      '<div class="form-group"><div class="form-label">CNPJ</div><div>' + company.cnpj + '</div></div>' +
      '<div class="form-group"><div class="form-label">Segmento</div><div>' + company.segment + '</div></div>' +
      '<div class="form-group"><div class="form-label">Porte</div><div>' + company.size + '</div></div>' +
      '<div class="form-group"><div class="form-label">Colaboradores</div><div>' + company.employees + '</div></div>' +
      '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Contato principal</span></div><div class="panel-body">' +
      '<div class="form-group"><div class="form-label">Nome</div><div>' + company.contact.name + '</div></div>' +
      '<div class="form-group"><div class="form-label">Cargo</div><div>' + company.contact.role + '</div></div>' +
      '<div class="form-group"><div class="form-label">E-mail</div><div>' + company.contact.email + '</div></div>' +
      '<div class="form-group"><div class="form-label">Telefone</div><div>' + company.contact.phone + '</div></div>' +
      '</div></div></div>' +
      '<div class="panel" style="margin-top:16px"><div class="panel-header"><span class="panel-title">Projetos</span></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Projeto</th><th>Trilhas</th><th>Status</th><th>Período</th><th></th></tr></thead>' +
      '<tbody>' + projRows + '</tbody></table></div></div>';
  }

  function projeto(ctx) {
    var project = MockData.getProject(ctx.projectId);
    var company = MockData.getCompany(ctx.companyId || (project && project.companyId));
    if (!project) return '<div class="empty-state"><div class="icon">🔍</div><h4>Projeto não encontrado</h4></div>';
    var scores = Object.values(project.score || {});
    var avgScore = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : 0;
    var trailCards = project.trails.map(function (t) {
      var diag = MockData.getDiagnostic(project.id, t);
      var score = project.score[t] || 0;
      return '<div class="card" style="display:flex;align-items:center;gap:16px;cursor:pointer" onclick="App.navigate(\'diagnostico\',{projectId:\'' + project.id + '\',trail:\'' + t + '\'})">' +
        (score ? renderScoreCircle(score, 72) : '<div style="width:72px;height:72px;background:var(--bg-4);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:.75rem">—</div>') +
        '<div><div style="font-weight:600;margin-bottom:4px">' + MockData.getTrailLabel(t) + '</div>' +
        (diag ? '<span class="badge badge-green">Concluído</span>' : '<span class="badge badge-yellow">Pendente</span>') +
        '<div style="font-size:.8125rem;color:var(--text-3);margin-top:6px">Clique para ' + (diag ? 'ver resultado' : 'iniciar diagnóstico') + '</div></div>' +
        '</div>';
    }).join('');
    var actions = MockData.getProjectActions(project.id).slice(0, 4);
    var actionRows = actions.map(function (a) {
      return '<tr><td>' + a.title + '</td><td>' + a.responsible + '</td>' +
        '<td><span class="badge ' + MockData.getPriorityBadge(a.priority) + '">' + a.priority + '</span></td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(a.status) + '">' + MockData.getStatusLabel(a.status) + '</span></td>' +
        '<td>' + MockData.formatDate(a.due) + '</td></tr>';
    }).join('');
    return '<div class="page-header"><div>' +
      '<div style="font-size:.8125rem;color:var(--text-3);margin-bottom:4px">' + (company ? company.name : '') + '</div>' +
      '<div class="page-title">' + project.name + '</div></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-secondary btn-sm" onclick="App.navigate(\'empresas\')">← Voltar</button>' +
      '<span class="badge ' + MockData.getStatusBadge(project.status) + '" style="font-size:.8125rem;padding:6px 14px">' + MockData.getStatusLabel(project.status) + '</span>' +
      '</div></div>' +
      '<div class="stats-row">' +
      '<div class="stat-card"><div class="stat-label">Score médio</div><div class="stat-value ' + MockData.getScoreClass(avgScore) + '">' + (avgScore || '—') + '</div><div class="stat-meta">' + MockData.getScoreLabel(avgScore) + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Ações abertas</div><div class="stat-value">' + (project.actionsTotal - project.actionsDone) + '</div><div class="stat-meta">de ' + project.actionsTotal + ' total</div></div>' +
      '<div class="stat-card"><div class="stat-label">Concluídas</div><div class="stat-value text-green">' + project.actionsDone + '</div><div class="stat-meta up">↑ bom progresso</div></div>' +
      '<div class="stat-card"><div class="stat-label">Em atraso</div><div class="stat-value ' + (project.actionsOverdue ? 'text-red' : 'text-green') + '">' + project.actionsOverdue + '</div><div class="stat-meta">ações críticas</div></div>' +
      '</div>' +
      '<div class="panel" style="margin-bottom:16px"><div class="panel-header"><span class="panel-title">Trilhas de diagnóstico</span><button class="btn btn-primary btn-sm" onclick="App.navigate(\'diagnostico\',{projectId:\'' + project.id + '\'})">Iniciar diagnóstico</button></div>' +
      '<div class="panel-body" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">' + trailCards + '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Plano de ação</span><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'plano-acao\')">Ver todos →</button></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Ação</th><th>Responsável</th><th>Prioridade</th><th>Status</th><th>Prazo</th></tr></thead>' +
      '<tbody>' + actionRows + '</tbody></table></div></div>';
  }

  function diagnosticoSelect(ctx) {
    var project = MockData.getProject(ctx.projectId || 'proj-001');
    var trails = DiagnosticQuestions.getAllTrails();
    var canAll = Auth.canAccessAllTrails();
    var trailIcons = { financeiro: '💰', comercial: '📈', gente: '👥' };
    var cards = trails.map(function (t, idx) {
      var diag = MockData.getDiagnostic(ctx.projectId || 'proj-001', t.id);
      var locked = !canAll && idx > 0;
      if (locked) {
        return '<div class="card" style="position:relative;opacity:.72">' +
          '<div style="position:absolute;top:14px;right:14px"><span class="badge" style="background:rgba(168,85,247,.12);color:var(--purple);border-color:rgba(168,85,247,.3)">🔒 Essencial</span></div>' +
          '<div style="font-size:1.5rem;margin-bottom:14px">' + trailIcons[t.id] + '</div>' +
          '<h4 style="font-weight:600;margin-bottom:8px">' + t.label + '</h4>' +
          '<p style="font-size:.8125rem;color:var(--text-2);margin-bottom:14px">' + t.desc + '</p>' +
          '<button class="btn btn-secondary" style="font-size:.8125rem;width:100%;justify-content:center" onclick="App.showUpgradeModal()">Disponível no Essencial →</button>' +
          '</div>';
      }
      return '<div class="card" style="cursor:pointer;transition:all .2s" onclick="App.navigate(\'diagnostico-form\',{projectId:\'' + (ctx.projectId || 'proj-001') + '\',trail:\'' + t.id + '\'})">' +
        '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:14px">' +
        '<div style="font-size:1.5rem">' + trailIcons[t.id] + '</div>' +
        (diag ? '<span class="badge badge-green">Concluído · ' + diag.score + 'pts</span>' : '<span class="badge badge-neutral">Pendente</span>') +
        '</div>' +
        '<h4 style="font-weight:600;margin-bottom:8px">' + t.label + '</h4>' +
        '<p style="font-size:.8125rem;color:var(--text-2);margin-bottom:14px">' + t.desc + '</p>' +
        '<div class="btn btn-secondary" style="font-size:.8125rem;width:100%;justify-content:center">' + (diag ? 'Ver resultado' : 'Iniciar diagnóstico') + ' →</div>' +
        '</div>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Diagnóstico</div>' +
      '<div class="page-sub">Selecione a trilha para iniciar ou continuar o diagnóstico</div></div></div>' +
      '<div class="content-grid three-col">' + cards + '</div>';
  }

  function actionPlan(ctx) {
    var projectId = ctx.projectId || 'proj-001';
    var actions = MockData.getProjectActions(projectId);
    var total = actions.length, done = actions.filter(function(a){return a.status==='concluida';}).length;
    var inProg = actions.filter(function(a){return a.status==='em_andamento';}).length;
    var notStart = actions.filter(function(a){return a.status==='nao_iniciada';}).length;
    var rows = actions.map(function (a) {
      return '<tr>' +
        '<td><span class="fw-500">' + a.title + '</span><div style="font-size:.75rem;color:var(--text-3);margin-top:2px">' + MockData.getTrailLabel(a.trail) + '</div></td>' +
        '<td>' + a.responsible + '</td>' +
        '<td><span class="badge ' + MockData.getPriorityBadge(a.priority) + '">' + a.priority + '</span></td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(a.status) + '">' + MockData.getStatusLabel(a.status) + '</span></td>' +
        '<td>' + MockData.formatDate(a.due) + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.openActionDetail(\'' + a.id + '\')">Ver</button></td></tr>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Plano de Ação</div><div class="page-sub">Acompanhe e gerencie a execução</div></div>' +
      '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.openNewActionModal()">+ Nova Ação</button></div></div>' +
      '<div class="stats-row">' +
      '<div class="stat-card"><div class="stat-label">Total de ações</div><div class="stat-value">' + total + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Em andamento</div><div class="stat-value text-accent">' + inProg + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Concluídas</div><div class="stat-value text-green">' + done + '</div></div>' +
      '<div class="stat-card"><div class="stat-label">Não iniciadas</div><div class="stat-value">' + notStart + '</div></div>' +
      '</div>' +
      '<div class="action-filters">' +
      '<button class="filter-chip active" onclick="App.filterActions(this,\'all\')">Todas (' + total + ')</button>' +
      '<button class="filter-chip" onclick="App.filterActions(this,\'nao_iniciada\')">Não iniciadas (' + notStart + ')</button>' +
      '<button class="filter-chip" onclick="App.filterActions(this,\'em_andamento\')">Em andamento (' + inProg + ')</button>' +
      '<button class="filter-chip" onclick="App.filterActions(this,\'concluida\')">Concluídas (' + done + ')</button>' +
      '</div>' +
      '<div class="panel" id="actions-table"><div class="table-wrap"><table><thead><tr><th>Ação</th><th>Responsável</th><th>Prioridade</th><th>Status</th><th>Prazo</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function indicadores(ctx) {
    var projectId = ctx.projectId || 'proj-001';
    var inds = MockData.getIndicators(projectId);
    var cards = inds.map(function (ind) {
      var change = ind.current - ind.base;
      var changeStr = (change > 0 ? '↑ +' : '↓ ') + Math.abs(change) + (ind.unit === '%' || ind.unit === 'pts' ? ind.unit : '');
      var isPositive = (ind.name === 'Turnover') ? change < 0 : change > 0;
      var maxH = Math.max.apply(null, ind.history);
      var bars = ind.history.map(function (v) { return '<span style="height:' + Math.round((v/maxH)*40) + 'px"></span>'; }).join('');
      return '<div class="indicator-card">' +
        '<div class="indicator-name">' + ind.name + ' <span class="badge badge-neutral" style="font-size:.625rem">' + MockData.getTrailLabel(ind.trail) + '</span></div>' +
        '<div class="indicator-value">' + (ind.unit === 'R$' ? MockData.formatCurrency(ind.current) : ind.current + ' ' + ind.unit) + '</div>' +
        '<div class="indicator-change ' + (isPositive ? 'up' : 'down') + '">' + changeStr + ' vs baseline</div>' +
        '<div class="indicator-chart">' + bars + '</div>' +
        '</div>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Indicadores</div><div class="page-sub">Acompanhe a evolução do projeto</div></div>' +
      '<div class="page-actions"><button class="btn btn-secondary btn-sm" onclick="App.openNewIndicatorModal()">+ Novo Indicador</button></div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">' + cards + '</div>';
  }

  function relatorios(ctx) {
    var project = MockData.getProject(ctx.projectId || 'proj-001');
    var company = MockData.getCompany(ctx.companyId || 'solidez');
    var scoreAvg = 71;
    var diagFin = MockData.getDiagnostic('proj-001', 'financeiro');
    var diagCom = MockData.getDiagnostic('proj-001', 'comercial');
    return '<div class="page-header"><div><div class="page-title">Relatório Executivo</div><div class="page-sub">' + (company ? company.name : '') + ' · Ciclo 04</div></div>' +
      '<div class="page-actions"><button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimir</button>' +
      '<button class="btn btn-primary btn-sm">⬇ Exportar PDF</button></div></div>' +
      '<div class="stats-row">' +
      '<div class="stat-card"><div class="stat-label">Score geral</div><div class="stat-value text-accent">' + scoreAvg + '</div><div class="stat-meta">Estruturado</div></div>' +
      '<div class="stat-card"><div class="stat-label">Ações concluídas</div><div class="stat-value text-green">18</div></div>' +
      '<div class="stat-card"><div class="stat-label">Principal alavanca</div><div class="stat-value" style="font-size:1rem">Pipeline comercial</div></div>' +
      '<div class="stat-card"><div class="stat-label">Risco principal</div><div class="stat-value text-red" style="font-size:1rem">Rotina operacional</div></div>' +
      '</div>' +
      '<div class="report-grid">' +
      '<div class="report-block" style="grid-column:1/-1"><h4>Leitura Executiva</h4>' +
      '<p>A empresa avançou significativamente em organização de responsabilidades e leitura gerencial. O estágio atual exige consolidar governança comercial e rotina de indicadores para transformar estrutura em previsibilidade de resultado.</p></div>' +
      '<div class="report-block"><h4>Scores por Trilha</h4>' +
      (diagFin ? renderSectionBars({ Financeiro: 68, Comercial: 74, 'Gente & Gestão': 70 }) : '<p style="color:var(--text-3)">Diagnósticos pendentes</p>') +
      '</div>' +
      '<div class="report-block"><h4>Avanços do Ciclo</h4><ul>' +
      '<li>Definição das macroetapas do processo comercial</li>' +
      '<li>Consolidação do baseline de indicadores financeiros</li>' +
      '<li>Alta adesão da liderança ao Academy (82%)</li>' +
      '<li>Implantação de rotina semanal de fluxo de caixa</li>' +
      '</ul></div>' +
      '<div class="report-block"><h4>Pontos Críticos</h4><ul>' +
      '<li>Falta padronizar ritos semanais de gestão</li>' +
      '<li>Conversão proposta→fechamento ainda instável</li>' +
      '<li>Leitura de margem por produto precisa de frequência</li>' +
      '</ul></div>' +
      '<div class="report-block"><h4>Próximos Passos</h4><ul>' +
      '<li>Implantar quadro único de pipeline (CRM)</li>' +
      '<li>Formalizar reunião semanal de performance</li>' +
      '<li>Encerrar trilha de liderança e desdobrar PDIs</li>' +
      '<li>Revisar DRE com margem por linha de produto</li>' +
      '</ul></div>' +
      '</div>' +
      '<div class="card" style="margin-top:16px;border-color:var(--accent-border);background:var(--accent-bg)">' +
      '<p style="font-size:.875rem;color:var(--text-2)"><strong style="color:var(--text-1)">Síntese:</strong> O projeto saiu da fase de leitura e entrou na fase de disciplina operacional. O próximo salto de resultado depende de constância e acompanhamento semanal das métricas-chave.</p>' +
      '</div>';
  }

  function academy() {
    var tracks = MockData.academy;
    var cards = tracks.map(function (t) {
      return '<div class="track-card">' +
        '<div class="track-icon">' + t.icon + '</div>' +
        '<div class="track-title">' + t.title + '</div>' +
        '<div class="track-desc">' + t.desc + '</div>' +
        '<div><div class="track-progress-label"><span>Progresso</span><span>' + t.progress + '%</span></div>' +
        '<div class="progress-bar" style="margin-top:4px"><div class="progress-fill ' + (t.progress >= 80 ? 'green' : '') + '" style="width:' + t.progress + '%"></div></div></div>' +
        '<div style="font-size:.75rem;color:var(--text-3)">' + t.completedModules + ' de ' + t.modules + ' módulos concluídos</div>' +
        '<button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="App.openAcademyTrack(\'' + t.id + '\')">Acessar trilha →</button>' +
        '</div>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Academy</div><div class="page-sub">Trilhas de desenvolvimento para sua equipe</div></div></div>' +
      '<div class="content-grid three-col">' + cards + '</div>';
  }

  function materiais() {
    var rows = MockData.materials.map(function (m) {
      var icons = { pdf: '📄', xlsx: '📊', pptx: '📑' };
      return '<tr><td>' + (icons[m.type] || '📎') + ' <span class="fw-500">' + m.title + '</span></td>' +
        '<td><span class="badge badge-neutral">' + m.category + '</span></td>' +
        '<td>' + m.type.toUpperCase() + '</td>' +
        '<td>' + MockData.formatDate(m.date) + '</td>' +
        '<td>' + m.size + '</td>' +
        '<td><button class="btn btn-ghost btn-sm">⬇ Baixar</button></td></tr>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Materiais</div><div class="page-sub">Documentos e recursos de apoio</div></div>' +
      '<div class="page-actions"><button class="btn btn-primary btn-sm">+ Upload</button></div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">' + MockData.materials.length + ' materiais</span>' +
      '<div class="flex gap-2"><input class="form-input" style="width:200px;padding:6px 12px" placeholder="Buscar..." /></div></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Nome</th><th>Categoria</th><th>Tipo</th><th>Data</th><th>Tamanho</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function config() {
    var key = AIService.getKey();
    var masked = key ? key.slice(0, 8) + '••••••••••••••••••••' + key.slice(-4) : '';
    return '<div class="page-header"><div><div class="page-title">Configurações</div><div class="page-sub">Conta e integrações</div></div></div>' +
      '<div class="content-grid equal">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Integração com IA</span></div><div class="panel-body">' +
      '<div class="ai-box" style="margin-bottom:16px"><div class="ai-header"><div class="ai-icon">✨</div><div><div class="ai-label">Anthropic Claude</div><div class="ai-title">Análise por IA</div></div></div>' +
      '<p class="ai-content">A plataforma usa Claude para gerar pareceres executivos dos diagnósticos com base prática acumulada em mais de 30 anos de consultoria empresarial, com supervisão frequente do time Persona. Insira sua chave API da Anthropic para habilitar a análise automática.</p></div>' +
      '<div class="form-group"><div class="form-label">Chave API Anthropic</div>' +
      '<input class="form-input" id="api-key-input" type="password" placeholder="sk-ant-..." value="' + (key || '') + '" />' +
      '<small style="color:var(--text-3);font-size:.75rem;margin-top:4px;display:block">Sua chave fica armazenada localmente no navegador. Obtenha em console.anthropic.com</small></div>' +
      '<button class="btn btn-primary" onclick="App.saveApiKey()">Salvar chave</button>' +
      (key ? '<button class="btn btn-ghost" style="margin-left:8px" onclick="App.testApiKey()">Testar conexão</button>' : '') +
      '</div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Conta</span></div><div class="panel-body">' +
      '<div class="form-group"><div class="form-label">Nome</div><input class="form-input" value="' + (Auth.getSession() ? Auth.getSession().name : '') + '" /></div>' +
      '<div class="form-group"><div class="form-label">E-mail</div><input class="form-input" value="' + (Auth.getSession() ? Auth.getSession().email : '') + '" readonly /></div>' +
      '<div class="form-group"><div class="form-label">Perfil</div><input class="form-input" value="' + (Auth.getSession() ? Auth.getSession().role : '') + '" readonly /></div>' +
      '<button class="btn btn-danger" onclick="Auth.logout()">Sair da conta</button>' +
      '</div></div></div>';
  }

  return {
    dashboardConsultor: dashboardConsultor, dashboardCliente: dashboardCliente,
    empresas: empresas, empresa: empresa, projeto: projeto,
    diagnosticoSelect: diagnosticoSelect, actionPlan: actionPlan,
    indicadores: indicadores, relatorios: relatorios, academy: academy,
    materiais: materiais, config: config,
    renderScoreCircle: renderScoreCircle, renderSectionBars: renderSectionBars
  };
})();
