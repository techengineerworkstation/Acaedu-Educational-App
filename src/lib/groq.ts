const GROQ_API_KEY = 'gsk_3W3ARHVQw4UzyDNOvKfgWGdyb3FYT5fr2A0UqsxdLqb8dAo8JwJbin'
const GROQ_BASE = 'https://api.groq.com/openai/v1'
const MODEL = 'llama-3.3-70b-versatile'

interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function groqChat(messages: GroqMessage[], maxTokens = 1024): Promise<string> {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
    }),
  })
  if (!res.ok) throw new Error(`Groq API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function generateLectureSummary(lectureTitle: string, content: string): Promise<string> {
  const prompt = `Summarize the following lecture content into clear, structured notes. Use bullet points for key concepts, bold important terms, and organize into sections:\n\nTitle: ${lectureTitle}\n\nContent:\n${content}`
  return groqChat([
    { role: 'system', content: 'You are an expert academic summarizer. Produce concise, well-structured summaries that highlight key concepts, definitions, and takeaways. Use markdown formatting.' },
    { role: 'user', content: prompt },
  ])
}

export async function generateNoteSummary(notes: string): Promise<string> {
  return groqChat([
    { role: 'system', content: 'You are an academic assistant. Condense the following notes into a clear summary with key points, definitions, and action items. Use markdown.' },
    { role: 'user', content: `Summarize these notes:\n\n${notes}` },
  ])
}

export async function getAcademicAdvice(question: string, context?: string): Promise<string> {
  const contextBlock = context ? `\n\nAdditional context: ${context}` : ''
  return groqChat([
    { role: 'system', content: 'You are an experienced academic advisor at a university. Provide thoughtful, practical advice about academic planning, course selection, study strategies, career pathways, and student success. Be encouraging but realistic. Keep responses concise and actionable.' },
    { role: 'user', content: question + contextBlock },
  ])
}

export async function getCareerAdvice(question: string, field?: string): Promise<string> {
  const fieldBlock = field ? `\n\nField of study: ${field}` : ''
  return groqChat([
    { role: 'system', content: 'You are a career counselor specializing in academic and professional development. Provide practical career advice including skill development, industry insights, internship guidance, and job market trends. Be specific and actionable.' },
    { role: 'user', content: question + fieldBlock },
  ])
}

export async function generateDashboardGreeting(
  role: 'student' | 'lecturer' | 'admin' | 'dean',
  name: string,
  stats: { courses?: number; exams?: number; assignments?: number; students?: number; enrollments?: number }
): Promise<string> {
  const timeOfDay = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 17) return 'afternoon'
    return 'evening'
  })()

  const statsContext = Object.entries(stats)
    .filter(([, v]) => v && v > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const roleContext: Record<string, string> = {
    student: `You are greeting a student named ${name}. They have ${statsContext}. Motivate them about their studies and remind them of upcoming deadlines.`,
    lecturer: `You are greeting a lecturer named ${name}. They manage ${statsContext}. Acknowledge their teaching work and mention anything relevant to their classes.`,
    admin: `You are greeting an administrator named ${name}. They oversee ${statsContext}. Highlight system health and any action items.`,
    dean: `You are greeting a dean named ${name}. They oversee ${statsContext}. Provide a high-level institutional overview.`,
  }

  return groqChat([
    { role: 'system', content: `You are a warm, professional academic assistant for the Acaedu platform. Generate a brief, personalized ${timeOfDay} greeting. Keep it to 1-2 sentences. Be specific to their role and current data. Do not use markdown. Do not greet with "Good ${timeOfDay}" — use more natural language.` },
    { role: 'user', content: roleContext[role] || roleContext.student },
  ], 150)
}

export async function getInsightFromData(dataDescription: string): Promise<string> {
  return groqChat([
    { role: 'system', content: 'You are a data analyst for an educational institution. Analyze the provided data and give 2-3 brief, actionable insights. Be specific with numbers. Keep response under 100 words.' },
    { role: 'user', content: dataDescription },
  ], 256)
}
