"use client";
import { useSession } from "next-auth/react";
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
import { PlusIcon, UserRoundPlus, X } from "lucide-react";
import axios from "axios";

export function AddMembersPopup() {
  const { data: session } = useSession();
  if (!session) return <div>Team not found...</div>;
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMember(e.target.value);
  };

  const handleAddMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers((prev) => [...prev, newMember]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (email: string) => {
    setMembers((prev) => prev.filter((member) => member !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    async function getTeamId() {
      let teamId = localStorage.getItem("teamId");
      if (!teamId) {
        const res = await axios.post("/api/team/my", {
          params: {
            userId: session?.user.id,
          },
        });
        console.log("add-members-popup.tsx: get teamId : res", res);
        teamId = res.data.data[0].id;
      }
      localStorage.setItem("teamId", teamId as string);
      return teamId;
    }
    const teamId = getTeamId();

    const res = await axios.post(`/api/team/addMembers/${teamId}`, {
      membersEmail: members,
    });
    console.log("add-members-popup.tsx: api/team/addMembers : res", res);
    setIsOpen(false);
    setMembers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex hover:text-slate-600"
          onClick={() => setIsOpen(true)}
        >
          <UserRoundPlus />
          <span className="pl-3">Add Members</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={newMember}
                onChange={handleInputChange}
                placeholder="Enter member email"
              />
              <Button
                type="button"
                onClick={handleAddMember}
                className="bg-[#F3F5FC] text-black hover:bg-[#E1E5F9]"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Add member</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Members to Add</Label>
            <ul className="mt-2 space-y-1">
              {members.map((member, index) => (
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
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F3F5FC] text-black hover:bg-[#E1E5F9]"
          >
            Add Members to Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
