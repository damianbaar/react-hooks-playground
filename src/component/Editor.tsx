import React, { createContext, useRef, useEffect, useLayoutEffect, useState } from 'react'
import { IAddTextPayload } from './AddText'
import { Rnd } from 'react-rnd'

// editor context
export interface IDrawable {
  selectedBackground: string
  texts: IAddTextPayload[]
}

export const EditorContext = createContext<{ elements: IDrawable }>({ elements: {} as IDrawable })
export const Editor = () => {
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
    ({ elements }) =>
      <div>
        <h1>Editor</h1>
        <div
          ref={containerEl}
          style={{
            width: '100%',
            height: '100%',
            minWidth: '400px',
            minHeight: '400px',
            border: '1px solid #DDD',
            overflow: 'hidden'
          }}
        >
          {elements.selectedBackground && <img
            src={elements.selectedBackground}
            ref={backgroundEl}
            style={{
              width: size.width,
              height: size.height,
              objectFit: 'cover'
            }} />
          }
          {elements.texts.map((t, key) => (
            <Rnd
              bounds="parent"
              enableUserSelectHack={true}
              key={key}
            >
              <p
                style={{
                  width: '100%',
                  height: '100%',
                  fontFamily: t.font,
                }}
              >{t.text}</p>
            </Rnd>
          ))}
        </div>
      </div>
  }
  </EditorContext.Consumer>
}