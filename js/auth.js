/* ===== AUTH MODULE ===== */
var Auth = (function () {
  var USERS = [
    {
      email: 'consultor@persona.com.br',
      password: 'persona123',
      name: 'Maurício Costa',
      role: 'consultor',
      plan: null,
      initials: 'MC'
    },
    {
      email: 'cliente@solidez.com.br',
      password: 'solidez123',
      name: 'Roberto Tavares',
      role: 'cliente',
      company: 'Solidez Industrial',
      companyId: 'solidez',
      plan: 'essencial',
      initials: 'RT'
    },
    {
      email: 'pro@demo.com.br',
      password: 'pro123',
      name: 'Ana Tavarnaro',
      role: 'cliente',
      company: 'Grupo Tavarnaro',
      companyId: 'tavarnaro',
      plan: 'profissional',
      initials: 'AT'
    },
    {
      email: 'free@demo.com.br',
      password: 'free123',
      name: 'Demo Free',
      role: 'cliente',
      company: 'Solidez Industrial',
      companyId: 'solidez',
      plan: 'free',
      initials: 'DF'
    },
    {
      email: 'admin@persona.com.br',
      password: 'admin123',
      name: 'Admin Persona',
      role: 'admin',
      plan: null,
      initials: 'AP'
    }
  ];

  function login(email, password) {
    var user = USERS.find(function (u) {
      return u.email === email && u.password === password;
    });
    if (!user) return null;
    var session = {
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan || null,
      initials: user.initials,
      company: user.company || null,
      companyId: user.companyId || null,
      loginAt: Date.now()
    };
    localStorage.setItem('persona_session', JSON.stringify(session));
    return session;
  }

  function loginDemo(role) {
    if (role === 'free') {
      var freeUser = USERS.find(function (u) { return u.plan === 'free'; });
      if (freeUser) return login(freeUser.email, freeUser.password);
    }
    var user = USERS.find(function (u) { return u.role === role; });
    if (!user) return null;
    return login(user.email, user.password);
  }

  function getSession() {
    try {
      var raw = localStorage.getItem('persona_session');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem('persona_session');
    localStorage.removeItem('persona_context');
    window.location.href = 'login.html';
  }

  function requireAuth() {
    var session = getSession();
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }
    return session;
  }

  function isConsultor() {
    var s = getSession();
    return s && (s.role === 'consultor' || s.role === 'admin');
  }

  function getPlan() {
    var s = getSession();
    return s ? (s.plan || null) : null;
  }

  function canUseAI() {
    var s = getSession();
    if (!s) return false;
    if (s.role === 'consultor' || s.role === 'admin') return true;
    return s.plan === 'essencial' || s.plan === 'profissional';
  }

  function canAccessAllTrails() {
    var s = getSession();
    if (!s) return false;
    if (s.role === 'consultor' || s.role === 'admin') return true;
    return s.plan === 'essencial' || s.plan === 'profissional';
  }

  function hasPersonaReview() {
    var s = getSession();
    if (!s) return false;
    if (s.role === 'consultor' || s.role === 'admin') return true;
    return s.plan === 'profissional';
  }

  return {
    login: login,
    loginDemo: loginDemo,
    getSession: getSession,
    logout: logout,
    requireAuth: requireAuth,
    isConsultor: isConsultor,
    getPlan: getPlan,
    canUseAI: canUseAI,
    canAccessAllTrails: canAccessAllTrails,
    hasPersonaReview: hasPersonaReview
  };
})();
