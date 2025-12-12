'use client'
import { useEffect, useState } from 'react'
import { getUsers } from '@/services/admin'
import { getToken } from '@/lib'
import { DataTable } from '@/components/dataTable'

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "full_name", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "location", header: "location" },
  { accessorKey: "headLine", header: "headLine" },
]

const page = () => {
  const [users,setUsers] = useState<User[]>([])
  const [loading,setLoading] = useState(true)

  const fetchUsers = async () =>{
    try{
      const res = await getUsers(getToken()!)      
      if(res.status === 200){
        setUsers(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (userId: number) =>{    
    setUsers(prev => prev.filter(u => u.id !== userId)) 
  }

  useEffect(() =>{
    fetchUsers()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Users list</h1>
      <DataTable
        data={users}
        content={'user'} 
        columns={columns}
        actions={[
        { label: "Delete", onClick: (userId: number) => handleDelete(userId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default page
