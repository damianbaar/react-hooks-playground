import { Dispatch, createContext } from 'react'
import { IBackgroundPayload } from './component/UnsplashList'
import { IAddTextPayload } from './component/AddText'
import { IDrawable } from './component/Editor'

export const ADD_TEXT = '[editor] SET_TEXT'
export const mkAddTextAction =
  (payload: IAddTextPayload) =>
    ({ type: ADD_TEXT as typeof ADD_TEXT, payload })

export const SET_BACKGROUND = '[editor] SET_BACKGROUND'
export const mkSetBackgroundAction =
  (payload: IBackgroundPayload) =>
    ({ type: SET_BACKGROUND as typeof SET_BACKGROUND, payload })

export type Actions =
  | ReturnType<typeof mkAddTextAction>
  | ReturnType<typeof mkSetBackgroundAction>

export interface IAppState {
  elements: IDrawable
}

export interface IEditorContext {
  state: IAppState
  dispatch: Dispatch<Actions>
}


export const initialState: IAppState = {
  elements: {
    selectedBackground: '',
    texts: []
  }
}

export const EditorContext = createContext<IEditorContext>({
  state: initialState,
  dispatch: () => void 0
})