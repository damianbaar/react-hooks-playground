import React from 'react'
import { List, Card } from 'antd'
import { logos } from './Logos'

const renderItem = (item: any) => (
  <List.Item>
    <Card
      hoverable={true}
      bodyStyle={{
        width: "100%",
        height: "100%",
        padding: 0
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%"
        }}
        src={item}
      />
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