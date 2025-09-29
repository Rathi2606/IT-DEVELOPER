import React, { useState } from 'react';
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
  Settings,
  Bell,
  User,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const stats = [
    { title: 'Total Tasks', value: 42, icon: Target, trend: '+12%', color: 'from-blue-500 to-blue-600' },
    { title: 'Completed', value: 28, icon: CheckCircle2, trend: '+8%', color: 'from-green-500 to-green-600' },
    { title: 'In Progress', value: 10, icon: Clock, trend: '+5%', color: 'from-yellow-500 to-yellow-600' },
    { title: 'Overdue', value: 4, icon: AlertCircle, trend: '-2%', color: 'from-red-500 to-red-600' }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Design new dashboard',
      description: 'Create a modern, responsive dashboard interface',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      assignee: { name: 'Sarah Chen', avatar: 'SC' },
      tags: ['Design', 'Frontend']
    },
    {
      id: 2,
      title: 'User research',
      description: 'Conduct user interviews and analyze feedback',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-18',
      assignee: { name: 'Mike Johnson', avatar: 'MJ' },
      tags: ['Research', 'UX']
    },
    {
      id: 3,
      title: 'API documentation',
      description: 'Document all endpoints and provide usage examples',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-12',
      assignee: { name: 'Alex Rivera', avatar: 'AR' },
      tags: ['Documentation', 'API']
    },
    {
      id: 4,
      title: 'Database optimization',
      description: 'Optimize database queries and reduce load times',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-20',
      assignee: { name: 'Emma Davis', avatar: 'ED' },
      tags: ['Performance', 'Backend']
    },
    {
      id: 5,
      title: 'Frontend development',
      description: 'Implement responsive components and interactions',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-22',
      assignee: { name: 'James Wilson', avatar: 'JW' },
      tags: ['Frontend', 'React']
    },
    {
      id: 6,
      title: 'Initial wireframes',
      description: 'Create low-fidelity wireframes for user flows',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-10',
      assignee: { name: 'Sarah Chen', avatar: 'SC' },
      tags: ['Design', 'UX']
    },
    {
      id: 7,
      title: 'Logo design',
      description: 'Design brand identity and logo variations',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-08',
      assignee: { name: 'David Kim', avatar: 'DK' },
      tags: ['Branding', 'Design']
    },
    {
      id: 8,
      title: 'Project setup',
      description: 'Initialize project structure and development environment',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-05',
      assignee: { name: 'Emma Davis', avatar: 'ED' },
      tags: ['Setup', 'DevOps']
    }
  ];

  const recentActivity = [
    { id: 1, action: 'completed', task: 'API documentation', user: 'Alex Rivera', time: '2 hours ago' },
    { id: 2, action: 'commented on', task: 'Design new dashboard', user: 'Mike Johnson', time: '4 hours ago' },
    { id: 3, action: 'created', task: 'User research', user: 'Sarah Chen', time: '6 hours ago' },
    { id: 4, action: 'updated', task: 'Database optimization', user: 'Emma Davis', time: '1 day ago' }
  ];

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

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">TaskLane</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
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
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
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
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeFilter === filter
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{task.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                              {task.assignee.avatar}
                            </div>
                            <span>{task.assignee.name}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="ml-4 p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
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
                ))}
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Alpha</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">3</div>
                    <div className="text-xs text-gray-500">To Do</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">4</div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">5</div>
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
    </div>
  );
};

export default Dashboard;