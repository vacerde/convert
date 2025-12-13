// File conversion utilities

export function getConversionOptions(file: File): string[] {
  const fileType = file.type || ""
  const fileName = file.name.toLowerCase()

  // Image conversions
  if (fileType.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(fileName)) {
    return ["png", "jpg", "webp", "gif", "bmp", "ico"]
  }

  // Document conversions
  if (fileType.includes("text") || fileType.includes("json") || /\.(txt|md|csv|json|html|xml)$/i.test(fileName)) {
    return ["txt", "md", "html", "json", "csv"]
  }

  // Audio conversions
  if (fileType.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac)$/i.test(fileName)) {
    return ["mp3", "wav", "ogg"]
  }

  // Video conversions
  if (fileType.startsWith("video/") || /\.(mp4|webm|avi|mov)$/i.test(fileName)) {
    return ["mp4", "webm"]
  }

  // PDF and documents
  if (fileType.includes("pdf") || /\.pdf$/i.test(fileName)) {
    return ["txt", "html"]
  }

  // Default options
  return ["txt", "json", "html"]
}

export async function convertFile(file: File, targetFormat: string): Promise<Blob> {
  const fileType = file.type || ""
  const fileName = file.name.toLowerCase()

  // Image conversions
  if (fileType.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(fileName)) {
    return convertImage(file, targetFormat)
  }

  // Text/Document conversions
  if (fileType.includes("text") || fileType.includes("json") || /\.(txt|md|csv|json|html|xml)$/i.test(fileName)) {
    return convertText(file, targetFormat)
  }

  // Audio conversions
  if (fileType.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac)$/i.test(fileName)) {
    return convertAudio(file, targetFormat)
  }

  // Video conversions (placeholder - browser APIs limited)
  if (fileType.startsWith("video/") || /\.(mp4|webm|avi|mov)$/i.test(fileName)) {
    return convertVideo(file, targetFormat)
  }

  // PDF conversions
  if (fileType.includes("pdf") || /\.pdf$/i.test(fileName)) {
    return convertPDF(file, targetFormat)
  }

  throw new Error("Unsupported file type")
}

async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw white background for formats that don't support transparency
      if (targetFormat === "jpg" || targetFormat === "jpeg") {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      const mimeType = getMimeType(targetFormat)
      const quality = targetFormat === "jpg" || targetFormat === "jpeg" ? 0.9 : undefined

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Conversion failed"))
          }
        },
        mimeType,
        quality,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.crossOrigin = "anonymous"
    img.src = URL.createObjectURL(file)
  })
}

async function convertText(file: File, targetFormat: string): Promise<Blob> {
  const text = await file.text()

  switch (targetFormat) {
    case "txt":
      return new Blob([text], { type: "text/plain" })

    case "md":
      return new Blob([text], { type: "text/markdown" })

    case "html": {
      // Convert text to HTML
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
  </style>
</head>
<body>
  <pre>${escapeHtml(text)}</pre>
</body>
</html>`
      return new Blob([html], { type: "text/html" })
    }

    case "json": {
      // Try to parse and prettify if already JSON, otherwise wrap as text
      try {
        const parsed = JSON.parse(text)
        const prettified = JSON.stringify(parsed, null, 2)
        return new Blob([prettified], { type: "application/json" })
      } catch {
        const wrapped = JSON.stringify({ content: text }, null, 2)
        return new Blob([wrapped], { type: "application/json" })
      }
    }

    case "csv": {
      // Simple conversion: split by lines
      const lines = text.split("\n").map((line) => `"${line.replace(/"/g, '""')}"`)
      return new Blob([lines.join("\n")], { type: "text/csv" })
    }

    default:
      return new Blob([text], { type: "text/plain" })
  }
}

async function convertAudio(file: File, targetFormat: string): Promise<Blob> {
  // Browser API limitations - we can decode but not re-encode to different formats easily
  // For a real implementation, you'd use Web Audio API or a WASM library like FFmpeg

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const arrayBuffer = await file.arrayBuffer()

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    // Create a WAV file from the audio buffer
    if (targetFormat === "wav") {
      const wavBlob = audioBufferToWav(audioBuffer)
      return wavBlob
    }

    // For MP3 and OGG, we'll need to use the original file or a more complex solution
    // For now, return the original with a note
    console.log("Audio conversion to", targetFormat, "is limited in browser")
    return new Blob([arrayBuffer], { type: `audio/${targetFormat}` })
  } catch (error) {
    console.error("Audio conversion error:", error)
    // Fallback: return original data with new mime type
    return new Blob([arrayBuffer], { type: `audio/${targetFormat}` })
  }
}

async function convertVideo(file: File, targetFormat: string): Promise<Blob> {
  // Video conversion in browser is extremely limited without WASM libraries
  // For a real implementation, you'd use FFmpeg.wasm
  const arrayBuffer = await file.arrayBuffer()

  console.log("Video conversion to", targetFormat, "is limited in browser")
  // Return with updated mime type - this won't actually convert the format
  return new Blob([arrayBuffer], { type: `video/${targetFormat}` })
}

async function convertPDF(file: File, targetFormat: string): Promise<Blob> {
  // PDF parsing requires a library like PDF.js
  // For now, provide a simple extraction
  const arrayBuffer = await file.arrayBuffer()
  const text = "PDF text extraction requires additional libraries. File preserved as binary."

  if (targetFormat === "txt") {
    return new Blob([text], { type: "text/plain" })
  } else if (targetFormat === "html") {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PDF Conversion</title>
</head>
<body>
  <p>${text}</p>
</body>
</html>`
    return new Blob([html], { type: "text/html" })
  }

  return new Blob([arrayBuffer], { type: "application/pdf" })
}

// Helper functions

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
    ico: "image/x-icon",
  }
  return mimeTypes[format] || "application/octet-stream"
}

function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numberOfChannels * bytesPerSample

  const data = []
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i]
      const int16 = Math.max(-1, Math.min(1, sample)) * 0x7fff
      data.push(int16 & 0xff)
      data.push((int16 >> 8) & 0xff)
    }
  }

  const dataSize = data.length
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  // WAV header
  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true) // Subchunk1Size
  view.setUint16(20, format, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  // Write data
  for (let i = 0; i < data.length; i++) {
    view.setUint8(44 + i, data[i])
  }

  return new Blob([buffer], { type: "audio/wav" })
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
