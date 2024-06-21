import { piece } from "./piece";

export type boardpos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type coord = { x: boardpos, y: boardpos }

export const coordEquals = (p: coord, q: coord): boolean =>
  p.x === q.x && p.y === q.y

// A coordinate that is more loose
export type lcoord = { x: number, y: number }

// If we know the input is a valid coordinate on the board
export const coordCast = (a: lcoord): coord => ({ x: <boardpos>a.x, y: <boardpos>a.y })

// Short for: squarecontents
export type squarecontents = piece | null
export type boardLayout = [
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents],
  [squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents, squarecontents]
]

// Initial Board
export const InitialBoard = (): boardLayout => {
  let out: boardLayout = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ]
  // Pawns
  for (let x = 0; x <= 7; x++) {
    out[x][1] = { white: ["pawn"], black: [] }
    out[x][6] = { white: [], black: ["pawn"] }
  }

  // Knights
  out[1][0] = { white: ["knight"], black: [] }
  out[6][0] = { white: ["knight"], black: [] }
  out[1][7] = { white: [], black: ["knight"] }
  out[6][7] = { white: [], black: ["knight"] }

  // Bishops
  out[2][0] = { white: ["bishop"], black: [] }
  out[5][0] = { white: ["bishop"], black: [] }
  out[2][7] = { white: [], black: ["bishop"] }
  out[5][7] = { white: [], black: ["bishop"] }

  // Rooks
  out[0][0] = { white: ["rook"], black: [] }
  out[7][0] = { white: ["rook"], black: [] }
  out[0][7] = { white: [], black: ["rook"] }
  out[7][7] = { white: [], black: ["rook"] }

  // Queens
  out[3][0] = { white: ["queen"], black: [] }
  out[3][7] = { white: [], black: ["queen"] }

  // Kings
  out[4][0] = { white: ["king"], black: [] }
  out[4][7] = { white: [], black: ["king"] }

  return out
}

// True: White, False: Black, null: Illegal
export type moveOption = "white" | "black" | "both" | null
export type moveOptions = [
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
  [moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption, moveOption],
]
export const blankMoveOption = (): moveOptions =>
  [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ]
