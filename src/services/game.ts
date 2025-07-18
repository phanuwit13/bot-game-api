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


type Gamble = {
  number: number
  suit: string
}

function getPoints(n: number): number {
  if (n < 10) {
    return n
  }
  return 0
}

type Result = 'hit' | 'stand'


function calculatePoints(arr: Gamble[]): number {
  return arr.reduce((acc, gamble) => acc + getPoints(gamble.number), 0) % 10
}

function isTwins(arr: Gamble[]): boolean {
  return arr[0].number === arr[1].number
}

function getResult(hands: Gamble[]): Result {
  const points = calculatePoints(hands);
  if (points >= 6) {
    return 'stand'
  }
  //4 & 5 must twin
  if (isTwins(hands) && points > 3) {
    return 'stand'
  }
  return 'hit'
}
const mock: Gamble[] = [{ number: 1, suit: 'hearts' }, { number: 2, suit: 'hearts' }]

const game1 = (hands: Gamble[][]): Result[] => {
  return hands.map((hand) => getResult(hand))
}

const game2 = (): Result[] => {
  return []
}
