import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"
import { deleteAdmin, deleteCategory, deleteJob, deleteSkill, deleteUser } from "@/services/admin"
import { getToken } from "@/lib"
import { toast } from "sonner"

interface DeleteDialogProps {
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    onDelete: (id: number) => void
    toDelete: string
    id: number
}
const DeleteDialog = ({ variant, toDelete, onDelete, id }: DeleteDialogProps) => {

    const [loading,setLoading] = useState(false)
    const [open,setOpen] = useState(false)

    const deleteFUNCTION = async () => {
        try {
            setLoading(true)
            switch (toDelete) {
                case "user":
                    const res = await deleteUser(getToken()!, id)
                    if (res.status === 200) {
                        toast.success("User deleted successfully")
                        onDelete(id)
                        setOpen(false)
                    }
                    break

                case "job":
                    const res2 = await deleteJob(getToken()!, id)
                    if (res2.status === 200) {
                        toast.success("Job deleted successfully")
                        onDelete(id)
                        setOpen(false)
                    }
                    break

                case "skill":
                    const res3 = await deleteSkill(getToken()!, id)
                    if (res3.status === 200) {
                        toast.success("Skill deleted successfully")
                        onDelete(id)
                        setOpen(false)
                    }
                    break

                case "category":
                    const res4 = await deleteCategory(getToken()!, id)
                    if (res4.status === 200) {
                        toast.success("Category deleted successfully")
                        onDelete(id)
                        setOpen(false)
                    }
                    break

                case "admin":
                    const res5 = await deleteAdmin(getToken()!, id)
                    if (res5.status === 200) {
                        toast.success("Admin deleted successfully")
                        onDelete(id)
                        setOpen(false)
                    }
                    break
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button variant={variant} onClick={() => setOpen(true)}>
                Delete
            </Button>
        </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete {toDelete} and remove data from our servers.
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button className="cursor-pointer" disabled={loading} onClick={deleteFUNCTION}>
                        {
                            loading ?
                                "Deleting..."
                            : 
                                "Delete"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DeleteDialog
