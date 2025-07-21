'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Clock, User, Sparkles, Copy, Send, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

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
}

type EmailCategory = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office' | 'Uncategorized';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  accountName: string;
}

export function EmailDetail({ email, onBack, accountName }: EmailDetailProps) {
  const [suggestedReply, setSuggestedReply] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [customReply, setCustomReply] = useState('');

  const categoryColors: Record<EmailCategory, string> = {
    'Interested': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Meeting Booked': 'bg-blue-100 text-blue-800 border-blue-200',
    'Not Interested': 'bg-red-100 text-red-800 border-red-200',
    'Spam': 'bg-orange-100 text-orange-800 border-orange-200',
    'Out of Office': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Uncategorized': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Interested':
        return <TrendingUp className="w-4 h-4" />;
      case 'Meeting Booked':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const generateReply = async () => {
    setLoadingReply(true);
    try {
      const response = await fetch(`/api/emails/${email.id}/reply`);
      
      if (response.ok) {
        const data = await response.json();
        setSuggestedReply(data.suggestedReply);
        toast.success('AI reply generated successfully!');
      } else {
        toast.error('Failed to generate reply');
      }
    } catch (error) {
      console.error('Failed to generate reply:', error);
      toast.error('Failed to generate reply');
    } finally {
      setLoadingReply(false);
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(suggestedReply);
    toast.success('Reply copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {email.subject}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {email.from_email}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(email.date)}
              </div>
              <Badge className={`${categoryColors[email.category as EmailCategory]} text-xs font-medium`}>
                <div className="flex items-center gap-1">
                  {getCategoryIcon(email.category)}
                  {email.category}
                </div>
              </Badge>
            </div>
          </div>
          
          {email.category === 'Interested' && (
            <Button
              onClick={generateReply}
              disabled={loadingReply}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loadingReply ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Reply
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Email Details */}
          <Card className="shadow-lg border-gray-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Email Details</h3>
                  <p className="text-sm text-gray-600 mt-1">Account: {accountName}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>Folder: {email.folder}</div>
                  <div>Message ID: {email.message_id.substring(0, 20)}...</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {email.html_body ? (
                  <div dangerouslySetInnerHTML={{ __html: email.html_body }} />
                ) : (
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {email.body}
                  </div>
                )}
              </div>

              {email.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Attachments ({email.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {email.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium">
                          {attachment.filename}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Suggested Reply */}
          {suggestedReply && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900 text-lg">AI Suggested Reply</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReply}
                    className="border-purple-300 hover:bg-purple-100 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {suggestedReply}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex items-center justify-between text-sm text-purple-700 mb-3">
                    <span>Customize your reply:</span>
                    <span>Confidence: 85%</span>
                  </div>
                  
                  <Textarea
                    placeholder="Add your personal touch or modify the AI suggestion..."
                    value={customReply}
                    onChange={(e) => setCustomReply(e.target.value)}
                    className="min-h-[120px] border-purple-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg"
                  />
                  
                  <div className="flex justify-end mt-3">
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="shadow-lg border-gray-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <h3 className="font-semibold text-gray-900 text-lg">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  Mark as Read
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  Archive
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-gray-50">
                  Move to Folder
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}