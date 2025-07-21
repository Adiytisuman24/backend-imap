'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, Plus, Brain, Target, Link, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function AIContext() {
  const [productContext, setProductContext] = useState({
    name: '',
    description: '',
    meeting_link: '',
    outreach_agenda: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const saveContext = async () => {
    if (!productContext.name || !productContext.description) {
      toast.error('Please fill in the product name and description');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/product-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productContext)
      });

      if (response.ok) {
        toast.success('AI context saved successfully!');
      } else {
        toast.error('Failed to save AI context');
      }
    } catch (error) {
      toast.error('Failed to save AI context');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen p-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Context Configuration
        </h2>
        <p className="text-gray-600 mt-2">
          Configure your product and outreach context to improve AI-generated reply suggestions using RAG
        </p>
      </div>

      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-3" />
            Product Context & RAG Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-name" className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-600" />
                Product/Service Name
              </Label>
              <Input
                id="product-name"
                placeholder="e.g., AI Email Assistant"
                value={productContext.name}
                onChange={(e) => setProductContext({ ...productContext, name: e.target.value })}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <Label htmlFor="meeting-link" className="flex items-center">
                <Link className="w-4 h-4 mr-2 text-purple-600" />
                Meeting Booking Link
              </Label>
              <Input
                id="meeting-link"
                placeholder="https://cal.com/your-meeting-link"
                value={productContext.meeting_link}
                onChange={(e) => setProductContext({ ...productContext, meeting_link: e.target.value })}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="product-description" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
              Product Description
            </Label>
            <Textarea
              id="product-description"
              placeholder="Describe your product or service in detail. This helps the AI understand what you're offering..."
              className="min-h-[120px] border-purple-300 focus:border-purple-500 focus:ring-purple-500/20"
              value={productContext.description}
              onChange={(e) => setProductContext({ ...productContext, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="outreach-agenda" className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              Outreach Agenda & Response Strategy
            </Label>
            <Textarea
              id="outreach-agenda"
              placeholder="Describe your outreach goals, target audience, and how you typically respond to interested prospects..."
              className="min-h-[140px] border-purple-300 focus:border-purple-500 focus:ring-purple-500/20"
              value={productContext.outreach_agenda}
              onChange={(e) => setProductContext({ ...productContext, outreach_agenda: e.target.value })}
            />
          </div>

          <Button
            onClick={saveContext}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Saving Context...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save AI Context
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Example Context */}
      <Card className="shadow-lg border-gray-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">💡 Example Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl space-y-4">
            <div>
              <strong className="text-gray-900 font-semibold">Product Name:</strong>
              <p className="text-gray-700 mt-1">AI Email Assistant - OneBox</p>
            </div>
            <div>
              <strong className="text-gray-900 font-semibold">Description:</strong>
              <p className="text-gray-700 mt-1 leading-relaxed">
                An intelligent email aggregation platform that synchronizes multiple email accounts, 
                categorizes emails using AI, and provides smart reply suggestions. Perfect for professionals 
                managing multiple email accounts and looking to streamline their email workflow.
              </p>
            </div>
            <div>
              <strong className="text-gray-900 font-semibold">Meeting Link:</strong>
              <p className="text-gray-700 mt-1">https://cal.com/onebox-demo</p>
            </div>
            <div>
              <strong className="text-gray-900 font-semibold">Outreach Agenda:</strong>
              <p className="text-gray-700 mt-1 leading-relaxed">
                I'm looking for professionals and teams who struggle with email management across 
                multiple accounts. When someone shows interest, I provide them with a demo link and 
                offer to schedule a personalized walkthrough of the platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            RAG & AI Reply Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-blue-800 space-y-3">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Be Specific:</strong> The more detailed your product description, the better the AI can tailor responses using RAG.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Include Your Tone:</strong> Mention your preferred communication style in the outreach agenda for consistent voice.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Vector Storage:</strong> Your context is stored in a vector database for semantic similarity matching.</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p><strong>Update Regularly:</strong> Keep your context current as your product or approach evolves for better accuracy.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}