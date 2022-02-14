import * as ZXingBrowser from '@zxing/browser'
import * as Util from './util'

window.addEventListener('load', async () => {
  Util.initPage()

  const reader = new ZXingBrowser.BrowserQRCodeReader()
  const deviceSelect = document.getElementById('device-id')! as HTMLSelectElement
  const preview = document.getElementById('preview')! as HTMLVideoElement
  const previewBox = preview.closest('div.card') as HTMLDivElement
  const resultBox = document.getElementById('result-box')! as HTMLDivElement

  const writer = new ZXingBrowser.BrowserQRCodeSvgWriter()
  const svg = writer.write(window.location.href, 300, 300)
  document.getElementById('qr-svg')!.appendChild(svg)
  document.getElementById('url-text')!.textContent = window.location.href

  const stream = await Util.initCamera()

  deviceSelect.innerText = ''
  const videoInputDevices = await ZXingBrowser.BrowserCodeReader.listVideoInputDevices()

  let cameraFound = false;
  videoInputDevices.forEach(device => {
    if (!device.deviceId) { return }
    const option = document.createElement('option')
    option.setAttribute('value', device.deviceId)
    option.textContent = device.label
    deviceSelect.appendChild(option)
    cameraFound = true
  })

  if (cameraFound) {
    // Util.showMessage('Detected Camera devices')
  } else {
    Util.showMessage('No camera found', 'alert-error')
    return
  }

  let controls: ZXingBrowser.IScannerControls | null = null

  document.getElementById('scan-btn')!.addEventListener('click', async () => {
    if (controls !== null) { controls.stop() }

    if (deviceSelect.value.length == 0) {
      return
    }

    resultBox.style.display = 'none'
    previewBox.style.display = 'block'

    const deviceId = deviceSelect.value
    controls = await reader.decodeFromVideoDevice(
      deviceId,
      preview,
      (result, error, controls) => {
        if (error) { return }

        Util.showMessage('Detected QRCode')
        document.getElementById('json-text')!.textContent = JSON.stringify(result, null, 2)
        previewBox.style.display = 'none'
        resultBox.style.display = 'block'

        controls.stop()
      }
    )
  })
})
