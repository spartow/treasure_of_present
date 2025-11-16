/**
 * Prepare RAG Data from Telegram Transcripts
 * 
 * This script processes Telegram transcripts and creates embeddings
 * for the RAG chatbot. It can use OpenAI embeddings or a local alternative.
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

interface Transcript {
  message_id: number;
  date: string;
  text: string;
  program_number?: number;
  views?: number;
  forwards?: number;
}

interface TranscriptData {
  total_transcripts: number;
  transcripts: Transcript[];
}

interface MappedData {
  data: {
    mapped: Array<{
      program_number: number;
      video: any;
      transcript: Transcript;
    }>;
    unmapped_transcripts: Transcript[];
  };
}

interface Chunk {
  id: string;
  program_number?: number;
  title?: string;
  text: string;
  chunkIndex: number;
  embedding?: number[];
}

// Configuration
const CHUNK_SIZE = 1000; // Characters per chunk
const CHUNK_OVERLAP = 200; // Overlap between chunks
const MAX_CHUNKS_PER_PROGRAM = 10; // Limit chunks per program

/**
 * Split text into chunks with overlap
 */
function splitIntoChunks(text: string, maxLength: number, overlap: number): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxLength;
    
    // Try to break at sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastQuestion = text.lastIndexOf('?', end);
      const lastExclamation = text.lastIndexOf('!', end);
      const lastNewline = text.lastIndexOf('\n', end);
      
      const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation, lastNewline);
      if (breakPoint > start + maxLength * 0.5) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter very short chunks
}

/**
 * Process transcripts and create chunks
 */
function processTranscripts(
  transcripts: Transcript[],
  mappedData?: MappedData
): Chunk[] {
  const chunks: Chunk[] = [];
  const programMap = new Map<number, any>();

  // Create program map from mapped data
  if (mappedData) {
    for (const entry of mappedData.data.mapped) {
      programMap.set(entry.program_number, {
        title: entry.video?.title || `برنامه ${entry.program_number}`,
        program_number: entry.program_number,
      });
    }
  }

  for (const transcript of transcripts) {
    if (!transcript.text || transcript.text.length < 100) {
      continue; // Skip very short transcripts
    }

    const programNumber = transcript.program_number;
    const programInfo = programNumber ? programMap.get(programNumber) : null;
    const title = programInfo?.title || (programNumber ? `برنامه ${programNumber}` : 'متن عمومی');

    // Split into chunks
    const textChunks = splitIntoChunks(transcript.text, CHUNK_SIZE, CHUNK_OVERLAP);
    
    // Limit chunks per program
    const chunksToUse = textChunks.slice(0, MAX_CHUNKS_PER_PROGRAM);

    for (let i = 0; i < chunksToUse.length; i++) {
      const chunk: Chunk = {
        id: `transcript-${transcript.message_id}-chunk-${i}`,
        program_number: programNumber,
        title: title,
        text: chunksToUse[i],
        chunkIndex: i,
      };
      chunks.push(chunk);
    }
  }

  return chunks;
}

/**
 * Generate embeddings using OpenAI
 */
async function generateEmbeddings(
  chunks: Chunk[],
  openai: OpenAI
): Promise<Chunk[]> {
  console.log(`\nGenerating embeddings for ${chunks.length} chunks...`);
  
  const BATCH_SIZE = 100; // OpenAI allows up to 2048 inputs per request
  const chunksWithEmbeddings: Chunk[] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`);

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small', // Cheaper and faster than ada-002
        input: batch.map(chunk => chunk.text),
      });

      for (let j = 0; j < batch.length; j++) {
        chunksWithEmbeddings.push({
          ...batch[j],
          embedding: response.data[j].embedding,
        });
      }

      // Rate limiting - OpenAI free tier: 3 requests/second
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    } catch (error: any) {
      console.error(`Error generating embeddings for batch ${i}:`, error.message);
      // Continue with next batch
    }
  }

  return chunksWithEmbeddings;
}

/**
 * Calculate cosine similarity (for local search without embeddings)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('RAG Data Preparation Script');
  console.log('='.repeat(60));

  // Check for required files
  const transcriptsFile = path.join(process.cwd(), 'telegram_transcripts.json');
  const mappedFile = path.join(process.cwd(), 'videos_with_transcripts.json');
  const outputFile = path.join(process.cwd(), 'data', 'rag-embeddings.json');

  if (!fs.existsSync(transcriptsFile)) {
    console.error(`\n❌ Error: ${transcriptsFile} not found!`);
    console.log('\nPlease run the Telegram scraper first:');
    console.log('  python telegram_scraper.py');
    process.exit(1);
  }

  // Load transcripts
  console.log('\n📖 Loading transcripts...');
  const transcriptsData: TranscriptData = JSON.parse(
    fs.readFileSync(transcriptsFile, 'utf-8')
  );
  console.log(`✓ Loaded ${transcriptsData.transcripts.length} transcripts`);

  // Load mapped data if available
  let mappedData: MappedData | undefined;
  if (fs.existsSync(mappedFile)) {
    console.log('\n📖 Loading mapped video data...');
    mappedData = JSON.parse(fs.readFileSync(mappedFile, 'utf-8'));
    if (mappedData) {
      console.log(`✓ Loaded ${mappedData.data.mapped.length} mapped entries`);
    }
  }

  // Process transcripts into chunks
  console.log('\n✂️  Processing transcripts into chunks...');
  const chunks = processTranscripts(transcriptsData.transcripts, mappedData);
  console.log(`✓ Created ${chunks.length} chunks`);

  // Check for OpenAI API key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  let chunksWithEmbeddings: Chunk[] = chunks;

  if (openaiApiKey) {
    console.log('\n🔑 OpenAI API key found - generating embeddings...');
    const openai = new OpenAI({ apiKey: openaiApiKey });
    chunksWithEmbeddings = await generateEmbeddings(chunks, openai);
    console.log(`✓ Generated embeddings for ${chunksWithEmbeddings.length} chunks`);
  } else {
    console.log('\n⚠️  No OpenAI API key found (OPENAI_API_KEY not set)');
    console.log('   Chunks will be saved without embeddings.');
    console.log('   You can use simple text search instead of semantic search.');
    console.log('\n   To enable embeddings:');
    console.log('   1. Get API key from https://platform.openai.com/api-keys');
    console.log('   2. Add to .env.local: OPENAI_API_KEY=sk-...');
    console.log('   3. Re-run this script');
  }

  // Save to output file
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const output = {
    version: '1.0',
    created_at: new Date().toISOString(),
    total_chunks: chunksWithEmbeddings.length,
    total_transcripts: transcriptsData.total_transcripts,
    has_embeddings: !!openaiApiKey,
    chunks: chunksWithEmbeddings,
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n✓ Saved to: ${outputFile}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total chunks: ${chunksWithEmbeddings.length}`);
  console.log(`   - Has embeddings: ${!!openaiApiKey}`);
  console.log(`   - File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n✅ Done!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { processTranscripts, generateEmbeddings, splitIntoChunks };

