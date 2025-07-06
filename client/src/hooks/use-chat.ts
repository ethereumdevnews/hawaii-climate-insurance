import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  quoteData?: {
    insuranceType: string;
    coverageAmount: number;
    monthlyPremium: number;
  };
}

export function useChat(customerId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load chat history if customer is identified
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/customers', customerId, 'chat'],
    enabled: !!customerId,
  });

  // Update messages when chat history loads
  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory)) {
      const formattedMessages = chatHistory.map((msg: any) => ({
        id: msg.id.toString(),
        message: msg.message,
        response: msg.response,
        timestamp: msg.createdAt,
      }));
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  const chatMutation = useMutation({
    mutationFn: async ({ message, messageType = 'question' }: { 
      message: string; 
      messageType?: 'question' | 'quote_request' | 'claim' 
    }) => {
      const payload: any = {
        message,
        messageType
      };
      
      // Only include customerId if it's not null
      if (customerId !== null) {
        payload.customerId = customerId;
      }
      
      const response = await apiRequest('POST', '/api/chat', payload);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Create new message with both user input and AI response
      const newMessage: ChatMessage = {
        id: data.id || Date.now().toString(),
        message: variables.message, // Use the original user message
        response: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      // Check if response contains quote information
      if (data.response && (data.response.includes('$') && data.response.includes('/month'))) {
        const priceMatch = data.response.match(/\$(\d+)\/month/);
        if (priceMatch) {
          newMessage.quoteData = {
            insuranceType: 'climate', 
            coverageAmount: 100000,
            monthlyPremium: parseInt(priceMatch[1])
          };
        }
      }

      setMessages(prev => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "Connection error",
        response: "I'm experiencing technical difficulties. Please try again in a moment or contact our support team for immediate assistance with your Hawaii insurance needs.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const sendMessage = useCallback(async (message: string) => {
    // Determine message type based on content
    let messageType: 'question' | 'quote_request' | 'claim' = 'question';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      messageType = 'quote_request';
    } else if (lowerMessage.includes('claim') || lowerMessage.includes('accident') || lowerMessage.includes('damage')) {
      messageType = 'claim';
    }

    try {
      return await chatMutation.mutateAsync({ message, messageType });
    } catch (error) {
      throw error;
    }
  }, [chatMutation]);

  return {
    messages,
    sendMessage,
    isLoading: chatMutation.isPending,
    error: chatMutation.error
  };
}