'use client';

import { Play, BarChart3, UserPlus, Bookmark, Gamepad2, Settings, Plus } from 'lucide-react';

export default function LeftSidebar() {
  const hashtags = ['work', 'business', 'hr', 'userinterface', 'digital', 'userexperience', 'ux', 'ui', 'freelance'];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* User Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              ME
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Mouad EL.</h3>
              <p className="text-xs text-gray-500">UI/UX Designer</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Profile completion</span>
              <span className="text-gray-600">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <button className="w-full py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            + Add another account
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 mb-6">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Play className="w-5 h-5" />
            <span>Learning</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span>Insights</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <UserPlus className="w-5 h-5" />
            <span>Find colleagues</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bookmark className="w-5 h-5" />
            <span>Bookmarks</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Gamepad2 className="w-5 h-5" />
            <span>Gaming</span>
            <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        {/* Followed Hashtags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Followed Hashtags</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <a
                key={tag}
                href="#"
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

