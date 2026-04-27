# Persona Consultoria — Plataforma de Diagnóstico Empresarial

MVP da plataforma SaaS da Persona Consultoria. Guia empresas por trilhas de diagnóstico estruturado, gera pareceres executivos via IA com base prática acumulada em mais de 30 anos de consultoria empresarial e organiza o plano de ação com supervisão frequente do time — tudo em um cockpit integrado para consultores e clientes.

---

## Visão geral

A Persona atua no espaço entre a consultoria tradicional (cara e genérica) e o software de gestão (sem acompanhamento): diagnóstico aplicado, plano de ação real e evolução mensurável.

A plataforma tem dois perfis de acesso:

- **Consultor** — visão de toda a carteira, acessa e acompanha múltiplas empresas/projetos
- **Cliente** — acessa o próprio diagnóstico, plano de ação, indicadores e academy

---

## Funcionalidades

### Diagnóstico por trilhas
Três trilhas especializadas, cada uma com coleta de dados reais da empresa + 20 perguntas de maturidade:

| Trilha | Dados coletados |
|---|---|
| **Financeiro** | Receita, margem bruta, despesas, resultado líquido, fluxo de caixa, inadimplência |
| **Comercial** | CAC, LTV, taxa de conversão, ciclo de vendas, churn, NPS |
| **Gente & Gestão** | Headcount, turnover, absenteísmo, % com PDI, nível de satisfação |

Score de maturidade (0–100) calculado automaticamente por área.

### Análise por IA
Parecer executivo gerado pelo Claude (Anthropic) com base nos dados e respostas preenchidos. O modelo lê os números reais da empresa, identifica gargalos e oportunidades, e entrega um diagnóstico executivo em linguagem clara com referência prática de mais de 30 anos de consultoria empresarial e supervisão frequente do time Persona — disponível nos planos Essencial e Profissional.

### Plano de ação
Ações priorizadas por trilha com responsável, prazo, prioridade (alta/média/baixa) e status de acompanhamento (pendente/em andamento/concluída).

### Indicadores
Painel de KPIs com valor baseline, valor atual e variação. Atualização manual com registro de histórico.

### Academy
Trilhas de conteúdo e materiais de apoio organizados por área (Financeiro, Comercial, Gente & Gestão, Liderança).

### Painel do consultor
Visão de carteira completa: empresas, projetos, status de diagnóstico por trilha, próximas revisões e acesso irrestrito a todos os diagnósticos e planos de ação.

---

## Planos

| Plano | Trilhas | IA | Revisão humana | Preço |
|---|---|---|---|---|
| **Free** | 1 trilha | Não | Não | Gratuito |
| **Essencial** | 3 trilhas | Sim (Claude) | Sim — supervisão frequente | R$ 297/mês |
| **Profissional** | 3 trilhas + ciclos ilimitados | Sim (Claude) | Sim — supervisão frequente + revisão dedicada em 48h | R$ 697/mês |

---

## Stack

Vanilla HTML + CSS + JavaScript puro. Sem framework, sem bundler, sem dependência externa. Funciona abrindo o `index.html` diretamente no navegador ou servindo como site estático.

### Arquitetura de módulos JS

Cada arquivo JS expõe um objeto global via padrão IIFE (`var Modulo = (function(){...})()`), evitando conflito de escopo sem precisar de bundler.

| Módulo | Responsabilidade |
|---|---|
| `auth.js` | Login, sessão (localStorage), controle de planos e permissões |
| `data.js` | Mock data: empresas, projetos, ações, indicadores, academy |
| `questions.js` | Definição das trilhas: campos de dados, perguntas de maturidade, cálculo de score, geração de prompt para IA |
| `ai.js` | Chamada à API da Anthropic com streaming de resposta |
| `views.js` | Renderização de todas as telas (dashboard, diagnóstico, plano, indicadores, academy, configurações, painel do consultor) |
| `app.js` | Controlador principal: inicialização, roteamento de views, formulários, eventos globais |

### Arquitetura de CSS

| Arquivo | Conteúdo |
|---|---|
| `css/base.css` | Design tokens (cores, tipografia, espaçamento, raios), componentes globais (botões, inputs, toasts, badges) |
| `css/landing.css` | Estilos da landing page: nav, hero, método, soluções, pricing, CTA, footer |
| `css/app.css` | Estilos da plataforma SPA: layout sidebar, dashboard, forms de diagnóstico, views de indicadores, academy, painel consultor, login |

---

## Estrutura de pastas

```
mvp/
├── index.html                    # Landing page pública
├── login.html                    # Tela de autenticação e modo demo
├── platform.html                 # Plataforma SPA (carrega os módulos JS)
├── css/
│   ├── base.css                  # Tokens e componentes globais
│   ├── landing.css               # Estilos da landing
│   └── app.css                   # Estilos da plataforma e login
├── js/
│   ├── auth.js                   # Autenticação, sessão, permissões
│   ├── data.js                   # Mock data
│   ├── questions.js              # Trilhas, questões, score, prompts
│   ├── ai.js                     # Serviço de IA (streaming Anthropic)
│   ├── views.js                  # Renderização de views
│   └── app.js                    # Controller principal
├── logo-Consultoria-BRANCO.png   # Logo (versão branca — fundo escuro)
└── logo-Consultoria-COR.png      # Logo (versão colorida — fundo claro)
```

---

## Como rodar localmente

Não há build step. Basta servir os arquivos estaticamente:

```bash
# Python (qualquer versão 3.x)
python -m http.server 3000

# Node.js
npx serve .

# Ou abra index.html diretamente no navegador
```

Acesse `http://localhost:3000`.

> **Atenção:** Abrir via `file://` pode bloquear o streaming da API da Anthropic em alguns navegadores. Prefira servir com um servidor local.

---

## Credenciais de demonstração

A autenticação é mock — nenhum dado é enviado a servidor. Tudo fica em memória e localStorage.

| Perfil | E-mail | Senha | Plano |
|---|---|---|---|
| Consultor | `consultor@persona.com.br` | `persona123` | Acesso total à carteira |
| Cliente Essencial | `cliente@solidez.com.br` | `solidez123` | 3 trilhas + IA |
| Cliente Profissional | `pro@demo.com.br` | `pro123` | Essencial + supervisão frequente + revisão dedicada |
| Cliente Free | `free@demo.com.br` | `free123` | 1 trilha, sem IA |

Na tela de login há botões de acesso rápido para cada perfil — não é necessário digitar as credenciais.

---

## Configurar a análise por IA

A integração usa a API da Anthropic (Claude Haiku), orientada por base prática de 30+ anos de consultoria empresarial e supervisão frequente da equipe Persona. Para ativar:

1. Acesse a plataforma com um perfil Essencial, Profissional ou Consultor
2. Clique no ícone **⚙ Configurações** no topo da barra lateral
3. Insira sua chave de API (`sk-ant-...`) — obtenha em [console.anthropic.com](https://console.anthropic.com)
4. Clique em **Salvar chave**

A chave fica salva apenas no `localStorage` do seu navegador. Não é enviada a nenhum servidor além da própria API da Anthropic.

> A chamada é feita diretamente do browser com o header `anthropic-dangerous-direct-browser-access: true`. Isso é adequado para demo e MVP. Em produção, o correto é usar um backend proxy para que a chave nunca fique exposta no cliente.

---

## Deploy no GitHub Pages

O projeto é 100% estático — sem build, sem servidor, sem banco de dados. Pronto para GitHub Pages:

1. Faça push do repositório para o GitHub
2. Acesse **Settings → Pages**
3. Em **Source**, selecione: branch `main`, pasta `/ (root)`
4. Aguarde ~1 minuto — o site estará disponível em:
   ```
   https://<seu-usuario>.github.io/<nome-do-repo>
   ```

---

## Limitações do MVP (conhecidas e intencionais)

| Limitação | Motivo | Próximo passo |
|---|---|---|
| Autenticação mock (credenciais hardcoded) | Sem backend no MVP | Supabase Auth ou similar |
| Dados em memória (perdem ao recarregar) | Sem banco de dados | Supabase PostgreSQL |
| Planos sem pagamento real | Sem gateway integrado | Stripe ou Asaas |
| IA chamada direto do browser | Sem backend proxy | Edge function / API route |
| Sem upload de arquivos | Escopo MVP | Storage + processamento de PDFs |

---

## Fluxo de uso esperado

```
Landing page (index.html)
  └── CTA / Entrar
        └── Login (login.html)
              ├── Consultor → Painel de carteira → seleciona empresa → diagnóstico / plano / indicadores
              └── Cliente   → Dashboard → Diagnóstico → IA → Plano de ação → Indicadores → Academy
```

---

Desenvolvido pela equipe Persona Consultoria.
