import * as Util from "./util";

window.addEventListener('load', async () => {
  Util.initPage()

  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement

  document.getElementById('facing')!.addEventListener('change', async (evt) => {
    const facing = evt.target as HTMLSelectElement
    if (!facing.value) {
      return
    }

    const stream = await Util.initCamera(facing.value)
    preview.srcObject = stream
    preview.play().catch(e => console.error(e))

    previewBox.style.display = 'block'
  })
})
