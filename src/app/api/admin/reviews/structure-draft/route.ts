import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false
  return (sessionClaims?.metadata as { role?: string })?.role === 'admin'
}

const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    excerpt: { type: 'string' },
    content: { type: 'string' },
    whoIsItFor: { type: 'string' },
    whoIsItNotFor: { type: 'string' },
    mainBenefit: { type: 'string' },
    mainDownside: { type: 'string' },
    verdict: { type: 'string' },
  },
  required: ['excerpt', 'content', 'whoIsItFor', 'whoIsItNotFor', 'mainBenefit', 'mainDownside', 'verdict'],
}

function extractOutputText(response: any) {
  if (typeof response.output_text === 'string') return response.output_text

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') return content.text
    }
  }

  return ''
}

function categoryGuidance(category: string) {
  const guidance: Record<string, string> = {
    Rackets:
      'Structure around racket identity, specifications if supplied, technology if supplied, on-court feel, forehand/backhand/serve/net/return feel, sweet spot, comfort, string setup thoughts, who it suits and who it does not suit.',
    Shoes:
      'Structure around fit, width, comfort, heel feel, forefoot court feel, stability, breathability, outsole/court model, durability, laces, colourways if relevant, who it suits and who it does not suit.',
    Strings:
      'Structure around string type, gauge if supplied, power, control, spin, launch angle, comfort, tension feel, tension maintenance, durability, when it goes dead, and who should use it.',
    Grips:
      'Structure around grip type, tack, sweat absorption, thickness, bevel feel, comfort, how it changes handle feel, durability, replacement timing, and who should use it.',
    Accessories:
      'Structure around what problem it solves, build quality, compatibility, value, durability, practical use, who should buy it and who should skip it.',
    Comparisons:
      'Structure around the products compared, practical differences, who should choose each option, trade-offs and a clear recommendation.',
  }

  return guidance[category] ?? guidance.Accessories
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 400 })
  }

  const body = await req.json()
  const category = typeof body.category === 'string' ? body.category : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''

  if (!notes) {
    return NextResponse.json({ error: 'Add your raw thoughts before generating a draft' }, { status: 400 })
  }

  const productName = typeof body.productName === 'string' ? body.productName : ''
  const brand = typeof body.brand === 'string' ? body.brand : ''
  const title = typeof body.title === 'string' ? body.title : ''

  const prompt = `
Write a RacketLogic product review draft from the owner/writer's raw thoughts.

Product title: ${title || 'Not supplied'}
Product name: ${productName || 'Not supplied'}
Brand: ${brand || 'Not supplied'}
Review category: ${category || 'Not supplied'}

Category structure:
${categoryGuidance(category)}

Raw thoughts from the writer:
${notes}

Rules:
- Keep the writer's meaning and opinion. Do not flatten it into generic marketing copy.
- Write in first person where useful: "In my opinion", "I found", "for me".
- Be clear, practical, honest and tennis-specific.
- Do not invent specifications, prices, technologies, injuries, measurements or affiliate claims.
- If something is uncertain, phrase it as opinion or uncertainty.
- Do not use ratings.
- Do not write sales hype.
- The content field must be clean HTML suitable for a rich text editor.
- Use h2/h3 headings and short paragraphs.
- Mention that the review is personal opinion/experience where appropriate.
- Keep it concise enough to read, but structured enough to publish after editing.
`

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_REVIEW_MODEL ?? 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'You are an expert tennis equipment editor for RacketLogic. You turn rough product notes into clear, honest, practical tennis reviews. Return only structured JSON that matches the schema.',
          },
          { role: 'user', content: prompt },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'racketlogic_review_draft',
            strict: true,
            schema: reviewSchema,
          },
        },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('OpenAI review draft error:', result)
      return NextResponse.json({ error: 'Failed to generate review draft' }, { status: 500 })
    }

    const outputText = extractOutputText(result)
    const draft = JSON.parse(outputText)

    return NextResponse.json({ success: true, draft })
  } catch (error) {
    console.error('Structure review draft error:', error)
    return NextResponse.json({ error: 'Failed to structure review draft' }, { status: 500 })
  }
}
