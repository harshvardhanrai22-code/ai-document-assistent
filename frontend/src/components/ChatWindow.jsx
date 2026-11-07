import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { Send, Loader2 } from 'lucide-react'

export default function ChatWindow({ activeDoc, messages, setMessages }) {
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || isStreaming) return

    setInput('')
    setIsStreaming(true)

    // Add user message
    const userMsg = { role: 'user', content: question, id: Date.now() }
    // Add placeholder AI message
    const aiMsgId = Date.now() + 1
    const aiMsg = { role: 'assistant', content: '', sources: [], id: aiMsgId, streaming: true }
    setMessages(prev => [...prev, userMsg, aiMsg])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          collection_name: activeDoc.collection_name
        })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'sources') {
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, sources: data.sources } : m
              ))
            } else if (data.type === 'content') {
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: m.content + data.content } : m
              ))
            } else if (data.type === 'done') {
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, streaming: false } : m
              ))
            } else if (data.type === 'error') {
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: `Error: ${data.message}`, streaming: false, error: true } : m
              ))
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId ? { ...m, content: `Network error: ${err.message}`, streaming: false, error: true } : m
      ))
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-900">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <span className="text-sm text-gray-300 font-medium truncate">{activeDoc.filename}</span>
        {activeDoc.num_chunks && (
          <span className="ml-auto text-xs text-gray-500">{activeDoc.num_chunks} chunks indexed</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 text-sm">Ask anything about <span className="text-gray-300 font-medium">{activeDoc.filename}</span></p>
            <p className="text-gray-600 text-xs mt-1">Press Enter to send</p>
          </div>
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900">
        <div className="flex items-end gap-2 bg-gray-800 rounded-xl px-3 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent resize-none text-sm text-gray-100 placeholder-gray-500 outline-none py-1 max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white transition-colors"
          >
            {isStreaming
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1 text-center">Shift+Enter for newline • Enter to send</p>
      </div>
    </div>
  )
}