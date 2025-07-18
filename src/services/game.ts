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

// export class GameEndpoint extends OpenAPIRoute {
//   schema = {
//     request: {
//       body: contentJson(
//         z.object({
//           playHands: z.array(z.array(CardSchema)),
//           gameType: z.number().or(z.string()),
//         })
//       ),
//     },
//     responses: {
//       // ... responses
//     },
//   }

// }

export async function game(c: Context) {
  const userDetails = await c.req.json()
  console.log('userDetails', userDetails)

  if (String(userDetails.gameType) === '2') {
    const game2 = (hands: Card[][]): Result[] => {
      return getDecisions(hands)
    }
    return c.json(game2(userDetails.playHands))
  }
  const game1 = (hands: Card[][]): Result[] => {
    return hands.map((hand) => getResult(hand))
  }

  return c.json(game1(userDetails.playHands))
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

/** คืนไพ่ที่เหลือ หลังเอาไพ่ใน removedCards ออก */
function getRemaining(removedCards: Card[]): Card[] {
  return ALL_CARDS.filter(
    (c) => !removedCards.some((r) => r.number === c.number && r.suit === c.suit)
  )
}

/** คำนวณเปอร์เซ็นของแต่ละหมายเลขใน remaining */
function calcProbByNumber(remaining: Card[]): Record<number, number> {
  const total = remaining.length
  const counts: Record<number, number> = {}
  for (const c of remaining) {
    counts[c.number] = (counts[c.number] || 0) + 1
  }
  const probs: Record<number, number> = {}
  for (const num in counts) {
    probs[+num] = parseFloat(((counts[+num] / total) * 100).toFixed(2))
  }
  return probs
}
// 4) ฟังก์ชันหลัก: ตัดสินใจ “hit” หรือ “stand”
function getDecisions(playedHands: Card[][]): ('hit' | 'stand')[] {
  const decisions: ('hit' | 'stand')[] = []
  const removed: Card[] = []

  for (const hand of playedHands) {
    // เอามือปัจจุบันออกจากกองก่อนคำนวน
    removed.push(...hand)
    const remaining = getRemaining(removed)
    const probs = calcProbByNumber(remaining)

    const score = calculatePoints(hand)
    const isPair = isTwins(hand)

    // สะสมเปอร์เซ็นตามกลุ่มเลข
    const sum124 = [1, 2, 3, 4].reduce((a, n) => a + (probs[n] || 0), 0)
    const sum789 = [7, 8, 9].reduce((a, n) => a + (probs[n] || 0), 0)

    let decision: 'hit' | 'stand'

    if (score >= 6) {
      console.log('case 1', score)
      // case 1: แต้ม ≥ 6 -> stand
      decision = 'stand'
    } else if (score === 5) {
      console.log('case 2', score)
      // case 2: แต้ม = 5 และ % ไพ่เลข 1–4 > 60 -> hit
      decision = sum124 > 60 ? 'hit' : 'stand'
    } else if (score === 4 && isPair) {
      console.log('case 3', score)
      // case 3: แต้ม = 4 และไพ่คู่ -> stand
      decision = 'stand'
    } else {
      // default: hit
      decision = 'hit'
    }

    decisions.push(decision)
  }

  return decisions
}
