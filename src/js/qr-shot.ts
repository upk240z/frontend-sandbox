import * as Util from "./util"
import axios from 'axios'

window.addEventListener('load', async () => {
  Util.initPage()

  const chooseBlock = document.getElementById('choose-block')! as HTMLDivElement
  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const resultText = document.getElementById('result-text') as HTMLPreElement
  const resultBox = resultText.closest('div.card') as HTMLDivElement
  const resultImg = document.getElementById('result-img') as HTMLImageElement
  let stream: MediaStream | null = null

  const stopCamera = (): void => {
    if (!stream) { return }
    stream.getTracks().forEach(track => track.stop())
  }

  const onResize = (): void => {
    document.getElementById('w-text')!.textContent = preview.width.toString()
    document.getElementById('h-text')!.textContent = preview.height.toString()
  }

  window.addEventListener('resize', onResize)

  document.getElementById('start-btn')!.addEventListener('click', async () => {
    chooseBlock.style.display = 'none'
    resultBox.style.display = 'none'
    stopCamera()

    const facing = document.getElementById('facing') as HTMLSelectElement
    if (!facing.value) {
      return
    }

    previewBox.style.display = 'block'

    try {
      stream = await Util.initCamera({facing: facing.value})
      preview.srcObject = stream
      preview.play().catch(e => console.error(e))
      onResize()
    } catch (e) {
      console.log('@@@ play error')
      console.error(e)
    }
  })

  document.getElementById('shot-btn')!.addEventListener('click', async () => {
    canvas.width = preview.width
    canvas.height = preview.height

    const context = canvas.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }

    previewBox.style.display = 'none'
    context.drawImage(preview, 0, 0, canvas.width, canvas.height)
    stopCamera()

    canvas.toBlob(async blob => {
      const postUrl = 'https://api.usappy.com/qr-img'
      // const postUrl = 'http://localhost:3777/qr-img'
      console.log('send to ' + postUrl)
      const res = await axios.post(postUrl, blob, {
        headers: {'Content-Type': 'image/jpeg'},
        withCredentials: true,
      })

      resultText.textContent = JSON.stringify(res.data, null, 2)
      resultImg.setAttribute('src', canvas.toDataURL())
      resultBox.style.display = 'block'
      chooseBlock.style.display = 'block'
    }, 'image/jpeg', 0.8)
  })
})
