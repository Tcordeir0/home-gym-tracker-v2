/** Redimensiona uma foto mantendo a proporção (não corta), até `max` no maior lado.
 *  Retorna um data URL JPEG. */
export function resizePhoto(file: File, max = 640, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let w = img.width
        let h = img.height
        if (w >= h && w > max) {
          h = Math.round((h * max) / w)
          w = max
        } else if (h > w && h > max) {
          w = Math.round((w * max) / h)
          h = max
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('canvas'))
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('imagem inválida'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('leitura falhou'))
    reader.readAsDataURL(file)
  })
}
