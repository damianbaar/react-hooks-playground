
import React, { useState, useContext } from 'react'
import { Select, Button } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { EditorContext, mkAddTextAction } from '../Actions'
import styles from './AddText.module.css'

const fonts = [
  'Arial',
  'Times New Roman',
  'Open Sans',
]

export interface IAddTextPayload {
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
  const { dispatch } = useContext(EditorContext)

  return <div className={styles.container}>
    <h2>Add Text</h2>
    <TextArea onChange={(e) => setText(e.target.value)} />
    <div>
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
    </div>
    <Button
      onClick={() =>
        dispatch(
          mkAddTextAction({
            text,
            textStyles: {
              ...defaultFontStyle,
              font,
            }
          }))}
    >Add text</Button>
  </div>
}