import { OpenAPIRoute, contentJson } from 'chanfana'
import { z } from 'zod'
import { type Context } from 'hono'
import { ALL_CARDS } from '../constants/card'

// A single playing card
const CardSchema = z.object({
  number: z.number().int().min(1), // card number (e.g. 1–13)
  suit: z.string(),
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

export class GameEndpoint extends OpenAPIRoute {
  schema = {
    request: {
      body: contentJson(
        z.object({
          playHands: z.array(z.array(CardSchema)),
          gameType: z.number().or(z.string()),
        })
      ),
    },
    responses: {
      // ... responses
    },
  }

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>()
    const userDetails = data.body // Type-safe access to validated body

    if (String(userDetails.gameType) === '2') {
      //call game2
      return game2()
    }
    const game1 = (hands: Card[][]): Result[] => {
      return hands.map((hand) => getResult(hand))
    }

    return game1(userDetails.playHands)
  }
}

function getPoints(n: number): number {
  if (n < 10) {
    return n
  }
  return 0
}

type Result = 'hit' | 'stand'

function calculatePoints(arr: Card[]): number {
  return arr.reduce((acc, gamble) => acc + getPoints(gamble.number), 0) % 10
}

function isTwins(arr: Card[]): boolean {
  return arr[0].number === arr[1].number
}

function getResult(hands: Card[]): Result {
  const points = calculatePoints(hands)
  if (points >= 6) {
    return 'stand'
  }
  //4 & 5 must twin
  if (isTwins(hands) && points > 3) {
    return 'stand'
  }
  return 'hit'
}

const game2 = (): Result[] => {
  console.log('ALL_CARDS', ALL_CARDS)

  return []
}
