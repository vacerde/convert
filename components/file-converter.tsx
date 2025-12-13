"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ArrowRight, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { convertFile, getConversionOptions, formatFileSize } from "@/lib/file-converter"
import Link from "next/link"

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [converting, setConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setConvertedFile(null)
    setOutputFormat("")
  }

  const handleConvert = async () => {
    if (!file || !outputFormat) return

    setConverting(true)
    try {
      const result = await convertFile(file, outputFormat)
      setConvertedFile(result)
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Conversion failed. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedFile || !file) return

    const url = URL.createObjectURL(convertedFile)
    const a = document.createElement("a")
    a.href = url
    const originalName = file.name.split(".")[0]
    a.download = `${originalName}.${outputFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const conversionOptions = file ? getConversionOptions(file) : []

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 808 800">
              <path
                fill="#000000"
                d="M591 124h42l49 1 5 10 1 3v7l-22 57-19 49-18 46-19 49-13 33-16 41-1 4 5 2 36 17 33 15 17 8 9 4-1 6-2 3-6-1-35-16-36-16-33-15-26-11-40-17-14-6-4-1-2 10 8 2 81 36 1 3-9 21-6 15h-4l-33-15-41-19-30-14-6-3 1-5 17-47 16-44 23-63 16-44 11-30 9-24 8-23 7-18 5-6 5-3zM141 125h136l5 12 13 36 18 48 43 116 16 43 6 15 1 5-6-2-31-15-28-13-36-17-28-13-60-28-36-17-28-13-27-13-33-15-5-2v-1l17 1 110 11-3-9-12-30-17-42-13-32-2-14zM68 372l4 1 36 17 28 13 31 15 28 13 37 18 28 13 114 54 22 11 16 9 34 16h2l3-5-1-4-25-12-20-10-3-3-23-11-35-17-34-16-45-22-3-4-14-38-3-7 5 1 16 8 34 16 28 13 27 13 28 13 20 10 4 6 6 19v7h2l2-11 4-10 9 3 36 17 33 15 29 14 33 15 27 13 36 16 2 1v2l-8-1-40-12-49-13h-2l-15 39-7 18h-4l-19-9-72-36-16-9-23-12-33-16-56-28-19-9-50-25-1-4 6-12-25-12-31-15-28-13-43-21-20-9-6-3v-4zM286 520l38 18 16 8 52 25 21 12 53 26 26 12 8 4-3 10-12 29-10 26-1 1H361l-5-8-19-47-16-40-17-43-6-14-11-5-5-3 3-9z"
              />
            </svg>
            <span className="text-xl font-semibold">Converter</span>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            Beta v0.1
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-background py-5 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Convert any file.
            <br />
            <span className="italic">Instantly.</span>
          </h1>
        </div>
      </section>

      {/* Converter Section */}
      <section className="flex-1 py-12 md:pt-12 md:pb-36">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-border bg-card p-6 md:p-8">
            {/* Upload Area */}
            {!file ? (
              <div
                className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragActive
                    ? "border-foreground bg-muted"
                    : "border-border bg-muted/50 hover:border-foreground/50 hover:bg-muted"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">
                  {dragActive ? "Drop your file here" : "Choose a file or drag it here"}
                </p>
                <p className="text-sm text-muted-foreground">Supports images, documents, audio, video, and more</p>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type || "Unknown type"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setConvertedFile(null)
                      setOutputFormat("")
                    }}
                  >
                    Remove
                  </Button>
                </div>

                {/* Conversion Options */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium">Convert to</label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select output format" />
                      </SelectTrigger>
                      <SelectContent>
                        {conversionOptions.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleConvert}
                    disabled={!outputFormat || converting}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {converting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        Convert
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Converted File */}
                {convertedFile && (
                  <div className="rounded-lg border border-border bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Conversion complete!</p>
                        <p className="text-sm text-muted-foreground">
                          {file.name.split(".")[0]}.{outputFormat} • {formatFileSize(convertedFile.size)}
                        </p>
                      </div>
                      <Button onClick={handleDownload} size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Features Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Client-side processing means instant conversions without server delays
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                Files never leave your device. Everything happens in your browser
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Universal Support</h3>
              <p className="text-sm text-muted-foreground">
                Convert between images, documents, audio, video, and data formats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built by <Link href="https://vacer.de" target="_blank" className="hover:underline">Vacer.de</Link> using browser APIs</p>
        </div>
      </footer>
    </div>
  )
}
