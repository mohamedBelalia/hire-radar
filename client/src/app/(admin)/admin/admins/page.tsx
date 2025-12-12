'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/dataTable'
import { getSkills } from '@/services/shared'
import { AddAdminDialog, AddSkillCategory } from '@/components/add-edit'
import { getAdmins } from '@/services/admin'
import { getToken } from '@/lib'

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "full_name", header: "Full name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "created_at", header: "Created at" },
]

const page = () => {
  const [admins,setAdmins] = useState<User[]>([])
  const [loading,setLoading] = useState(true)

  const fetchAdmins = async () =>{
    try{
      const res = await getAdmins(getToken()!)
      if(res.status === 200){
        setAdmins(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (adminId: number) =>{    
    setAdmins(prev => prev.filter(a => a.id !== adminId)) 
  }

  const handleAdd = (newAdmin: User) => {
    setAdmins(prev => [...prev, newAdmin])
  }


  useEffect(() =>{
    fetchAdmins()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Admins list</h1>
      <DataTable
        data={admins}
        content={'admin'} 
        columns={columns} 
        showMenu={false}
        addComponent={<AddAdminDialog onAdded={handleAdd} />}
        actions={[
        { label: "Delete", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default page
