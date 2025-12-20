import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleSlash, Briefcase, SquareX } from "lucide-react";
import Image from "next/image";
import { HandleEducation , HandleExperience, EducationData, ExperienceData } from "./add-update-delete-career";
import apiClient from "@/lib/apiClient";
import { getToken } from "@/lib";
import { SkillCombobox } from "./list-skills";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import DeleteDialog from "./delete-dialog";


interface Skill {
  id: number
  name: string
}


const CareerTab = () => {

  const [educations, setEducations] = useState<EducationData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [skills, setSkills] = useState([]);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
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

   const handleSelect = (skill: Skill) => {
    setSelectedSkill(skill)
    onSelect?.(skill)
  }

  const handleAddSkill = async () => {
    if (!selectedSkill) return

    try {
      setLoading(true)
      const res = await apiClient.post(
        "/api/candidates/skills",
        { name: selectedSkill.name },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )

      if (res.status === 200) {
        setSkills((prev) => [...prev, res.data.skill])
        toast.success("Skill added successfully")
        setSelectedSkill(null)
      } else {
        toast.error("Failed to add skill")
      }
    } catch (err: any) {
        if (err.response && err.response.data) {
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false)
    }
  }

  const ondeleteSkill = (id: number) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const ondeleteEducation = (id: number) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const ondeleteExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
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
                    <DeleteDialog id={edu.id!} variant={"destructive"} toDelete="education" onDelete={ondeleteEducation}/>
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
                    <DeleteDialog id={exp.id!} variant={"destructive"} toDelete="experience" onDelete={ondeleteExperience}/>
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
                    <Icon icon={`devicon:${skill.name.toLowerCase()}`} className="w-4 h-4" />
                    <span className="font-medium">{skill.name}</span>
                    <DeleteDialog id={skill.id!} variant={"destructive"} toDelete="skill" onDelete={ondeleteSkill}/>
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
            <SkillCombobox onSelect={handleSelect} initialValue={selectedSkill} />

            <Button onClick={handleAddSkill} disabled={!selectedSkill || loading}>
                {loading ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerTab;
