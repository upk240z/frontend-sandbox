import * as Util from "./util"
import axios from 'axios'
import Config  from './config'

window.addEventListener('load', async () => {
  Util.initPage()

  const chooseBlock = document.getElementById('choose-block')! as HTMLDivElement
  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const canvas = document.getElementById('shot-canvas') as HTMLCanvasElement
  const resultBox = document.getElementById('result-box') as HTMLDivElement
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
    Util.clearMessage()
    stopCamera()

    const facing = document.getElementById('facing') as HTMLSelectElement
    if (!facing.value) {
      return
    }

    chooseBlock.style.display = 'none'
    resultBox.style.display = 'none'
    Util.loading(true,'Starting ...')
    setTimeout(() => {
      Util.loading(false)
    }, 1500)

    previewBox.style.display = 'block'

    try {
      stream = await Util.initCamera({facing: facing.value})
      preview.srcObject = stream
      preview.play().catch(e => console.error(e))
      onResize()
    } catch (e) {
      console.log('@@@ play error')
      console.error(e)
      Util.loading(false)
    }
  })

  const setResultText = (name: string, value: string | undefined): void => {
    const input = resultBox.querySelector(`input[name=${name}]`) as HTMLInputElement
    input.value =  value ? value : ''
  }

  document.getElementById('shot-btn')!.addEventListener('click', async () => {
    Util.clearMessage()
    canvas.width = preview.width
    canvas.height = preview.height

    const context = canvas.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }

    Util.loading(true, 'Scanning image ...')

    previewBox.style.display = 'none'
    context.drawImage(preview, 0, 0, canvas.width, canvas.height)
    stopCamera()

    canvas.toBlob(async blob => {
      const postUrl = Config.get('api-base') + 'qr-img'

      let result = null

      try {
        const res = await axios.post(postUrl, blob, {
          headers: {'Content-Type': 'image/jpeg'},
          withCredentials: true,
        })
        result = res.data
      } catch (e: any) {
        Util.showMessage(e, Util.MESSAGE_CLASSES['error'])
        chooseBlock.style.display = 'block'
        Util.loading(false)
        return
      }

      Util.showMessage(result.message, Util.MESSAGE_CLASSES[result.result])

      if (result.result == 'error' || result['info'] == undefined) {
        chooseBlock.style.display = 'block'
        Util.loading(false)
        return
      }

      const info: any = result['info']
      setResultText('kata', info['kata'])
      setResultText('rui', info['rui'])
      setResultText('fin_date', info['inspection-fin-date'])
      setResultText('first_month', info['first-month'])
      const plate = info['plate']
      if (plate) {
        setResultText(
          'plate',
          plate['area'] + ' ' +
          plate['class'] + ' ' +
          plate['hira'] + ' ' +
          plate['number']
        )
      } else {
        setResultText('plate', '')
      }

      resultImg.setAttribute('src', canvas.toDataURL())
      resultBox.style.display = 'block'
      chooseBlock.style.display = 'block'
      Util.loading(false)
    }, 'image/jpeg', 1.0)
  })

  document.getElementById('cancel-btn')!.addEventListener('click', async () => {
    Util.clearMessage()
    previewBox.style.display = 'none'
    chooseBlock.style.display = 'block'
  })
})
