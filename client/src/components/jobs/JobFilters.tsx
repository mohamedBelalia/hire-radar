"use client";

import { X, MapPin, DollarSign, Code } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface JobFiltersProps {
  location: string;
  salaryMin: string;
  skill: string;
  onLocationChange: (value: string) => void;
  onSalaryMinChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function JobFilters({
  location,
  salaryMin,
  skill,
  onLocationChange,
  onSalaryMinChange,
  onSkillChange,
  onClearFilters,
}: JobFiltersProps) {
  const hasActiveFilters = location || salaryMin || skill;

  return (
    <Card className="border-border bg-card sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Location Filter */}
        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., New York, Remote"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        {/* Salary Filter */}
        <div className="space-y-2">
          <Label
            htmlFor="salary"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <DollarSign className="w-4 h-4" />
            Minimum Salary
          </Label>
          <Input
            id="salary"
            type="number"
            placeholder="e.g., 50000"
            value={salaryMin}
            onChange={(e) => onSalaryMinChange(e.target.value)}
            min="0"
            className="bg-background border-border"
          />
        </div>

        {/* Skill Filter */}
        <div className="space-y-2">
          <Label
            htmlFor="skill"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Code className="w-4 h-4" />
            Skill
          </Label>
          <Input
            id="skill"
            type="text"
            placeholder="e.g., React, Python"
            value={skill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>
      </CardContent>
    </Card>
  );
}
