"use client";

import { useParams } from "next/navigation";
import PublicProfileContent from "@/features/profile/components/public-profile-content";

export default function UserProfilePage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-accent/20 pb-20">
            <div className="mx-auto max-w-7xl px-4 pt-10">
                <PublicProfileContent userId={id} />
            </div>
        </main>
    );
}
