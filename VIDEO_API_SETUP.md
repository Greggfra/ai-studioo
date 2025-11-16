# 🎬 Setup Video Generation API

## Opzioni disponibili

### 1. **Replicate** (CONSIGLIATO) ⭐
**Pro:** 
- Facile da usare
- Gratis per iniziare ($0.01-0.05 per video)
- Modelli stabili: Zeroscope V2 XL, AnimateDiff, Stable Video Diffusion
- No queue, generazione in ~30-60 secondi

**Contro:**
- Video brevi (max 3-5 secondi di qualità)
- Richiede carta di credito dopo trial

**Setup:**
1. Vai su [replicate.com](https://replicate.com)
2. Registrati gratuitamente
3. Vai su [Account → API Tokens](https://replicate.com/account/api-tokens)
4. Copia il token API
5. Aggiungi al file `backend/.env`:
```env
REPLICATE_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxx
```

---

### 2. **Stability AI** (Video Diffusion)
**Pro:**
- Alta qualità video
- Stable Video Diffusion (SVD)
- Buona per animazioni

**Contro:**
- Più costoso ($0.10-0.30 per video)
- Setup più complesso

**Setup:**
1. Vai su [platform.stability.ai](https://platform.stability.ai)
2. Ottieni API Key
3. Aggiungi al `.env`:
```env
STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
```

---

### 3. **RunwayML** (Gen-2)
**Pro:**
- Qualità cinematografica
- Video più lunghi (4-16 secondi)

**Contro:**
- Molto costoso ($0.50-2.00 per video)
- Richiede abbonamento Pro

**Setup:**
1. Vai su [runwayml.com](https://runwayml.com)
2. Abbonamento Pro richiesto
3. API Key da dashboard

---

### 4. **Modalità Demo** (Attuale)
Senza configurare API key, il sistema usa un video di esempio.

---

## 🚀 Come attivare (Replicate - Raccomandato)

### Step 1: Ottieni API Key Gratis
```bash
# 1. Vai su https://replicate.com/signin
# 2. Registrati con Google/GitHub
# 3. Vai su https://replicate.com/account/api-tokens
# 4. Copia il token (inizia con r8_)
```

### Step 2: Configura il Backend
Apri `backend/.env` e aggiungi:
```env
REPLICATE_API_KEY=r8_TUO_TOKEN_QUI
```

### Step 3: Riavvia il Server
```bash
cd backend
npm start
```

Dovresti vedere:
```
✅ Replicate API initialized for video generation
```

---

## 📊 Modelli Video Disponibili

### Zeroscope V2 XL (Default - Text-to-Video)
```javascript
"anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351"
```
- **Durata:** 3-5 secondi
- **Costo:** ~$0.02-0.05 per video
- **Qualità:** Media-Alta
- **Tempo:** 30-60 secondi

### AnimateDiff (Text-to-Video)
```javascript
"lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663"
```
- **Durata:** 2-3 secondi
- **Costo:** ~$0.01-0.03 per video
- **Qualità:** Anime/Cartoon style
- **Tempo:** 20-40 secondi

### Stable Video Diffusion (Image-to-Video)
```javascript
"stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438"
```
- **Input:** Richiede immagine di partenza
- **Durata:** 2-4 secondi
- **Costo:** ~$0.04-0.08 per video
- **Qualità:** Ottima

---

## 🔄 Cambiare Modello Video

Apri `backend/routes/video.js` e modifica:

```javascript
// Attuale (Zeroscope V2 XL - text-to-video)
const output = await replicate.run(
  "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
  {
    input: {
      prompt: prompt,
      num_frames: Math.min(duration * fps, 72),
      fps: fps
    }
  }
);

// Alternativa 1: AnimateDiff (più veloce, stile cartoon)
const output = await replicate.run(
  "lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663",
  {
    input: {
      prompt: prompt,
      motion_module: "mm_sd_v15_v2",
      num_frames: 16
    }
  }
);

// Alternativa 2: Hotshot-XL (open source)
const output = await replicate.run(
  "lucataco/hotshot-xl:78b3a6257e16e4b241245d2e8e6b91096e4e0ea8b69a02c4d9d05fb0c38d615e",
  {
    input: {
      prompt: prompt,
      width: 512,
      height: 512,
      video_length: "8"
    }
  }
);
```

---

## 💰 Costi Stimati (Replicate)

| Modello | Costo/Video | Tempo Gen. | Qualità |
|---------|-------------|------------|---------|
| Zeroscope V2 XL | $0.02-0.05 | 30-60s | ⭐⭐⭐⭐ |
| AnimateDiff | $0.01-0.03 | 20-40s | ⭐⭐⭐ |
| Stable Video Diff | $0.04-0.08 | 40-80s | ⭐⭐⭐⭐⭐ |
| Hotshot-XL | $0.03-0.06 | 25-50s | ⭐⭐⭐⭐ |

**Crediti gratis:** Replicate dà $5-10 di crediti iniziali (100-500 video di test!)

---

## 🧪 Test Video Generation

Una volta configurato, prova questi prompt:

```
✅ BUONI PROMPT:
- "A rocket launching into space, cinematic"
- "Ocean waves crashing on beach, slow motion"
- "Fireworks exploding in night sky"
- "A cat playing with yarn, cute"
- "Northern lights dancing, timelapse"
- "A drone flying over mountains, aerial view"

❌ PROMPT DA EVITARE:
- "A person talking" (volti difficili)
- "Complex action scenes" (troppo complessi)
- Prompt molto lunghi (mantieni 10-15 parole)
```

---

## 🐛 Troubleshooting

### Errore: "Invalid API key"
```bash
# Verifica che la key sia corretta in .env
cat backend/.env | grep REPLICATE

# Deve iniziare con r8_
REPLICATE_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxx
```

### Errore: "Model timeout"
Alcuni modelli possono richiedere tempo. Riduci `num_frames` o `duration`.

### Video di bassa qualità
- Usa prompt più descrittivi
- Aggiungi "cinematic, high quality, 4k" al prompt
- Prova modello Stable Video Diffusion

---

## 📚 Risorse

- [Replicate Docs](https://replicate.com/docs)
- [Zeroscope V2 XL](https://replicate.com/anotherjesse/zeroscope-v2-xl)
- [AnimateDiff](https://replicate.com/lucataco/animate-diff)
- [Stable Video Diffusion](https://replicate.com/stability-ai/stable-video-diffusion)

---

## ✅ Checklist Setup Completo

- [ ] Registrato su Replicate
- [ ] Ottenuto API key
- [ ] Aggiunto `REPLICATE_API_KEY` in `backend/.env`
- [ ] Riavviato backend server
- [ ] Testato generazione video da UI
- [ ] Video salvato correttamente

---

**Tempo setup:** ~5 minuti
**Costo iniziale:** GRATIS (crediti trial)
**Difficoltà:** ⭐ Facile
