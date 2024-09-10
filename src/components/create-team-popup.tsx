"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Upload } from "lucide-react";
import axios from "axios";
interface Team {
  id: string;
  name: string;
  image: string;
  members: string[];
}

export function CreateTeamPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [team, setTeam] = useState<Partial<Team>>({
    name: "",
    image: "",
    members: [],
  });
  const [memberEmail, setMemberEmail] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (memberEmail && !team.members?.includes(memberEmail)) {
      setTeam((prev) => ({
        ...prev,
        members: [...(prev.members || []), memberEmail],
      }));
      setMemberEmail("");
    }
  };

  const handleRemoveMember = (email: string) => {
    setTeam((prev) => ({
      ...prev,
      members: prev.members?.filter((m) => m !== email) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(team);

    const response = await axios.post("/api/members/byEmail", {
      memberEmails: team.members,
    });
    const { data: members } = response.data;

    const result = await axios.post("/api/team", {
      ...team,
      members,
    });

    console.log("res.data createteampopup: ", result.data);
    setTeam({ name: "", image: "", members: [] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex hover:text-slate-600"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon />
          <span className="pl-3">Create Team</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              value={team.name}
              onChange={handleInputChange}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Team Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                name="image"
                value={team.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="bg-[#F3F5FC] hover:bg-[#E1E5F9]"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload image</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="members">Team Members</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="members"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member email"
              />
              <Button
                type="button"
                onClick={handleAddMember}
                className="bg-[#F3F5FC] text-black hover:bg-[#E1E5F9]"
              >
                Add
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {team.members?.map((member, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <span>{member}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member)}
                    className="hover:bg-[#F3F5FC]"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F3F5FC] text-black hover:bg-[#E1E5F9]"
          >
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
