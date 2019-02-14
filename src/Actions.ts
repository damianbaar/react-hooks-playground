import { Dispatch, createContext } from 'react'

import { IBackgroundPayload } from './component/UnsplashList'
import { IAddTextPayload } from './component/AddText'
import { IDrawable, IExportImagePayload } from './component/Editor'
import { IAddLogoPayload } from 'src/component/AddLogo'

export const ADD_TEXT = '[editor] SET_TEXT'
export const mkAddTextAction =
  (payload: IAddTextPayload) =>
    ({ type: ADD_TEXT as typeof ADD_TEXT, payload })

export const SET_BACKGROUND = '[editor] SET_BACKGROUND'
export const mkSetBackgroundAction =
  (payload: IBackgroundPayload) =>
    ({ type: SET_BACKGROUND as typeof SET_BACKGROUND, payload })

export const ADD_LOGO = '[editor] ADD_LOGO'
export const mkAddLogoAction =
  (payload: IAddLogoPayload) =>
    ({ type: ADD_LOGO as typeof ADD_LOGO, payload })

export const EXPORT_IMAGE = '[editor] EXPORT_IMAGE'
export const mkExportImage =
  (payload: IExportImagePayload) =>
    ({ type: EXPORT_IMAGE as typeof EXPORT_IMAGE, payload })

export type Actions =
  | ReturnType<typeof mkAddTextAction>
  | ReturnType<typeof mkSetBackgroundAction>
  | ReturnType<typeof mkAddLogoAction>

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
    logos: [],
    texts: []
  }
}

export const EditorContext = createContext<IEditorContext>({
  state: initialState,
  dispatch: () => void 0
})