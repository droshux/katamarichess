import { Board } from "./Board"
import "../styles/Board.css"
import "../styles/App.css"

function App() {
  return (
    <>
      <h1>Katamari Chess:</h1>
      <div style={{display: "flex"}}>
        <Board />
        <div className="infoContainer">
          <h2>How to play:</h2>
          The existing rules of regular chess apply (although En-Passant and Castling
          haven't been implemented yet) but with one very important change:
          <h3>Merging Pieces:</h3>
          In this chess varient when two pieces take
          eachother they stick together becoming a single piece. However the component pieces
          that make it up are controlled by their respective players meaning that
          (for example) if a white Queen takes a black Knight, white can move the new
          composite piece like a Queen but black can also move that piece like a Knight.
          You can't take pieces that entirely belong to you, and kings completely destroy composite pieces.
          <h3>Controls:</h3>
          Left-Click a piece to see it's possible moves
          and then Left-Click a highlighted square to move there. <span style={{ backgroundColor: "var(--current)" }}>Green</span> squares
          are moves that you can make with that piece but <span style={{ backgroundColor: "var(--opponent)" }}>red</span> squares
          are moves that your opponent can make with that piece. Left-Clicking an
          empty space will hide these highlights. Right-Click a piece to see what
          pieces make it up. If you try to make a move and nothing happens, don't
          worry, it's just that that move would put you in check if you made it.
          <h3>Basic Strategy:</h3>
          If you take a piece with a composite piece that already contains it, the
          new addition won't have an effect on the movement of the composite and so
          this is the only real way to remove material from the board.
        </div>
      </div>
    </>
  )
}

export default App
