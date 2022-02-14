import * as Util from "./util";

window.addEventListener('load', async () => {
  Util.initPage()

  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const canvasBox = canvas.closest('div.card') as HTMLDivElement

  document.getElementById('start-btn')!.addEventListener('click', async () => {
    canvasBox.style.display = 'none'

    console.log('@@@ 001 @@@')

    const facing = document.getElementById('facing') as HTMLSelectElement
    console.log(facing)
    if (!facing.value) {
      return
    }

    console.log('@@@ 002 @@@')

    if (preview.srcObject) {
      console.log('@@@ 002-1 @@@')
      preview.pause()
      preview.currentTime = 0
      preview.srcObject = null
    }

    console.log('@@@ 003 @@@')

    previewBox.style.display = 'block'

    const stream = await Util.initCamera(facing.value)
    console.log('@@@ stream')
    console.log(stream)

    preview.srcObject = stream
    preview.play().catch(e => console.error(e))
  })

  document.getElementById('shot-btn')!.addEventListener('click', () => {
    canvas.width = preview.clientWidth
    canvas.height = preview.clientHeight

    const context = canvas.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }

    previewBox.style.display = 'none'
    context.drawImage(preview, 0, 0, canvas.width, canvas.height)
    canvasBox.style.display = 'block'
  })
})
