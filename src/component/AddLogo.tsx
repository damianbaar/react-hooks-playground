import React from 'react'
import { List } from 'antd'

const renderItem = (item: { url: string }) => (
  <List.Item style={{ width: "200px" }}>
    <img
      style={{ width: "100%", height: "100px" }}
      src={item.url}
    />
  </List.Item>
)

export function AddLogo() {
  return <div>
    <h1>Add background</h1>
    <List
      bordered={true}
      itemLayout="horizontal"
      dataSource={[]}
      renderItem={renderItem}
    />
  </div>
}