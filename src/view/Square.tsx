import { squarecontents } from "../model/game"
import { piecekind } from "../model/piece"
import React, { Component, ReactNode } from "react"
import '../styles/Board.css'
import { SquareViewer } from "./SquareViewer"

export type SquareColour = "dark" | "light" | "current" | "opponent" | "both"
type SquareProps = {
  contents: squarecontents,
  colour: SquareColour,
}

export class Square extends Component<SquareProps, {}> {
  constructor(props: SquareProps) {
    super(props)
    this.onClickR = this.onClickR.bind(this)
  }


  private viewerRef = React.createRef<HTMLDialogElement>()
  onClickR(event: React.MouseEvent) {
    event.preventDefault()
    this.viewerRef.current?.showModal()
  }

  static getSrc = (k: piecekind, W: boolean): string =>
    window.location.origin + `/piecepng/${k != "knight" ? k.charAt(0) : 'n'}${W ? 'l' : 'd'}.png`

  private getCSScolour = (c: SquareColour) =>
    c != "both" 
      ? { backgroundColor: `var(--${c})` } 
      : { background: "linear-gradient(45deg, var(--current), var(--current) 50%, var(--opponent) 50%, var(--opponent))"}

  render(): ReactNode {
    const con = this.props.contents
    // If there is no piece, return an empty square
    if (con == null)
      return <div className="sq" style={this.getCSScolour(this.props.colour)} />

    // Generate a stack of images on top of eachother
    let imgs: ReactNode[] = []
    let z = 0
    const opacity = 1 / (con.white.length + con.black.length)

    const createImage = (k: piecekind, w: boolean, z: number) => <img
      src={Square.getSrc(k, w)}
      className="piece"
      style={{ zIndex: z, opacity: opacity }}
      key={z}
    />

    // White
    con.white.forEach(k => { imgs.push(createImage(k, true, z)); z++ })
    // Black
    con.black.forEach(k => { imgs.push(createImage(k, false, z)); z++ })

    return <div 
      onContextMenu={this.onClickR} 
      className="sq" 
      style={this.getCSScolour(this.props.colour)}
    >
      {imgs}
      {con != null ? <dialog ref={this.viewerRef}>
        <SquareViewer piece={con} />
        <p>Press <u>Escape</u> to close.</p>
      </dialog> : <></>}
    </div>
  }
}

