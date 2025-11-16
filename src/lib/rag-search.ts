/**
 * RAG Search Implementation
 * 
 * Provides semantic search over transcript chunks using embeddings
 * Falls back to simple text search if embeddings not available
 */

import fs from 'fs';
import path from 'path';

interface Chunk {
  id: string;
  program_number?: number;
  title?: string;
  text: string;
  chunkIndex: number;
  embedding?: number[];
}

interface RAGData {
  version: string;
  created_at: string;
  total_chunks: number;
  has_embeddings: boolean;
  chunks: Chunk[];
}

let ragData: RAGData | null = null;

/**
 * Load RAG data from file
 */
export function loadRAGData(): RAGData | null {
  if (ragData) {
    return ragData;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'rag-embeddings.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    ragData = JSON.parse(fileContent) as RAGData;
    return ragData;
  } catch (error) {
    console.error('Error loading RAG data:', error);
    return null;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Simple text search (fallback when embeddings not available)
 */
function textSearch(query: string, chunks: Chunk[], topK: number = 5): Chunk[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = chunks.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;
    
    // Count word matches
    for (const word of queryWords) {
      const matches = (textLower.match(new RegExp(word, 'g')) || []).length;
      score += matches;
    }
    
    // Bonus for exact phrase match
    if (textLower.includes(queryLower)) {
      score += 10;
    }
    
    return { chunk, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

/**
 * Semantic search using embeddings
 */
async function semanticSearch(
  queryEmbedding: number[],
  chunks: Chunk[],
  topK: number = 5
): Promise<Chunk[]> {
  const chunksWithEmbeddings = chunks.filter(c => c.embedding && c.embedding.length > 0);
  
  if (chunksWithEmbeddings.length === 0) {
    return [];
  }
  
  const scored = chunksWithEmbeddings.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding!),
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

/**
 * Search for relevant chunks
 */
export async function searchChunks(
  query: string,
  queryEmbedding?: number[],
  topK: number = 5
): Promise<Chunk[]> {
  const data = loadRAGData();
  
  if (!data || data.chunks.length === 0) {
    return [];
  }
  
  // Use semantic search if embeddings available
  if (queryEmbedding && data.has_embeddings) {
    return await semanticSearch(queryEmbedding, data.chunks, topK);
  }
  
  // Fallback to text search
  return textSearch(query, data.chunks, topK);
}

/**
 * Get chunks by program number
 */
export function getChunksByProgram(programNumber: number): Chunk[] {
  const data = loadRAGData();
  
  if (!data) {
    return [];
  }
  
  return data.chunks.filter(
    chunk => chunk.program_number === programNumber
  );
}

