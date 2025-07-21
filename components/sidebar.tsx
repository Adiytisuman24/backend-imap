'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Settings, Database, Sparkles, BarChart3, Users, Brain, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'emails', label: 'Inbox', icon: Mail },
    { id: 'accounts', label: 'Accounts', icon: Users },
    { id: 'context', label: 'AI Context', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-4 shadow-lg">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OneBox
            </h1>
            <p className="text-xs text-gray-500">AI Email Hub</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:shadow-md'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <h3 className="font-semibold text-purple-900">AI Powered</h3>
          </div>
          <p className="text-sm text-purple-700 leading-relaxed">
            Configure AI context with RAG to get intelligent reply suggestions for your emails.
          </p>
        </div>
      </div>
    </div>
  );
}