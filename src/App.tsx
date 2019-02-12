import React, { useReducer, Reducer, useContext } from 'react'
import './App.css'

import { Button, Row, Col, Layout } from 'antd'
import { UnsplashList, IBackgroundPayload } from './component/UnsplashList'
import { Editor, EditorContext } from './component/Editor'
import { AddText, IAddTextPayload } from './component/AddText'
import { AddLogo } from './component/AddLogo'

interface IAppState {
  selectedBackground: string
  texts: IAddTextPayload[]
}

const ADD_TEXT = '[editor] SET_TEXT'
const mkAddTextAction =
  (payload: IAddTextPayload) =>
    ({ type: ADD_TEXT as typeof ADD_TEXT, payload })

const SET_BACKGROUND = '[editor] SET_BACKGROUND'
const mkSetBackgroundAction = (payload: IBackgroundPayload) =>
  ({ type: SET_BACKGROUND as typeof SET_BACKGROUND, payload })

type Actions =
  | ReturnType<typeof mkAddTextAction>
  | ReturnType<typeof mkSetBackgroundAction>

const initialState: IAppState = {
  selectedBackground: '',
  texts: []
}

function reducer(state: IAppState, action: Actions) {
  switch (action.type) {
    case SET_BACKGROUND:
      return {
        ...state,
        selectedBackground: action.payload
      }

    case ADD_TEXT:
      return {
        ...state,
        texts: [...state.texts, action.payload]
      }

    default:
      throw new Error()
  }
}

export function App() {
  const [state, dispatch] = useReducer<Reducer<IAppState, Actions>>(reducer, initialState)
  const [] = useContext(EditorContext)

  return (
    <Layout>
      <Layout.Header>
        <p style={{ color: '#FFFFFF' }}>{JSON.stringify(state)}</p>
      </Layout.Header>
      <Layout.Content
        style={{
          minWidth: "1200px",
          padding: '50px 50px',
          background: '#FFF',
        }}>
        <Row gutter={16}>
          <Col span={8}>
            <UnsplashList
              onBackgroundSelect={p => dispatch(mkSetBackgroundAction(p))}
            />
          </Col>
          <Col span={8} >
            <EditorContext.Provider value={{ elements: state }}>
              <Row>
                <Editor />
                <Button type="primary">Download as image</Button>
              </Row>
            </EditorContext.Provider>
          </Col>
          <Col span={8} >
            <Row>
              <AddLogo />
              <AddText
                onTextAdded={p => dispatch(mkAddTextAction(p))}
              />
            </Row>
          </Col>
        </Row>
      </Layout.Content>
      <Layout.Footer>
        <span>extra options</span>
      </Layout.Footer>
    </Layout>
  )
}

export default App;
