
import React, { useState, useContext } from 'react'
import { Select, Button } from 'antd'
import { presetPalettes } from 'ant-design-palettes'
import TextArea from 'antd/lib/input/TextArea'
import compose from 'ramda/es/compose'

import { IPayload, EditorContext, mkAddTextAction } from '../Actions'
import styles from './AddText.module.css'

const fonts = [
  'Arial',
  'Times New Roman',
  'Open Sans',
]

const colors = Object
  .values(presetPalettes)
  .map(d => d[0])

export interface IAddTextPayload extends IPayload {
  type: 'text'
  text: string
  textStyles: {
    font: string
    color: string
    size: string
  }
}

const defaultFontStyle = {
  size: '20px',
  color: '#000',
}

export function AddText() {
  // INFO: better would be to read value from dom, but antd does not expose ref to textArea
  // const inputEl = useRef<TextArea>(null)
  const [text, setText] = useState('')
  const [font, selectedFont] = useState(fonts[0])
  const [color, selectColor] = useState(colors[0])
  const { dispatch } = useContext(EditorContext)
  const addTextToEditor = () =>
    dispatch(
      mkAddTextAction({
        text,
        textStyles: {
          ...defaultFontStyle,
          color,
          font,
        }
      }))

  const clearText = () => setText('')
  const addTextHandler = compose(addTextToEditor, clearText)
  // INFO: very naive
  const validateBeforeSubmit = () => text && addTextHandler()

  return <div className={styles.container}>
    <h2>Add Text</h2>
    <TextArea
      value={text}
      style={{ color }}
      onChange={(e) => setText(e.target.value)}
    />
    <Select
      style={{ width: "100%" }}
      placeholder="Select font"
      defaultValue={font}
      onChange={e => selectedFont(e as string)}
    >
      {fonts.map((fontName, key) =>
        <Select.Option
          value={fontName}
          key={key.toString()}
        >{fontName}</Select.Option>
      )}
    </Select>
    <Select
      style={{ width: "100%" }}
      placeholder="Select color"
      defaultValue={color}
      onChange={e => selectColor(e as string)}
    >
      {colors.map((colorHex, key) =>
        <Select.Option
          value={colorHex}
          key={key.toString()}
        ><div style={{
          width: "100%",
          height: "100%",
          display: 'block',
          backgroundColor: colorHex,
        }}>{colorHex}</div></Select.Option>
      )}
    </Select>
    <Button onClick={validateBeforeSubmit}>Add text</Button>
  </div>
}