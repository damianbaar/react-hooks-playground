import React, { useRef, useEffect, useLayoutEffect, useState, forwardRef, RefObject } from 'react'
import { DropTarget, DropTargetConnector, DropTargetMonitor, DndComponentClass } from 'react-dnd'
import { Rnd, Props as RndProps } from 'react-rnd'

import { EditorContext, mkDeleteElement } from '../Actions'
import { IAddTextPayload } from './AddText'
import { LOGO, IDraggableTarget } from './DraggableItemType'
import { IAddLogoPayload } from './AddLogo'

import styles from './Editor.module.css'
import { Button } from 'antd';

export interface IDrawable {
  selectedBackground: string
  texts: IAddTextPayload[]
  logos: IAddLogoPayload[]
}

export interface IExportImagePayload {
  nodeToExport: HTMLElement
}

const TextRender = ({ textStyles, type, text, id }: IAddTextPayload) =>
  <EditorContext.Consumer>{({ dispatch }) =>
    <DraggableInteractionItem
      onDelete={() => dispatch(mkDeleteElement({ type, id }))}
    >
      <p
        style={{
          width: '100%',
          height: '100%',
          fontFamily: textStyles.font,
          fontSize: textStyles.size,
          color: textStyles.color,
        }}
      >{text}</p>
    </DraggableInteractionItem>
  }</EditorContext.Consumer>

const defaultLogoPlacement = {
  x: 10,
  y: 10,
  width: 100,
  height: 'auto'
}

const defaultLogoBoundaries = {
  minWidth: 30,
  minHeight: 30,
  maxHeight: 150,
  maxWidth: 150,
}

const DraggableInteractionItem =
  ({ children, onDelete, ...rest }: RndProps & { onDelete: () => void }) => {
    const [over, setMouseOver] = useState(false)

    return <Rnd
      bounds="parent"
      enableUserSelectHack={true}
      style={{
        border: over ? '1px solid #DDD' : '',
        boxSizing: 'border-box'
      }}
      onMouseOver={(e) => setMouseOver(true)}
      onMouseOut={(e) => setMouseOver(false)}
      {...rest}
    >
      {children}
      <Button
        type="danger"
        onClick={onDelete}
        style={{
          width: "100%",
          minWidth: "55px",
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          visibility: over ? 'visible' : 'hidden',
        }}
      >delete</Button>
    </Rnd>
  }

const LogoRender = ({ item, type, id }: IAddLogoPayload) =>
  <EditorContext.Consumer>{({ dispatch }) =>
    <DraggableInteractionItem
      onDelete={() => dispatch(mkDeleteElement({ type, id }))}
      default={defaultLogoPlacement}
      lockAspectRatio={true}
      {...defaultLogoBoundaries}
    >

      <img
        style={{ width: '100%', height: 'auto' }}
        src={item}
        draggable={false}
      />
    </DraggableInteractionItem>
  }</EditorContext.Consumer>

interface WithSize {
  size: {
    width: number
    height: number
  }
}
interface WithBackground {
  background: string
}
const BackgroundRender =
  forwardRef(({ size, background }: WithSize & WithBackground, ref: RefObject<HTMLImageElement>) =>
    <img
      src={background}
      ref={ref}
      style={{
        width: size.width,
        height: size.height,
        objectFit: 'cover'
      }} />
  )

interface WithRefForwarder { forwardedRef?: RefObject<HTMLDivElement> }

const BaseEditor = ({ forwardedRef }: WithRefForwarder) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const containerEl = useRef<HTMLDivElement>(null)
  const backgroundEl = useRef<HTMLImageElement>(null)
  const resizeHandler = () => {
    const editor = containerEl.current!
    setSize({
      width: editor.offsetWidth,
      height: editor.offsetHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  })

  useLayoutEffect(() => {
    if (size.width === 0 && size.height === 0) { resizeHandler() }
  })

  return <EditorContext.Consumer>{
    ({ state: { elements } }) =>
      <div>
        <h1>Editor</h1>
        <div ref={forwardedRef}>
          <div
            ref={containerEl}
            className={styles.editor}
          >
            {elements.selectedBackground &&
              <BackgroundRender
                ref={backgroundEl}
                size={size}
                background={elements.selectedBackground}
              />
            }

            {elements.texts.map((t, key) => <TextRender key={key} {...t} />)}

            {elements.logos.map((t, key) => <LogoRender key={key} {...t} />)}
          </div>
        </div>
      </div>
  }
  </EditorContext.Consumer>
}

export const DropEnabledEditor = ({ connectDropTarget, forwardedRef }: IDraggableTarget & WithRefForwarder) => {
  return connectDropTarget(
    <div>
      <BaseEditor forwardedRef={forwardedRef} />
    </div>
  )
}

export const asDropTarget = DropTarget(
  LOGO,
  {},
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOvers: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)

export const DroppableEditor: DndComponentClass<WithRefForwarder>
  = asDropTarget(DropEnabledEditor)

export const ExportableEditor =
  forwardRef((props, ref: RefObject<HTMLDivElement>) =>
    <DroppableEditor
      {...props}
      forwardedRef={ref}
    />)

export const Editor = ExportableEditor