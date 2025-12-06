'use client';

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SavedJobsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bookmark className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          No saved jobs yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't saved any jobs yet. Start exploring opportunities and save the ones that interest you.
        </p>
        <Button
          onClick={() => window.location.href = '/jobs/search'}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Browse Jobs
        </Button>
      </div>
    </div>
  );
}
