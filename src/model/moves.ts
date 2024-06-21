import {
  boardLayout,
  coord,
  squarecontents,
  lcoord,
  coordCast,
  coordEquals
} from "./game"
import { piecekind } from "./piece";


const isLegal = (b: boardLayout, p: lcoord, isW: boolean): boolean => {
  if (p.x > 7 || p.x < 0 || p.y > 7 || p.y < 0) return false
  const P: squarecontents = b[p.x][p.y]
  return P == null || (isW && P.black.length != 0) || (!isW && P.white.length != 0)
}

const isEmpty = (b: boardLayout, p: coord): boolean => b[p.x][p.y] == null

export const movesOfPieceKind = (k: piecekind, b: boardLayout, p: coord, isW: boolean, includeAll: boolean = false): coord[] => {
  let f: (b: boardLayout, p: coord, isW: boolean) => coord[]

  switch (k) {
    case "pawn":
      return pawnMoves(b, p, isW, includeAll)
    case "knight":
      f = knightMoves
      break
    case "bishop":
      f = bishopMoves
      break
    case "rook":
      f = rookMoves
      break
    case "queen":
      f = queenMoves
      break
    case "king":
      f = kingMoves
      break
  }

  return f(b, p, isW)
}

const pawnMoves = (b: boardLayout, p: coord, isW: boolean, includeAll: boolean = false): coord[] => {
  let out: coord[] = []

  // Move straight forwards
  const checkaddS = (q: lcoord) => {
    if (isLegal(b, q, isW) && isEmpty(b, coordCast(q))) out.push(coordCast(q))
  }
  if (isW)
    checkaddS({ x: p.x, y: p.y + 1 })
  else
    checkaddS({ x: p.x, y: p.y - 1 })

  // Double move
  if (
    isW
    && isLegal(b, { x: p.x, y: 3 }, isW)
    && p.y == 1
    && isEmpty(b, { x: p.x, y: 3 })
    && isEmpty(b, { x: p.x, y: 2 })
  )
    out.push({ x: p.x, y: 3 })
  if (
    !isW 
    && isLegal(b, { x: p.x, y: 4 }, isW)
    && p.y == 6
    && isEmpty(b, { x: p.x, y: 4 })
    && isEmpty(b, { x: p.x, y: 5 })
  )
    out.push({ x: p.x, y: 4 })

  // Take Diagonally 
  const checkaddD = (q: lcoord) => {
    if (isLegal(b, q, isW) && (!isEmpty(b, coordCast(q)) || includeAll))
      out.push(coordCast(q))
  }
  if (isW) { // White
    checkaddD({ x: p.x - 1, y: p.y + 1 }) // Left
    checkaddD({ x: p.x + 1, y: p.y + 1 }) //Right
  } else { // Black
    checkaddD({ x: p.x - 1, y: p.y - 1 }) // Left
    checkaddD({ x: p.x + 1, y: p.y - 1 }) // Right
  }

  // En-Passant seems like a total pain in the butt so I'm skipping it
  return out
}


const boardRay = (b: boardLayout, p: coord, isW: boolean, delta: (a: lcoord) => lcoord): coord[] => {
  let out: coord[] = []
  let current: lcoord = delta({ ...p })

  while (isLegal(b, current, isW)) {
    out.push(coordCast(current))
    if (!isEmpty(b, coordCast(current))) break
    current = delta(current)
  }
  return out
}

const bishopMoves = (b: boardLayout, p: coord, isW: boolean): coord[] => {
  const directions: ((a: lcoord) => lcoord)[] = [
    a => ({ x: a.x + 1, y: a.y + 1 }),
    a => ({ x: a.x - 1, y: a.y + 1 }),
    a => ({ x: a.x + 1, y: a.y - 1 }),
    a => ({ x: a.x - 1, y: a.y - 1 }),
  ]
  return directions.map(d => boardRay(b, p, isW, d)).reduce((a, b) => a.concat(b))
}

// By changing the directions array we can change how the rook moves
const rookMoves = (b: boardLayout, p: coord, isW: boolean): coord[] => {
  const directions: ((a: lcoord) => lcoord)[] = [
    a => ({ x: a.x, y: a.y + 1 }),
    a => ({ x: a.x, y: a.y - 1 }),
    a => ({ x: a.x + 1, y: a.y }),
    a => ({ x: a.x - 1, y: a.y }),
  ]
  return directions.map(d => boardRay(b, p, isW, d)).reduce((a, b) => a.concat(b))
}

// A queen moves like a rook or a bishop
const queenMoves = (b: boardLayout, p: coord, isW: boolean): coord[] =>
  bishopMoves(b, p, isW).concat(rookMoves(b, p, isW))

const knightMoves = (b: boardLayout, p: coord, isW: boolean): coord[] =>
  [
    { x: p.x - 1, y: p.y + 2 }, // Up-Left
    { x: p.x + 1, y: p.y + 2 }, // Up-Right
    { x: p.x - 1, y: p.y - 2 }, // Down-Left
    { x: p.x + 1, y: p.y - 2 }, //Down-Right
    { x: p.x - 2, y: p.y + 1 }, // Left-Up
    { x: p.x - 2, y: p.y - 1 }, // Left-Down
    { x: p.x + 2, y: p.y + 1 }, // Right-Up
    { x: p.x + 2, y: p.y - 1 }, // Right-Down
  ]
    .filter(q => isLegal(b, q, isW))
    .map(q => coordCast(q))

export const isCheck = (b: boardLayout, p: coord, isW: boolean) => {
  let s: squarecontents

  // Check every square on the board
  for (let x = 0; x <= 7; x++) for (let y = 0; y <= 7; y++) {
    s = b[x][y]
    // If it's empty skip it
    if (s == null) continue
    const enemyTower = isW ? s.black : s.white
    if (enemyTower.length == 0) continue

    // If it's the enemy king, check if p is adjacent
    if (enemyTower.indexOf("king") != -1) {
      if (
        kingDeltas(coordCast({ x: x, y: y }))
          .findIndex(p2 => coordEquals(p, p2)) != -1
      ) return true;
    }
    else if (
      // Check if any of them land on the kind
      enemyTower.flatMap(
        // Get the moves of that piecekind
        k => movesOfPieceKind(k, b, coordCast({ x: x, y: y }), !isW, true)
      ).findIndex(p2 => coordEquals(p, p2)) != -1
    )
      return true
  }
  // If nothing has landed on the king return false
  return false
}

const kingDeltas = (p: coord) => [
  { x: p.x, y: p.y + 1 }, // U
  { x: p.x + 1, y: p.y + 1 }, // UR
  { x: p.x + 1, y: p.y }, // R
  { x: p.x + 1, y: p.y - 1 }, // DR
  { x: p.x, y: p.y - 1 }, // D
  { x: p.x - 1, y: p.y - 1 }, // DL
  { x: p.x - 1, y: p.y }, // L
  { x: p.x - 1, y: p.y + 1 } // UL
].map(q => coordCast(q))

const kingMoves = (b: boardLayout, p: coord, isW: boolean): coord[] =>
  kingDeltas(p).filter(q => isLegal(b, q, isW) && !isCheck(b, q, isW))
