import { piece, piecekind } from "../model/piece"
import { Square } from "./Square"
import "../styles/Board.css"

type SquareViewerProps = { piece: piece }

export const SquareViewer = (props: SquareViewerProps): React.JSX.Element => {
  const createImage = (k: piecekind, w: boolean, id: number) => 
    <img 
      src={Square.getSrc(k, w)} 
      className="piece" 
      key={w + id.toString()} 
      style={{gridColumn: id + 1, gridRow: w ? 1 : 2}}
    />

  let imgs: React.JSX.Element[] = []
  let id = 0
  // White
  props.piece.white.forEach(k => { imgs.push(createImage(k, true, id)); id++ })
  // Black
  id = 0
  props.piece.black.forEach(k => { imgs.push(createImage(k, false, id)); id++ })

  return <div className="viewbox">{imgs}</div>
}
