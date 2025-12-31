import React, { useState } from "react";
import { Users2, Mail, Crown, UserPlus, Search, Trash2, Shield } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import {
  useGetAllBoardsQuery,
  useGetBoardMembersQuery,
  useAddMemberToBoardMutation,
  useRemoveMemberFromBoardMutation,
} from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const TeamPage = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");  const { data: boards } = useGetAllBoardsQuery();
  const selectedBoardId = boards && boards.length > 0 ? boards[0]._id : null;
  const { data: boardMembers } = useGetBoardMembersQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });

  const [addMemberToBoard] = useAddMemberToBoardMutation();
  const [removeMemberFromBoard] = useRemoveMemberFromBoardMutation();

  // Get the board owner
  const boardOwner = boards && boards.length > 0 ? boards[0].userId : null;

  // Handle invite member
  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;

    try {
      await addMemberToBoard({
        boardId: selectedBoardId,
        email: inviteEmail.trim(),
        role: "member",
      }).unwrap();

      alert("Member invited successfully!");
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (err) {
      alert(`Failed to invite member: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeMemberFromBoard({
        boardId: selectedBoardId,
        userId: memberId,
      }).unwrap();

      alert("Member removed successfully!");
    } catch (err) {
      alert(`Failed to remove member: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  // Filter members by search query
  const filteredMembers = boardMembers?.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter((n) => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-6">
      <div>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Users2 className="w-8 h-8 text-blue-600" />
              Team Members
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your board team and collaborate effectively
            </p>
          </div>
          <Button
            onClick={() => setShowInviteDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-800">
                  {boardMembers?.length || 0}
                </p>
              </div>
              <Users2 className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Admins</p>
                <p className="text-2xl font-bold text-gray-800">
                  {boardMembers?.filter((m) => m.role === "admin").length || 0}
                </p>
              </div>
              <Shield className="w-10 h-10 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Regular Members</p>
                <p className="text-2xl font-bold text-gray-800">
                  {boardMembers?.filter((m) => m.role === "member").length || 0}
                </p>
              </div>
              <Users2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6  border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">All Members</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.userId}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {member.name}
                        </h3>
                        {member.userId === boardOwner && (
                          <Crown className="w-4 h-4 text-yellow-500" title="Board Owner" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.role === "admin" ? "Admin" : "Member"}
                    </span>
                    {user?.id === boardOwner && member.userId !== boardOwner && (
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                No members found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email Address
              </label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter member's email"
                className="w-full"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleInviteMember}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Send Invitation
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteDialog(false);
                  setInviteEmail("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamPage;
