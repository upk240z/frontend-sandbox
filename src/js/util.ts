import * as ZXingBrowser from '@zxing/browser'

export const initPage = (): void => {
  const drawer = document.getElementById('drawer')! as HTMLElement
  drawer.style.display = 'none'
  const drawerCheckbox = document.getElementById('drawer-opened')! as HTMLInputElement

  const writer = new ZXingBrowser.BrowserQRCodeSvgWriter()
  const svg = writer.write(window.location.href, 300, 300)
  document.getElementById('qr-svg')!.appendChild(svg)
  document.getElementById('url-text')!.textContent = window.location.href

  document.getElementById('open-qr-btn')!.addEventListener('click', () => {
    document.getElementById('qr-modal')!.classList.add('modal-open')
  })

  document.getElementById('close-qr-modal-btn')!.addEventListener('click', (evt) => {
    evt.preventDefault()
    document.getElementById('qr-modal')!.classList.remove('modal-open')
  })

  document.getElementById('drawer-btn')!.addEventListener('click', () => {
    drawerCheckbox.checked = !drawerCheckbox.checked
    drawer.style.display = drawerCheckbox.checked ? 'grid' : 'none'
  })

  drawerCheckbox.addEventListener('change', () => {
    drawer.style.display = drawerCheckbox.checked ? 'grid' : 'none'
  })
}

export const initCamera = (facing: string = 'environment'): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: {
          exact: facing
        }
      }
    }).then(stream => {
      resolve(stream)
    })
  })
}

export const showMessage = (text: string, className: string = 'alert-info'): void => {
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
