"use client";

import { useState } from "react";
import { X, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Job } from "@/types/job";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onApply: (
    jobId: string,
    coverLetter?: string,
    cvFile?: File,
  ) => Promise<void>;
}

export default function ApplyModal({
  isOpen,
  onClose,
  job,
  onApply,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onApply(job.id.toString(), coverLetter, cvFile || undefined);
      setCoverLetter("");
      setCvFile(null);
      onClose();
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            {job.company_name || job.company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Tell the employer why you're a great fit for this position..."
              className="bg-background border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cv-upload">Upload CV/Resume (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX (max 5MB)
                </p>
              </label>
            </div>
            {cvFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                <FileText className="w-4 h-4" />
                <span>{cvFile.name}</span>
                <button
                  type="button"
                  onClick={() => setCvFile(null)}
                  className="ml-auto text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
