import { ConnectDragSource, ConnectDropTarget } from 'react-dnd'

export const LOGO = 'logo'

export interface IDraggableItem {
  isDragging: boolean
  connectDragSource: ConnectDragSource
}

export interface IDraggableTarget {
  canDrop: boolean
  isOver: boolean
  connectDropTarget: ConnectDropTarget
}
