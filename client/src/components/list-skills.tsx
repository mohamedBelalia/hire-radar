"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import apiClient from "@/lib/apiClient";
import { getToken } from "@/lib";
import { Icon } from "@iconify/react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Skill {
  id: number;
  name: string;
}

interface SkillSelectProps {
  onSelect?: (skill: Skill) => void;
  initialValue?: Skill | null;
}

export function SkillCombobox({ onSelect, initialValue }: SkillSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Skill | null>(initialValue || null);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSelectSkill = (skill: Skill | string) => {
    let selectedSkill: Skill;

    if (typeof skill === "string") {
      selectedSkill = { id: Date.now(), name: skill };
      setSkills((prev) => [...prev, selectedSkill]);
    } else {
      selectedSkill = skill;
    }

    setValue(selectedSkill);
    setSearch("");
    setOpen(false);
    onSelect?.(selectedSkill);
  };

  const fetchSkills = async (query = "") => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/candidates/skills`, {
        params: { query },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 200) setSkills(res.data.skills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSkills();
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => fetchSkills(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[90%]">
          {value ? value.name : "Select skill..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search skill..."
            className="h-9"
            value={search}
            onValueChange={(text) => setSearch(text)}
          />
          <CommandList>
            <CommandEmpty>{loading ? "Loading..." : "No skill found."}</CommandEmpty>
            <CommandGroup>
              {skills.map((skill) => (
                <CommandItem key={skill.id} value={skill.name} onSelect={() => handleSelectSkill(skill)}>
                  <Icon icon={`devicon:${skill.name.toLowerCase()}`} className="w-4 h-4" />
                  {skill.name}
                  <Check
                    className={cn("ml-auto", value?.id === skill.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}

              {search && !skills.find((s) => s.name.toLowerCase() === search.toLowerCase()) && (
                <CommandItem onSelect={() => handleSelectSkill(search)}>
                  
                  Add <Icon icon={`devicon:${search.toLowerCase()}`} className="w-4 h-4" /> "{search}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}




export function Delete({ id, toDelete }: { id: string, toDelete: string }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
