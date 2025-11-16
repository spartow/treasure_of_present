import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchChunks } from '@/lib/rag-search';

// Initialize OpenAI client (optional - only if API key is set)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'پیام خالی است. لطفاً سوال خود را وارد کنید.' },
        { status: 400 }
      );
    }

    // Limit message length
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'پیام خیلی طولانی است. لطفاً سوال کوتاه‌تری بپرسید.' },
        { status: 400 }
      );
    }

    let queryEmbedding: number[] | undefined;
    let relevantChunks: any[] = [];

    // Step 1: Generate embedding for query (if OpenAI is available)
    if (openai) {
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: message,
        });
        queryEmbedding = embeddingResponse.data[0].embedding;
      } catch (error: any) {
        console.error('Error generating embedding:', error.message);
        // Continue without embedding (will use text search)
      }
    }

    // Step 2: Search for relevant chunks
    try {
      relevantChunks = await searchChunks(message, queryEmbedding, 5);
    } catch (error: any) {
      console.error('Error searching chunks:', error.message);
      // Continue without context
    }

    // Step 3: Build context from retrieved chunks
    let context = '';
    const sources: Array<{ program_number?: number; title?: string; score?: number }> = [];

    if (relevantChunks.length > 0) {
      context = relevantChunks
        .map((chunk, i) => {
          const programInfo = chunk.program_number
            ? `[برنامه #${chunk.program_number}: ${chunk.title || `برنامه ${chunk.program_number}`}]`
            : '[متن عمومی]';
          
          // Add to sources
          if (chunk.program_number) {
            sources.push({
              program_number: chunk.program_number,
              title: chunk.title,
            });
          }
          
          return `${programInfo}\n${chunk.text}`;
        })
        .join('\n\n---\n\n');

      // Limit context length
      if (context.length > 3000) {
        context = context.substring(0, 3000) + '...';
      }
    }

    // Step 4: Generate response
    let responseText = '';
    
    if (openai && context) {
      // Use OpenAI to generate response with context
      try {
        const systemPrompt = `شما دستیار هوشمند "گنج حضور" هستید که توسط پرویز شهبازی اجرا می‌شود. وظیفه شما کمک به کاربران در یافتن و درک محتوای برنامه‌های معنوی و عرفانی است.

از اطلاعات زیر برای پاسخ دادن به سوال کاربر استفاده کنید. اگر پاسخ در متن زیر نیست، صادقانه بگویید که نمی‌دانید و پیشنهاد دهید کاربر جستجوی دیگری انجام دهد.

همیشه منابع خود را ذکر کنید (شماره برنامه).

متن مرجع:
${context}`;

        const messages: any[] = [
          { role: 'system', content: systemPrompt },
        ];

        // Add recent history (last 3 messages)
        if (history && Array.isArray(history)) {
          const recentHistory = history.slice(-3);
          for (const msg of recentHistory) {
            if (msg.role && msg.content) {
              messages.push({
                role: msg.role,
                content: msg.content,
              });
            }
          }
        }

        messages.push({ role: 'user', content: message });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Cost-effective model
          messages,
          temperature: 0.7,
          max_tokens: 500,
        });

        responseText = completion.choices[0].message.content || 'متاسفانه نتوانستم پاسخی تولید کنم.';
      } catch (error: any) {
        console.error('Error generating response with OpenAI:', error.message);
        // Fallback to simple response
        responseText = generateFallbackResponse(message, relevantChunks);
      }
    } else {
      // Fallback: Generate simple response from context
      responseText = generateFallbackResponse(message, relevantChunks);
    }

    // Remove duplicate sources
    const uniqueSources = Array.from(
      new Map(sources.map(s => [s.program_number, s])).values()
    );

    return NextResponse.json({
      response: responseText,
      sources: uniqueSources,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'خطا در پردازش پیام. لطفاً دوباره تلاش کنید.',
        response: 'متاسفانه خطایی رخ داد. لطفاً بعداً تلاش کنید.',
        sources: [],
      },
      { status: 500 }
    );
  }
}

/**
 * Generate fallback response when OpenAI is not available
 */
function generateFallbackResponse(query: string, chunks: any[]): string {
  if (chunks.length === 0) {
    return 'متاسفانه اطلاعات مرتبطی پیدا نکردم. لطفاً سوال خود را به شکل دیگری مطرح کنید یا از شماره برنامه خاصی بپرسید.';
  }

  const programNumbers = [...new Set(chunks.map(c => c.program_number).filter(Boolean))];
  
  if (programNumbers.length > 0) {
    const programsList = programNumbers.slice(0, 3).join('، ');
    return `بر اساس جستجوی شما، اطلاعات مرتبطی در برنامه‌های ${programsList} پیدا کردم. ${programNumbers.length > 3 ? `و ${programNumbers.length - 3} برنامه دیگر.` : ''}

برای مشاهده متن کامل، می‌توانید به صفحات این برنامه‌ها مراجعه کنید.`;
  }

  return 'اطلاعات مرتبطی پیدا کردم اما نمی‌توانم پاسخ دقیقی بدهم. لطفاً سوال خود را واضح‌تر مطرح کنید.';
}

// Example implementation with OpenAI (when you're ready):
/*
import OpenAI from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new PineconeClient();

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    // 1. Generate embedding for user message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // 2. Search Pinecone for relevant transcripts
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    const queryResponse = await index.query({
      queryRequest: {
        vector: embedding,
        topK: 3,
        includeMetadata: true,
      },
    });

    // 3. Build context from retrieved transcripts
    const context = queryResponse.matches
      ?.map((match) => match.metadata?.text)
      .join('\n\n');

    // 4. Generate response with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `شما دستیار هوشمند گنج حضور هستید. از اطلاعات زیر برای پاسخ دادن به سوال کاربر استفاده کنید:\n\n${context}`,
        },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const response = {
      response: completion.choices[0].message.content,
      sources: queryResponse.matches?.map((match) => ({
        programNumber: match.metadata?.programNumber,
        title: match.metadata?.title,
        score: match.score,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
*/
