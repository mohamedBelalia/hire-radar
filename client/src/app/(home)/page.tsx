'use client';

import TopNavbar from '@/components/TopNavbar';
import LeftSidebar from '@/app/(home)/components/LeftSidebar';
import RightSidebar from '@/app/(home)/components/RightSidebar';
import PostCreator from '@/app/(home)/components/PostCreator';
import FeedPost from '@/app/(home)/components/FeedPost';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <TopNavbar />
      
      <div className="flex relative pt-16">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-8 py-8 ml-64 mr-96">
          <div className="space-y-6 max-w-4xl">
            <PostCreator />
            
            {/* Feed Posts */}
            <FeedPost
              author={{
                name: 'Mouad EL.',
                title: 'UI/UX Designer',
                avatar: 'ME'
              }}
              title="-Healthy Tracking App"
              content={
                <div className="grid grid-cols-2 gap-5 my-6">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="space-y-4">
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">Welcome, Visitor</h4>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Popular Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {['Mountain', 'Beach', 'Forest', 'City', 'Jungle'].map((cat) => (
                            <span key={cat} className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md text-sm rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-all cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Recommended</p>
                        <div className="space-y-3">
                          <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-full h-32 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl mb-3"></div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Sphinx</p>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">$123</p>
                          </div>
                          <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl mb-3"></div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Pyramids</p>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">$345</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="space-y-4">
                      <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-yellow-200 dark:from-orange-900/50 dark:to-yellow-900/50 rounded-xl mb-4"></div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">Sphinx</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Distance:</span> 5km
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Temperature:</span> 25°C
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Rating:</span> ⭐⭐⭐⭐⭐
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">About the trip: A wonderful experience...</p>
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md border border-gray-300/50 dark:border-gray-600/50 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-semibold text-gray-900 dark:text-white">
                          Preview
                        </button>
                        <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-xl text-sm hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
              likes={99}
              comments={8}
            />
            
            <FeedPost
              author={{
                name: 'Soufiane Boukir',
                title: 'Web Developer',
                avatar: 'SB'
              }}
              title="-Photo is perfect"
              content={
                <div className="w-full h-96 bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400 dark:from-green-900/50 dark:via-emerald-900/50 dark:to-teal-900/50 rounded-2xl my-6 flex items-center justify-center overflow-hidden shadow-xl">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-xl">Nature Photo</span>
                </div>
              }
              likes={42}
              comments={12}
            />
          </div>
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
