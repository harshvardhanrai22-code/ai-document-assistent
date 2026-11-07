import { BookOpen } from 'lucide-react'

export default function SourceCards({ sources }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg">
      {sources.map((src, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs"
        >
          <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
            <BookOpen size={11} />
            <span className="font-medium text-gray-300">Page {src.page}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-600 truncate">{src.source?.split(/[\\/]/).pop()}</span>
          </div>
          <p className="text-gray-400 leading-relaxed line-clamp-3">{src.content}</p>
        </div>
      ))}
    </div>
  )
}