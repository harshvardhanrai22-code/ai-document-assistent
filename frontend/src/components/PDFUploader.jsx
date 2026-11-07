import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function PDFUploader({ onUploadSuccess, hasExistingDocs, onBack }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) {
      setUploadStatus('error')
      setStatusMessage('Please upload a valid PDF file.')
      return
    }

    setIsUploading(true)
    setUploadStatus(null)
    setStatusMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || 'Upload failed')

      setUploadStatus('success')
      setStatusMessage(`"${data.filename}" indexed successfully (${data.num_chunks} chunks).`)
      setTimeout(() => onUploadSuccess(data), 1200)
    } catch (err) {
      setUploadStatus('error')
      setStatusMessage(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-950">
      {hasExistingDocs && onBack && (
        <button
          onClick={onBack}
          className="self-start mb-6 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to chat
        </button>
      )}

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-1">Upload a PDF</h1>
        <p className="text-gray-400 text-sm mb-6">The document will be indexed and made available for Q&amp;A.</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-500 bg-gray-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={36} className="text-blue-400 animate-spin" />
              <p className="text-gray-300 text-sm">Indexing document... this may take a moment.</p>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={36} className="text-green-400" />
              <p className="text-green-300 text-sm">{statusMessage}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-gray-800 rounded-full">
                {isDragging ? <Upload size={28} className="text-blue-400" /> : <FileText size={28} className="text-gray-400" />}
              </div>
              <div>
                <p className="text-gray-200 text-sm font-medium">Drag &amp; drop or click to select</p>
                <p className="text-gray-500 text-xs mt-1">PDF files only</p>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {uploadStatus === 'error' && (
          <p className="mt-3 text-red-400 text-sm text-center">{statusMessage}</p>
        )}
      </div>
    </div>
  )
}