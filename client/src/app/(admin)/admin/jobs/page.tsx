'use client'
import { useEffect, useState } from 'react'
import { getJobs } from '@/services/admin'
import { getToken } from '@/lib'
import { DataTable } from '@/components/dataTable'

type Job = {
  id: number
  employer_id: number
  category_id: number
  title: string
  company: string
  location: string
  created_at: Date
}

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "location", header: "location" },
  { accessorKey: "created_at", header: "Posted at" },
]

const Page = () => {
  const [jobs,setJobs] = useState<Job[]>([])
  const [loading,setLoading] = useState(true)

  const fetchUsers = async () =>{
    try{
      const res = await getJobs(getToken()!)
      
      if(res.status === 200){
        setJobs(res.data)
      }
    }catch{

    }finally{
      setLoading(false)
    }
  }

  const handleDelete = (jobId: number) =>{    
    setJobs(prev => prev.filter(j => j.id !== jobId)) 
  }

  useEffect(() =>{
    fetchUsers()
  },[])

  if(loading) return null
  return (  
    <div>
      <h1 className='text-xl font-semibold'>Posted jobs</h1>
      <DataTable
        data={jobs}
        content={'job'} 
        columns={columns} 
        actions={[
        { label: "Delete", onClick: (jobId: number) => handleDelete(jobId), variant: "destructive" },
      ]} />
    </div>
  )
}

export default Page
