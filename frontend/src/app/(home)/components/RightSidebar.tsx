'use client';

import { Calendar, MessageCircle, ChevronUp } from 'lucide-react';

export default function RightSidebar() {
  const suggestedPeople = [
    { name: 'Steve Jobs', title: 'CEO of Apple', avatar: 'SJ' },
    { name: 'Ryan Roslansky', title: 'CEO of Linkedin', avatar: 'RR' },
    { name: 'Dylan Field', title: 'CEO of Figma', avatar: 'DF' },
  ];

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Premium Widget */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 relative overflow-hidden">
          <h3 className="font-semibold text-lg mb-1">Try Premium for free</h3>
          <p className="text-sm text-gray-600 mb-4">--One month free</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            Try free
          </button>
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <div className="w-32 h-32 bg-purple-500 rounded-full"></div>
          </div>
          <Calendar className="absolute bottom-2 right-2 w-12 h-12 text-purple-300 opacity-50" />
        </div>

        {/* People You May Know */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4">People you may know:</h3>
          <div className="space-y-4">
            {suggestedPeople.map((person, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {person.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{person.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{person.title}</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap">
                  Connect
                </button>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4">
            See All
          </a>
        </div>

        {/* Skills/Interests */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500"></div>
                <span className="text-sm font-medium">UX Design</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-400 to-purple-500"></div>
                <span className="text-sm font-medium">UI Design</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">+99</span>
            </div>
            <a href="#" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm p-2">
              <span className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600">
                +
              </span>
              <span>Add new page</span>
            </a>
          </div>
        </div>

        {/* Messages Widget */}
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-sm">Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">6</span>
              <button className="text-gray-400 hover:text-gray-600">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

