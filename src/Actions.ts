import { Dispatch, createContext } from 'react'
import uuid from 'uuid/v1'
import { Lens } from 'monocle-ts'

import { IBackgroundPayload } from './component/UnsplashList'
import { IAddTextPayload } from './component/AddText'
import { IDrawable, IExportImagePayload } from './component/Editor'
import { IAddLogoPayload } from 'src/component/AddLogo'

export const ADD_TEXT = '[editor] SET_TEXT'
export const mkAddTextAction =
  (payload: Partial<IAddTextPayload>) => ({
    type: ADD_TEXT as typeof ADD_TEXT,
    payload: { ...payload, type: 'text' } as IAddTextPayload
  })

export const ADD_LOGO = '[editor] ADD_LOGO'
export const mkAddLogoAction =
  (payload: Partial<IAddLogoPayload>) => ({
    type: ADD_LOGO as typeof ADD_LOGO,
    payload: { ...payload, type: 'logo' } as IAddLogoPayload
  })

export const SET_BACKGROUND = '[editor] SET_BACKGROUND'
export const mkSetBackgroundAction =
  (payload: IBackgroundPayload) =>
    ({ type: SET_BACKGROUND as typeof SET_BACKGROUND, payload })

export interface IPayload {
  type: 'logo' | 'text'
  id?: string
}

export type IDeletableElementPayload = IPayload

export const appendIdToElement =
  <P extends IPayload>(element: P) => ({
    ...element,
    id: uuid()
  })

export const DELETE_ELEMENT = '[editor] DELETE_ELEMENT'
export const mkDeleteElement =
  (payload: IDeletableElementPayload) =>
    ({ type: DELETE_ELEMENT as typeof DELETE_ELEMENT, payload })

export const EXPORT_IMAGE = '[editor] EXPORT_IMAGE'
export const mkExportImage =
  (payload: IExportImagePayload) =>
    ({ type: EXPORT_IMAGE as typeof EXPORT_IMAGE, payload })

export type Actions =
  | ReturnType<typeof mkAddTextAction>
  | ReturnType<typeof mkSetBackgroundAction>
  | ReturnType<typeof mkAddLogoAction>
  | ReturnType<typeof mkDeleteElement>

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

// state accessors
export const elements = Lens.fromProp<IAppState>()('elements')
export const texts = Lens.fromProp<IAppState['elements']>()('texts')
export const logos = Lens.fromProp<IAppState['elements']>()('logos')
export const background = Lens.fromProp<IAppState['elements']>()('selectedBackground')

export const setTexts = elements.compose(texts)
export const setLogos = elements.compose(logos)
export const setBackground = elements.compose(background)