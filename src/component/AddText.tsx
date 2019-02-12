
import React, { useState } from 'react'
import { Select, Button } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const fonts = [
  'Arial',
  'Times New Roman',
  'Open Sans',
]

export interface IAddTextPayload {
  text: string
  font: string
}

interface IProps {
  onTextAdded: (val: IAddTextPayload) => void
}

export function AddText({ onTextAdded }: Partial<IProps>) {
  // INFO: better would be to read value from dom, but antd does not expose ref to textArea
  // const inputEl = useRef<TextArea>(null)
  const [text, setText] = useState('')
  const [font, selectedFont] = useState(fonts[0])

  return <div>
    <h1>Add Text</h1>
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
            style={radioStyle}
            value={fontName}
            key={key.toString()}
          >{fontName}</Select.Option>
        )}
      </Select>
    </div>
    <Button
      onClick={() => onTextAdded && onTextAdded({ text, font })}>Add text</Button>
  </div>
}