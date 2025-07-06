import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Paperclip, Download, MoreVertical } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getTranslation, getCurrentLanguage } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  customerId: number | null;
  onCustomerIdentified: (customerId: number) => void;
}

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  isUser?: boolean;
}

export default function ChatInterface({ customerId, onCustomerIdentified }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getCurrentLanguage());
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const payload: any = {
        message: userMessage,
        messageType: 'question'
      };
      
      if (customerId !== null) {
        payload.customerId = customerId;
      }
      
      const response = await apiRequest('POST', '/api/chat', payload);
      return response.json();
    },
    onSuccess: (data, userMessage) => {
      // Add both user message and AI response to chat
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: userMessage,
        response: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: message,
        response: "I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = async () => {
    if (!message.trim() || chatMutation.isPending) return;
    
    const currentMessage = message;
    setMessage("");
    
    try {
      await chatMutation.mutateAsync(currentMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
      <CardHeader className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Hawaii Natural Disaster Insurance Specialist</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-neutral-500">Hawaii Expert Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {/* Welcome Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white w-4 h-4" />
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm max-w-lg">
              <p className="text-neutral-900 mb-2">{getTranslation('chat.welcome', currentLanguage)}</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                <li>• {getTranslation('chat.ethquakeInsurance', currentLanguage)}</li>
                <li>• {getTranslation('chat.femaCoverage', currentLanguage)}</li>
                <li>• {getTranslation('chat.volcanoInsurance', currentLanguage)}</li>
                <li>• {getTranslation('chat.lavaCoverage', currentLanguage)}</li>
                <li>• {getTranslation('chat.smartContracts', currentLanguage)}</li>
              </ul>
              <p className="mt-3 text-neutral-900">What can I help you with today?</p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {/* User Message */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-blue-600 rounded-lg p-4 max-w-md">
                  <p className="text-white">{msg.message}</p>
                </div>
                <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-neutral-600 w-4 h-4" />
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white w-4 h-4" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-lg">
                  <p className="text-neutral-900 whitespace-pre-wrap">{msg.response}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {chatMutation.isPending && (
            <div className="space-y-3">
              {/* Show user message immediately */}
              <div className="flex items-start space-x-3 justify-end">
                <div className="bg-blue-600 rounded-lg p-4 max-w-md">
                  <p className="text-white">{message}</p>
                </div>
                <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-neutral-600 w-4 h-4" />
                </div>
              </div>
              
              {/* Loading skeleton */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white w-4 h-4" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-neutral-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={getTranslation('chat.placeholder', currentLanguage)}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 border-neutral-300 focus:border-blue-500"
                disabled={chatMutation.isPending}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-blue-600"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || chatMutation.isPending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
            <span>Press Enter to send</span>
            <span>Powered by AI • Secure & Private</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}