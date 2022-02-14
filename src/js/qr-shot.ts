import * as Util from "./util";

window.addEventListener('load', async () => {
  Util.initPage()

  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const canvasBox = canvas.closest('div.card') as HTMLDivElement

  document.getElementById('start-btn')!.addEventListener('click', async () => {
    canvasBox.style.display = 'none'

    const facing = document.getElementById('facing') as HTMLSelectElement
    console.log(facing.value)
    if (!facing.value) {
      return
    }

    if (preview.srcObject) {
      preview.pause()
      preview.currentTime = 0
      preview.srcObject = null
    }

    previewBox.style.display = 'block'

    try {
      const stream = await Util.initCamera(facing.value)
      preview.srcObject = stream
      preview.play().catch(e => console.error(e))
    } catch (e) {
      console.log('@@@ play error')
      console.error(e)
    }
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
