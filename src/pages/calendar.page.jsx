import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllBoardsQuery, useGetCardsByBoardQuery } from "../lib/api";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: boards } = useGetAllBoardsQuery();
  const selectedBoardId = boards && boards.length > 0 ? boards[0]._id : null;
  const { data: cards } = useGetCardsByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  });

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get tasks for a specific date
  const getTasksForDate = (day) => {
    if (!cards) return [];
    const dateStr = new Date(year, month, day).toDateString();
    return cards.filter((card) => {
      if (!card.dueDate) return false;
      return new Date(card.dueDate).toDateString() === dateStr;
    });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 border-red-300 text-red-700";
      case "Medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-700";
      case "Low":
        return "bg-green-100 border-green-300 text-green-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="p-2 bg-gray-50"></div>
    );
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const tasksForDay = getTasksForDate(day);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        className={`min-h-24 p-2 border border-gray-200 bg-white transition-all hover:bg-gray-50 ${
          isToday ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <div
          className={`text-sm font-semibold mb-2 ${
            isToday ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {day}
        </div>
        <div className="space-y-1">
          {tasksForDay.slice(0, 2).map((task) => (
            <div
              key={task._id}
              className={`text-xs p-1 rounded border truncate ${getPriorityColor(
                task.priority
              )}`}
              title={task.title}
            >
              {task.title}
            </div>
          ))}
          {tasksForDay.length > 2 && (
            <div className="text-xs text-gray-500 font-medium">
              +{tasksForDay.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  }

  // Stats
  const totalTasks = cards?.length || 0;
  const tasksWithDueDate = cards?.filter((c) => c.dueDate).length || 0;
  const overdueTasks =
    cards?.filter(
      (c) =>
        c.dueDate && new Date(c.dueDate) < new Date() && c.columnId !== "done"
    ).length || 0;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Calendar View
          </h1>
          <p className="text-gray-600 mt-1">
            View your tasks organized by due date
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tasksWithDueDate}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-semibold text-gray-700"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">{calendarDays}</div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Priority Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-sm text-gray-700">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
              <span className="text-sm text-gray-700">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm text-gray-700">Low Priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
