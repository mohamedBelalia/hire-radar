"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { getToken } from "@/lib";

export interface EducationData {
  id?: number;
  school_name?: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ExperienceData {
  id?: number;
  job_title?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface HandleEducationProps {
  education?: EducationData;
  add?: (education: EducationData) => void;
  update?: (education: EducationData) => void;
}

interface HandleExperienceProps {
  experience?: ExperienceData;
  add?: (education: ExperienceData) => void;
  update?: (education: ExperienceData) => void;
}

export const HandleEducation: React.FC<HandleEducationProps> = ({
  education,
  add,
  update
}) => {
  const [formData, setFormData] = useState<EducationData>({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
    ...education,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof EducationData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (education?.id) {
        const res = await apiClient.put(
          `/api/candidates/educations/${education.id}`,
          formData
        );
        if(res.status === 200){
            toast.success("Education updated successfully")
            update!(formData)
        }else{
            toast.success("Something went wrong, Try again")
        }
      } else {
        const res = await apiClient.post("/api/candidates/educations", formData,{
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        
        if(res.status === 200){
            toast.success("Education Added successfully")
            add!(res.data.education)
        }else{
            toast.success("Something went wrong, Try again")
        }
      }
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>          
          {education ? 
            <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
            </Button> : (
            <Button className="w-full mt-2" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Education
            </Button>
          )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{education ? "Update Education" : "Add Education"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="space-y-1">
            <Label>School Name</Label>
            <Input
              placeholder="ex: EST Beni Mellal"
              value={formData.school_name}
              onChange={(e) => handleChange("school_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Degree</Label>
            <Input
              placeholder="Bachelor's degree in AI & Data Science"
              value={formData.degree}
              onChange={(e) => handleChange("degree", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Field of Study</Label>
            <Input
              placeholder="AI Engineering & Data Science"
              value={formData.field_of_study}
              onChange={(e) => handleChange("field_of_study", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1 flex gap-4">
            <div className="flex-1 space-y-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>End Date</Label>
              <Input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              placeholder="Studying AI, Maths and Software Engineering"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          {error && <p className="text-destructive">{error}</p>}

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : education ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};







export const HandleExperience: React.FC<HandleExperienceProps> = ({
  experience,
  add,
  update
}) => {
  const [formData, setFormData] = useState<ExperienceData>({
    job_title: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
    ...experience,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof ExperienceData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (experience?.id) {
        const res = await apiClient.put(
          `/api/candidates/experiences/${experience.id}`,
          formData
        );
        if(res.status === 200){
            toast.success("Experience updated successfully")
            update!(formData)
        }else{
            toast.success("Something went wrong, Try again")
        }
      } else {
        const res = await apiClient.post("/api/candidates/experiences", formData,{
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        
        if(res.status === 200){
            toast.success("Experience Added successfully")
            add!(res.data.experience)
        }else{
            toast.success("Something went wrong, Try again")
        }
      }
      
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>          
          {experience ? 
            <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
            </Button> : (
            <Button className="w-full mt-2" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
            </Button>
          )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{experience ? "Update Experience" : "Add Experience"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="space-y-1">
            <Label>Job title</Label>
            <Input
              placeholder="ex: Cloud engineer"
              value={formData.job_title}
              onChange={(e) => handleChange("job_title", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Company name</Label>
            <Input
              placeholder="ex: Google Inc"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1 flex gap-4">
            <div className="flex-1 space-y-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>End Date</Label>
              <Input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              placeholder="Server administrator"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          {error && <p className="text-destructive">{error}</p>}

          <DialogFooter className="mt-2 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : experience ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

