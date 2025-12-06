'use client';

import { Image as ImageIcon, Video, Calendar, FileText, Send } from 'lucide-react';

export default function PostCreator() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-600/50">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50">
          ME
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Share your thoughts..."
            className="w-full px-5 py-4 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 focus:border-transparent mb-4 transition-all text-base bg-white/50 dark:bg-gray-700/50 backdrop-blur-md hover:bg-white/70 dark:hover:bg-gray-700/70 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white"
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2.5 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
                <ImageIcon className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold">Photo</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2.5 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
                <Video className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold">Video</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2.5 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
                <Calendar className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold">Event</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all group px-4 py-2.5 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
                <FileText className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold">Article</span>
              </button>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-bold">
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

