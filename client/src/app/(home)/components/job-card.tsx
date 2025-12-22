'use client'

import { Job } from '@/interfaces'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis, Pencil, Trash2, Users, FileText, MapPin, Building, Clock, DollarSign, Briefcase, Calendar, CheckCircle, Award, Layers, Target, UserCheck, ExternalLink } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { statusIndicator } from '@/constants/status-indicator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Icon } from '@iconify/react'

interface JobCardProps {
    jobData: Job
    onOpenDelete: (val: { open: boolean, jobId: string }) => void
    onOpenUpdate: (val: { open: boolean, jobData: Job }) => void
    onApply: (jobId: number) => void
    onReport: (jobId: number) => void
}

export const JobCard = ({ jobData, onOpenDelete, onOpenUpdate, onApply, onReport }: JobCardProps) => {
    const { emp_type, skills, createdAt, employer, responsibilities } = jobData

    return (
        <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/10 bg-card">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                        {/* Job Title & Category */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                {/* Company Info */}
                                <div className="flex items-center gap-3">
                                    {employer?.image && (
                                        <Image
                                            width={20}
                                            height={20}
                                            src={employer.image} 
                                            alt={employer.full_name[0].toLowerCase()} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                        />
                                    )}
                                    <div className="space-y-1">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-left">{employer?.full_name || jobData.company}</span>
                                            <p>{employer?.headLine || "Employer"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex flex-col items-end gap-2">
                                {statusIndicator[emp_type]?.icon && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                                                {statusIndicator[emp_type].icon}
                                                <span className="text-xs">{emp_type?.replace("-", " ") || "Full-time"}</span>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{statusIndicator[emp_type].description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => onOpenUpdate({open: true, jobData: jobData})}>
                                <Pencil className="w-4 h-4" /> Edit Job
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-green-600" onClick={() => onApply(jobData.id)}>
                                <UserCheck className="w-4 h-4" /> Apply Now
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => {/* View Details */}}>
                                <ExternalLink className="w-4 h-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-500" onClick={() => onReport(jobData.id)}>
                                <FileText className="w-4 h-4" /> Report
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="gap-2 text-red-500 focus:text-red-500" 
                                onClick={() => onOpenDelete({open:true,jobId: jobData._id!})}
                            >
                                <Trash2 className="w-4 h-4" /> Delete Job
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <Separator />

                                
            <div className='flex-1 space-y-3 px-10'>
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {jobData.title || "Untitled Job"}
                    </h3>
                    {jobData.category && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                            {jobData.category}
                        </Badge>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{jobData.location || "Remote"}</span>
                    </div>
                    
                    {jobData.salary_range && (
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">{jobData.salary_range}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{emp_type?.replace("-", " ") || "Full-time"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{createdAt ? formatRelativeTime(createdAt) : "Recently posted"}</span>
                    </div>
                </div>
            </div>
                                
            <Separator />

            <CardContent className="space-y-6">
                {/* Description */}
                {jobData.description && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Job Description</h4>
                        </div>
                        <p className="pl-6">{jobData.description}</p>
                    </div>
                )}

                {/* Responsibilities */}
                {responsibilities && responsibilities.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Responsibilities</h4>
                        </div>
                        <ul className="space-y-2 pl-6">
                            {responsibilities.map((res, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    - <span>{res}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Skills Section */}
                {skills && skills.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Required Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                            {skills.map((skill: string, index: number) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary"
                                    className="px-3 py-1.5 text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                    <Icon
                                        icon={`devicon:${skill.toLowerCase()}`}
                                        className="w-4 h-4"
                                    />
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <Separator className="my-1" />

            <CardFooter>
                <div className="w-full flex justify-between items-center">
                    {/* Applicants Info */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">
                                    {jobData.applicants || 0} {jobData.applicants === 1 ? 'Applicant' : 'Applicants'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Apply before {getApplicationDeadline(createdAt)}
                                </p>
                            </div>
                        </div>
                        
                        {/* Posted Time */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {createdAt ? formatRelativeTime(createdAt) : "recently"}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onReport(jobData.id)}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Report
                        </Button>
                        <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => onApply(jobData.id)}
                            className="gap-2"
                        >
                            <UserCheck className="w-4 h-4" />
                            Apply Now
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: (date.getFullYear() !== now.getFullYear()) ? 'numeric' : undefined
    })
}

function getApplicationDeadline(dateString: string) {
    const date = new Date(dateString)
    date.setDate(date.getDate() + 30) // Add 30 days for deadline
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}