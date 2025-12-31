import React, { useState } from 'react';
import { UserPlus, X, Crown, Shield, Trash2, Mail } from 'lucide-react';
import {
  useGetBoardMembersQuery,
  useAddMemberToBoardMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberFromBoardMutation,
} from '../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const BoardMembersDialog = ({ isOpen, onClose, boardId, isOwner }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const { data: members = [], refetch } = useGetBoardMembersQuery(boardId, { skip: !boardId });
  const [addMember] = useAddMemberToBoardMutation();
  const [updateRole] = useUpdateMemberRoleMutation();
  const [removeMember] = useRemoveMemberFromBoardMutation();

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await addMember({ boardId, email, role }).unwrap();
      setEmail('');
      setRole('member');
      refetch();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please check the email and try again.');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateRole({ boardId, userId, role: newRole }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      await removeMember({ boardId, userId }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Board Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Member Form */}
          <form onSubmit={handleAddMember} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold mb-2">
                Add Member
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Members ({members.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {member.role === 'admin' ? (
                      <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        <span>Admin</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        <span>Member</span>
                      </span>
                    )}

                    {isOwner && (
                      <div className="flex items-center space-x-1">
                        {member.role === 'member' && (
                          <button
                            onClick={() => handleUpdateRole(member.userId, 'admin')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Promote to admin"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        {member.role === 'admin' && (
                          <button
                            onClick={() => handleUpdateRole(member.userId, 'member')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Demote to member"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardMembersDialog;