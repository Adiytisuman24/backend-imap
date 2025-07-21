'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Settings, Trash2, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EmailAccount {
  id: string;
  email: string;
  imap_host: string;
  imap_port: number;
  username: string;
  is_active: boolean;
  last_sync: string;
}

interface AccountSettingsProps {
  accounts: EmailAccount[];
  onAccountsChange: () => void;
}

export function AccountSettings({ accounts, onAccountsChange }: AccountSettingsProps) {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: '',
    imap_host: '',
    imap_port: 993,
    username: '',
    password: ''
  });

  const addAccount = async () => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      });

      if (response.ok) {
        setIsAddingAccount(false);
        setNewAccount({
          email: '',
          imap_host: '',
          imap_port: 993,
          username: '',
          password: ''
        });
        onAccountsChange();
        toast.success('Account added successfully!');
      } else {
        toast.error('Failed to add account');
      }
    } catch (error) {
      toast.error('Failed to add account');
    }
  };

  const toggleAccount = async (accountId: string, is_active: boolean) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active })
      });

      if (response.ok) {
        onAccountsChange();
        toast.success(`Account ${is_active ? 'activated' : 'deactivated'}`);
      } else {
        toast.error('Failed to update account');
      }
    } catch (error) {
      toast.error('Failed to update account');
    }
  };

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onAccountsChange();
        toast.success('Account deleted');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const getImapPresets = (email: string) => {
    if (email.includes('@gmail.com')) {
      return { imap_host: 'imap.gmail.com', imap_port: 993 };
    } else if (email.includes('@outlook.com') || email.includes('@hotmail.com')) {
      return { imap_host: 'outlook.office365.com', imap_port: 993 };
    } else if (email.includes('@yahoo.com')) {
      return { imap_host: 'imap.mail.yahoo.com', imap_port: 993 };
    }
    return { imap_host: '', imap_port: 993 };
  };

  const handleEmailChange = (email: string) => {
    const presets = getImapPresets(email);
    setNewAccount({
      ...newAccount,
      email,
      username: email,
      ...presets
    });
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Email Accounts
          </h2>
          <p className="text-gray-600 mt-2">Manage your email accounts for real-time synchronization</p>
        </div>
        <Button 
          onClick={() => setIsAddingAccount(true)} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Add Account Form */}
      {isAddingAccount && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Add New Email Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newAccount.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Usually same as email"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imapHost">IMAP Host</Label>
                <Input
                  id="imapHost"
                  placeholder="imap.gmail.com"
                  value={newAccount.imap_host}
                  onChange={(e) => setNewAccount({ ...newAccount, imap_host: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <Label htmlFor="imapPort">IMAP Port</Label>
                <Input
                  id="imapPort"
                  type="number"
                  placeholder="993"
                  value={newAccount.imap_port}
                  onChange={(e) => setNewAccount({ ...newAccount, imap_port: parseInt(e.target.value) })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password / App Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your email password or app-specific password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex">
                <Shield className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-2">Security Notice:</p>
                  <p className="text-amber-700 leading-relaxed">
                    For Gmail, use an App Password instead of your regular password. 
                    Enable 2FA and generate an app-specific password in your Google Account settings.
                    Your credentials are encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsAddingAccount(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={addAccount} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Accounts */}
      <div className="space-y-4">
        {accounts.map((account) => (
          <Card key={account.id} className={`transition-colors ${
            account.is_active 
              ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50' 
              : 'border-gray-200 bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    account.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {account.is_active ? <CheckCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{account.email}</h3>
                      <Badge 
                        variant={account.is_active ? 'default' : 'secondary'}
                        className={account.is_active ? 'bg-emerald-100 text-emerald-800' : ''}
                      >
                        {account.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {account.imap_host}:{account.imap_port}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {new Date(account.last_sync).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`active-${account.id}`} className="text-sm">
                      Active
                    </Label>
                    <Switch
                      id={`active-${account.id}`}
                      checked={account.is_active}
                      onCheckedChange={(checked) => toggleAccount(account.id, checked)}
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {accounts.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300 bg-white/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-6">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No accounts configured</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Add your first email account to start synchronizing emails
              </p>
              <Button 
                onClick={() => setIsAddingAccount(true)} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}