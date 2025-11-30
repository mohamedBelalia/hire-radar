'use client';

import { Pencil, Image as ImageIcon, Video, Calendar, FileText, Send } from 'lucide-react';

export default function PostCreator() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          ME
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Write something..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Video className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Event</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Article</span>
              </button>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

