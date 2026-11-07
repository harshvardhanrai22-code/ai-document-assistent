import { useState } from 'react'
import { User, Bot, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import SourceCards from './SourceCards'

export default function MessageBubble({ message }) {
  const [showSources, setShowSources] = useState(false)
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${ isUser ? 'justify-end' : 'justify-start' }`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mt-1">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${ isUser ? 'items-end' : 'items-start' } flex flex-col gap-1`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-sm'
              : message.error
              ? 'bg-red-900/30 text-red-300 border border-red-800 rounded-bl-sm'
              : 'bg-gray-800 text-gray-100 rounded-bl-sm'
          }`}
        >
          {message.content || (
            message.streaming ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : ''
          )}
          {message.streaming && message.content && (
            <span className="inline-block w-0.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* Sources toggle */}
        {!isUser && !message.streaming && message.sources && message.sources.length > 0 && (
          <button
            onClick={() => setShowSources(s => !s)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showSources ? 'Hide' : 'Show'} {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
          </button>
        )}

        {/* Sources panel */}
        {showSources && <SourceCards sources={message.sources} />}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center mt-1">
          <User size={14} className="text-gray-300" />
        </div>
      )}
    </div>
  )
}