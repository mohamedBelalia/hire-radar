"use client";

import { usePublicProfile } from "@/features/profile/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin, Globe, Github, FileText, Briefcase, GraduationCap, Code } from "lucide-react";
import ProfileHeader from "@/app/(home)/profile/components/profile-header";

interface PublicProfileContentProps {
    userId: string;
}

export default function PublicProfileContent({ userId }: PublicProfileContentProps) {
    const { data: profile, isLoading, error } = usePublicProfile(userId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                    <MapPin className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                <p className="text-muted-foreground max-w-md">
                    The profile you are looking for might have been removed or the link is incorrect.
                </p>
            </div>
        );
    }

    const isCandidate = profile.role === "candidate";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero / Header Section */}
            <ProfileHeader user={profile} readOnly={true} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
                        <CardHeader className="bg-primary/5 pb-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/70">Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {profile.location && (
                                <div className="flex items-center gap-3 text-sm group transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-foreground/80">{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <div className="flex items-center gap-3 text-sm group transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Globe className="h-4 w-4 text-primary" />
                                    </div>
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium truncate">
                                        {profile.website.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            )}
                            {profile.github_url && (
                                <div className="flex items-center gap-3 text-sm group transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Github className="h-4 w-4 text-primary" />
                                    </div>
                                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium truncate">
                                        GitHub Profile
                                    </a>
                                </div>
                            )}
                            {profile.resume_url && (
                                <div className="flex items-center gap-3 text-sm group transition-colors">
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium truncate">
                                        Download Resume / CV
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {isCandidate && profile.skills && profile.skills.length > 0 && (
                        <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-primary/5 pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/70">Expertise</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill: any) => (
                                        <Badge key={skill.id} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none hover:bg-primary/20 transition-colors">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Bio Section */}
                    <Section icon={<FileText className="h-5 w-5" />} title="About">
                        <div className="prose prose-sm max-w-none text-muted-foreground italic leading-relaxed">
                            {profile.bio || "No biography provided."}
                        </div>
                    </Section>

                    {isCandidate && (
                        <>
                            {/* Experience Section */}
                            <Section icon={<Briefcase className="h-5 w-5" />} title="Professional Experience">
                                <div className="space-y-6">
                                    {profile.experiences && profile.experiences.length > 0 ? (
                                        profile.experiences.map((exp: any, index: number) => (
                                            <div key={exp.id} className="relative pl-6 pb-6 border-l-2 border-primary/20 last:border-0 last:pb-0">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-sm" />
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-base text-foreground">{exp.job_title}</h4>
                                                    <p className="text-primary font-medium text-sm">{exp.company}</p>
                                                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                                        {new Date(exp.start_date).getFullYear()} — {exp.end_date ? new Date(exp.end_date).getFullYear() : "Present"}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-3 hover:line-clamp-none transition-all duration-300">
                                                            {exp.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-lg">No work experience listed.</p>
                                    )}
                                </div>
                            </Section>

                            {/* Education Section */}
                            <Section icon={<GraduationCap className="h-5 w-5" />} title="Education">
                                <div className="grid grid-cols-1 gap-4">
                                    {profile.educations && profile.educations.length > 0 ? (
                                        profile.educations.map((edu: any) => (
                                            <div key={edu.id} className="p-4 rounded-xl border border-border/50 bg-accent/5 hover:bg-accent/10 transition-colors group">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{edu.school_name}</h4>
                                                        <p className="text-sm font-medium text-muted-foreground">{edu.degree} in {edu.field_of_study}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] whitespace-nowrap">
                                                        {new Date(edu.start_date).getFullYear()} — {edu.end_date ? new Date(edu.end_date).getFullYear() : "Present"}
                                                    </Badge>
                                                </div>
                                                {edu.description && <p className="mt-3 text-xs text-muted-foreground italic">{edu.description}</p>}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-lg">No education history listed.</p>
                                    )}
                                </div>
                            </Section>
                        </>
                    )}

                    {!isCandidate && profile.companyName && (
                        <Section icon={<Briefcase className="h-5 w-5" />} title="Company Information">
                            <div className="bg-accent/5 p-6 rounded-2xl border border-border/50">
                                <h4 className="text-xl font-bold mb-2">{profile.companyName}</h4>
                                <p className="text-muted-foreground">{profile.bio || "No company description available."}</p>
                            </div>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-inner">
                    {icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                {children}
            </div>
        </div>
    );
}
