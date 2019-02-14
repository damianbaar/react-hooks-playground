import React, { useRef, useEffect, useLayoutEffect, useState, forwardRef, RefObject } from 'react'
import { DropTarget, DropTargetConnector, DropTargetMonitor, DndComponentClass } from 'react-dnd'
import { Rnd } from 'react-rnd'

import { EditorContext } from '../Actions'
import { IAddTextPayload } from './AddText'
import { LOGO, IDraggableTarget } from './DraggableItemType'
import { IAddLogoPayload } from './AddLogo'

import styles from './Editor.module.css'

export interface IDrawable {
  selectedBackground: string
  texts: IAddTextPayload[]
  logos: IAddLogoPayload[]
}

export interface IExportImagePayload {
  nodeToExport: HTMLElement
}

const TextRender = ({ textStyles, text }: IAddTextPayload) =>
  <Rnd
    bounds="parent"
    style={{ border: '1px solid #DDD' }}
    enableUserSelectHack={true}
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
  </Rnd>

const defaultLogoPlacement = {
  x: 10,
  y: 10,
  width: 100,
  height: 'auto'
}

const defaultLogoBoundaries = {
  minWidth: 30,
  minHeight: 30,
  maxHeight: 300,
  maxWidth: 300,
}

const LogoRender = ({ item }: IAddLogoPayload) =>
  <Rnd
    bounds="parent"
    enableUserSelectHack={true}
    default={defaultLogoPlacement}
    lockAspectRatio={true}
    style={{ border: '1px solid #DDD' }}
    {...defaultLogoBoundaries}
  >
    <img
      style={{ width: '100%', height: 'auto' }}
      src={item}
      draggable={false}
    />
  </Rnd>

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

            {elements.texts.map((t, key) =>
              <TextRender
                key={key}
                textStyles={t.textStyles}
                text={t.text}
              />
            )}

            {elements.logos.map((t, key) =>
              <LogoRender
                key={key}
                item={t.item}
              />
            )}
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