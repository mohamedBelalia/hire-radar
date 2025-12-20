"use client";

import { Skill, createOrGetSkill } from "../api";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface SkillSelectorProps {
  availableSkills: Skill[];
  selectedSkillIds: number[];
  onSkillsChange: (skillIds: number[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SkillSelector({
  availableSkills,
  selectedSkillIds,
  onSkillsChange,
  disabled = false,
  isLoading = false,
}: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [newlyCreatedSkills, setNewlyCreatedSkills] = useState<Skill[]>([]);

  // Merge available skills with newly created ones
  const allSkills = [...availableSkills, ...newlyCreatedSkills];

  const selectedSkills = allSkills.filter((skill) =>
    selectedSkillIds.includes(skill.id),
  );

  const filteredSkills = allSkills.filter(
    (skill) =>
      !selectedSkillIds.includes(skill.id) &&
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Check if search term matches any existing skill
  const skillExists = allSkills.some(
    (skill) => skill.name.toLowerCase() === searchTerm.toLowerCase(),
  );

  const handleSelectSkill = (skillId: number) => {
    onSkillsChange([...selectedSkillIds, skillId]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleRemoveSkill = (skillId: number) => {
    onSkillsChange(selectedSkillIds.filter((id) => id !== skillId));
  };

  const handleCreateSkill = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsCreatingSkill(true);
      const newSkill = await createOrGetSkill(searchTerm.trim());

  // Add to newly created skills list so it appears in dropdown
  setNewlyCreatedSkills([...newlyCreatedSkills, newSkill]);

  // Add the new skill to selected skills
  onSkillsChange([...selectedSkillIds, newSkill.id]);

      toast.success(`Skill "${newSkill.name}" added successfully`);
      setSearchTerm("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create skill:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create skill",
      );
    } finally {
      setIsCreatingSkill(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Skills</label>
        <div className="p-2 border border-gray-300 rounded-md text-sm text-gray-500">
          Loading skills...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Skills</label>

      {/* Selected Skills Display */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {selectedSkills.map((skill) => (
          <Badge
            key={skill.id}
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 pr-1"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              disabled={disabled}
              className="ml-1 hover:bg-blue-300 rounded-full p-0.5 disabled:opacity-50"
              aria-label={`Remove ${skill.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Skill Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search and add skills..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled || isCreatingSkill}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        {/* Dropdown */}
        {isOpen &&
          (filteredSkills.length > 0 ||
            (searchTerm.trim() && !skillExists)) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {/* Existing skills matching search */}
              {filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSelectSkill(skill.id)}
                  disabled={disabled}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 disabled:opacity-50 border-b border-gray-100 last:border-b-0"
                >
                  {skill.name}
                </button>
              ))}

              {/* Create new skill option */}
              {searchTerm.trim() && !skillExists && (
                <button
                  type="button"
                  onClick={handleCreateSkill}
                  disabled={disabled || isCreatingSkill}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 focus:bg-green-50 disabled:opacity-50 border-t border-gray-200 bg-green-50 flex items-center gap-2 font-medium text-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Create new skill: "{searchTerm.trim()}"
                </button>
              )}
            </div>
          )}

        {/* No results message */}
        {isOpen &&
          searchTerm &&
          filteredSkills.length === 0 &&
          skillExists && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
              <p className="text-sm text-gray-500">Skill already selected</p>
            </div>
          )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Search for existing skills or type to create a new one. Click the X to
        remove a skill.
      </p>
    </div>
  );
}
