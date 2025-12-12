"use client";

import TopNavbar from "@/components/TopNavbar";
import LeftSidebar from "@/app/(home)/components/LeftSidebar";
import RightSidebar from "@/app/(home)/components/RightSidebar";
import PostCreator from "@/app/(home)/components/PostCreator";
import FeedPost from "@/app/(home)/components/FeedPost";
import { useCurrentUser } from "@/features/auth/hook";
import { getToken } from "@/lib";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <TopNavbar /> */}

//       <div className="flex pt-16">
//         <LeftSidebar />

//         {/* Main Content Area */}
//         <main className="flex-1 mx-auto max-w-2xl px-4 py-6 ml-64 mr-80">
//           <PostCreator />

//           {/* Feed Posts */}
//           <FeedPost
//             author={{
//               name: 'Mouad EL.',
//               title: 'UI/UX Designer',
//               avatar: 'ME'
//             }}
//             title="-Healthy Tracking App"
//             content={
//               <div className="grid grid-cols-2 gap-4 my-4">
//                 <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
//                   <div className="space-y-3">
//                     <h4 className="font-semibold text-sm">Welcome, Visitor</h4>
//                     <div>
//                       <p className="text-xs text-gray-600 mb-2">Popular Categories</p>
//                       <div className="flex flex-wrap gap-2">
//                         {['Mountain', 'Beach', 'Forest', 'City', 'Jungle'].map((cat) => (
//                           <span key={cat} className="px-2 py-1 bg-white text-xs rounded border border-gray-200">
//                             {cat}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-600 mb-2">Recommended</p>
//                       <div className="space-y-2">
//                         <div className="bg-white p-2 rounded border border-gray-200">
//                           <div className="w-full h-24 bg-gray-300 rounded mb-2"></div>
//                           <p className="text-xs font-semibold">Sphinx</p>
//                           <p className="text-xs text-gray-500">$123</p>
//                         </div>
//                         <div className="bg-white p-2 rounded border border-gray-200">
//                           <div className="w-full h-24 bg-gray-300 rounded mb-2"></div>
//                           <p className="text-xs font-semibold">Pyramids</p>
//                           <p className="text-xs text-gray-500">$345</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
//                   <div className="space-y-3">
//                     <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
//                     <h4 className="font-semibold text-sm">Sphinx</h4>
//                     <div className="space-y-1 text-xs text-gray-600">
//                       <p>Distance: 5km</p>
//                       <p>Temperature: 25°C</p>
//                       <p>Rating: ⭐⭐⭐⭐⭐</p>
//                     </div>
//                     <p className="text-xs text-gray-600">About the trip: A wonderful experience...</p>
//                     <div className="flex gap-2">
//                       <button className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
//                         Preview
//                       </button>
//                       <button className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
//                         Book Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             }
//             likes={99}
//             comments={8}
//           />

//           <FeedPost
//             author={{
//               name: 'Soufiane Boukir',
//               title: 'Web Developer',
//               avatar: 'SB'
//             }}
//             title="-Photo is perfect"
//             content={
//               <div className="w-full h-64 bg-gradient-to-br from-green-200 to-green-400 rounded-lg my-4 flex items-center justify-center">
//                 <span className="text-gray-600">Nature Photo</span>
//               </div>
//             }
//             likes={42}
//             comments={12}
//           />
//         </main>

//         <RightSidebar />
//       </div>
//     </div>
//   );
// }

export default function Home() {
  const token = getToken();
  const { data, isLoading, error } = useCurrentUser(token!);
  
  if (isLoading)
    return (
      <div className="mt-10 mx-auto w-[50%] flex justify-center gap-2 text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="mt-10 mx-auto w-[50%] flex justify-center gap-2 text-xl">
        No user logged in
      </div>
    );

  return (
    <div className="mt-10 mx-auto w-[50%] flex justify-center gap-2 text-xl">
      Logged in as <strong className="text-blue-500"> {data?.full_name}</strong>
    </div>
  );
}
