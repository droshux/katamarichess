export type piecekind = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"


type pieceTower = piecekind[]

const addPieceToTower = (t: pieceTower, p: piecekind) => {
  // t is passed by reference
  if (t.indexOf(p) != -1) return // If p is already in t do nothing
  let bi: number

  // TODO: Testing without merging
  t.push(p)
  return

  switch (p) {
    case "pawn":
      t.push("pawn")
      break
    case "knight":
      t.push("knight")
      break
    case "bishop":
      bi = t.indexOf("rook")
      if (bi == -1) {
        t.push("bishop")
        break
      }
      t.splice(bi)
      t.push("queen")
      break
    case "rook":
      bi = t.indexOf("bishop")
      if (bi == -1) {
        t.push("rook")
        break
      }
      t.splice(bi)
      t.push("queen")
      break
    case "queen":
      // Get rooks and bishops...
      const r = t.indexOf("rook");
      const b = t.indexOf("bishop");

      if (r != -1) t.splice(r)
      if (r != -1) t.splice(b)
      t.push("queen")
      break
  }
}


export type piece = { white: pieceTower, black: pieceTower }

// p takes q
export const merge = (p: piece, q: piece, isW: boolean): piece => {
  
  let out: piece = { white: [...p.white], black: [...p.black] }
  
  // Kings take entire towers
  if (isW) {
    if (p.white.indexOf("king") != -1)
      return { white: ["king"], black: [] }
  } else {
    if (p.black.indexOf("king") != -1)
      return { white: [], black: ["king"] }
  }

  q.white.forEach(w => addPieceToTower(out.white, w))
  q.black.forEach(b => addPieceToTower(out.black, b))
  return out
}
