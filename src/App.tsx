import React, { useReducer, Reducer, useRef } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from "react-dnd"
import { Button, Row, Col, Layout } from 'antd'

import { UnsplashList } from './component/UnsplashList'
import { Editor } from './component/Editor'
import { AddText } from './component/AddText'
import { AddLogo } from './component/AddLogo'

import {
  IAppState,
  Actions,
  SET_BACKGROUND,
  ADD_TEXT,
  EditorContext,
  initialState,
  ADD_LOGO,
  DELETE_ELEMENT,
  IDeletableElementPayload,
  appendIdToElement,
  setTexts,
  setLogos,
  setBackground,
} from './Actions'

import './App.css'
import { downloadImage } from './htmlToPng'


const deleteItem = (payload: IDeletableElementPayload) => {
  if (payload.type === 'text')
    return setTexts
      .modify(t =>
        t.filter(d => d.id !== payload.id))

  if (payload.type === 'logo')
    return setLogos
      .modify(l =>
        l.filter(d => d.id !== payload.id))

  return (state: IAppState) => state
}

function reducer(state: IAppState, action: Actions) {
  switch (action.type) {
    case SET_BACKGROUND:
      return setBackground.set(action.payload)(state)

    case ADD_TEXT:
      return setTexts
        .modify(t =>
          [...t, appendIdToElement(action.payload)])(state)

    case ADD_LOGO:
      return setLogos
        .modify(l =>
          [...l, appendIdToElement(action.payload)])(state)

    case DELETE_ELEMENT:
      {
        const a = deleteItem(action.payload)
        console.log('@@', a, a(state))
        debugger

        return deleteItem(action.payload)(state)
      }

    default:
      throw new Error()
  }
}

export function App() {
  const [state, dispatch] = useReducer<Reducer<IAppState, Actions>>(reducer, initialState)
  const editorEl = useRef(null)

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <Layout>
        <Layout.Header>
          <h1 style={{ color: '#FFFFFF' }}>Simple editor</h1>
        </Layout.Header>
        <EditorContext.Provider value={{ state, dispatch }}>
          <Layout.Content
            style={{
              minWidth: "1200px",
              padding: '50px 50px',
              background: '#FFF',
            }}>
            <Row gutter={16}>
              <Col span={4}>
                <UnsplashList />
              </Col>
              <Col span={16} >
                <Row>
                  <Editor ref={editorEl} />
                  <div style={{
                    textAlign: "center",
                    paddingTop: "5px",
                  }}>
                    <Button
                      type="primary"
                      shape="round"
                      icon="download"
                      onClick={() => downloadImage(editorEl.current!, 'image.png')}
                    >Download as image</Button>
                  </div>
                </Row>
              </Col>
              <Col span={4} >
                <Row>
                  <h1>Extras</h1>
                  <AddLogo />
                  <AddText />
                </Row>
              </Col>
            </Row>
          </Layout.Content>
        </EditorContext.Provider>
        <Layout.Footer>
          <span>some extra options ... 🦄🌈💥</span>
        </Layout.Footer>
      </Layout>
    </DragDropContextProvider>
  )
}

export default App
