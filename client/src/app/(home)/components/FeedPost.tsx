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
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-600/50">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-lg flex-shrink-0 ring-2 ring-white/50 dark:ring-gray-700/50">
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">{author.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{author.title}</p>
          </div>
        </div>
        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-xl hover:bg-gray-500/10 dark:hover:bg-gray-500/20 transition-all" aria-label="More options">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Post Title */}
      <h2 className="font-bold text-xl mb-5 text-gray-900 dark:text-white leading-tight">{title}</h2>

      {/* Post Content */}
      {content && <div className="mb-6">{content}</div>}

      {/* Post Actions */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200/50 dark:border-gray-700/50">
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
          <ThumbsUp className="w-5 h-5 group-hover:scale-125 transition-transform" />
          <span className="text-sm font-bold">{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
          <MessageCircle className="w-5 h-5 group-hover:scale-125 transition-transform" />
          <span className="text-sm font-bold">{comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20" aria-label="Share">
          <Send className="w-5 h-5 group-hover:scale-125 transition-transform" />
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all ml-auto group px-4 py-2 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20" aria-label="Bookmark">
          <Bookmark className="w-5 h-5 group-hover:scale-125 transition-transform" />
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50">
          ME
        </div>
        <div className="flex-1 flex items-center gap-2 px-5 py-3 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/50 dark:focus-within:ring-purple-400/50 focus-within:border-transparent transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-md hover:bg-white/70 dark:hover:bg-gray-700/70">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 outline-none text-base bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white"
          />
          <button className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-all" aria-label="Voice input">
            <Mic className="w-5 h-5" />
          </button>
          <button className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-all" aria-label="Add emoji">
            <Smile className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

