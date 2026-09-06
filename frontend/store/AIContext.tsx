/**
 * SMANV AI Assistant Context & Engine
 * Developed by SMANV Info Tech Private Limited
 */

import React, { createContext, useContext, useState } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionButtons?: { label: string; route: string }[];
  suggestedFollowUps?: string[];
}

interface AIContextType {
  messages: ChatMessage[];
  isThinking: boolean;
  sendMessage: (query: string) => Promise<void>;
  clearHistory: () => void;
  quickPrompts: string[];
}

const AIContext = createContext<AIContextType>({
  messages: [],
  isThinking: false,
  sendMessage: async () => {},
  clearHistory: () => {},
  quickPrompts: [],
});

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'ai-welcome-01',
    sender: 'ai',
    text: 'Hello! I am SMANV AI Copilot, your intelligent school and college management assistant. How can I assist your administration today?',
    timestamp: 'Just now',
    actionButtons: [
      { label: 'View Attendance Anomaly', route: '/attendance' },
      { label: 'Review Fee Defaulters', route: '/fees' },
    ],
    suggestedFollowUps: [
      'Generate Attendance Summary for Grade 9-C',
      'Draft Parent Circular for PTC',
      'Check Fee Collection Progress',
      'Generate Physics Assignment for Class 11',
    ],
  },
];

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const quickPrompts = [
    'Attendance Summary',
    'Generate Assignment',
    'Draft Notice / Circular',
    'Fee Defaulter Insights',
    'Predict Exam Results',
    'Faculty Workload Analysis',
  ];

  const generateAIResponse = (query: string): { text: string; actionButtons?: { label: string; route: string }[]; suggestedFollowUps?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('attendance')) {
      return {
        text: '📊 **Attendance Analysis Summary (Today):**\n\n• **Overall Campus Attendance**: 95.0% (2,328 / 2,450 students present)\n• **Highest Attendance**: Grade 12-A (99.1%)\n• **Attention Required**: Grade 9-C (72.5% attendance rate; 14 students below 75% regulatory criteria).\n\n*Action Taken:* Automated WhatsApp and SMS alert triggers are prepared for guardian review.',
        actionButtons: [{ label: 'Open Attendance Module', route: '/attendance' }],
        suggestedFollowUps: ['Send SMS to Grade 9-C parents', 'View monthly attendance graph'],
      };
    }

    if (q.includes('fee') || q.includes('collection') || q.includes('due') || q.includes('defaulter')) {
      return {
        text: '💰 **SMANV Fee Recovery Intelligence:**\n\n• **Total Collected (Term 2)**: ₹1,84,30,000 (86.4% target met)\n• **Total Outstanding**: ₹28,95,000 across 84 accounts\n• **Critical Overdue (>30 days)**: 12 students (Total ₹3,24,000)\n\n*Recommended Step:* Click below to issue batch payment reminder links with UPI & NetBanking checkout.',
        actionButtons: [{ label: 'Manage Fee Collections', route: '/fees' }],
        suggestedFollowUps: ['Download pending fees report', 'Issue receipt to Aarav Sharma'],
      };
    }

    if (q.includes('assignment') || q.includes('homework')) {
      return {
        text: '📝 **SMANV AI Assignment Generator:**\n\nGenerated for **Grade 11 Physics (Topic: Electromagnetic Induction)**:\n1. Derive Faraday\'s laws and explain Lenz\'s rule using conservation of energy. [10 Marks]\n2. A square loop of side 10cm is placed in a magnetic field changing at 0.5 T/s. Calculate induced EMF. [5 Marks]\n3. Practical Case: Working principles of Maglev trains. [15 Marks]',
        actionButtons: [{ label: 'Publish to Grade 11-A', route: '/assignments' }],
        suggestedFollowUps: ['Create marking rubric', 'Export to PDF worksheet'],
      };
    }

    if (q.includes('circular') || q.includes('notice') || q.includes('parent')) {
      return {
        text: '📢 **Draft Circular - SMANV EduERP Communication Hub:**\n\n**Subject: Scheduled Parent-Teacher Conference (PTC) - Term 1**\n\nDear Guardians,\n\nWe cordially invite you to the Term 1 Parent-Teacher Conference on **Saturday, Sept 28, 2026** between 09:00 AM and 02:00 PM. Digital time slots can be selected directly through your SMANV Mobile Portal.\n\nWarm regards,\n*Principal, SMANV International Academy*',
        actionButtons: [{ label: 'Broadcast Announcement', route: '/notifications' }],
        suggestedFollowUps: ['Send via WhatsApp Notification', 'Edit meeting dates'],
      };
    }

    return {
      text: `🤖 **SMANV Enterprise AI Intelligence:**\n\nI processed your request: "${query}".\n\n• Analysis verified against your current Academic Year: **2026-2027**.\n• Current database records synchronized: **2,450 Students**, **182 Faculty Members**, **95.0% Campus Attendance**.\n\nIs there a specific report, circular draft, or automated workflow you would like me to execute?`,
      actionButtons: [
        { label: 'View Dashboard Analytics', route: '/(tabs)' },
        { label: 'Export Reports', route: '/reports' },
      ],
      suggestedFollowUps: ['Attendance Summary', 'Fee Defaulter Insights', 'Staff Duty List'],
    };
  };

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Simulate AI inference latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const aiReplyData = generateAIResponse(query);
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiReplyData.text,
      timestamp: 'Just now',
      actionButtons: aiReplyData.actionButtons,
      suggestedFollowUps: aiReplyData.suggestedFollowUps,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const clearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isThinking,
        sendMessage,
        clearHistory,
        quickPrompts,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
