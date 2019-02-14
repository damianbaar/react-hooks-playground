import React from 'react'
import { List, Card } from 'antd'
import { DragSourceMonitor, DragSource, DragSourceConnector } from 'react-dnd'

import { logos } from './Logos'
import { IDraggableItem, LOGO } from './DraggableItemType'
import { IEditorContext, EditorContext, mkAddLogoAction } from '../Actions'

export interface IAddLogoPayload {
  item: string
}

type IDraggableLogo = IAddLogoPayload & IEditorContext

const draggingSource = {
  beginDrag(props: IDraggableLogo) {
    return {
      item: props.item,
    }
  },

  endDrag({ dispatch, item }: IDraggableLogo, monitor: DragSourceMonitor) {
    const dropResult = monitor.getDropResult()
    if (dropResult) {
      dispatch(mkAddLogoAction({ item }))
    }
  },
}

const BaseLogo =
  ({ item }: { item: any }) =>
    <img
      style={{
        width: "100%",
        height: "100%",
      }}
      src={item}
    />

export const DragEnabledLogo =
  ({ connectDragSource, ...rest }: IDraggableItem & { item: string }) => {
    return connectDragSource(
      <div>
        <BaseLogo {...rest} />
      </div>
    )
  }

const asDraggableTarget = DragSource(
  LOGO,
  draggingSource,
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)

const Logo = asDraggableTarget(DragEnabledLogo)

const renderItem = (item: string) => (
  <List.Item>
    <Card
      hoverable={true}
      bodyStyle={{
        width: "100%",
        height: "100%",
        padding: 0
      }}
    >
      <EditorContext.Consumer>{
        context =>
          <Logo
            item={item}
            {...context}
          />
      }</EditorContext.Consumer>
    </Card>
  </List.Item>
)

export function AddLogo() {
  return <div>
    <h2>Add logo</h2>
    <List
      grid={{ column: 3, gap: 0 }}
      dataSource={logos}
      renderItem={renderItem}
    />
  </div>
}