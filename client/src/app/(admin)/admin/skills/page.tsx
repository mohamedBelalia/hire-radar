'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/dataTable'
import { getSkills } from '@/services/shared'
import { Button } from '@/components/ui/button'
import { AddSkillCategory } from '@/components/add-edit'

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Skill name" },
]

const page = () => {
  const [skills,setSkills] = useState<Skill[]>([])
  const [loading,setLoading] = useState(true)

  const fetchSkills = async () =>{
    try{
      const res = await getSkills()
      if(res.status === 200){
        setSkills(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (skillId: number) =>{    
    setSkills(prev => prev.filter(s => s.id !== skillId)) 
  }

  const handleAdd = (newSkill: Skill) => {
    setSkills(prev => [...prev, newSkill])
  }


  useEffect(() =>{
    fetchSkills()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Skills list</h1>
      <DataTable
        data={skills}
        content={'skill'} 
        columns={columns} 
        showMenu={false}
        addComponent={<AddSkillCategory toAdd="skill" onAdded={handleAdd} />}
        actions={[
        { label: "Delete", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
        { label: "Edit", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default page
