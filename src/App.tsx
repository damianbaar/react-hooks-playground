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
} from './Actions'

import './App.css'
import { downloadImage } from './htmlToPng'

// TODO better would be to go with lenses -> monocle-ts
function reducer(state: IAppState, action: Actions) {
  switch (action.type) {
    case SET_BACKGROUND:
      return {
        ...state,
        elements: {
          ...state.elements,
          selectedBackground: action.payload
        }
      }

    case ADD_TEXT:
      return {
        ...state,
        elements: {
          ...state.elements,
          texts: [...state.elements.texts, action.payload]
        }
      }

    case ADD_LOGO:
      return {
        ...state,
        elements: {
          ...state.elements,
          logos: [...state.elements.logos, action.payload]
        }
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
          <h1 style={{ color: '#FFFFFF' }}>Interview challange for promo.com</h1>
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
