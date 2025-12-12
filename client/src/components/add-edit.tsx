import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getToken } from "@/lib"
import { addCategory, addSkill, editCategory, editSkill } from "@/services/admin"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function AddSkillCategory({ toAdd, onAdded }: { toAdd: string, onAdded: (data?: any) => void }) {

    const [loading,setLoading] = useState(false)
    const [name, setName] = useState('')

    const add = async () =>{
        setLoading(true)

        try{
            switch (toAdd){
              case "skill":
                const res = await addSkill(getToken()!, name)
                if(res.status === 200){
                    toast.success("New skill added successfully")
                    onAdded?.(res.data)
                }
                break

              case "category":
                const res2 = await addCategory(getToken()!, name)
                if(res2.status === 200){
                    toast.success("New category added successfully")
                }
                break
            }
        }catch(error: any){ 
          if (error.response?.data?.error) {
            toast.error(`Error: ${error.response.data.error}`)
          } else {
            toast.error("Something went wrong. Please try again.")
          }
        }finally{
            setLoading(false)
        }
    }


  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <Button className="ml-auto cursor-pointer" variant="outline">
                <Plus />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new {toAdd}</DialogTitle>
            <DialogDescription>
              Write the {toAdd} name. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Next.js" placeholder={toAdd === 'skill' ? "Next.js" : "Economics"} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={add} disabled={name.trim().length === 0 || loading}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


export function EditSkillCategory({ toEdit, id, oldValue }: { toEdit: string, id: number, oldValue: string }) {

    const [loading,setLoading] = useState(false)
    const [name, setName] = useState(oldValue || '')

    const edit = async () =>{
        setLoading(true)

        try{
            switch (toEdit){
              case "skill":
                const res = await editSkill(getToken()!, id,name)
                if(res.status === 200){
                    toast.success("Skill name edited successfully")
                }
                break

              case "category":
                const res2 = await editCategory(getToken()!, id,name)
                if(res2.status === 200){
                    toast.success("Category name edited successfully")
                }
                break
            }
        }catch(error: any){ 
          if (error.response?.data?.error) {
            toast.error(`Error: ${error.response.data.error}`)
          } else {
            toast.error("Something went wrong. Please try again.")
          }
        }finally{
            setLoading(false)
        }
    }


  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
            <Button className="ml-auto cursor-pointer" variant="outline">
              Edit
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {toEdit}</DialogTitle>
            <DialogDescription>
              Write the new {toEdit} name. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Next.js" placeholder={toEdit === 'skill' ? "Next.js" : "Economics"} value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={edit} disabled={name.trim().length === 0 || loading}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}





import { addAdmin } from "@/services/admin"

export function AddAdminDialog({ onAdded }: { onAdded?: (data?: any) => void }) {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleAddAdmin = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await addAdmin(getToken()!, {
        full_name: fullName,
        email,
        password,
      })

      if (res.status === 201) {
        toast.success("New admin added successfully")
        onAdded?.(res.data.admin)
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="ml-auto cursor-pointer" variant="outline">
            <Plus />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Fill the form to add a new admin user.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              disabled={
                loading ||
                !fullName.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              }
              onClick={handleAddAdmin}
            >
              {loading ? "Adding..." : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
