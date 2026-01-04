const stores = require('../data/stores');

// Normalizar texto (quitar acentos, minúsculas)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .trim();
}

// Detectar intención
function detectIntent(userText) {
  const normalized = normalizeText(userText);
  
  // INTENCIÓN: Llamar a un local
  if (normalized.match(/llamar|comunicar|contactar|hablar con/)) {
    return {
      intent: 'TRANSFERIR_LOCAL',
      confidence: 0.9,
      userText: normalized
    };
  }
  
  // INTENCIÓN: Ubicación de un local
  if (normalized.match(/donde|ubicacion|queda|encuentra/)) {
    return {
      intent: 'BUSCAR_LOCAL',
      confidence: 0.85,
      userText: normalized
    };
  }
  
  // INTENCIÓN: Horarios
  if (normalized.match(/horario|abre|cierra|hora/)) {
    return {
      intent: 'HORARIOS',
      confidence: 0.9,
      userText: normalized
    };
  }
  
  // INTENCIÓN: Ayuda
  if (normalized.match(/ayuda|opciones|menu/)) {
    return {
      intent: 'AYUDA',
      confidence: 1.0,
      userText: normalized
    };
  }
  
  // No se detectó intención clara
  return {
    intent: 'DESCONOCIDO',
    confidence: 0.3,
    userText: normalized
  };
}

// Buscar local por keywords
function findStore(userText) {
  const normalized = normalizeText(userText);
  
  // Buscar coincidencias en keywords
  const matches = stores.filter(store => {
    return store.keywords.some(keyword => 
      normalized.includes(keyword)
    );
  });
  
  return matches;
}

module.exports = {
  detectIntent,
  findStore,
  normalizeText
};