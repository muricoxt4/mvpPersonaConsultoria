/* ===== DIAGNOSTIC QUESTIONS MODULE ===== */
var DiagnosticQuestions = (function () {

  var RATING_LABELS = ['Não implementado', 'Iniciando', 'Em desenvolvimento', 'Estruturado', 'Excelente'];

  var TRAILS = {

    financeiro: {
      id: 'financeiro',
      label: 'Diagnóstico Financeiro',
      desc: 'Resultado, caixa, custos, precificação e planejamento financeiro.',
      dataFields: [
        {
          group: 'Resultado e Rentabilidade',
          fields: [
            { id: 'receita_mensal',    label: 'Receita bruta mensal atual',                              type: 'currency', placeholder: '150.000',   required: true  },
            { id: 'receita_anual',     label: 'Receita bruta anual (último exercício)',                  type: 'currency', placeholder: '1.800.000', required: false },
            { id: 'margem_bruta',      label: 'Margem bruta (%)',                                        type: 'percent',  placeholder: '42',         required: true  },
            { id: 'margem_liquida',    label: 'Margem líquida (%)',                                      type: 'percent',  placeholder: '8',          required: false },
            { id: 'custo_fixo',        label: 'Custos fixos mensais totais',                             type: 'currency', placeholder: '80.000',     required: false },
            { id: 'ponto_equilibrio',  label: 'Ponto de equilíbrio mensal',                              type: 'currency', placeholder: '100.000',    required: false }
          ]
        },
        {
          group: 'Caixa e Estrutura',
          fields: [
            { id: 'caixa_disponivel',  label: 'Caixa disponível atual',                                 type: 'currency', placeholder: '50.000',     required: false },
            { id: 'divida_total',      label: 'Endividamento total (empréstimos e financiamentos)',      type: 'currency', placeholder: '200.000',    required: false },
            { id: 'prazo_receb',       label: 'Prazo médio de recebimento de clientes (dias)',           type: 'number',   placeholder: '30',         required: false },
            { id: 'prazo_pgto',        label: 'Prazo médio de pagamento a fornecedores (dias)',          type: 'number',   placeholder: '28',         required: false },
            { id: 'inadimplencia',     label: 'Taxa de inadimplência atual (%)',                         type: 'percent',  placeholder: '3',          required: false },
            { id: 'crescimento_12m',   label: 'Crescimento da receita nos últimos 12 meses (%)',         type: 'percent',  placeholder: '15',         required: false }
          ]
        },
        {
          group: 'Contexto e Prioridades',
          fields: [
            { id: 'desafio_fin',       label: 'Qual o maior desafio financeiro hoje?',                  type: 'textarea', placeholder: 'Ex: caixa apertado, margens baixas, endividamento, falta de visibilidade gerencial, precificação incorreta...', required: true  },
            { id: 'objetivo_fin',      label: 'Objetivo financeiro para os próximos 12 meses',          type: 'textarea', placeholder: 'Ex: atingir R$ 2M de faturamento, aumentar margem líquida de 5% para 12%, eliminar dívidas de curto prazo...', required: false }
          ]
        }
      ],
      sections: [
        {
          label: 'Gestão de Resultado',
          questions: [
            { id: 'fin_01', text: 'A empresa possui DRE gerencial atualizada e analisada mensalmente pelo gestor?' },
            { id: 'fin_02', text: 'O gestor conhece a margem bruta e líquida separada por produto, serviço ou linha de negócio?' },
            { id: 'fin_03', text: 'As finanças pessoais dos sócios estão completamente separadas das finanças da empresa, com pro-labore definido?' },
            { id: 'fin_04', text: 'Existe análise de custo por produto ou centro de resultado — a empresa sabe o que dá lucro e o que não dá?' },
            { id: 'fin_05', text: 'Há metas de faturamento e resultado formalizadas, com acompanhamento e plano de ação quando há desvio?' }
          ]
        },
        {
          label: 'Caixa e Liquidez',
          questions: [
            { id: 'fin_06', text: 'Existe rotina de previsão de fluxo de caixa cobrindo pelo menos os próximos 30 dias com consistência?' },
            { id: 'fin_07', text: 'A empresa mantém reserva financeira suficiente para cobrir pelo menos 2 meses de custos fixos sem receita?' },
            { id: 'fin_08', text: 'O prazo médio de recebimento de clientes é igual ou menor que o prazo de pagamento a fornecedores?' },
            { id: 'fin_09', text: 'Existe régua de cobrança estruturada e processo claro para gestão de inadimplência com acompanhamento ativo?' },
            { id: 'fin_10', text: 'A empresa tem acesso a crédito saudável (capital de giro, antecipação) sem depender de modalidades de alto custo?' }
          ]
        },
        {
          label: 'Custos e Precificação',
          questions: [
            { id: 'fin_11', text: 'Os custos fixos e variáveis estão mapeados, categorizados e revisados com frequência mínima trimestral?' },
            { id: 'fin_12', text: 'O ponto de equilíbrio da empresa é calculado, monitorado e do conhecimento da liderança?' },
            { id: 'fin_13', text: 'Existe política de precificação formal, baseada em margem de contribuição real e não apenas em percepção de mercado?' },
            { id: 'fin_14', text: 'A empresa analisa rentabilidade por cliente ou segmento, identificando quais geram mais resultado efetivo?' },
            { id: 'fin_15', text: 'Há revisão e renegociação periódica de contratos com fornecedores buscando eficiência de custos?' }
          ]
        },
        {
          label: 'Planejamento e Controle',
          questions: [
            { id: 'fin_16', text: 'A empresa tem orçamento anual (budget) estruturado, aprovado antes do exercício e revisado mensalmente?' },
            { id: 'fin_17', text: 'Há planejamento tributário ativo, com assessoria especializada orientando estrutura e regime fiscal?' },
            { id: 'fin_18', text: 'A retirada dos sócios (pro-labore) está formalizada e é compatível com a saúde financeira da empresa?' },
            { id: 'fin_19', text: 'Existe planejamento de investimentos de médio prazo (12–36 meses) com análise de retorno esperado?' },
            { id: 'fin_20', text: 'Os sócios tomam decisões baseadas em relatórios financeiros regulares, não apenas em percepção ou saldo bancário?' }
          ]
        }
      ]
    },

    comercial: {
      id: 'comercial',
      label: 'Diagnóstico Comercial',
      desc: 'Processo de vendas, funil, CRM, marketing, retenção e expansão de clientes.',
      dataFields: [
        {
          group: 'Funil e Performance de Vendas',
          fields: [
            { id: 'clientes_ativos',   label: 'Número de clientes ativos hoje',                         type: 'number',   placeholder: '120',        required: true  },
            { id: 'ticket_medio',      label: 'Ticket médio por venda',                                 type: 'currency', placeholder: '3.500',       required: true  },
            { id: 'leads_mes',         label: 'Média de leads gerados por mês',                         type: 'number',   placeholder: '80',         required: false },
            { id: 'taxa_conversao',    label: 'Taxa de conversão lead → cliente (%)',                   type: 'percent',  placeholder: '12',         required: false },
            { id: 'ciclo_vendas',      label: 'Ciclo médio de vendas (dias do 1º contato ao fechamento)', type: 'number', placeholder: '21',         required: false },
            { id: 'cac',               label: 'CAC — Custo de Aquisição por Cliente',                   type: 'currency', placeholder: '800',        required: false }
          ]
        },
        {
          group: 'Retenção e Recorrência',
          fields: [
            { id: 'churn_mensal',      label: 'Taxa de churn (cancelamento) mensal (%)',                type: 'percent',  placeholder: '3',          required: false },
            { id: 'ltv_meses',         label: 'LTV — Tempo médio de retenção de cliente (meses)',       type: 'number',   placeholder: '18',         required: false },
            { id: 'receita_recorrente',label: 'Receita recorrente mensal atual',                        type: 'currency', placeholder: '60.000',     required: false },
            { id: 'canais_venda',      label: 'Principais canais de venda ativos',                      type: 'text',     placeholder: 'Ex: indicação, inbound, redes sociais, SDR externo, WhatsApp', required: true }
          ]
        },
        {
          group: 'Contexto e Desafios',
          fields: [
            { id: 'meta_receita',      label: 'Meta de receita mensal atual',                           type: 'currency', placeholder: '200.000',    required: false },
            { id: 'gargalo_com',       label: 'Qual o maior gargalo comercial hoje?',                   type: 'textarea', placeholder: 'Ex: poucos leads, baixa conversão de propostas, dependência de um vendedor, falta de processo definido, preço alto vs concorrência...', required: true  },
            { id: 'perfil_icp',        label: 'Descreva o perfil do cliente ideal (ICP)',               type: 'textarea', placeholder: 'Segmento, porte, cargo do decisor, principais dores, critérios de compra, tempo de decisão...', required: false }
          ]
        }
      ],
      sections: [
        {
          label: 'Processo Comercial',
          questions: [
            { id: 'com_01', text: 'Existe um processo de vendas formalizado, documentado e seguido consistentemente por toda a equipe?' },
            { id: 'com_02', text: 'A equipe comercial tem roteiro ou metodologia de abordagem padronizada para cada etapa da venda?' },
            { id: 'com_03', text: 'O Perfil de Cliente Ideal (ICP) está definido formalmente e orienta a prospecção e qualificação de oportunidades?' },
            { id: 'com_04', text: 'Existe critério claro de qualificação de leads (ex: BANT, SPIN) que filtra oportunidades antes de gerar proposta?' },
            { id: 'com_05', text: 'A proposta comercial é padronizada, com precificação clara, e entregue com follow-up estruturado e registrado?' }
          ]
        },
        {
          label: 'Pipeline e CRM',
          questions: [
            { id: 'com_06', text: 'A empresa utiliza CRM (não planilhas) para registrar e acompanhar todas as oportunidades em tempo real?' },
            { id: 'com_07', text: 'As etapas do funil de vendas estão definidas com critérios claros de avanço entre cada fase?' },
            { id: 'com_08', text: 'Há reunião semanal de pipeline com a equipe comercial, revisando oportunidades e definindo próximas ações?' },
            { id: 'com_09', text: 'A taxa de conversão por etapa do funil é mensurada e acompanhada com ações corretivas quando abaixo do esperado?' },
            { id: 'com_10', text: 'Existe análise de propostas perdidas para identificar padrões e melhorar abordagem futura?' }
          ]
        },
        {
          label: 'Marketing e Geração de Demanda',
          questions: [
            { id: 'com_11', text: 'A empresa tem estratégia definida de geração de leads com canais ativos, metas e responsáveis claros?' },
            { id: 'com_12', text: 'Os investimentos em marketing são monitorados por CAC e ROI, com decisões baseadas em dados de retorno?' },
            { id: 'com_13', text: 'Há consistência e qualidade na presença digital — site, redes sociais, conteúdo e reputação online?' },
            { id: 'com_14', text: 'Existe programa ativo de indicações ou marketing de referência que gera demanda previsível e recorrente?' },
            { id: 'com_15', text: 'A comunicação e proposta de valor são segmentadas por perfil de cliente, com mensagens distintas por ICP?' }
          ]
        },
        {
          label: 'Retenção e Expansão',
          questions: [
            { id: 'com_16', text: 'Existe processo formal de onboarding de novos clientes, com jornada estruturada pós-fechamento?' },
            { id: 'com_17', text: 'A empresa mede NPS ou satisfação dos clientes periodicamente (mínimo semestral) com ação sobre o resultado?' },
            { id: 'com_18', text: 'Há estratégia ativa de upsell e cross-sell para a base de clientes existente, com metas definidas?' },
            { id: 'com_19', text: 'A equipe tem metas claras de retenção e churn com plano de ação para clientes em risco de cancelamento?' },
            { id: 'com_20', text: 'Existe rotina de acompanhamento pós-venda estruturada, com contato periódico e registro no CRM?' }
          ]
        }
      ]
    },

    gente: {
      id: 'gente',
      label: 'Gente & Gestão',
      desc: 'Estrutura organizacional, liderança, performance, cultura e processos operacionais.',
      dataFields: [
        {
          group: 'Estrutura e Time',
          fields: [
            { id: 'num_colaboradores', label: 'Número total de colaboradores (CLT + PJ)',               type: 'number',   placeholder: '32',         required: true  },
            { id: 'num_gestores',      label: 'Número de gestores / líderes de equipe',                 type: 'number',   placeholder: '5',          required: false },
            { id: 'turnover_anual',    label: 'Taxa de turnover anual (%)',                             type: 'percent',  placeholder: '18',         required: false },
            { id: 'tempo_medio',       label: 'Tempo médio de empresa dos colaboradores (meses)',       type: 'number',   placeholder: '24',         required: false },
            { id: 'custo_folha',       label: 'Custo total de folha + encargos mensal',                 type: 'currency', placeholder: '120.000',    required: false },
            { id: 'absenteismo',       label: 'Taxa de absenteísmo mensal (%)',                         type: 'percent',  placeholder: '2',          required: false }
          ]
        },
        {
          group: 'Desenvolvimento e Engajamento',
          fields: [
            { id: 'invest_treinamento',label: 'Investimento mensal em treinamento e desenvolvimento',   type: 'currency', placeholder: '3.000',      required: false },
            { id: 'pct_metas',         label: 'Colaboradores com metas individuais formalizadas (%)',   type: 'percent',  placeholder: '40',         required: false },
            { id: 'satisfacao_equipe', label: 'Satisfação média da equipe — última pesquisa (1 a 10)',  type: 'number',   placeholder: '7',          required: false },
            { id: 'vagas_abertas',     label: 'Número de vagas em aberto hoje',                         type: 'number',   placeholder: '3',          required: false }
          ]
        },
        {
          group: 'Contexto e Desafios',
          fields: [
            { id: 'desafio_rh',        label: 'Qual o maior desafio de gente e gestão hoje?',           type: 'textarea', placeholder: 'Ex: alto turnover, liderança fraca, falta de processos, equipe sem metas, dificuldade de contratar, cultura desalinhada, sobrecarga dos sócios...', required: true  },
            { id: 'estrutura_atual',   label: 'Descreva brevemente a estrutura organizacional atual',   type: 'textarea', placeholder: 'Ex: 2 sócios + 2 gerentes + 8 operadores + 3 vendedores. Sem RH formal. Gestão concentrada nos sócios.', required: false },
            { id: 'objetivo_gestao',   label: 'Objetivo de gestão para os próximos 12 meses',          type: 'textarea', placeholder: 'Ex: reduzir turnover para abaixo de 10%, estruturar liderança intermediária, implementar avaliação de desempenho semestral...', required: false }
          ]
        }
      ],
      sections: [
        {
          label: 'Estrutura Organizacional',
          questions: [
            { id: 'gg_01', text: 'Existe organograma formalizado, atualizado e do conhecimento de toda a equipe?' },
            { id: 'gg_02', text: 'As funções e responsabilidades de cada cargo estão documentadas (job description) e comunicadas formalmente?' },
            { id: 'gg_03', text: 'A estrutura de liderança é adequada ao tamanho da operação, sem sobrecarga dos sócios com gestão operacional?' },
            { id: 'gg_04', text: 'Existem critérios claros e conhecidos de progressão de carreira, promoção e evolução salarial?' },
            { id: 'gg_05', text: 'A política de remuneração e benefícios é competitiva com o mercado e aplicada com consistência?' }
          ]
        },
        {
          label: 'Liderança e Cultura',
          questions: [
            { id: 'gg_06', text: 'Os gestores conduzem reuniões 1:1 regulares com suas equipes, com agenda definida e registro de encaminhamentos?' },
            { id: 'gg_07', text: 'Os valores e a cultura organizacional estão definidos, comunicados e percebidos no dia a dia pelos colaboradores?' },
            { id: 'gg_08', text: 'Existem rituais estruturados de reconhecimento, celebração de resultados e engajamento da equipe?' },
            { id: 'gg_09', text: 'Os líderes passam por desenvolvimento contínuo (cursos, mentoria, feedback) com frequência mínima anual?' },
            { id: 'gg_10', text: 'A empresa tem mecanismos regulares de escuta ativa — pesquisa de clima, feedbacks anônimos ou canais formais?' }
          ]
        },
        {
          label: 'Gestão de Performance',
          questions: [
            { id: 'gg_11', text: 'Todos os colaboradores têm metas individuais formalizadas, mensuráveis e comunicadas no início de cada ciclo?' },
            { id: 'gg_12', text: 'Há processo de avaliação de desempenho periódico (mínimo semestral) com critérios claros e feedback estruturado?' },
            { id: 'gg_13', text: 'O PDI (Plano de Desenvolvimento Individual) é utilizado como ferramenta de crescimento e retenção de talentos?' },
            { id: 'gg_14', text: 'A empresa monitora indicadores de RH — turnover, absenteísmo, NPS de colaborador — e age sobre os desvios?' },
            { id: 'gg_15', text: 'Existe política clara e processo estruturado para casos de desempenho abaixo do esperado e para desligamentos?' }
          ]
        },
        {
          label: 'Processos e Operação',
          questions: [
            { id: 'gg_16', text: 'Os processos críticos da operação estão documentados (SOPs, fluxogramas, checklists) e seguidos de fato?' },
            { id: 'gg_17', text: 'Há plano de onboarding estruturado para novos colaboradores cobrindo função, cultura e ferramentas nos primeiros 90 dias?' },
            { id: 'gg_18', text: 'A empresa investe em treinamentos técnicos e comportamentais com frequência e registro formal de desenvolvimento?' },
            { id: 'gg_19', text: 'Há visibilidade clara da capacidade produtiva atual versus demanda, com planejamento de contratação baseado em dados?' },
            { id: 'gg_20', text: 'Existe reunião de gestão periódica (mínimo semanal) com liderança, pauta estruturada, indicadores e encaminhamentos?' }
          ]
        }
      ]
    }
  };

  function getTrail(id) { return TRAILS[id] || null; }

  function getAllTrails() {
    return Object.keys(TRAILS).map(function (k) {
      return { id: k, label: TRAILS[k].label, desc: TRAILS[k].desc };
    });
  }

  function getRatingLabels() { return RATING_LABELS; }

  function calculateScore(answers, trailId) {
    var trail = TRAILS[trailId];
    if (!trail) return { total: 0, sections: {} };
    var sections = {};
    var totalPts = 0, totalQ = 0;
    trail.sections.forEach(function (s) {
      var pts = s.questions.reduce(function (acc, q) { return acc + (answers[q.id] || 0); }, 0);
      sections[s.label] = Math.round((pts / (s.questions.length * 5)) * 100);
      totalPts += pts;
      totalQ += s.questions.length;
    });
    return { total: Math.round((totalPts / (totalQ * 5)) * 100), sections: sections };
  }

  function getBottlenecks(answers, trailId) {
    var trail = TRAILS[trailId];
    if (!trail) return [];
    var all = [];
    trail.sections.forEach(function (s) {
      s.questions.forEach(function (q) {
        all.push({ text: q.text, score: answers[q.id] || 0, section: s.label });
      });
    });
    return all.filter(function (q) { return q.score > 0; })
      .sort(function (a, b) { return a.score - b.score; })
      .slice(0, 6);
  }

  function buildPrompt(trailId, answers, companyName, score, sections, bottlenecks, data) {
    var trail = TRAILS[trailId];
    var sectionLines = Object.keys(sections).map(function (k) {
      return '<li>' + k + ': <strong>' + sections[k] + '/100</strong></li>';
    }).join('');
    var bottleneckLines = bottlenecks.map(function (b) {
      return '<li>[' + b.score + '/5] ' + b.text + '</li>';
    }).join('');

    var dataBlock = '';
    if (data && Object.keys(data).length) {
      var lines = [];
      (trail.dataFields || []).forEach(function (group) {
        group.fields.forEach(function (f) {
          if (data[f.id]) lines.push('<li>' + f.label + ': <strong>' + data[f.id] + (f.type === 'currency' ? ' (R$)' : f.type === 'percent' ? '%' : '') + '</strong></li>');
        });
      });
      if (lines.length) dataBlock = '\n\nDADOS REAIS DA EMPRESA:\n<ul>' + lines.join('') + '</ul>';
    }

    return 'Você é consultor sênior da Persona Consultoria, especialista em diagnóstico empresarial para PMEs. ' +
      'A análise deve refletir treinamento e conteúdo prático acumulado em mais de 30 anos de consultoria empresarial da Persona, com recomendações claras para supervisão frequente do time. ' +
      'Gere um parecer executivo estruturado, direto e acionável baseado nos dados abaixo.\n\n' +
      'EMPRESA: ' + companyName + '\n' +
      'TRILHA: ' + trail.label + '\n' +
      'SCORE GERAL: ' + score + '/100\n\n' +
      'SCORES POR SEÇÃO:\n<ul>' + sectionLines + '</ul>\n\n' +
      'PRINCIPAIS GARGALOS (piores notas):\n<ul>' + (bottleneckLines || '<li>Nenhum crítico identificado</li>') + '</ul>' +
      dataBlock + '\n\n' +
      'Gere o parecer com EXATAMENTE esta estrutura HTML (apenas h4, p, ul, li — sem markdown, sem asteriscos):\n\n' +
      '<h4>Leitura do momento</h4>\n' +
      '<p>2-3 frases sobre o estágio atual da empresa nesta trilha, considerando score e dados informados.</p>\n\n' +
      '<h4>Os 3 maiores riscos e gargalos</h4>\n' +
      '<ul><li>Risco 1 — específico, com impacto descrito</li><li>Risco 2</li><li>Risco 3</li></ul>\n\n' +
      '<h4>Alavancas de curto prazo (próximos 90 dias)</h4>\n' +
      '<ul><li>Ação concreta e específica 1</li><li>Ação 2</li><li>Ação 3</li></ul>\n\n' +
      '<h4>Foco de médio prazo (3–12 meses)</h4>\n' +
      '<ul><li>Iniciativa estratégica 1</li><li>Iniciativa 2</li></ul>\n\n' +
      '<h4>Síntese executiva</h4>\n' +
      '<p>1 parágrafo sintetizando o diagnóstico, o principal risco e a recomendação central.</p>';
  }

  return {
    getTrail: getTrail,
    getAllTrails: getAllTrails,
    getRatingLabels: getRatingLabels,
    calculateScore: calculateScore,
    getBottlenecks: getBottlenecks,
    buildPrompt: buildPrompt
  };
})();
