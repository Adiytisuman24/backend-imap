'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { EmailList } from '@/components/email-list';
import { AccountSettings } from '@/components/account-settings';
import { AIContext } from '@/components/ai-context';
import { Analytics } from '@/components/analytics';
import { Toaster } from '@/components/ui/sonner';
import { EmailAccount } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('emails');
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSyncStart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/start', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start sync');
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncStop = async () => {
    try {
      await fetch('/api/sync/stop', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to stop sync:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'emails':
        return (
          <EmailList
            accounts={accounts}
            onSyncStart={handleSyncStart}
            onSyncStop={handleSyncStop}
            isLoading={isLoading}
          />
        );
      case 'accounts':
        return (
          <AccountSettings
            accounts={accounts}
            onAccountsChange={fetchAccounts}
          />
        );
      case 'context':
        return <AIContext />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      
      <Toaster />
    </div>
  );
}