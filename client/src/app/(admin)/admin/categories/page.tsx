'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/dataTable'
import { getCategories } from '@/services/shared'
import { AddSkillCategory } from '@/components/add-edit'

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Category name" },
]

const Page = () => {
  const [categories,setCategories] = useState<Category[]>([])
  const [loading,setLoading] = useState(true)

  const fetchCategories = async () =>{
    try{
      const res = await getCategories()
      if(res.status === 200){
        setCategories(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (categoryId: number) =>{    
    setCategories(prev => prev.filter(c => c.id !== categoryId)) 
  }

  const handleAdd = (newCategory: Skill) => {
    setCategories(prev => [...prev, newCategory])
  }


  useEffect(() =>{
    fetchCategories()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Categories list</h1>
      <DataTable
        data={categories}
        content={'category'} 
        columns={columns} 
        showMenu={false}
        addComponent={<AddSkillCategory toAdd="category" onAdded={handleAdd} />}
        actions={[
        { label: "Delete", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
        { label: "Edit", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default Page
