import * as game from "../model/game"
import React from "react"
import { Square, SquareColour } from "./Square"
import { movePiece, getMoves, updateKingLocs } from "../controller/controller"
import "../styles/Board.css"

export type BoardState = {
  board: game.boardLayout
  displayedMove: game.moveOptions
  thinkingSquare: game.coord | null
  king_locs: { white: game.coord, black: game.coord }
  perspective: boolean
  currentPlayer: boolean // White: true, Black: false
}

const playerName = (isW: boolean): "white" | "black" =>
  isW ? "white" : "black"

export class Board extends React.Component<{}, BoardState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      board: game.InitialBoard(),
      perspective: true,
      currentPlayer: true,
      displayedMove: game.blankMoveOption(),
      thinkingSquare: null,
      king_locs: {
        white: { x: 4, y: 0 },
        black: { x: 4, y: 7 }
      }
    }

    // Bind Event Listeners
    this.togglePerspective = this.togglePerspective.bind(this)
    this.restartGame = this.restartGame.bind(this)
  }

  togglePerspective() {
    this.setState({ perspective: !this.state.perspective })
  }

  getColour(pos: game.coord, mv: game.moveOptions): SquareColour {
    const op: game.moveOption = mv[pos.x][pos.y]
    switch (op) {
      case "white":
      case "black":
        return op == playerName(this.state.currentPlayer) ? "current" : "opponent"
      case "both":
        return "both"
      default:
        return ((pos.x % 2 == 0) != (pos.y % 2 == 0) ? "light" : "dark")
    }
  }

  private mateRef = React.createRef<HTMLDialogElement>()
  //@ts-ignore
  generateSquareClick = (x: number, y: number): ((e: React.MouseEvent) => void) => (event: React.MouseEvent) => {
    // Get useful consts
    const contents: game.squarecontents = this.state.board[x][y]
    const moveType: game.moveOption = this.state.displayedMove[x][y]
    const coord: game.coord = game.coordCast({ x: x, y: y })
    const thinkingPiece = this.state.thinkingSquare != null ? this.state.board[this.state.thinkingSquare.x][this.state.thinkingSquare.y] : null

    // Show a pieces move
    if (contents != null && moveType == null)
      return this.setState({
        displayedMove: getMoves(contents, this.state.board, coord),
        thinkingSquare: coord
      })

    // Hide the currently shown move
    if (contents == null && moveType == null)
      return this.setState({
        displayedMove: game.blankMoveOption(),
        thinkingSquare: null
      })

    // If you're trying to move to a red square exit early
    if ((moveType != playerName(this.state.currentPlayer) && moveType != "both") || thinkingPiece == null)
      return

    // Make a move with a piece
    const move_result = movePiece(
      this.state,
      coord,
      thinkingPiece,
      contents,
    )

    // If the move would put you in check exit early
    if (move_result.board != undefined)

      // Make a move on the board
      this.setState({
        board: move_result.board,
        thinkingSquare: null,
        displayedMove: game.blankMoveOption(),
        currentPlayer: !this.state.currentPlayer,
        king_locs: updateKingLocs(move_result.board)
      })

    // If there is checkmate display it!
    if (move_result.mate != 'neither')
      this.mateRef.current?.showModal()
  }

  restartGame() {
    window.location.reload();
  }

  render(): React.ReactNode {
    let sqs: JSX.Element[] = []
    for (let x = 0; x <= 7; x++) for (let y = 0; y <= 7; y++)
      // Wrap it and add it to the grid
      sqs.push(<div
        style={{
          gridColumn: this.state.perspective ? x + 1 : 8 - x,
          gridRow: this.state.perspective ? 8 - y : y + 1
        }}
        id={x.toString() + y.toString()}
        key={x.toString() + y.toString()}
        className="sqc"
        onClick={this.generateSquareClick(x, y)}
      ><Square
          colour={this.getColour(game.coordCast({ x: x, y: y }), this.state.displayedMove)}
          contents={this.state.board[x][y]}
        />
      </div>)

    return <div className="gameContainer">
      <div style={{ display: "grid", width: 480 }}>{sqs}</div>
      <div style={{display: "flex", borderWidth: 0}}>
        <button onClick={this.togglePerspective} className="gameBottom">Switch View</button>
        <p className="gameBottom">{playerName(this.state.currentPlayer).toUpperCase()} to play.</p>
        <button onClick={this.restartGame} className="gameBottom">Restart Game</button>
      </div>
      <dialog ref={this.mateRef} /* onCancel={this.restartGame} */>
        <p>{playerName(!this.state.currentPlayer).toUpperCase()} wins!</p>
        <button onClick={this.restartGame}>Restart!</button>
      </dialog>
    </div>
  }
}
