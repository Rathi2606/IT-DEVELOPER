import React, { useState } from "react";
import { Plus, Clock, CheckCircle2, AlertCircle, Calendar, Flag, User } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useGetAllBoardsQuery, useGetCardsByBoardQuery, useCreateCardMutation, useGetColumnsByBoardQuery } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const QuickActionPage = ({ filter = "all" }) => {
  const { user } = useUser();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");

  const { data: boards } = useGetAllBoardsQuery();
  const selectedBoardId = boards && boards.length > 0 ? boards[0]._id : null;
  const { data: cards, refetch: refetchCards } = useGetCardsByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });
  const { data: columns } = useGetColumnsByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });

  const [createCard] = useCreateCardMutation();
 
  // Get filtered tasks based on the filter type
  const getFilteredTasks = () => {
    if (!cards) return [];
    
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    switch (filter) {
      case "in-progress":
        return cards.filter(
          (card) =>
            columns?.find((col) => col._id === card.columnId)?.title ===
            "In Progress"
        );
      case "completed":
        return cards.filter(
          (card) =>
            columns?.find((col) => col._id === card.columnId)?.title === "Done"
        );
      case "due-soon":
        return cards.filter((card) => {
          if (!card.dueDate) return false;
          const dueDate = new Date(card.dueDate);
          return dueDate >= today && dueDate <= sevenDaysFromNow;
        });
      case "new-task":
        return [];
      default:
        return cards;
    }
  };

  // Create task
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    // Find the "To Do" column
    const todoColumn = columns?.find((col) => col.title === "To Do");
    if (!todoColumn) {
      alert("No 'To Do' column found");
      return;
    }

    try {
      const cardPayload = {
        title: taskTitle.trim(),
        boardId: selectedBoardId,
        columnId: todoColumn._id,
      };

      if (taskDescription.trim()) {
        cardPayload.description = taskDescription.trim();
      }

      cardPayload.priority = taskPriority;

      if (taskDueDate) {
        cardPayload.dueDate = new Date(taskDueDate).toISOString();
      }

      if (user && user.id) {
        cardPayload.assignees = [
          {
            userId: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
            initials: ((user.firstName || "U")[0] + (user.lastName?.[0] || "")).toUpperCase(),
          },
        ];
      }

      await createCard(cardPayload).unwrap();

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setShowCreateDialog(false);
      refetchCards();
      alert("Task created successfully!");
    } catch (err) {
      alert(`Failed to create task: ${err?.data?.message || err?.message || "Unknown error"}`);
    }
  };

  // Get page details
  const getPageDetails = () => {
    switch (filter) {
      case "new-task":
        return {
          title: "Add New Task",
          description: "Create a new task quickly",
          icon: Plus,
          color: "blue",
        };
      case "in-progress":
        return {
          title: "In Progress Tasks",
          description: "View all tasks currently in progress",
          icon: Clock,
          color: "yellow",
        };
      case "completed":
        return {
          title: "Completed Tasks",
          description: "View all completed tasks",
          icon: CheckCircle2,
          color: "green",
        };
      case "due-soon":
        return {
          title: "Due Soon",
          description: "Tasks due within the next 7 days",
          icon: AlertCircle,
          color: "red",
        };
      default:
        return {
          title: "All Tasks",
          description: "View all your tasks",
          icon: CheckCircle2,
          color: "blue",
        };
    }
  };

  const pageDetails = getPageDetails();
  const filteredTasks = getFilteredTasks();
  const IconComponent = pageDetails.icon;

  // Get priority color
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

  // Format due date
  const formatDueDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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
    <div className="h-full bg-gradient-to-b from-blue-50 to-white p-6 overflow-y-auto">
      <div>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <IconComponent className={`w-8 h-8 text-${pageDetails.color}-600`} />
              {pageDetails.title}
            </h1>
            <p className="text-gray-600 mt-1">{pageDetails.description}</p>
          </div>
          {filter === "new-task" && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredTasks.length}
                </p>
              </div>
              <IconComponent className={`w-10 h-10 text-${pageDetails.color}-500`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredTasks.filter((t) => t.priority === "High").length}
                </p>
              </div>
              <Flag className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">With Due Date</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredTasks.filter((t) => t.dueDate).length}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Task List */}
        {filter === "new-task" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Create a New Task
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button above to create a new task quickly
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  {task.priority && (
                    <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                      <Flag className="w-3 h-3" />
                      {task.priority}
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {formatDueDate(task.dueDate)}
                    </div>
                  )}
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex items-center gap-1">
                      {task.assignees.slice(0, 3).map((assignee, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold"
                          title={assignee.name}
                        >
                          {assignee.initials || getInitials(assignee.name)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <IconComponent className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No tasks found
            </h2>
            <p className="text-gray-600">
              There are no {pageDetails.title.toLowerCase()} at the moment
            </p>
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Create Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
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
    </div>
  );
};

export default QuickActionPage;
