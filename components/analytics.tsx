'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Mail, Users, Clock, Target } from 'lucide-react';

export function Analytics() {
  // Mock data for demonstration
  const stats = {
    totalEmails: 1247,
    interested: 89,
    meetingBooked: 23,
    notInterested: 156,
    spam: 312,
    outOfOffice: 45,
    responseRate: 18.5,
    averageResponseTime: '2.3 hours'
  };

  const categoryData = [
    { category: 'Interested', count: stats.interested, color: 'bg-green-500', percentage: 7.1 },
    { category: 'Meeting Booked', count: stats.meetingBooked, color: 'bg-blue-500', percentage: 1.8 },
    { category: 'Not Interested', count: stats.notInterested, color: 'bg-red-500', percentage: 12.5 },
    { category: 'Spam', count: stats.spam, color: 'bg-orange-500', percentage: 25.0 },
    { category: 'Out of Office', count: stats.outOfOffice, color: 'bg-yellow-500', percentage: 3.6 },
    { category: 'Uncategorized', count: stats.totalEmails - (stats.interested + stats.meetingBooked + stats.notInterested + stats.spam + stats.outOfOffice), color: 'bg-gray-500', percentage: 50.0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Email Analytics</h2>
        <p className="text-gray-600 mt-1">Insights and performance metrics for your email campaigns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmails.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Interested</p>
                <p className="text-2xl font-bold text-green-600">{stats.interested}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Meetings Booked</p>
                <p className="text-2xl font-bold text-purple-600">{stats.meetingBooked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-orange-600">{stats.responseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Categories Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Email Categories Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">High Interest Rate</p>
                <p className="text-sm text-green-700">7.1% of emails show interest</p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Good Conversion</p>
                <p className="text-sm text-blue-700">25.8% of interested leads book meetings</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-900">Spam Filtering</p>
                <p className="text-sm text-orange-700">25% spam detection rate</p>
              </div>
              <div className="text-2xl">🛡️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Response Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.averageResponseTime}</p>
              <p className="text-sm text-gray-600">Average Response Time</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Within 1 hour</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">1-6 hours</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">6-24 hours</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">24+ hours</span>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle>💡 Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Optimize AI Context:</strong> Your interest detection rate is good. Consider refining your AI context for even better categorization.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Follow-up Strategy:</strong> 74% of interested leads haven't booked meetings yet. Consider automated follow-ups.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Spam Management:</strong> High spam detection is protecting your productivity. Review false positives occasionally.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}