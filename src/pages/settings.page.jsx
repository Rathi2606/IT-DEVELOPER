import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Database,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";

export default function TaskLaneSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    notifications: {
      email: true,
      push: true,
      taskAssigned: true,
      taskCompleted: false,
      mentions: true,
    },
    theme: "light",
    accentColor: "#3b82f6",
    language: "en",
    autoArchive: true,
    weekStart: "monday",
  });

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Database },
  ];

  const handleToggle = (category, field) => {
    if (category) {
      setSettings((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: !prev[category][field],
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            T
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              TaskLane Settings
            </h1>
            <p className="text-sm text-slate-500">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 bg-white rounded-xl border p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="col-span-12 md:col-span-9 bg-white rounded-xl border p-6">
          {activeSection === "profile" && (
            <>
              <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              <input
                className="w-full border rounded-lg px-4 py-2 mb-4"
                value={settings.name}
                onChange={(e) =>
                  handleInputChange("name", e.target.value)
                }
              />
              <input
                className="w-full border rounded-lg px-4 py-2"
                value={settings.email}
                onChange={(e) =>
                  handleInputChange("email", e.target.value)
                }
              />
            </>
          )}

          {activeSection === "preferences" && (
            <ToggleItem
              label="Auto-archive completed tasks"
              description="Automatically archive after 30 days"
              checked={settings.autoArchive}
              onChange={() => handleToggle(null, "autoArchive")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ label, description, checked, onChange }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-slate-500">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
