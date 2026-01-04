require('dotenv').config();
const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { detectIntent, findStore } = require('./services/intentDetector');
const stores = require('./data/stores');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Call Center Puente de San Gil - API funcionando ✅');
});

// Endpoint para llamadas entrantes
app.post('/webhooks/twilio/incoming', (req, res) => {
  console.log('📞 Llamada recibida:', req.body.CallSid);
  
  const twiml = new VoiceResponse();
  
  twiml.say(
    { language: 'es-MX' },
    'Bienvenido al Centro Comercial Puente de San Gil'
  );
  
  const gather = twiml.gather({
    input: ['speech'],
    timeout: 5,
    action: '/webhooks/twilio/process',
    language: 'es-MX'
  });
  
  gather.say(
    { language: 'es-MX' },
    '¿En qué puedo ayudarte? Puedes buscar un local, pedir horarios, o que te comuniquemos con alguna tienda.'
  );
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Procesar respuesta del usuario
app.post('/webhooks/twilio/process', (req, res) => {
  const { SpeechResult, Confidence } = req.body;
  
  console.log('🗣️  Usuario dijo:', SpeechResult);
  console.log('📊 Confianza:', Confidence);
  
  const twiml = new VoiceResponse();
  
  // Detectar intención
  const intentResult = detectIntent(SpeechResult);
  console.log('🎯 Intención detectada:', intentResult);
  
  // Buscar locales relacionados
  const foundStores = findStore(SpeechResult);
  console.log('🏬 Locales encontrados:', foundStores.length);
  
  // Responder según intención
  switch (intentResult.intent) {
    case 'TRANSFERIR_LOCAL':
      handleTransferIntent(twiml, foundStores, SpeechResult);
      break;
      
    case 'BUSCAR_LOCAL':
      handleSearchIntent(twiml, foundStores, SpeechResult);
      break;
      
    case 'HORARIOS':
      handleScheduleIntent(twiml, foundStores, SpeechResult);
      break;
      
    case 'AYUDA':
      handleHelpIntent(twiml);
      break;
      
    default:
      twiml.say(
        { language: 'es-MX' },
        'No entendí tu solicitud. ¿Puedes ser más específico?'
      );
      twiml.redirect('/webhooks/twilio/incoming');
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Manejar intención de transferencia
function handleTransferIntent(twiml, stores, userText) {
  if (stores.length === 0) {
    twiml.say(
      { language: 'es-MX' },
      'No encontré ese local en el centro comercial. ¿Buscas otra cosa?'
    );
    twiml.redirect('/webhooks/twilio/incoming');
    return;
  }
  
  if (stores.length === 1) {
    const store = stores[0];
    twiml.say(
      { language: 'es-MX' },
      `Encontré ${store.nombre}. Te voy a comunicar.`
    );
    
    // AQUÍ IRÍA LA TRANSFERENCIA REAL
    twiml.say(
      { language: 'es-MX' },
      'Simulando transferencia... En producción esto llamaría al local.'
    );
    twiml.say(
      { language: 'es-MX' },
      'Gracias por usar el sistema. Adiós.'
    );
    twiml.hangup();
    return;
  }
  
  // Múltiples resultados
  const nombres = stores.map(s => s.nombre).join(', ');
  twiml.say(
    { language: 'es-MX' },
    `Encontré ${stores.length} locales: ${nombres}. ¿A cuál quieres llamar?`
  );
  
  const gather = twiml.gather({
    input: ['speech'],
    timeout: 5,
    action: '/webhooks/twilio/process',
    language: 'es-MX'
  });
  
  gather.say(
    { language: 'es-MX' },
    'Dime el nombre del local.'
  );
}

// Manejar búsqueda de ubicación
function handleSearchIntent(twiml, stores, userText) {
  if (stores.length === 0) {
    twiml.say(
      { language: 'es-MX' },
      'No encontré ese local. ¿Buscas otra cosa?'
    );
    twiml.redirect('/webhooks/twilio/incoming');
    return;
  }
  
  if (stores.length === 1) {
    const store = stores[0];
    twiml.say(
      { language: 'es-MX' },
      `${store.nombre} está en ${store.ubicacion}.`
    );
    twiml.say(
      { language: 'es-MX' },
      '¿Necesitas algo más?'
    );
    twiml.redirect('/webhooks/twilio/incoming');
    return;
  }
  
  // Múltiples resultados
  const ubicaciones = stores.map(s => 
    `${s.nombre} en ${s.ubicacion}`
  ).join('. ');
  
  twiml.say(
    { language: 'es-MX' },
    `Encontré: ${ubicaciones}`
  );
  twiml.redirect('/webhooks/twilio/incoming');
}

// Manejar horarios
function handleScheduleIntent(twiml, stores, userText) {
  if (stores.length === 0) {
    twiml.say(
      { language: 'es-MX' },
      'No encontré ese local. ¿De qué local quieres saber el horario?'
    );
    twiml.redirect('/webhooks/twilio/incoming');
    return;
  }
  
  const store = stores[0];
  const horarios = Object.entries(store.horario)
    .map(([dia, hora]) => `${dia}: ${hora}`)
    .join('. ');
  
  twiml.say(
    { language: 'es-MX' },
    `El horario de ${store.nombre} es: ${horarios}`
  );
  twiml.redirect('/webhooks/twilio/incoming');
}

// Manejar ayuda
function handleHelpIntent(twiml) {
  twiml.say(
    { language: 'es-MX' },
    'Puedo ayudarte a buscar locales, darte horarios, o comunicarte con alguna tienda. ¿Qué necesitas?'
  );
  twiml.redirect('/webhooks/twilio/incoming');
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor corriendo en http://localhost:${PORT}
  📞 Sistema de Call Center listo
  🏬 Locales cargados: ${stores.length}
  `);
});