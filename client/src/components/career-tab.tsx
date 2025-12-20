import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CircleSlash, Briefcase, SquareX } from "lucide-react";
import Image from "next/image";
import { HandleEducation , HandleExperience, EducationData, ExperienceData } from "./add-update-delete-career";
import apiClient from "@/lib/apiClient";
import { getToken } from "@/lib";

const CareerTab = () => {
  // Dummy data
  const [educations, setEducations] = useState<EducationData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [skills, setSkills] = useState([]);

  const [newSkill, setNewSkill] = useState("");
  const [skillLoading,setSkillLoading] = useState(false)

  const [loading, setLoading] = useState(false)

  const fetchCareer = async () =>{
    try{
        setLoading(true)
        const response = await apiClient.get(`/api/candidates/career`,{
            headers: {
                Authorization: `Bearee ${getToken()}`
            }
        })
        if(response.status === 200){
            setEducations(response.data.educations)
            setExperiences(response.data.experiences)
            setSkills(response.data.skills)
        }
    }catch{

    }finally{
        setLoading(false)
    }
  }

  const handleAddEducation = (eudcation: EducationData) => {
    setEducations([...educations, eudcation ]);
  };
  const handleUpdateEducation = (updatedEducation: EducationData) => {
    setEducations((prev) =>
        prev.map((edu) => (edu.id === updatedEducation.id ? updatedEducation : edu))
    );
  };


  const handleAddExperience = (experience: ExperienceData) => {
    setExperiences([...experiences, experience ]);
  };
  const handleUpdateExperience = (updatedExperience: ExperienceData) => {
    setExperiences((prev) =>
        prev.map((exp) => (exp.id === updatedExperience.id ? updatedExperience : exp))
    );
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  useEffect(() =>{
    fetchCareer()
  },[])

  return (
    <div className="space-y-8">
      {/* EDUCATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Educations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {educations.length > 0 ? (
            educations.map((edu) => (
                <div
                key={edu.id}
                className="flex justify-between items-start p-4 border rounded-md gap-4"
                >
                <div className="w-16 h-16">
                    <Image
                    src="/icons/education.png"
                    alt="school"
                    width={25}
                    height={25}
                    className="w-full h-full object-cover rounded-md"
                    />
                </div>

                <div className="flex-1">
                    <div className="font-semibold">{edu.school_name}</div>
                    <div className="text-sm text-muted-foreground">
                    {edu.degree} in {edu.field_of_study} | {edu.start_date} - {edu.end_date}
                    </div>
                    <div className="text-sm">{edu.description}</div>
                </div>

                <div className="flex gap-2">
                    <HandleEducation education={edu} update={handleUpdateEducation}/>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            ))
            ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <CircleSlash className="w-12 h-12 mb-4" />
                <div className="text-center">
                No educations added yet. Click "Add Education" to get started.
                </div>
            </div>
            )}

          <HandleEducation add={handleAddEducation}/>
        </CardContent>
      </Card>

      {/* EXPERIENCES */}
      <Card>
        <CardHeader>
          <CardTitle>Experiences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
                <div
                key={exp.id}
                className="flex justify-between items-start p-4 border rounded-md gap-4"
                >
                <div className="w-16 h-16">
                    <Image
                    src="/icons/work.png"
                    alt="experience"
                    width={25}
                    height={25}
                    className="w-full h-full object-cover rounded-md"
                    />
                </div>

                <div className="flex-1">
                    <div className="font-semibold">{exp.job_title}</div>
                    <div className="text-sm text-muted-foreground">
                    {exp.company} | {exp.start_date} - {exp.end_date}
                    </div>
                    <div className="text-sm">{exp.description}</div>
                </div>

                <div className="flex gap-2">
                    <HandleExperience add={handleUpdateExperience} experience={exp}/>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            ))
            ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Briefcase className="w-12 h-12 mb-4" />
                <div className="text-center">
                No experiences added yet. Click "Add Experience" to get started.
                </div>
            </div>
            )}


          {/* ADD EXPERIENCE */}
          <HandleExperience add={handleAddExperience}/>
        </CardContent>
      </Card>

      {/* SKILLS */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <div
                    key={skill.id}
                    className="flex items-center justify-between gap-2 px-4 py-2 border rounded-md bg-background"
                    >
                    <span className="font-medium">{skill.name}</span>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <SquareX className="w-12 h-12 mb-4" />
                <div className="text-center">
                    No skills added yet. Click "Add Skill" to get started.
                </div>
                </div>
            )}
            </div>

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerTab;
