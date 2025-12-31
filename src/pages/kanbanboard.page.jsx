import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Loader,
  Send,
  MessageSquare,
  Calendar,
  User,
  X,
  AlertCircle,
  Flag,
  Edit2,
  Users,
  CheckCircle2,
  Bell,
  FileText,
  Paperclip,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import {
  useGetAllBoardsQuery,
  useGetBoardByIdQuery,
  useGetColumnsByBoardQuery,
  useGetCardsByBoardQuery,
  useCreateBoardMutation,
  useCreateCardMutation,
  useDeleteCardMutation,
  useMoveCardMutation,
  useCreateCommentMutation,
  useGetCommentsByCardQuery,
  useUpdateCardMutation,
  useAddMemberToBoardMutation,
  useGetBoardMembersQuery,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const KanbanBoard = () => {
  const { isLoaded, user } = useUser();

  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [selectedLane, setSelectedLane] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [comment, setComment] = useState("");
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showBoardMembersDialog, setShowBoardMembersDialog] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [completedSubtasks, setCompletedSubtasks] = useState({});

  const { data: boards, isLoading: boardsLoading } = useGetAllBoardsQuery();
  const { data: board } = useGetBoardByIdQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });
  const { data: columns, isLoading: columnsLoading } = useGetColumnsByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });
  const {
    data: cards,
    refetch: refetchCards,
  } = useGetCardsByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });

  const { data: comments = [] } = useGetCommentsByCardQuery(
    selectedCard?._id,
    { skip: !selectedCard }
  );

  const { data: boardMembers } = useGetBoardMembersQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });

  const { data: notifications = [] } = useGetUserNotificationsQuery();

  const [createBoard] = useCreateBoardMutation();
  const [createCard] = useCreateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [moveCard] = useMoveCardMutation();
  const [createComment] = useCreateCommentMutation();
  const [updateCard] = useUpdateCardMutation();
  const [addMemberToBoard] = useAddMemberToBoardMutation();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  /* INIT BOARD */
  useEffect(() => {
    if (!isLoaded || !boards) return;

    if (!selectedBoardId && boards.length > 0) {
      setSelectedBoardId(boards[0]._id);
    }

    if (!selectedBoardId && boards.length === 0) {
      createBoard({ name: "My Board" })
        .unwrap()
        .then((res) => setSelectedBoardId(res.id))
        .catch((err) => {
          setError("Failed to create board");
          console.error(err);
        });
    }
  }, [boards, selectedBoardId, isLoaded, createBoard]);

  /* CREATE TASK */
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    if (!selectedLane) {
      setError("Please select a column");
      return;
    }

    try {
      setError(null);
      const cardPayload = {
        title: taskTitle.trim(),
        boardId: selectedBoardId,
        columnId: selectedLane,
      };

      if (taskDescription.trim()) {
        cardPayload.description = taskDescription.trim();
      }

      cardPayload.priority = taskPriority;

      if (taskDueDate) {
        cardPayload.dueDate = new Date(taskDueDate).toISOString();
      }

      if (user && user.id) {
        cardPayload.assignees = [{
          userId: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
          initials: ((user.firstName || "U")[0] + (user.lastName?.[0] || "")).toUpperCase(),
        }];
      }

      await createCard(cardPayload).unwrap();

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setShowTaskDialog(false);
      refetchCards();
    } catch (err) {
      console.error("Error creating card:", err);
      setError(`Failed to create task: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* UPDATE TASK */
  const handleUpdateTask = async () => {
    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setError(null);
      const updatePayload = {
        title: taskTitle.trim(),
      };

      if (taskDescription.trim()) {
        updatePayload.description = taskDescription.trim();
      }

      updatePayload.priority = taskPriority;

      if (taskDueDate) {
        updatePayload.dueDate = new Date(taskDueDate).toISOString();
      }

      if (selectedCard.subtasks) {
        updatePayload.subtasks = selectedCard.subtasks;
      }

      await updateCard({ cardId: selectedCard._id, ...updatePayload }).unwrap();

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setShowEditTaskDialog(false);
      setShowCardDetailsModal(false);
      setSelectedCard(null);
      refetchCards();
    } catch (err) {
      console.error("Error updating card:", err);
      setError(`Failed to update task: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* DELETE TASK */
  const handleDeleteTask = async (id, e) => {
    if (e) e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setError(null);
      await deleteCard(id).unwrap();
      if (selectedCard?._id === id) {
        setSelectedCard(null);
        setShowCardDetailsModal(false);
      }
      refetchCards();
    } catch (err) {
      console.error("Error deleting card:", err);
      setError(`Failed to delete task: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* DROP HANDLER */
  const handleDrop = async (e, destinationColumnId) => {
    e.preventDefault();
    setHoveredCol(null);

    const raw =
      e.dataTransfer.getData("application/json") ||
      e.dataTransfer.getData("text/plain");

    if (!raw) return;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    const { cardId, fromColumnId } = parsed;

    if (!cardId) return;

    if (fromColumnId === destinationColumnId) {
      return;
    }

    try {
      setError(null);
      await moveCard({
        cardId,
        fromColumnId,
        toColumnId: destinationColumnId,
        newPosition: 0,
      }).unwrap();

      refetchCards();
    } catch (err) {
      console.error("Error moving card:", err);
      setError(`Failed to move task: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* COMMENT */
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setError(null);
      await createComment({
        cardId: selectedCard._id,
        content: comment.trim(),
      }).unwrap();

      setComment("");
      refetchCards();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(`Failed to add comment: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* ADD SUBTASK */
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;

    try {
      setError(null);
      const updatedSubtasks = [...(selectedCard.subtasks || []), { title: newSubtask, completed: false }];
      await updateCard({
        cardId: selectedCard._id,
        subtasks: updatedSubtasks,
      }).unwrap();

      setNewSubtask("");
      setSelectedCard({ ...selectedCard, subtasks: updatedSubtasks });
      refetchCards();
    } catch (err) {
      console.error("Error adding subtask:", err);
      setError(`Failed to add subtask: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* TOGGLE SUBTASK */
  const handleToggleSubtask = (index) => {
    setCompletedSubtasks({
      ...completedSubtasks,
      [index]: !completedSubtasks[index],
    });
  };

  /* INVITE MEMBER */
  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setError("Please enter an email");
      return;
    }

    try {
      setError(null);
      await addMemberToBoard({
        boardId: selectedBoardId,
        email: inviteEmail.trim(),
        role: "member",
      }).unwrap();

      setInviteEmail("");
      setError(null);
      alert("Member invited successfully!");
    } catch (err) {
      console.error("Error inviting member:", err);
      setError(`Failed to invite member: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  /* GET PRIORITY COLOR */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-50";
      case "Medium":
        return "text-yellow-500 bg-yellow-50";
      case "Low":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(n => n)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  if (!isLoaded || boardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
        <Loader className="animate-spin w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  const hasCards = cards && cards.length > 0;
  const firstColumn = columns && columns.length > 0 ? columns[0] : null;

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-100 p-6 overflow-y-auto">
      <div>
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {board?.name || "Kanban Board"}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your tasks efficiently with drag and drop
            </p>
          </div>
          <div className="flex gap-2">
            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                className="relative p-2 hover:bg-white rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6 text-indigo-600" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {showNotificationsPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 ${!notif.read ? "bg-blue-50" : ""}`}
                          onClick={() => markNotificationAsRead(notif._id)}
                        >
                          <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Members Button */}
            <Button
              onClick={() => setShowBoardMembersDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Users className="w-4 h-4 mr-2" /> Members
            </Button>

            {/* Create First Task Button */}
            {!hasCards && firstColumn && (
              <Button
                onClick={() => {
                  setSelectedLane(firstColumn._id);
                  setShowTaskDialog(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Create First Task
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!hasCards && firstColumn && columnsLoading === false && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No tasks yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first task to get started
            </p>
          </div>
        )}

        {/* Kanban Board */}
        {columnsLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin w-6 h-6 text-indigo-600" />
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns?.map((col) => {
              const colCards = cards?.filter((c) => c.columnId === col._id) || [];
              return (
                <div
                  key={col._id}
                  className={`flex-shrink-0 w-96 bg-white rounded-lg shadow-sm transition-all ${
                    hoveredCol === col._id ? "ring-2 ring-indigo-400 shadow-md" : ""
                  }`}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-gray-800">{col.title}</h2>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {colCards.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div
                    className="min-h-96 p-4 space-y-3 max-h-[600px] overflow-y-auto"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setHoveredCol(col._id);
                    }}
                    onDragEnter={() => setHoveredCol(col._id)}
                    onDragLeave={() => setHoveredCol(null)}
                    onDrop={(e) => {
                      handleDrop(e, col._id);
                    }}
                  >
                    {colCards.map((card) => (
                      <div
                        key={card._id}
                        draggable
                        onDragStart={(e) => {
                          const payload = JSON.stringify({
                            cardId: card._id,
                            fromColumnId: col._id,
                          });

                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("application/json", payload);
                          e.dataTransfer.setData("text/plain", payload);
                        }}
                        onDragEnd={() => setHoveredCol(null)}
                        onClick={() => {
                          setSelectedCard(card);
                          setShowCardDetailsModal(true);
                          setCompletedSubtasks({});
                        }}
                        className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md hover:border-indigo-300 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-800 flex-1 text-sm line-clamp-2">
                            {card.title}
                          </h3>
                          <Trash2
                            className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-600 transition-all"
                            onClick={(e) => handleDeleteTask(card._id, e)}
                          />
                        </div>

                        {/* Card Metadata */}
                        <div className="space-y-2 text-xs">
                          {card.priority && (
                            <div className={`flex items-center gap-1 w-fit px-2 py-1 rounded ${getPriorityColor(card.priority)}`}>
                              <Flag className="w-3 h-3" />
                              {card.priority}
                            </div>
                          )}

                          {card.dueDate && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {formatDueDate(card.dueDate)}
                            </div>
                          )}

                          {card.assignees && card.assignees.length > 0 && (
                            <div className="flex items-center gap-1">
                              {card.assignees.slice(0, 2).map((assignee, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-semibold"
                                  title={assignee.name}
                                >
                                  {assignee.initials || getInitials(assignee.name)}
                                </div>
                              ))}
                              {card.assignees.length > 2 && (
                                <span className="text-gray-600">
                                  +{card.assignees.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {card.subtasks && card.subtasks.length > 0 && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <CheckCircle2 className="w-3 h-3" />
                              {card.subtasks.filter((st) => st.completed).length}/{card.subtasks.length}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Card Button */}
                    <Button
                      variant="outline"
                      className="w-full mt-2 text-gray-600 border-dashed border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                      onClick={() => {
                        setSelectedLane(col._id);
                        setShowTaskDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Task
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE TASK DIALOG */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Task Title *
              </label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateTask}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Create Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTaskDialog(false);
                  setTaskTitle("");
                  setTaskDescription("");
                  setTaskPriority("Medium");
                  setTaskDueDate("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT TASK DIALOG */}
      {selectedCard && (
        <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Task Title *
                </label>
                <Input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleUpdateTask}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditTaskDialog(false);
                    setTaskTitle("");
                    setTaskDescription("");
                    setTaskPriority("Medium");
                    setTaskDueDate("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* CARD DETAILS MODAL */}
      {selectedCard && (
        <Dialog open={showCardDetailsModal} onOpenChange={setShowCardDetailsModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <DialogTitle className="text-xl">{selectedCard.title}</DialogTitle>
                <button
                  onClick={() => setShowCardDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Description */}
              {selectedCard.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedCard.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedCard.priority && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Priority
                    </label>
                    <div
                      className={`flex items-center gap-2 w-fit px-3 py-1 rounded text-sm ${getPriorityColor(
                        selectedCard.priority
                      )}`}
                    >
                      <Flag className="w-4 h-4" />
                      {selectedCard.priority}
                    </div>
                  </div>
                )}

                {selectedCard.dueDate && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Due Date
                    </label>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatDueDate(selectedCard.dueDate)}
                    </div>
                  </div>
                )}
              </div>

              {/* Assignees */}
              {selectedCard.assignees && selectedCard.assignees.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-2">
                    Assigned To
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {selectedCard.assignees.map((assignee, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-semibold">
                          {assignee.initials || getInitials(assignee.name)}
                        </div>
                        <span className="text-sm text-gray-800">{assignee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks */}
              {selectedCard.subtasks && selectedCard.subtasks.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-2">
                    Subtasks
                  </label>
                  <div className="space-y-2">
                    {selectedCard.subtasks.map((subtask, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={completedSubtasks[idx] || subtask.completed}
                          onChange={() => handleToggleSubtask(idx)}
                          className="w-4 h-4 rounded"
                        />
                        <span className={`text-sm ${completedSubtasks[idx] ? "line-through text-gray-400" : "text-gray-700"}`}>
                          {subtask.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Subtask */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">
                  Add Subtask
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddSubtask}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
                </h3>

                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c._id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <p className="text-sm text-gray-800">{c.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {c.createdBy && `By ${c.createdBy.name}`}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="border-t pt-4 flex gap-2">
                <Button
                  onClick={() => {
                    setTaskTitle(selectedCard.title);
                    setTaskDescription(selectedCard.description || "");
                    setTaskPriority(selectedCard.priority || "Medium");
                    setTaskDueDate(selectedCard.dueDate ? new Date(selectedCard.dueDate).toISOString().split('T')[0] : "");
                    setShowCardDetailsModal(false);
                    setShowEditTaskDialog(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Task
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteTask(selectedCard._id);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* BOARD MEMBERS DIALOG */}
      <Dialog open={showBoardMembersDialog} onOpenChange={setShowBoardMembersDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Board Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Current Members */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Members</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {boardMembers && boardMembers.length > 0 ? (
                  boardMembers.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-semibold">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold">
                        {member.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No members yet</p>
                )}
              </div>
            </div>

            {/* Invite New Member */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Invite Member</h3>
              <div className="flex gap-2">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email to invite"
                  className="flex-1"
                />
                <Button
                  onClick={handleInviteMember}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
