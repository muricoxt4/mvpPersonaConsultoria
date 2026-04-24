/* ===== MAIN APPLICATION ===== */
var App = (function () {
  var session, currentView, currentCtx;
  var diagnosticAnswers = {};
  var diagnosticData = {};
  var currentTrail, currentSection;

  function init() {
    session = Auth.requireAuth();
    if (!session) return;
    currentCtx = MockData.getContext();
    if (session.companyId) { currentCtx.companyId = session.companyId; currentCtx.projectId = 'proj-001'; }
    renderShell();
    var hash = location.hash.replace('#', '') || 'dashboard';
    navigate(hash);
    window.addEventListener('hashchange', function () {
      navigate(location.hash.replace('#', '') || 'dashboard');
    });
  }

  function renderShell() {
    var isConsultor = Auth.isConsultor();
    var navItems = isConsultor ? [
      { view: 'dashboard', icon: '◉', label: 'Dashboard' },
      { view: 'empresas', icon: '🏢', label: 'Empresas' },
      { view: 'projetos', icon: '📁', label: 'Projetos' },
      { section: 'ANÁLISE' },
      { view: 'diagnostico', icon: '📊', label: 'Diagnóstico' },
      { view: 'plano-acao', icon: '✓', label: 'Plano de Ação' },
      { view: 'indicadores', icon: '📈', label: 'Indicadores' },
      { view: 'relatorios', icon: '📄', label: 'Relatórios' },
      { section: 'DESENVOLVIMENTO' },
      { view: 'materiais', icon: '📎', label: 'Materiais' },
      { view: 'academy', icon: '🎓', label: 'Academy' }
    ] : [
      { view: 'dashboard', icon: '◉', label: 'Dashboard' },
      { section: 'MEU PROJETO' },
      { view: 'diagnostico', icon: '📊', label: 'Diagnóstico' },
      { view: 'plano-acao', icon: '✓', label: 'Plano de Ação' },
      { view: 'indicadores', icon: '📈', label: 'Indicadores' },
      { view: 'relatorios', icon: '📄', label: 'Relatórios' },
      { section: 'DESENVOLVIMENTO' },
      { view: 'materiais', icon: '📎', label: 'Materiais' },
      { view: 'academy', icon: '🎓', label: 'Academy' }
    ];

    var navHtml = navItems.map(function (item) {
      if (item.section) return '<div class="sidebar-section-label">' + item.section + '</div>';
      return '<button class="nav-item" data-view="' + item.view + '" onclick="App.navigate(\'' + item.view + '\')">' +
        '<span class="nav-icon">' + item.icon + '</span>' + item.label + '</button>';
    }).join('');

    var av = session.initials || session.name.slice(0, 2).toUpperCase();
    var planMap = { free: 'badge-neutral', essencial: 'badge-green', profissional: 'badge-purple' };
    var planLabel = { free: 'Plano Free', essencial: 'Essencial', profissional: 'Profissional' };
    var plan = session.plan;
    var planBadgeHtml = '';
    if (!Auth.isConsultor() && plan) {
      planBadgeHtml = '<div style="padding:8px 10px 0">' +
        '<span class="badge ' + (planMap[plan] || 'badge-neutral') + '" style="font-size:.6875rem">' + (planLabel[plan] || plan) + '</span>' +
        (plan === 'free' ? '<button class="btn btn-ghost btn-sm" style="font-size:.6875rem;padding:2px 8px;margin-left:4px;color:var(--accent)" onclick="App.showUpgradeModal()">Upgrade →</button>' : '') +
        '</div>';
    }

    document.getElementById('app').innerHTML =
      '<div class="app-shell">' +
      '<aside class="sidebar">' +
      '<div class="sidebar-brand" style="flex-direction:column;align-items:flex-start;gap:4px;padding:16px">' +
      '<img src="logo-Consultoria-BRANCO.png" alt="Persona Consultoria" style="height:26px;width:auto;max-width:160px" />' +
      '<div class="sidebar-brand-role" style="font-size:.6875rem;color:var(--text-3);padding-left:1px">' + (Auth.isConsultor() ? 'Painel do Consultor' : 'Painel do Cliente') + '</div>' +
      '</div>' +
      '<nav class="sidebar-nav">' + navHtml + '</nav>' +
      '<div class="sidebar-footer">' + planBadgeHtml + '<div class="sidebar-user" onclick="App.navigate(\'config\')">' +
      '<div class="user-avatar">' + av + '</div>' +
      '<div class="user-info"><div class="user-name">' + session.name + '</div>' +
      '<div class="user-email">' + session.email + '</div></div></div></div>' +
      '</aside>' +
      '<div class="app-main">' +
      '<header class="app-header">' +
      '<div class="breadcrumb"><span class="crumb" id="breadcrumb-main">Dashboard</span></div>' +
      '<div class="header-right">' +
      '<button class="btn btn-ghost btn-sm" onclick="App.navigate(\'config\')">⚙</button>' +
      '<button class="btn btn-danger btn-sm" onclick="Auth.logout()">Sair</button>' +
      '</div></header>' +
      '<div class="content-area" id="main-content"></div>' +
      '</div></div>' +
      '<div class="toast-container" id="toast-container"></div>';
  }

  function navigate(view, ctx) {
    currentView = view;
    if (ctx) { currentCtx = Object.assign({}, currentCtx, ctx); MockData.setContext(currentCtx); }
    location.hash = view;
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.toggle('active', el.dataset.view === view.split('-')[0] || el.dataset.view === view);
    });
    var breadcrumb = document.getElementById('breadcrumb-main');
    var labels = { dashboard:'Dashboard', empresas:'Empresas', empresa:'Empresa', projetos:'Projetos', projeto:'Projeto', diagnostico:'Diagnóstico', 'diagnostico-form':'Diagnóstico – Formulário', resultado:'Resultado', 'plano-acao':'Plano de Ação', indicadores:'Indicadores', relatorios:'Relatórios', materiais:'Materiais', academy:'Academy', config:'Configurações' };
    if (breadcrumb) breadcrumb.textContent = labels[view] || view;
    renderView(view);
  }

  function renderView(view) {
    var el = document.getElementById('main-content');
    if (!el) return;
    var isConsultor = Auth.isConsultor();
    switch (view) {
      case 'dashboard':
        el.innerHTML = isConsultor
          ? Views.dashboardConsultor(session, MockData.getConsultorStats(), currentCtx)
          : Views.dashboardCliente(session);
        break;
      case 'empresas': el.innerHTML = Views.empresas(); break;
      case 'empresa': el.innerHTML = Views.empresa(currentCtx); break;
      case 'projetos': el.innerHTML = renderProjetosList(); break;
      case 'projeto': el.innerHTML = Views.projeto(currentCtx); break;
      case 'diagnostico': el.innerHTML = Views.diagnosticoSelect(currentCtx); break;
      case 'diagnostico-form': renderDiagnosticoForm(); return;
      case 'resultado': renderResultado(); return;
      case 'plano-acao': el.innerHTML = Views.actionPlan(currentCtx); break;
      case 'indicadores': el.innerHTML = Views.indicadores(currentCtx); break;
      case 'relatorios': el.innerHTML = Views.relatorios(currentCtx); break;
      case 'materiais': el.innerHTML = Views.materiais(); break;
      case 'academy': el.innerHTML = Views.academy(); break;
      case 'config': el.innerHTML = Views.config(); break;
      default: el.innerHTML = '<div class="empty-state"><div class="icon">🚧</div><h4>Em construção</h4><p>Esta seção está sendo desenvolvida.</p></div>';
    }
  }

  function renderProjetosList() {
    var projs = MockData.projects;
    var rows = projs.map(function (p) {
      var company = MockData.getCompany(p.companyId);
      var scores = Object.values(p.score || {});
      var avg = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : 0;
      return '<tr><td><span class="fw-500">' + p.name + '</span></td>' +
        '<td>' + (company ? company.name : '-') + '</td>' +
        '<td>' + p.trails.map(function(t){return MockData.getTrailLabel(t);}).join(', ') + '</td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(p.status) + '">' + MockData.getStatusLabel(p.status) + '</span></td>' +
        '<td>' + (avg ? '<span class="' + MockData.getScoreClass(avg) + ' fw-600">' + avg + '</span>' : '—') + '</td>' +
        '<td>' + MockData.formatDate(p.startDate) + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.navigate(\'projeto\',{projectId:\'' + p.id + '\',companyId:\'' + p.companyId + '\'})">Abrir →</button></td></tr>';
    }).join('');
    return '<div class="page-header"><div><div class="page-title">Projetos</div><div class="page-sub">Todos os projetos da carteira</div></div>' +
      '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.openNewProjectModal()">+ Novo Projeto</button></div></div>' +
      '<div class="panel"><div class="table-wrap"><table><thead><tr><th>Projeto</th><th>Empresa</th><th>Trilhas</th><th>Status</th><th>Score</th><th>Início</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function renderDataFieldsHtml(trailData) {
    if (!trailData.dataFields || !trailData.dataFields.length) return '';
    var groups = trailData.dataFields.map(function (group) {
      var fields = group.fields.map(function (f) {
        var req = f.required ? ' <span style="color:var(--red)">*</span>' : '';
        var isWide = f.type === 'textarea';
        var inputHtml;
        if (f.type === 'textarea') {
          inputHtml = '<textarea class="form-input data-field-input" id="df-' + f.id + '" data-field="' + f.id + '" placeholder="' + f.placeholder + '" rows="2" style="resize:vertical"></textarea>';
        } else if (f.type === 'currency') {
          inputHtml = '<div style="position:relative"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-3);font-size:.875rem;pointer-events:none">R$</span>' +
            '<input class="form-input data-field-input" id="df-' + f.id + '" data-field="' + f.id + '" type="text" inputmode="numeric" placeholder="' + f.placeholder + '" style="padding-left:32px" /></div>';
        } else if (f.type === 'percent') {
          inputHtml = '<div style="position:relative"><input class="form-input data-field-input" id="df-' + f.id + '" data-field="' + f.id + '" type="text" inputmode="numeric" placeholder="' + f.placeholder + '" style="padding-right:32px" />' +
            '<span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--text-3);font-size:.875rem;pointer-events:none">%</span></div>';
        } else {
          inputHtml = '<input class="form-input data-field-input" id="df-' + f.id + '" data-field="' + f.id + '" type="text" inputmode="numeric" placeholder="' + f.placeholder + '" />';
        }
        return '<div class="form-group"' + (isWide ? ' style="grid-column:1/-1"' : '') + '>' +
          '<div class="form-label">' + f.label + req + '</div>' + inputHtml + '</div>';
      }).join('');
      return '<div style="margin-bottom:24px">' +
        '<div style="font-size:.8125rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border)">' + group.group + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' + fields + '</div></div>';
    }).join('');
    return '<div class="panel"><div class="panel-header"><span class="panel-title">📊 Dados da Empresa</span>' +
      '<span style="font-size:.8125rem;color:var(--text-3)">Preencha os dados reais para análise precisa pela IA</span></div>' +
      '<div class="panel-body" style="padding:20px">' + groups + '</div></div>';
  }

  function renderDiagnosticoForm() {
    var trail = currentCtx.trail;
    if (!trail) { navigate('diagnostico'); return; }
    var trailData = DiagnosticQuestions.getTrail(trail);
    if (!trailData) return;
    currentTrail = trail;
    diagnosticAnswers = {};
    diagnosticData = {};
    currentSection = -1;

    var labels = DiagnosticQuestions.getRatingLabels();

    var sectionNav =
      '<button class="section-nav-item active" id="nav-data" onclick="App.showDataSection()">' +
      '<span class="section-nav-dot"></span>Dados da Empresa</button>' +
      trailData.sections.map(function (s, i) {
        return '<button class="section-nav-item" data-section="' + i + '" onclick="App.showSection(' + i + ')">' +
          '<span class="section-nav-dot"></span>' + s.label + '</button>';
      }).join('');

    var sectionsHtml = trailData.sections.map(function (section, si) {
      var questions = section.questions.map(function (q, qi) {
        var ratingBtns = [1,2,3,4,5].map(function (v) {
          return '<button class="rating-btn" data-val="' + v + '" onclick="App.setAnswer(\'' + q.id + '\',' + v + ',this)">' +
            v + '<span>' + labels[v-1] + '</span></button>';
        }).join('');
        return '<div class="question-card" id="q-' + q.id + '">' +
          '<div class="question-num">Pergunta ' + (qi+1) + ' de ' + section.questions.length + '</div>' +
          '<div class="question-text">' + q.text + '</div>' +
          '<div class="rating-group">' + ratingBtns + '</div>' +
          '<div class="question-obs"><textarea class="form-input" placeholder="Observação (opcional)..." rows="2" id="obs-' + q.id + '"></textarea></div>' +
          '</div>';
      }).join('');
      return '<div class="diagnostic-section" data-section="' + si + '" style="display:none">' +
        '<div style="margin-bottom:16px"><h3 style="font-size:1rem;font-weight:600;margin-bottom:4px">' + section.label + '</h3>' +
        '<p style="font-size:.875rem;color:var(--text-2)">' + section.questions.length + ' perguntas — avalie de 1 (não implementado) a 5 (excelente)</p></div>' +
        questions + '</div>';
    }).join('');

    document.getElementById('main-content').innerHTML =
      '<div class="page-header"><div>' +
      '<div class="page-title">' + trailData.label + '</div>' +
      '<div class="page-sub" id="form-progress">Dados da Empresa</div></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-secondary btn-sm" onclick="App.navigate(\'diagnostico\')">← Cancelar</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="App.saveDraft()">💾 Salvar rascunho</button>' +
      '</div></div>' +
      '<div class="diagnostic-layout">' +
      '<div class="diagnostic-sidebar card"><h4 style="font-size:.8125rem;font-weight:600;color:var(--text-3);margin-bottom:12px">SEÇÕES</h4>' +
      '<div class="section-nav">' + sectionNav + '</div>' +
      '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">' +
      '<div class="form-label">Progresso geral</div>' +
      '<div class="progress-bar" style="margin-top:6px"><div class="progress-fill" id="overall-progress" style="width:0%"></div></div>' +
      '<div id="overall-pct" style="font-size:.75rem;color:var(--text-3);margin-top:4px">0% respondido</div>' +
      '</div></div>' +
      '<div>' +
      '<div id="data-section">' + renderDataFieldsHtml(trailData) + '</div>' +
      sectionsHtml +
      '<div style="display:flex;justify-content:space-between;margin-top:16px">' +
      '<button class="btn btn-ghost" id="btn-prev" onclick="App.prevSection()" style="display:none">← Anterior</button>' +
      '<div style="margin-left:auto;display:flex;gap:8px">' +
      '<button class="btn btn-secondary" id="btn-next" onclick="App.nextSection()">Iniciar questionário →</button>' +
      '<button class="btn btn-primary" id="btn-finish" onclick="App.finalizeDiagnostic()" style="display:none">✓ Finalizar Diagnóstico</button>' +
      '</div></div></div></div>';
  }

  function showDataSection() {
    currentSection = -1;
    var dataEl = document.getElementById('data-section');
    var navData = document.getElementById('nav-data');
    var sections = document.querySelectorAll('.diagnostic-section');
    var navItems = document.querySelectorAll('.section-nav-item[data-section]');
    if (dataEl) dataEl.style.display = '';
    sections.forEach(function (s) { s.style.display = 'none'; });
    if (navData) { navData.classList.add('active'); navData.classList.remove('done'); }
    navItems.forEach(function (n) { n.classList.remove('active'); });
    var progressEl = document.getElementById('form-progress');
    if (progressEl) progressEl.textContent = 'Dados da Empresa';
    var prevBtn = document.getElementById('btn-prev');
    var nextBtn = document.getElementById('btn-next');
    var finBtn = document.getElementById('btn-finish');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) { nextBtn.style.display = ''; nextBtn.textContent = 'Iniciar questionário →'; }
    if (finBtn) finBtn.style.display = 'none';
  }

  function showSection(idx) {
    var dataEl = document.getElementById('data-section');
    var navData = document.getElementById('nav-data');
    var sections = document.querySelectorAll('.diagnostic-section');
    var navItems = document.querySelectorAll('.section-nav-item[data-section]');
    if (dataEl) dataEl.style.display = 'none';
    if (navData) { navData.classList.remove('active'); navData.classList.add('done'); }
    sections.forEach(function (s, i) { s.style.display = i === idx ? '' : 'none'; });
    navItems.forEach(function (n, i) {
      n.classList.toggle('active', i === idx);
      if (i < idx) n.classList.add('done');
    });
    currentSection = idx;
    var total = sections.length;
    var progressEl = document.getElementById('form-progress');
    if (progressEl) progressEl.textContent = 'Seção ' + (idx+1) + ' de ' + total;
    var prevBtn = document.getElementById('btn-prev');
    var nextBtn = document.getElementById('btn-next');
    var finBtn = document.getElementById('btn-finish');
    if (prevBtn) prevBtn.style.display = '';
    if (nextBtn) { nextBtn.style.display = idx < total - 1 ? '' : 'none'; nextBtn.textContent = 'Próxima seção →'; }
    if (finBtn) finBtn.style.display = idx === total - 1 ? '' : 'none';
    updateProgress();
  }

  function setAnswer(qId, val, btn) {
    diagnosticAnswers[qId] = val;
    var card = document.getElementById('q-' + qId);
    if (card) card.querySelectorAll('.rating-btn').forEach(function (b) { b.classList.remove('selected'); });
    if (btn) btn.classList.add('selected');
    updateProgress();
  }

  function updateProgress() {
    var trail = DiagnosticQuestions.getTrail(currentTrail);
    if (!trail) return;
    var total = trail.sections.reduce(function (acc, s) { return acc + s.questions.length; }, 0);
    var answered = Object.keys(diagnosticAnswers).length;
    var pct = Math.round((answered / total) * 100);
    var bar = document.getElementById('overall-progress');
    var pctEl = document.getElementById('overall-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '% respondido';
  }

  function collectDataFields() {
    diagnosticData = {};
    document.querySelectorAll('.data-field-input').forEach(function (el) {
      var key = el.dataset.field;
      if (key && el.value.trim()) diagnosticData[key] = el.value.trim();
    });
  }

  function prevSection() {
    if (currentSection === 0) { showDataSection(); }
    else if (currentSection > 0) { showSection(currentSection - 1); }
  }

  function nextSection() {
    if (currentSection === -1) {
      collectDataFields();
      showSection(0);
    } else {
      var trail = DiagnosticQuestions.getTrail(currentTrail);
      if (trail && currentSection < trail.sections.length - 1) showSection(currentSection + 1);
    }
  }

  function saveDraft() { showToast('Rascunho salvo!', 'success'); }

  function finalizeDiagnostic() {
    collectDataFields();
    var trail = DiagnosticQuestions.getTrail(currentTrail);
    var allQ = trail.sections.reduce(function (acc, s) { return acc.concat(s.questions.map(function (q) { return q.id; })); }, []);
    var missing = allQ.filter(function (id) { return !diagnosticAnswers[id]; }).length;
    if (missing > 0) {
      showToast(missing + ' pergunta(s) sem resposta. Complete para finalizar.', 'error');
      return;
    }
    currentCtx.trail = currentTrail;
    MockData.setContext(currentCtx);
    navigate('resultado');
  }

  function renderResultado() {
    var trail = currentCtx.trail;
    if (!trail) { navigate('diagnostico'); return; }
    var trailData = DiagnosticQuestions.getTrail(trail);
    var projectId = currentCtx.projectId || 'proj-001';
    var company = MockData.getCompany(currentCtx.companyId || 'solidez');
    var existingDiag = MockData.getDiagnostic(projectId, trail);
    var answers = Object.keys(diagnosticAnswers).length ? diagnosticAnswers : (existingDiag ? {} : {});
    var scoring = Object.keys(diagnosticAnswers).length
      ? DiagnosticQuestions.calculateScore(diagnosticAnswers, trail)
      : { total: existingDiag ? existingDiag.score : 0, sections: existingDiag ? existingDiag.sections : {} };
    var bottlenecks = Object.keys(diagnosticAnswers).length
      ? DiagnosticQuestions.getBottlenecks(diagnosticAnswers, trail)
      : [];
    var scoreColor = MockData.getScoreColor(scoring.total);
    var bottleneckHtml = bottlenecks.length
      ? bottlenecks.map(function (b) {
          return '<div class="bottleneck-item"><div class="bottleneck-icon">⚠</div>' +
            '<div class="bottleneck-text"><strong>' + b.text + '</strong><span>Nota: ' + b.score + '/5 · ' + b.section + '</span></div></div>';
        }).join('')
      : '<p style="color:var(--text-3);font-size:.875rem">Nenhum ponto crítico identificado. Excelente maturidade!</p>';

    document.getElementById('main-content').innerHTML =
      '<div class="page-header"><div>' +
      '<div class="page-title">Resultado: ' + trailData.label + '</div>' +
      '<div class="page-sub">' + (company ? company.name : '') + '</div></div>' +
      '<div class="page-actions">' +
      '<button class="btn btn-secondary btn-sm" onclick="App.navigate(\'diagnostico\')">← Voltar</button>' +
      '<button class="btn btn-primary btn-sm" onclick="App.navigate(\'plano-acao\')">Criar Plano de Ação →</button>' +
      '</div></div>' +
      '<div class="content-grid equal" style="margin-bottom:16px">' +
      '<div class="panel"><div class="score-display">' + Views.renderScoreCircle(scoring.total, 120) +
      '<div class="score-info">' +
      '<span class="badge ' + (scoring.total >= 75 ? 'badge-green' : scoring.total >= 50 ? 'badge-blue' : 'badge-red') + '" style="margin-bottom:8px">' + MockData.getScoreLabel(scoring.total) + '</span>' +
      '<div class="score-classification" style="color:' + scoreColor + '">' + scoring.total + '/100</div>' +
      '<p class="score-desc">Score geral de maturidade na trilha ' + MockData.getTrailLabel(trail) + '</p>' +
      '</div></div>' +
      '<div class="panel-footer"><button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="App.navigate(\'relatorios\')">Ver relatório completo</button></div></div>' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">Score por seção</span></div>' +
      '<div class="section-scores">' + Views.renderSectionBars(scoring.sections) + '</div></div>' +
      '</div>' +
      '<div class="content-grid equal">' +
      '<div class="panel"><div class="panel-header"><span class="panel-title">⚠ Principais gargalos</span></div>' +
      '<div class="panel-body bottleneck-list">' + bottleneckHtml + '</div></div>' +
      '<div id="ai-result-panel" class="ai-box">' +
      '<div class="ai-header"><div class="ai-icon">✨</div>' +
      '<div><div class="ai-label">Anthropic Claude</div><div class="ai-title">Parecer executivo por IA</div></div>' +
      (Auth.hasPersonaReview() ? '<span class="badge badge-purple" style="margin-left:auto;font-size:.6875rem">Revisão Persona</span>' : '') +
      '</div>' +
      '<div id="ai-content" class="ai-content">' +
      (!Auth.canUseAI()
        ? '<div style="text-align:center;padding:16px 0">' +
          '<div style="font-size:1.5rem;margin-bottom:10px">🔒</div>' +
          '<p style="color:var(--text-2);font-size:.875rem;margin-bottom:16px">Disponível no <strong style="color:var(--text-1)">Plano Essencial</strong>. Faça upgrade e receba análise executiva automática baseada nas suas respostas.</p>' +
          '<button class="btn btn-primary btn-sm" onclick="App.showUpgradeModal()">Ver planos →</button>' +
          '</div>'
        : existingDiag && existingDiag.aiSynthesis
          ? existingDiag.aiSynthesis
          : '<button class="btn btn-primary" id="btn-ai" onclick="App.generateAISynthesis()">✨ Gerar análise com IA</button>' +
            '<p style="margin-top:10px;font-size:.8125rem;color:var(--text-3)">Clique para gerar um parecer executivo baseado nas respostas.</p>') +
      '</div></div></div>';

    if (existingDiag && existingDiag.aiSynthesis && !Object.keys(diagnosticAnswers).length) return;
    if (Object.keys(diagnosticAnswers).length) {
      var result = { status: 'concluido', score: scoring.total, completedAt: new Date().toISOString().slice(0,10), sections: scoring.sections, aiSynthesis: null };
      MockData.saveDiagnosticResult(projectId, trail, result);
    }
  }

  function generateAISynthesis() {
    if (!Auth.canUseAI()) {
      showUpgradeModal();
      return;
    }
    if (!AIService.hasKey()) {
      showModal('<h3>Configurar chave API</h3>', '<p>Você precisa configurar sua chave Anthropic para usar a análise por IA.</p>' +
        '<div class="form-group" style="margin-top:16px"><div class="form-label">Chave API (sk-ant-...)</div>' +
        '<input class="form-input" id="quick-api-key" type="password" placeholder="sk-ant-..." /></div>',
        function () {
          var k = document.getElementById('quick-api-key');
          if (k && k.value) { AIService.setKey(k.value); generateAISynthesis(); }
          else showToast('Insira uma chave válida.', 'error');
        }, 'Salvar e gerar'
      );
      return;
    }

    var trailData = DiagnosticQuestions.getTrail(currentTrail || currentCtx.trail);
    var projectId = currentCtx.projectId || 'proj-001';
    var company = MockData.getCompany(currentCtx.companyId || 'solidez');
    var existingDiag = MockData.getDiagnostic(projectId, currentTrail || currentCtx.trail);
    var scoring = Object.keys(diagnosticAnswers).length
      ? DiagnosticQuestions.calculateScore(diagnosticAnswers, currentTrail || currentCtx.trail)
      : { total: existingDiag ? existingDiag.score : 0, sections: existingDiag ? existingDiag.sections : {} };
    var bottlenecks = Object.keys(diagnosticAnswers).length
      ? DiagnosticQuestions.getBottlenecks(diagnosticAnswers, currentTrail || currentCtx.trail)
      : [];

    var prompt = DiagnosticQuestions.buildPrompt(
      currentTrail || currentCtx.trail, diagnosticAnswers,
      company ? company.name : 'Empresa',
      scoring.total, scoring.sections, bottlenecks,
      diagnosticData
    );

    var contentEl = document.getElementById('ai-content');
    if (!contentEl) return;
    contentEl.innerHTML = '<div class="ai-loading"><div class="spinner"></div>Gerando análise com Claude...</div>';

    var fullText = '';
    AIService.analyze(
      prompt,
      function (chunk) { fullText += chunk; contentEl.innerHTML = '<div>' + fullText + '</div>'; },
      function () {
        var trail = currentTrail || currentCtx.trail;
        var diag = MockData.getDiagnostic(projectId, trail) || {};
        diag.aiSynthesis = fullText;
        MockData.saveDiagnosticResult(projectId, trail, diag);
        showToast('Análise gerada com sucesso!', 'success');
      },
      function (err) {
        contentEl.innerHTML = '<div style="color:var(--red)">' + err + '</div>' +
          '<button class="btn btn-primary" style="margin-top:12px" onclick="App.generateAISynthesis()">Tentar novamente</button>';
        showToast('Erro: ' + err, 'error');
      }
    );
  }

  function filterActions(btn, status) {
    document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
    btn.classList.add('active');
    var projectId = currentCtx.projectId || 'proj-001';
    var actions = MockData.getProjectActions(projectId, status !== 'all' ? status : null);
    var rows = actions.map(function (a) {
      return '<tr><td><span class="fw-500">' + a.title + '</span><div style="font-size:.75rem;color:var(--text-3)">' + MockData.getTrailLabel(a.trail) + '</div></td>' +
        '<td>' + a.responsible + '</td>' +
        '<td><span class="badge ' + MockData.getPriorityBadge(a.priority) + '">' + a.priority + '</span></td>' +
        '<td><span class="badge ' + MockData.getStatusBadge(a.status) + '">' + MockData.getStatusLabel(a.status) + '</span></td>' +
        '<td>' + MockData.formatDate(a.due) + '</td>' +
        '<td><button class="btn btn-ghost btn-sm" onclick="App.openActionDetail(\'' + a.id + '\')">Ver</button></td></tr>';
    }).join('');
    var tableEl = document.getElementById('actions-table');
    if (tableEl) tableEl.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Ação</th><th>Responsável</th><th>Prioridade</th><th>Status</th><th>Prazo</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function openActionDetail(actionId) {
    var action = MockData.actions.find(function (a) { return a.id === actionId; });
    if (!action) return;
    var comments = action.comments.map(function (c) {
      return '<div style="padding:10px;background:var(--bg-3);border-radius:var(--r);margin-bottom:8px">' +
        '<div style="font-size:.75rem;font-weight:600;margin-bottom:4px">' + c.author + ' · ' + MockData.formatDate(c.date) + '</div>' +
        '<div style="font-size:.875rem;color:var(--text-2)">' + c.text + '</div></div>';
    }).join('') || '<p style="color:var(--text-3);font-size:.875rem">Sem comentários ainda.</p>';
    showModal(action.title,
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">' +
      '<div><div class="form-label">Trilha</div><div>' + MockData.getTrailLabel(action.trail) + '</div></div>' +
      '<div><div class="form-label">Prioridade</div><span class="badge ' + MockData.getPriorityBadge(action.priority) + '">' + action.priority + '</span></div>' +
      '<div><div class="form-label">Responsável</div><div>' + action.responsible + '</div></div>' +
      '<div><div class="form-label">Prazo</div><div>' + MockData.formatDate(action.due) + '</div></div>' +
      '</div>' +
      '<div class="form-label">Descrição</div><p style="font-size:.875rem;color:var(--text-2);margin-bottom:16px">' + action.desc + '</p>' +
      '<div class="form-label">Status</div>' +
      '<select class="form-input" style="margin-bottom:16px" id="action-status-select">' +
      ['nao_iniciada','em_andamento','bloqueada','concluida'].map(function(s){return '<option value="'+s+'"'+(action.status===s?' selected':'')+'>'+MockData.getStatusLabel(s)+'</option>';}).join('') +
      '</select>' +
      '<div class="form-label">Comentários</div><div style="margin-bottom:12px">' + comments + '</div>' +
      '<textarea class="form-input" id="new-comment" placeholder="Adicionar comentário..." rows="2"></textarea>',
      function () {
        var sel = document.getElementById('action-status-select');
        if (sel) action.status = sel.value;
        var comm = document.getElementById('new-comment');
        if (comm && comm.value.trim()) {
          action.comments.push({ author: session.name, text: comm.value.trim(), date: new Date().toISOString().slice(0,10) });
        }
        navigate('plano-acao');
        showToast('Ação atualizada!', 'success');
      }, 'Salvar'
    );
  }

  function openNewProjectModal() {
    showModal('Novo Projeto',
      '<div class="form-group"><div class="form-label">Nome do projeto</div><input class="form-input" id="proj-name" placeholder="Ex: Reestruturação Comercial" /></div>' +
      '<div class="form-group"><div class="form-label">Empresa</div><select class="form-input" id="proj-company">' +
      MockData.companies.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('') +
      '</select></div>' +
      '<div class="form-group"><div class="form-label">Escopo resumido</div><textarea class="form-input" id="proj-scope" rows="2" placeholder="Descreva o objetivo..."></textarea></div>' +
      '<div class="form-group"><div class="form-label">Trilhas ativas</div><div style="display:flex;gap:8px;flex-wrap:wrap">' +
      ['financeiro','comercial','gente'].map(function(t){return '<label style="display:flex;align-items:center;gap:6px;font-size:.875rem"><input type="checkbox" value="'+t+'" checked /> '+MockData.getTrailLabel(t)+'</label>';}).join('') +
      '</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="form-group"><div class="form-label">Data de início</div><input class="form-input" type="date" id="proj-start" /></div>' +
      '<div class="form-group"><div class="form-label">Data prevista</div><input class="form-input" type="date" id="proj-end" /></div></div>',
      function () { showToast('Projeto criado com sucesso!', 'success'); navigate('projetos'); },
      'Criar Projeto'
    );
  }

  function openNewCompanyModal() {
    showModal('Nova Empresa',
      '<div class="form-group"><div class="form-label">Nome da empresa</div><input class="form-input" placeholder="Razão social" /></div>' +
      '<div class="form-group"><div class="form-label">CNPJ</div><input class="form-input" placeholder="00.000.000/0001-00" /></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="form-group"><div class="form-label">Segmento</div><input class="form-input" placeholder="Ex: Indústria" /></div>' +
      '<div class="form-group"><div class="form-label">Nº colaboradores</div><input class="form-input" type="number" /></div>' +
      '<div class="form-group"><div class="form-label">Cidade</div><input class="form-input" /></div>' +
      '<div class="form-group"><div class="form-label">Estado</div><input class="form-input" maxlength="2" /></div></div>',
      function () { showToast('Empresa criada! Adicione usuários para liberar acesso.', 'success'); navigate('empresas'); },
      'Criar Empresa'
    );
  }

  function openNewActionModal() {
    showModal('Nova Ação',
      '<div class="form-group"><div class="form-label">Título</div><input class="form-input" placeholder="Descreva a ação..." /></div>' +
      '<div class="form-group"><div class="form-label">Descrição</div><textarea class="form-input" rows="2" placeholder="Detalhes e objetivo..."></textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="form-group"><div class="form-label">Trilha</div><select class="form-input">' +
      ['financeiro','comercial','gente'].map(function(t){return '<option value="'+t+'">'+MockData.getTrailLabel(t)+'</option>';}).join('') +
      '</select></div>' +
      '<div class="form-group"><div class="form-label">Prioridade</div><select class="form-input"><option>alta</option><option>media</option><option>baixa</option></select></div>' +
      '<div class="form-group"><div class="form-label">Responsável</div><input class="form-input" /></div>' +
      '<div class="form-group"><div class="form-label">Prazo</div><input class="form-input" type="date" /></div></div>',
      function () { showToast('Ação criada com sucesso!', 'success'); navigate('plano-acao'); },
      'Criar Ação'
    );
  }

  function openNewIndicatorModal() {
    showModal('Novo Indicador',
      '<div class="form-group"><div class="form-label">Nome do indicador</div><input class="form-input" placeholder="Ex: Taxa de conversão" /></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="form-group"><div class="form-label">Trilha</div><select class="form-input">' +
      ['financeiro','comercial','gente'].map(function(t){return '<option value="'+t+'">'+MockData.getTrailLabel(t)+'</option>';}).join('') +
      '</select></div>' +
      '<div class="form-group"><div class="form-label">Unidade</div><input class="form-input" placeholder="%, R$, unidades..." /></div>' +
      '<div class="form-group"><div class="form-label">Valor baseline</div><input class="form-input" type="number" /></div>' +
      '<div class="form-group"><div class="form-label">Valor atual</div><input class="form-input" type="number" /></div></div>',
      function () { showToast('Indicador adicionado!', 'success'); navigate('indicadores'); },
      'Adicionar'
    );
  }

  function openAcademyTrack(trackId) {
    var track = MockData.academy.find(function(t){return t.id===trackId;});
    if (!track) return;
    var contents = track.contents.map(function(c){
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-3);border-radius:var(--r);margin-bottom:8px">' +
        '<div style="font-size:1.25rem">' + (c.type==='video' ? '▶' : '📄') + '</div>' +
        '<div style="flex:1"><div style="font-size:.875rem;font-weight:500">' + c.title + '</div>' +
        '<div style="font-size:.75rem;color:var(--text-3)">' + (c.duration || c.pages + ' páginas') + '</div></div>' +
        (c.done ? '<span class="badge badge-green">Concluído</span>' : '<button class="btn btn-primary btn-sm">Acessar</button>') +
        '</div>';
    }).join('');
    showModal(track.title,
      '<p style="color:var(--text-2);font-size:.875rem;margin-bottom:16px">' + track.desc + '</p>' +
      '<div class="progress-bar" style="margin-bottom:16px"><div class="progress-fill green" style="width:' + track.progress + '%"></div></div>' +
      '<div style="font-size:.8125rem;color:var(--text-3);margin-bottom:16px">' + track.progress + '% concluído · ' + track.completedModules + '/' + track.modules + ' módulos</div>' +
      contents,
      null, null
    );
  }

  function saveApiKey() {
    var input = document.getElementById('api-key-input');
    if (!input || !input.value.trim()) { showToast('Insira uma chave válida.', 'error'); return; }
    AIService.setKey(input.value.trim());
    showToast('Chave API salva com sucesso!', 'success');
    renderView('config');
  }

  function testApiKey() {
    showToast('Testando conexão...', 'info');
    AIService.analyzeFallback(
      'Responda apenas: "Conexão OK"',
      function (text) { showToast('Conexão OK! API funcionando.', 'success'); },
      function (err) { showToast('Erro: ' + err, 'error'); }
    );
  }

  function showUpgradeModal() {
    showModal('Funcionalidade Premium',
      '<div style="text-align:center;padding:8px 0 16px">' +
      '<div style="font-size:2.5rem;margin-bottom:8px">✨</div>' +
      '<p style="color:var(--text-2);font-size:.9375rem;margin-bottom:24px">Esta funcionalidade está disponível a partir do <strong style="color:var(--text-1)">Plano Essencial</strong>.</p>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">' +
      '<div style="background:var(--bg-3);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px">' +
      '<div style="font-size:.75rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Essencial · R$ 297/mês</div>' +
      '<ul class="solution-features"><li>3 trilhas de diagnóstico</li><li>Parecer executivo por IA</li><li>Plano de ação completo</li><li>Academy e materiais</li></ul>' +
      '</div>' +
      '<div style="background:var(--bg-3);border:1px solid var(--accent-border);border-radius:var(--r-lg);padding:16px">' +
      '<div style="font-size:.75rem;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Profissional · R$ 697/mês</div>' +
      '<ul class="solution-features"><li>Tudo do Essencial</li><li>Revisão do time Persona</li><li>Relatórios executivos PDF</li><li>Suporte prioritário</li></ul>' +
      '</div>' +
      '</div>' +
      '<p style="font-size:.8125rem;color:var(--text-3);text-align:center">Fale com seu consultor Persona para ativar o upgrade.</p>',
      null, null
    );
  }

  function showModal(title, body, onConfirm, confirmLabel) {
    var existingModal = document.querySelector('.modal-backdrop');
    if (existingModal) existingModal.remove();
    var el = document.createElement('div');
    el.className = 'modal-backdrop';
    el.innerHTML = '<div class="modal">' +
      '<div class="modal-header"><h3>' + title + '</h3>' +
      '<button class="btn btn-ghost btn-sm" onclick="this.closest(\'.modal-backdrop\').remove()">✕</button></div>' +
      '<div class="modal-body">' + body + '</div>' +
      (onConfirm ? '<div class="modal-footer">' +
        '<button class="btn btn-ghost" onclick="this.closest(\'.modal-backdrop\').remove()">Cancelar</button>' +
        '<button class="btn btn-primary" id="modal-confirm">' + (confirmLabel || 'Confirmar') + '</button>' +
        '</div>' : '') +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) el.remove(); });
    if (onConfirm) {
      var btn = el.querySelector('#modal-confirm');
      if (btn) btn.addEventListener('click', function () { onConfirm(); el.remove(); });
    }
  }

  function showToast(msg, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 4000);
  }

  return {
    init: init, navigate: navigate, showDataSection: showDataSection, showSection: showSection,
    setAnswer: setAnswer, prevSection: prevSection, nextSection: nextSection, saveDraft: saveDraft,
    finalizeDiagnostic: finalizeDiagnostic, generateAISynthesis: generateAISynthesis,
    filterActions: filterActions, openActionDetail: openActionDetail,
    openNewProjectModal: openNewProjectModal, openNewCompanyModal: openNewCompanyModal,
    openNewActionModal: openNewActionModal, openNewIndicatorModal: openNewIndicatorModal,
    openAcademyTrack: openAcademyTrack, saveApiKey: saveApiKey, testApiKey: testApiKey,
    showModal: showModal, showToast: showToast, showUpgradeModal: showUpgradeModal
  };
})();

window.addEventListener('load', App.init);
