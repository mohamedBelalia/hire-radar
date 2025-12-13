"use client";

import { useState } from "react";
import { Upload, FileText, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateProfile } from "@/types/profile";

interface UploadCVProps {
  profile: CandidateProfile;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export default function UploadCV({
  profile,
  onUpload,
  isUploading = false,
}: UploadCVProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Resume / CV
      </h2>

      {profile.cv_url ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 dark:text-green-300">
                CV Uploaded
              </p>
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 dark:text-green-400 hover:underline flex items-center gap-1 mt-1"
              >
                <FileText className="w-4 h-4" />
                View Current CV
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-600"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Drag and drop your CV here, or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          PDF files only (max 5MB)
        </p>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          id="cv-upload"
        />
        <label htmlFor="cv-upload">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            asChild
          >
            <span>Choose File</span>
          </Button>
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isUploading ? "Uploading..." : "Upload CV"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
