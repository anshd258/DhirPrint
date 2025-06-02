
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Loader2, User, Bot, Send } from 'lucide-react'; // Added Send icon
import type { ChatMessage } from '@/types';
import { answerDesignFAQ } from '@/ai/flows/answer-design-faq'; // Using this as a generic chat assistant
import { useAuthContext } from '@/contexts/AuthContext';
// TODO: Firestore integration for chatSessions/{sessionId}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  // TODO: Load chat history for current user if session exists

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: If implementing chatSessions, create or update session in Firestore
      const response = await answerDesignFAQ({ question: input }); // Using answerDesignFAQ as a proxy
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: response.answer,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        text: "Sorry, I couldn't process that. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg p-4 h-16 w-16 z-50 bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat Assistant"
      >
        <MessageSquare className="h-8 w-8 text-primary-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] h-[70vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-xl font-headline">AI Design Assistant</DialogTitle>
            <DialogDescription>Ask me anything about product design or our services!</DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
            <div className="space-y-6 pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-xl shadow ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                     <p className="text-xs mt-1 opacity-70 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {msg.sender === 'user' && currentUser && (
                     <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={currentUser.photoURL || undefined} />
                      <AvatarFallback>{getInitials(currentUser.displayName) || <User className="h-5 w-5"/>}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-end gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                       <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] p-3 rounded-xl shadow bg-muted text-foreground rounded-bl-none">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-4 border-t">
            <div className="flex w-full items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow resize-none min-h-[40px] max-h-[120px]"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button type="submit" onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon" className="shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
