import * as game from '../model/game'
import { isCheck, movesOfPieceKind } from '../model/moves';
import { merge, piece } from '../model/piece'
import { BoardState } from '../view/Board'

export function movePiece(
  game_state: BoardState,
  coord: game.coord,
  thinkingPiece: piece,
  c: game.squarecontents
): { board: game.boardLayout | undefined, mate: mate_result } {
  let newB: game.boardLayout = board_state_deepcopy(game_state.board);

  // Make the move on a copy of the board
  if (c == null) newB[coord.x][coord.y] = thinkingPiece
  else {
    newB[coord.x][coord.y] = merge(thinkingPiece, c, game_state.currentPlayer)
  }
  if (game_state.thinkingSquare != null) // Type guard
    newB[game_state.thinkingSquare.x][game_state.thinkingSquare.y] = null

  // Get the final location of the kings and whether or not they're in check
  const final_king_coordinate = game_state.currentPlayer
    ? updateKingLocs(newB).white
    : updateKingLocs(newB).black
  const check = isCheck(newB, final_king_coordinate, game_state.currentPlayer)

  // Return the updated board (if not moving into check) and the mate status
  return {
    board: check ? undefined : newB,
    mate: isCheckmate(newB, game_state.king_locs)
  }
}

// Freaking Javascript
const board_state_deepcopy = (arr: game.squarecontents[][]): game.boardLayout => {
  let copy = game.InitialBoard();
  for (let x = 0; x < copy.length; x++)
    for (let y = 0; y < copy[x].length; y++)
      copy[x][y] = arr[x][y]
  return copy
}

export const getMoves = (p: piece, b: game.boardLayout, pos: game.coord) => {
  let out: game.moveOptions = game.blankMoveOption()

  // Black:
  const bmoves: game.coord[] = p.black
    .map(k => movesOfPieceKind(k, b, pos, false))
    .flat()

  // White
  const wmoves: game.coord[] = p.white
    .map(k => movesOfPieceKind(k, b, pos, true))
    .flat()

  // Add to the output
  bmoves.forEach(c => out[c.x][c.y] = "black")
  wmoves.forEach(c => {
    // If a black move was already added, replace it with both.
    if (out[c.x][c.y] == "black" || out[c.x][c.y] == "both") out[c.x][c.y] = "both"
    else out[c.x][c.y] = "white"
  })

  return out
}

export type mate_result = "white" | "black" | "neither"
export const isCheckmate = (board: game.boardLayout, kings: { white: game.coord, black: game.coord }): mate_result => {
  const wMate = isCheck(board, kings.white, true)
  const bMate = isCheck(board, kings.black, false)

  if (!wMate && !bMate) return "neither"

  let piece: game.squarecontents
  for (let x = 0; x < 8; x++)
    for (let y = 0; y < 8; y++) {
      piece = board[x][y]
      if (
        piece == null
        // || (wMate ? piece.white : piece.black).length == 0
      ) continue

      let X = try_moves(
        board,
        (wMate ? kings.white : kings.black),
        wMate,
        piece,
        game.coordCast({ x: x, y: y })
      )
      if (X) return "neither"
    }

  return wMate ? "white" : "black"
}

const try_moves = (
  board: game.boardLayout,
  king_loc: game.coord,
  is_white: boolean,
  piece: piece,
  start_loc: game.coord
): boolean => {
  let newB: game.boardLayout
  let contents: game.squarecontents


  // Get the moves the piece can make
  return (is_white ? piece.white : piece.black)
    .flatMap(k => movesOfPieceKind(k, board, start_loc, is_white, false))

    // Check if you're still in check after making each
    .filter(coord => {
      newB = board_state_deepcopy(board)
      contents = newB[coord.x][coord.y]

      // Make move
      if (contents == null) newB[coord.x][coord.y] = piece
      else {
        let x = merge(piece, contents, is_white)
        newB[coord.x][coord.y] = x
      }
      newB[start_loc.x][start_loc.y] = null;

      // Get coordinate of king after movement
      const kingCoord = (
        is_white
          ? piece.white
          : piece.black
      ).indexOf("king") == -1 
        ? king_loc 
        : coord

      return !isCheck(newB, kingCoord, is_white)
    })

    // If there are no moves that escape check, return true
    .length != 0
}

export const updateKingLocs = (board: game.boardLayout): { 
  white: game.coord,
  black: game.coord 
} => {
  let whiteloc: game.coord | undefined = undefined;
  let blackloc: game.coord | undefined = undefined;
  let current: game.squarecontents;
  for (let x = 0; x < board.length; x++)
    for (let y = 0; y < board[x].length; y++) {
      current = board[x][y];
      if (current == null) continue;
      if (current.white.indexOf("king") != -1)
        whiteloc = game.coordCast({ x: x, y: y })
      if (current.black.indexOf("king") != -1)
        blackloc = game.coordCast({ x: x, y: y })
    }
  if (whiteloc == undefined || blackloc == undefined) throw "MISSING A KING";
  return { white: whiteloc, black: blackloc }
}
