import * as Util from "./util"
import axios from 'axios'

window.addEventListener('load', async () => {
  Util.initPage()

  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const canvasBox = canvas.closest('div.card') as HTMLDivElement
  const jsonText = document.getElementById('json-text') as HTMLPreElement
  const jsonBox = jsonText.closest('div.card') as HTMLDivElement
  let stream: MediaStream | null = null

  const stopCamera = (): void => {
    if (!stream) { return }
    stream.getTracks().forEach(track => track.stop())
  }

  const onResize = (): void => {
    document.getElementById('w-text')!.textContent = preview.clientWidth.toString()
    document.getElementById('h-text')!.textContent = preview.clientHeight.toString()
  }

  window.addEventListener('resize', onResize)

  document.getElementById('start-btn')!.addEventListener('click', async () => {
    canvasBox.style.display = 'none'
    jsonBox.style.display = 'none'
    stopCamera()

    const facing = document.getElementById('facing') as HTMLSelectElement
    if (!facing.value) {
      return
    }

    previewBox.style.display = 'block'

    try {
      stream = await Util.initCamera(facing.value)
      preview.srcObject = stream
      preview.play().catch(e => console.error(e))
      onResize()
    } catch (e) {
      console.log('@@@ play error')
      console.error(e)
    }
  })

  document.getElementById('shot-btn')!.addEventListener('click', async () => {
    canvas.width = preview.clientWidth
    canvas.height = preview.clientHeight

    const context = canvas.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }

    previewBox.style.display = 'none'
    context.drawImage(preview, 0, 0, canvas.width, canvas.height)
    stopCamera()
    canvasBox.style.display = 'block'

    const dataURL = canvas.toDataURL()
    const matches = /data:(.+?);base64,(.+)$/.exec(dataURL)
    if (!matches || matches.length < 2) {
      console.log('DataURL error')
      console.log(dataURL)
      return
    }

    const postUrl = 'https://api.usappy.com/qrcode'
    // const postUrl = 'http://localhost:3777/qrcode'
    const postParams = {
      'type': matches[1],
      'base64': matches[2]
    }
    console.log('send to ' + postUrl)
    console.log(postParams['type'])

    const res = await axios.post(postUrl, postParams, {
      withCredentials: true,
    })

    jsonText.textContent = JSON.stringify(res.data, null, 2)
    jsonBox.style.display = 'block'
  })
})
