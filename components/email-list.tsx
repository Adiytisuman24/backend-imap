'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Mail, Clock, User, Sparkles, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { EmailDetail } from './email-detail';

interface EmailListProps {
  accounts: any[];
  onSyncStart: () => void;
  onSyncStop: () => void;
  isLoading: boolean;
}

interface Email {
  id: string;
  message_id: string;
  account_id: string;
  from_email: string;
  to_emails: string[];
  subject: string;
  body: string;
  html_body?: string;
  date: string;
  folder: string;
  category: string;
  is_read: boolean;
  attachments: any[];
  headers: any;
  email_accounts?: {
    email: string;
    imap_host: string;
  };
}

type EmailCategory = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office' | 'Uncategorized';

export function EmailList({ accounts, onSyncStart, onSyncStop, isLoading }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchLoading, setSearchLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const categoryColors: Record<EmailCategory | 'Uncategorized', string> = {
    'Interested': 'bg-green-100 text-green-800 border-green-200',
    'Meeting Booked': 'bg-blue-100 text-blue-800 border-blue-200',
    'Not Interested': 'bg-red-100 text-red-800 border-red-200',
    'Spam': 'bg-orange-100 text-orange-800 border-orange-200',
    'Out of Office': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Uncategorized': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const searchEmails = async () => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.set('query', searchQuery);
      if (selectedAccount && selectedAccount !== 'all') params.set('accountId', selectedAccount);
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      
      const response = await fetch(`/api/emails/search?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
        setTotal(data.total || 0);
      } else {


        console.error('Failed to fetch emails');
        setEmails([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to search emails:', error);
      setEmails([]);
      setTotal(0);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchEmails();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedAccount, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.email || 'Unknown Account';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Interested':
        return <TrendingUp className="w-3 h-3" />;
      case 'Meeting Booked':
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (selectedEmail) {
    return (
      <EmailDetail
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        accountName={selectedEmail.email_accounts?.email || getAccountName(selectedEmail.account_id)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-6 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Email Inbox
            </h1>
            <p className="text-gray-600 mt-1">AI-powered email management</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onSyncStart}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Sync
                </>
              )}
            </Button>
            <Button
              onClick={onSyncStop}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              Stop Sync
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          
          <Select value={selectedAccount || 'all'} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[200px] border-gray-200">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] border-gray-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Interested">Interested</SelectItem>
              <SelectItem value="Meeting Booked">Meeting Booked</SelectItem>
              <SelectItem value="Not Interested">Not Interested</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Out of Office">Out of Office</SelectItem>
              <SelectItem value="Uncategorized">Uncategorized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {searchLoading ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </div>
            ) : (
              `${total} emails found`
            )}
          </div>
          {total > 0 && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/50 m-4 rounded-xl border border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No emails found</h3>
            <p className="text-sm text-center max-w-md text-gray-600">
              {accounts.length === 0
                ? 'Add email accounts to start synchronizing emails.'
                : 'Try adjusting your search criteria or start email synchronization.'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {emails.map((email) => (
              <Card
                key={email.id}
                className="border border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm"
                onClick={() => setSelectedEmail(email)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center text-sm text-gray-700 font-medium">
                          <User className="w-3 h-3 mr-1" />
                          {email.from_email}
                        </div>
                        <Badge className={`text-xs font-medium ${categoryColors[email.category as EmailCategory]} transition-colors`}>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(email.category)}
                            {email.category}
                          </div>
                        </Badge>
                        {!email.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <h3 className={`text-base font-semibold truncate mb-2 ${
                        email.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {email.subject}
                      </h3>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {email.body}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500 font-medium">
                          {email.email_accounts?.email || getAccountName(email.account_id)}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(email.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}