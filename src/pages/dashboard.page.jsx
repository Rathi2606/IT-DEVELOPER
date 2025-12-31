import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  MoreHorizontal,
  ChevronDown,
  X,
  Loader
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import {
  useCreateBoardMutation,
  useGetAllBoardsQuery,
  useGetColumnsByBoardQuery,
  useGetCardsByBoardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useMoveCardMutation,
  useDeleteCardMutation
} from '../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [activeFilter, setActiveFilter] = useState('all');

  console.log('Dashboard: rendering, isLoaded', isLoaded, 'user', user);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });

  // API Hooks
  const { data: boards, isLoading: boardsLoading } = useGetAllBoardsQuery();
  const [createBoardMutation] = useCreateBoardMutation();
  const [createCardMutation] = useCreateCardMutation();
  const [updateCardMutation] = useUpdateCardMutation();
  const [moveCardMutation] = useMoveCardMutation();
  const [deleteCardMutation] = useDeleteCardMutation();

  const { data: columns, refetch: refetchColumns } = useGetColumnsByBoardQuery(
    selectedBoardId,
    { skip: !selectedBoardId }
  );

  const { data: cards, isLoading: cardsLoading, refetch: refetchCards } = useGetCardsByBoardQuery(
    selectedBoardId,
    { skip: !selectedBoardId }
  );

  // Initialize board
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    const initializeBoard = async () => {
      if (!selectedBoardId && boards && boards.length > 0) {
        setSelectedBoardId(boards[0]._id);
      } else if (!selectedBoardId && boards && boards.length === 0) {
        try {
          const result = await createBoardMutation({ name: 'My Board', description: 'Default board' }).unwrap();
          if (result && result.id) {
            setSelectedBoardId(result.id);
          }
        } catch (error) {
          console.error('Error creating board:', error);
        }
      }
    };

    initializeBoard();
  }, [boards, isLoaded, user, selectedBoardId, createBoardMutation]);

  // Map backend data to display format
  const tasks = cards ? cards.map(card => {
    const statusMap = {
      'To Do': 'todo',
      'In Progress': 'in-progress',
      'Done': 'completed'
    };
    
    const column = columns?.find(col => col._id === card.columnId);
    const status = column ? statusMap[column.title] || 'todo' : 'todo';

    return {
      id: card._id,
      title: card.title,
      description: card.description,
      priority: card.priority?.toLowerCase() || 'medium',
      status: status,
      dueDate: card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : null,
      assignee: card.assignees?.[0] ? {
        name: card.assignees[0].name || 'Unknown',
        avatar: card.assignees[0].initials || 'U'
      } : null,
      tags: card.labels || [],
      columnId: card.columnId
    };
  }) : [];

  // Calculate stats
  const stats = [
    { 
      title: 'Total Tasks', 
      value: tasks.length, 
      icon: Target, 
      trend: '+12%', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      title: 'Completed', 
      value: tasks.filter(t => t.status === 'completed').length, 
      icon: CheckCircle2, 
      trend: '+8%', 
      color: 'from-green-500 to-green-600' 
    },
    { 
      title: 'In Progress', 
      value: tasks.filter(t => t.status === 'in-progress').length, 
      icon: Clock, 
      trend: '+5%', 
      color: 'from-yellow-500 to-yellow-600' 
    },
    { 
      title: 'To Do', 
      value: tasks.filter(t => t.status === 'todo').length, 
      icon: AlertCircle, 
      trend: '-2%', 
      color: 'from-red-500 to-red-600' 
    }
  ];

  const recentActivity = tasks.slice(0, 4).map((task, index) => ({
    id: index + 1,
    action: task.status === 'completed' ? 'completed' : 'updated',
    task: task.title,
    user: task.assignee?.name || 'User',
    time: '2 hours ago'
  }));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'todo': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.currentTarget.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || !columns) return;

    const statusColumnMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Done'
    };

    const targetColumnTitle = statusColumnMap[newStatus];
    const targetColumn = columns.find(col => col.title === targetColumnTitle);
    const sourceColumn = columns.find(col => col._id === draggedTask.columnId);

    if (!targetColumn || !sourceColumn) return;

    if (draggedTask.columnId === targetColumn._id) {
      setDraggedTask(null);
      return;
    }

    try {
      await moveCardMutation({
        cardId: draggedTask.id,
        fromColumnId: draggedTask.columnId,
        toColumnId: targetColumn._id,
        newPosition: 0
      }).unwrap();

      await refetchCards();
    } catch (error) {
      console.error('Error moving task:', error);
    }

    setDraggedTask(null);
  };

  const openTaskDialog = () => {
    setEditMode(false);
    setTaskFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'todo'
    });
    setShowTaskDialog(true);
  };

  const openEditDialog = (task) => {
    setEditMode(true);
    setTaskFormData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      status: task.status,
      columnId: task.columnId
    });
    setShowTaskDialog(true);
    setShowTaskDetailModal(false);
  };

  const handleSubmitTask = async () => {
    if (!taskFormData.title.trim() || !columns || !selectedBoardId) return;

    const statusColumnMap = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Done'
    };

    const targetColumnTitle = statusColumnMap[taskFormData.status];
    const targetColumn = columns.find(col => col.title === targetColumnTitle);

    if (!targetColumn) return;

    try {
      if (editMode) {
        // Update existing task
        await updateCardMutation({
          cardId: taskFormData.id,
          title: taskFormData.title,
          description: taskFormData.description,
          priority: taskFormData.priority.charAt(0).toUpperCase() + taskFormData.priority.slice(1),
          dueDate: taskFormData.dueDate || undefined,
          columnId: targetColumn._id,
          boardId: selectedBoardId
        }).unwrap();
      } else {
        // Create new task
        await createCardMutation({
          title: taskFormData.title,
          description: taskFormData.description,
          priority: taskFormData.priority.charAt(0).toUpperCase() + taskFormData.priority.slice(1),
          dueDate: taskFormData.dueDate || undefined,
          labels: [],
          subtasks: [],
          assignees: [],
          columnId: targetColumn._id,
          boardId: selectedBoardId,
          position: 0
        }).unwrap();
      }

      setShowTaskDialog(false);
      await refetchCards();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteCardMutation(taskId).unwrap();
      setShowTaskDetailModal(false);
      await refetchCards();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isLoaded || boardsLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'User'}!</h2>
          <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                  <button 
                    onClick={openTaskDialog}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Task</span>
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {['all', 'todo', 'in-progress', 'completed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        onDragOver={filter !== 'all' ? handleDragOver : undefined}
                        onDrop={filter !== 'all' ? (e) => handleDrop(e, filter) : undefined}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeFilter === filter
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        } ${filter !== 'all' && draggedTask ? 'ring-2 ring-purple-300 ring-opacity-50' : ''}`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleTaskClick(task)}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {task.dueDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{task.dueDate}</span>
                              </div>
                            )}
                            {task.assignee && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                                  {task.assignee.avatar}
                                </div>
                                <span>{task.assignee.name}</span>
                              </div>
                            )}
                          </div>
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {task.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="ml-4 p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium">{activity.task}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" 
                      style={{ 
                        width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tasks.filter(t => t.status === 'todo').length}</div>
                    <div className="text-xs text-gray-500">To Do</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tasks.filter(t => t.status === 'in-progress').length}</div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tasks.filter(t => t.status === 'completed').length}</div>
                    <div className="text-xs text-gray-500">Done</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              <div className="space-y-3">
                {['Sarah Chen', 'Mike Johnson', 'Alex Rivera', 'Emma Davis', 'James Wilson'].map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Create Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription className="text-base">
              {editMode ? 'Update task details below' : 'Fill in the details to create a new task'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold mb-2">Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold mb-2">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority" className="text-sm font-semibold mb-2">Priority</Label>
                <select
                  id="priority"
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-semibold mb-2">Status</Label>
                <select
                  id="status"
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-sm font-semibold mb-2">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTask} className="bg-gradient-to-r from-purple-500 to-purple-600">
              {editMode ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Modal */}
      {showTaskDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 pr-8">{selectedTask.title}</h2>
                <button
                  onClick={() => setShowTaskDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedTask.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block uppercase tracking-wide">
                      Priority
                    </label>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1.5 rounded ${
                        getPriorityColor(selectedTask.priority)
                      }`}
                    >
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block uppercase tracking-wide">
                      Status
                    </label>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1.5 rounded ${
                        getStatusColor(selectedTask.status)
                      }`}
                    >
                      {selectedTask.status.replace('-', ' ').charAt(0).toUpperCase() + selectedTask.status.replace('-', ' ').slice(1)}
                    </span>
                  </div>
                </div>

                {selectedTask.dueDate && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block uppercase tracking-wide">
                      Due Date
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600 font-medium">
                        {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {selectedTask.tags && selectedTask.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block uppercase tracking-wide">Labels</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-3 py-1.5 rounded bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.assignee && (
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block uppercase tracking-wide">
                      Assignee
                    </label>
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg inline-flex">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {selectedTask.assignee.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => openEditDialog(selectedTask)}
                    className="px-6 py-2.5 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete Task
                  </button>
                  <button
                    onClick={() => setShowTaskDetailModal(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors ml-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;