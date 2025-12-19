"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea" 
import { Trash2 } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { getToken } from "@/lib"

export function DeleteAccount() {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!reason.trim()) {
      setError("Please provide a reason for deleting your account.")
      setLoading(false)
      return
    }

    try {
      const response = await apiClient.post(`/api/auth/delete-account`,{reason},{
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
      })

      if (response.status === 200) {
        setSuccess("Delete request submitted successfully!")
        setReason("")
      } else {
        setError(response.data.message || "Failed to submit delete request.")        
      }
    } catch (err: any) {
        if (err.response && err.response.data) {
            setError(err.response.data.message || "Something went wrong");
        } else {
            setError(err.message || "Something went wrong");
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Trash2 />
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete your account</DialogTitle>
            <DialogDescription>
              Please provide a reason for deleting your account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why do you want to delete your account?"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || reason === ''} onClick={handleSubmit}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
