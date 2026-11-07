import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import PDFUploader from './components/PDFUploader'

export default function App() {
  const [uploadedDocs, setUploadedDocs] = useState([])
  const [activeDoc, setActiveDoc] = useState(null)
  const [messages, setMessages] = useState([])
  const [showUploader, setShowUploader] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(true)

  // Load pre-existing indexed documents on startup
  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => {
        if (data.documents && data.documents.length > 0) {
          setUploadedDocs(data.documents)
          setActiveDoc(data.documents[0])
        } else {
          setShowUploader(true)
        }
      })
      .catch(() => setShowUploader(true))
      .finally(() => setLoadingDocs(false))
  }, [])

  const handleUploadSuccess = (doc) => {
    setUploadedDocs(prev => {
      const exists = prev.find(d => d.collection_name === doc.collection_name)
      return exists ? prev : [...prev, doc]
    })
    setActiveDoc(doc)
    setShowUploader(false)
    setMessages([])
  }

  const handleDocSwitch = (doc) => {
    setActiveDoc(doc)
    setMessages([])
  }

  if (loadingDocs) {
    return (
      <div className="flex h-screen bg-gray-950 items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Loading indexed documents...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar
        docs={uploadedDocs}
        activeDoc={activeDoc}
        onDocSelect={handleDocSwitch}
        onUploadClick={() => setShowUploader(true)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        {showUploader || !activeDoc ? (
          <PDFUploader
            onUploadSuccess={handleUploadSuccess}
            hasExistingDocs={uploadedDocs.length > 0}
            onBack={uploadedDocs.length > 0 ? () => setShowUploader(false) : null}
          />
        ) : (
          <ChatWindow
            activeDoc={activeDoc}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </main>
    </div>
  )
}