import * as Util from "./util";

window.addEventListener('load', async () => {
  Util.initPage()

  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const canvasBox = canvas.closest('div.card') as HTMLDivElement
  let stream: MediaStream | null = null

  const stopCamera = (): void => {
    if (!stream) { return }
    stream.getTracks().forEach(track => track.stop())
  }

  document.getElementById('start-btn')!.addEventListener('click', async () => {
    canvasBox.style.display = 'none'
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
    stopCamera()
    canvasBox.style.display = 'block'
  })
})
