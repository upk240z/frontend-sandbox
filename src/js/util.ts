import * as ZXingBrowser from '@zxing/browser'

export const initPage = (): void => {
  const drawer = document.getElementById('drawer')! as HTMLElement
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

  const toggleDrawer = () => {
    if (drawerCheckbox.checked) {
      drawer.classList.add('z-10')
    } else {
      drawer.classList.remove('z-10')
    }
  }

  document.getElementById('drawer-btn')!.addEventListener('click', () => {
    drawerCheckbox.checked = !drawerCheckbox.checked
    toggleDrawer()
  })
  drawerCheckbox.addEventListener('change', toggleDrawer)
}

export type CameraParams = {
  facing: string,
  width?: number,
  height?: number,
}

export const initCamera = (params: CameraParams = {
  facing: 'user',
  width: undefined,
  height: undefined
}): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: {
          exact: params.facing ? params.facing : 'user'
        },
        width: params.width ? params.width : 1200,
        height: params.height ? params.height : 1200,
      }
    }).then(stream => {
      resolve(stream)
    }).catch(err => {
      reject(err)
    })
  })
}

export const MESSAGE_CLASSES: {[index: string]: string} = {
  success: 'alert-success',
  info: 'alert-info',
  error: 'alert-error',
  warning: 'alert-warning',
}

export const showMessage = (text: string, className: string = MESSAGE_CLASSES.info): void => {
  const box = document.getElementById('message-box') as HTMLDivElement
  Object.values(MESSAGE_CLASSES).forEach((cls: string) => {
    box.classList.remove(cls)
  })
  box.classList.add(className)
  if (!box) { return }
  Array.from(box.getElementsByTagName('label')).forEach(el => {
    el.textContent = text
  })
  box.style.display = 'flex'
}

export const clearMessage = (): void => {
  const box = document.getElementById('message-box') as HTMLDivElement
  box.style.display = 'none'
}

export const loading = (visible: boolean = true, msg: string = '') => {
  const element = document.getElementById('loading') as HTMLDivElement
  element.textContent = msg
  element.style.display = visible ? 'block' : 'none'
}
