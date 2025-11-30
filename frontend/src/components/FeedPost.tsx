'use client';

import { ThumbsUp, MessageCircle, Send, Bookmark, Mic, Smile, MoreVertical } from 'lucide-react';

interface FeedPostProps {
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  title: string;
  content?: React.ReactNode;
  likes: number;
  comments: number;
}

export default function FeedPost({ author, title, content, likes, comments }: FeedPostProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{author.name}</h3>
            <p className="text-xs text-gray-500">{author.title}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Post Title */}
      <h2 className="font-semibold text-lg mb-3">{title}</h2>

      {/* Post Content */}
      {content && <div className="mb-4">{content}</div>}

      {/* Post Actions */}
      <div className="flex items-center gap-6 mb-3 pb-3 border-b border-gray-200">
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm">+{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
          <Send className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors ml-auto">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          ME
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder="Write a comment"
            className="flex-1 outline-none text-sm"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <Mic className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Smile className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

