// netlify/functions/duke-tts.js
// Server-side proxy for ElevenLabs text-to-speech.
// Browser POSTs { text, voiceId, settings? } → function returns audio/mpeg.
// API key lives in Netlify env var ELEVENLABS_API_KEY (never sent to browser).

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { text, voiceId, settings, modelId } = payload;

  if (!text || typeof text !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'text (string) is required' }) };
  }
  if (text.length > 5000) {
    return { statusCode: 400, body: JSON.stringify({ error: 'text too long (5000 char max)' }) };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'ELEVENLABS_API_KEY not configured. Set it in Netlify → Site settings → Environment variables.'
      })
    };
  }

  const useVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!useVoiceId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'voiceId required. Either pass voiceId in the request body or set ELEVENLABS_VOICE_ID env var.'
      })
    };
  }

  const voiceSettings = settings && typeof settings === 'object' ? settings : {
    stability: 0.45,
    similarity_boost: 0.85,
    style: 0.65,
    use_speaker_boost: true
  };

  const useModelId = modelId || 'eleven_multilingual_v2';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(useVoiceId)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: useModelId,
          voice_settings: voiceSettings
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      let errJson;
      try { errJson = JSON.parse(errText); } catch (e) { errJson = { raw: errText }; }
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: `ElevenLabs returned ${response.status}`,
          detail: errJson
        })
      };
    }

    const audioBuffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(audioBuffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Function error: ' + err.message })
    };
  }
};
