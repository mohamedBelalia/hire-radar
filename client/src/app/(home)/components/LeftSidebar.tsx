'use client';

import { Play, BarChart3, UserPlus, Bookmark, Gamepad2, Settings, Plus } from 'lucide-react';

export default function LeftSidebar() {
  const hashtags = ['work', 'business', 'hr', 'userinterface', 'digital', 'userexperience', 'ux', 'ui', 'freelance'];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 overflow-y-auto">
      <div className="p-5">
        {/* User Profile Card */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 mb-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50 flex-shrink-0">
              ME
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white">Mouad EL.</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">UI/UX Designer</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Profile completion</span>
              <span className="text-gray-900 dark:text-white font-bold">90%</span>
            </div>
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 h-2.5 rounded-full transition-all duration-500 shadow-lg" style={{ width: '90%' }}></div>
            </div>
          </div>
          <button className="w-full py-2.5 text-sm text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-700 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-all font-semibold">
            + Add another account
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 mb-6">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <Play className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Learning</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <BarChart3 className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Insights</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <UserPlus className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Find colleagues</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <Bookmark className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Bookmarks</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <Gamepad2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Gaming</span>
            <span className="ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">New</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all group">
            <Settings className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span className="font-semibold">Settings</span>
          </a>
        </nav>

        {/* Followed Hashtags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Followed Hashtags</h3>
            <button className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <a
                key={tag}
                href="#"
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 text-sm rounded-xl transition-all font-semibold border border-gray-200/50 dark:border-gray-700/50"
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

