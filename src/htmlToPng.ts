import * as htmlToImage from 'html-to-image'
import saveAs from 'file-saver'

export const saveToFile =
  (fileName: string) =>
    (data: string) =>
      saveAs(data, fileName)

export const domToBlob =
  (node: HTMLElement) =>
    htmlToImage
      .toPng(node)

export const downloadImage =
  (node: HTMLElement, fileName: string) =>
    domToBlob(node)
      .then(saveToFile(fileName))