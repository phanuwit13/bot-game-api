import { Card } from '../services/game'

const suits = ['hearts', 'spades', 'diamonds', 'clubs'] as const

export const ALL_CARDS: Card[] = suits.flatMap((suit) =>
  Array.from({ length: 13 }, (_, i) => ({
    number: i + 1,
    suit,
  }))
)
