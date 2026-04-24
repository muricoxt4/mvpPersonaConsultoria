/* ===== AI SERVICE MODULE ===== */
var AIService = (function () {
  var KEY_STORAGE = 'persona_api_key';

  function getKey() { return localStorage.getItem(KEY_STORAGE) || ''; }
  function setKey(key) { localStorage.setItem(KEY_STORAGE, key.trim()); }
  function hasKey() { return !!getKey(); }

  function analyze(prompt, onChunk, onDone, onError) {
    var key = getKey();
    if (!key) { onError('Chave API não configurada. Acesse Configurações para inserir sua chave Anthropic.'); return; }

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        stream: true,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    .then(function (res) {
      if (!res.ok) {
        return res.json().then(function (e) { onError('Erro da API: ' + (e.error && e.error.message || res.status)); });
      }
      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      function read() {
        reader.read().then(function (result) {
          if (result.done) { onDone(); return; }
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop();
          lines.forEach(function (line) {
            if (!line.startsWith('data: ')) return;
            var data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              var parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta && parsed.delta.text) {
                onChunk(parsed.delta.text);
              }
            } catch (e) {}
          });
          read();
        }).catch(function (e) { onError('Erro de leitura: ' + e.message); });
      }
      read();
    })
    .catch(function (e) {
      onError('Erro de conexão. Verifique sua internet e a chave API. Detalhe: ' + e.message);
    });
  }

  function analyzeFallback(prompt, onDone, onError) {
    var key = getKey();
    if (!key) { onError('Chave API não configurada.'); return; }

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.error) { onError(data.error.message); return; }
      var text = data.content && data.content[0] && data.content[0].text || '';
      onDone(text);
    })
    .catch(function (e) { onError(e.message); });
  }

  return { getKey: getKey, setKey: setKey, hasKey: hasKey, analyze: analyze, analyzeFallback: analyzeFallback };
})();
