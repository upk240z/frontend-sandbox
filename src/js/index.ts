import * as ZXingBrowser from '@zxing/browser'

const initCamera = (): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: {
          exact: 'environment'
        }
      }
    }).then(stream => {
      resolve(stream)
    })
  })
}

const showMessage = (text: string, className: string = 'alert-info'): void => {
  const box = document.getElementById('message-box') as HTMLDivElement
  box.classList.remove('alert-error')
  box.classList.remove('alert-info')
  box.classList.add(className)
  if (!box) { return }
  Array.from(box.getElementsByTagName('label')).forEach(el => {
    el.textContent = text
  })
  box.style.display = 'flex'
}

window.addEventListener('load', async () => {
  const reader = new ZXingBrowser.BrowserQRCodeReader()
  const deviceSelect = document.getElementById('device-id')! as HTMLSelectElement
  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const resultBox = document.getElementById('result-box')! as HTMLDivElement

  document.getElementById('open-qr-btn')!.addEventListener('click', () => {
    document.getElementById('qr-modal')!.classList.add('modal-open')
  })

  document.getElementById('close-qr-modal-btn')!.addEventListener('click', (evt) => {
    evt.preventDefault()
    document.getElementById('qr-modal')!.classList.remove('modal-open')
  })

  const writer = new ZXingBrowser.BrowserQRCodeSvgWriter()
  const svg = writer.write(window.location.href, 300, 300)
  document.getElementById('qr-svg')!.appendChild(svg)
  document.getElementById('url-text')!.textContent = window.location.href

  const stream = await initCamera()

  deviceSelect.innerText = ''
  const videoInputDevices = await ZXingBrowser.BrowserCodeReader.listVideoInputDevices()

  videoInputDevices.forEach(device => {
    if (!device.deviceId) { return }
    const option = document.createElement('option')
    option.setAttribute('value', device.deviceId)
    option.textContent = device.label
    deviceSelect.appendChild(option)
  })

  showMessage('Detected Camera devices')

  document.getElementById('scan-btn')!.addEventListener('click', () => {
    if (deviceSelect.value.length == 0) { return }

    resultBox.style.display = 'none'
    previewBox.style.display = 'block'

    const deviceId = deviceSelect.value
    reader.decodeFromVideoDevice(
      deviceId,
      preview,
      (result, error, controls) => {
        if (error) { return }

        showMessage('Detected QRCode')
        document.getElementById('json-text')!.textContent = JSON.stringify(result, null, 2)
        previewBox.style.display = 'none'
        resultBox.style.display = 'block'

        controls.stop()
      }
    )
  })
})
