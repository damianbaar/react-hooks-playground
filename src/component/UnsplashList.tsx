import React, { useMemo, useState, createContext, Dispatch, SetStateAction, useCallback } from 'react'
import { Input, List, Button, Card } from 'antd'
import { range } from 'ramda'
import { usePromise } from 'react-hook-utils'
import { useDebounce } from 'use-debounce'
import pReduce from 'p-reduce'

interface IBackgroundItem {
  url: string
}

export type IBackgroundPayload = string

const BackgroundSelectCtx =
  createContext
    <{ selectedItem: string, setSelectedItem: Dispatch<SetStateAction<string>> }>({
      selectedItem: '',
      setSelectedItem: () => void 0,
    })

const renderItem = (item: IBackgroundItem) => (
  <BackgroundSelectCtx.Consumer>{(value) =>
    <List.Item
      onClick={() => value.setSelectedItem(item.url)}
    >
      <Card
        hoverable={true}
        style={{
          width: "100%",
          height: "200px",
          overflow: "hidden",
          border: item.url === value.selectedItem ? '2px solid #000' : ''
        }}
        cover={
          <img
            style={{ width: "100%", maxWidth: "100%" }}
            src={item.url}
          />
        }
      /></List.Item>
  }</BackgroundSelectCtx.Consumer>
)

interface IProps {
  onBackgroundSelect: (val: IBackgroundPayload) => void
  selectedBackground: string
}

export function UnsplashList({ onBackgroundSelect }: Partial<IProps>) {
  const [phrase, setPhrase] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const debouncedPhrase = useDebounce(phrase, 1000)
  const updateSelectedBackground = useCallback(
    (e) => {
      setSelectedItem(e)
      if (onBackgroundSelect) { onBackgroundSelect(e) }
    },
    [selectedItem]
  )
  const [data, error, loading] =
    usePromise(
      useMemo(() =>
        fetchMovies(debouncedPhrase), [debouncedPhrase]))

  return <div style={{ minHeight: '200px' }}>
    <h1>Select background</h1>
    <h1>{error ? error.toString() : ''}</h1>
    <Input
      placeholder="Search phrase on unsplash"
      disabled={loading}
      onChange={(e) => setPhrase(e.target.value)}
    />
    <BackgroundSelectCtx.Provider
      value={{ selectedItem, setSelectedItem: updateSelectedBackground }}>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={data || []}
        renderItem={renderItem}
      />
    </BackgroundSelectCtx.Provider>
    <Button
      disabled={!selectedItem}
      onClick={() => updateSelectedBackground('')}
    >
      Delete background
    </Button>
  </div>
}

const unsplashAPI = 'https://source.unsplash.com/random/'
const cacheTrick = (phrase: string, idx: number) =>
  phrase
    ? `${phrase},${idx}`
    : idx

const prepareURL = (phrase: string, idx: number) =>
  `${unsplashAPI}${cacheTrick(phrase, idx)}`

// INFO 
// better would be to go with API and reuse https://github.com/unsplash/unsplash-js 
// instead of such hacky solutions

const fetchMovies =
  (phrase: string): Promise<IBackgroundItem[]> => {
    const urls =
      range(1, 5)
        .map((_, idx) => prepareURL(phrase, idx))

    return pReduce(urls, (imageURLs, url) =>
      fetch(url, { cache: "no-store" }).then(res => [...imageURLs, res.url])
      , []).then(result =>
        result.map(url => ({ url })))
  }