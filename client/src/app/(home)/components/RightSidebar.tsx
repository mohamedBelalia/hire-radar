'use client';

import { Calendar, MessageCircle, ChevronUp } from 'lucide-react';

export default function RightSidebar() {
  const suggestedPeople = [
    { name: 'Steve Jobs', title: 'CEO of Apple', avatar: 'SJ' },
    { name: 'Ryan Roslansky', title: 'CEO of Linkedin', avatar: 'RR' },
    { name: 'Dylan Field', title: 'CEO of Figma', avatar: 'DF' },
  ];

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-96 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50 overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Premium Widget */}
        <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-rose-50/80 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 rounded-2xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Try Premium for free</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">--One month free</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Try free
          </button>
          <div className="absolute -bottom-8 -right-8 opacity-20 dark:opacity-10">
            <div className="w-40 h-40 bg-purple-500 dark:bg-purple-400 rounded-full blur-2xl"></div>
          </div>
          <Calendar className="absolute bottom-4 right-4 w-14 h-14 text-purple-300/50 dark:text-purple-500/30" />
        </div>

        {/* People You May Know */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="font-bold mb-5 text-gray-900 dark:text-white">People you may know:</h3>
          <div className="space-y-4">
            {suggestedPeople.map((person, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-500/10 dark:hover:bg-gray-500/20 transition-all duration-200">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white">{person.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{person.title}</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all text-sm font-semibold whitespace-nowrap shadow-md hover:shadow-lg">
                  Connect
                </button>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold mt-5 py-3 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 rounded-xl transition-all">
            See All
          </a>
        </div>

        {/* Skills/Interests */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-sm">Your Interests</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 rounded-xl cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg group-hover:scale-110 transition-transform"></div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">UX Design</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-pink-500/10 dark:hover:bg-pink-500/20 rounded-xl cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg group-hover:scale-110 transition-transform"></div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">UI Design</span>
              </div>
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">+99</span>
            </div>
            <a href="#" className="flex items-center gap-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm p-3 rounded-xl hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-all font-semibold">
              <span className="w-10 h-10 rounded-xl bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-bold">
                +
              </span>
              <span>Add new page</span>
            </a>
          </div>
        </div>

        {/* Messages Widget */}
        <div className="fixed bottom-6 right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-5 w-80 hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-sm text-gray-900 dark:text-white">Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">6</span>
              <button className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

