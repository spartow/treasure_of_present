const fs = require('fs');
const path = require('path');
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const TRANSCRIPTS_PATH = path.join(__dirname, 'data', 'telegram_transcripts.json');
const MODEL_NAME = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const CHUNK_SIZE = Number(process.env.TRANSCRIPT_CHUNK_SIZE || 800);
const CHUNK_OVERLAP = Number(process.env.TRANSCRIPT_CHUNK_OVERLAP || 200);
const BATCH_SIZE = Number(process.env.TRANSCRIPT_BATCH_SIZE || 32);
const START_AT = Number(process.env.TRANSCRIPT_START || 0);
const LIMIT = process.env.TRANSCRIPT_LIMIT ? Number(process.env.TRANSCRIPT_LIMIT) : null;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const OPENAI_API_KEY = requireEnv('OPENAI_API_KEY');
const PINECONE_API_KEY = requireEnv('PINECONE_API_KEY');
const PINECONE_INDEX = requireEnv('PINECONE_INDEX');

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pinecone.index(PINECONE_INDEX);

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  if (!text) return [];
  const result = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    result.push(text.slice(start, end));
    if (end === text.length) break;
    start += Math.max(size - overlap, 1);
  }

  return result;
}

async function embedTexts(texts) {
  const response = await openai.embeddings.create({
    model: MODEL_NAME,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

async function flushBuffer(buffer) {
  if (!buffer.length) return 0;
  try {
    const embeddings = await embedTexts(buffer.map((item) => item.text));
    const vectors = embeddings.map((values, idx) => ({
      id: buffer[idx].id,
      values,
      metadata: buffer[idx].metadata,
    }));
    await index.upsert(vectors);
    return vectors.length;
  } catch (error) {
    console.error('❌ Failed to flush batch:', error.message);
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function processTranscripts() {
  if (!fs.existsSync(TRANSCRIPTS_PATH)) {
    console.error(`❌ Cannot find transcripts file: ${TRANSCRIPTS_PATH}`);
    process.exit(1);
  }

  console.log('📄 Loading transcripts...');
  const raw = fs.readFileSync(TRANSCRIPTS_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  const transcripts = parsed.transcripts || parsed;

  if (!Array.isArray(transcripts) || transcripts.length === 0) {
    console.error('❌ No transcripts found in file.');
    process.exit(1);
  }

  const end = LIMIT ? Math.min(transcripts.length, START_AT + LIMIT) : transcripts.length;
  console.log(`🚀 Starting ingestion from ${START_AT} to ${end} (out of ${transcripts.length})`);

  let buffer = [];
  let totalChunks = 0;

  for (let i = START_AT; i < end; i++) {
    const transcript = transcripts[i];
    const text = cleanText(transcript?.text);
    if (!text) continue;

    const chunks = chunkText(text);
    const messageId = transcript?.message_id ?? transcript?.messageId ?? `msg_${i}`;

    chunks.forEach((chunk, chunkIndex) => {
      buffer.push({
        id: `telegram_${messageId}_${chunkIndex}`,
        text: chunk,
        metadata: {
          source: 'telegram',
          message_id: messageId,
          date: transcript?.date || null,
          program_number: transcript?.program_number || transcript?.programNumber || null,
          views: transcript?.views || null,
        },
      });
    });

    if (buffer.length >= BATCH_SIZE) {
      const count = await flushBuffer(buffer);
      totalChunks += count;
      console.log(`✅ Upserted ${totalChunks} chunks so far (processed transcript ${i + 1}/${end})`);
      buffer = [];
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  if (buffer.length) {
    const count = await flushBuffer(buffer);
    totalChunks += count;
  }

  console.log(`🎉 Finished. Total chunks ingested: ${totalChunks}`);
}

processTranscripts().catch((error) => {
  console.error('❌ Unexpected error during processing:', error);
  process.exit(1);
});
