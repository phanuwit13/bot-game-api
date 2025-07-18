import { OpenAPIRoute, contentJson } from 'chanfana'
import { z } from 'zod'
import { type Context } from 'hono'

// A single playing card
const CardSchema = z.object({
  number: z.number().int().min(1), // card number (e.g. 1–13)
  suit: z.enum(['hearts', 'spades', 'diamonds', 'clubs']), // one of the four suits
})

// A “hand” of exactly two cards
const HandSchema = z.tuple([CardSchema, CardSchema])

// The overall request body
export const BodySchema = z.object({
  playHands: z.array(HandSchema),
  knownHands: z.array(HandSchema),
})

// Optionally export TS types
export type Card = z.infer<typeof CardSchema>
export type Hand = z.infer<typeof HandSchema>
export type Body = z.infer<typeof BodySchema>

export class GameEndpoint extends OpenAPIRoute {
  schema = {
    request: {
      body: contentJson(BodySchema),
    },
    responses: {
      // ... responses
    },
  }

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>()
    const userDetails = data.body // Type-safe access to validated body

    if (userDetails.knownHands.length === 0) {
      //call game2
      return { message: 'game2' }
    }

    // ... logic to create a user ...
    return { message: 'game1' }
  }
}

const game1 = () => {}
const game2 = () => {}
