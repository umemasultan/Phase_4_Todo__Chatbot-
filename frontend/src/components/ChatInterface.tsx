import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ChatMessage } from '../types';
import { apiClient } from '../services/ApiClient';

interface ChatInterfaceProps {
  onTodosChange: () => void;
}

export function ChatInterface({ onTodosChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await apiClient.getChatHistory(50);
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message optimistically
    const tempUserMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'temp',
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await apiClient.sendChatMessage(userMessage);

      if (response.success && response.data) {
        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: 'temp',
          role: 'ASSISTANT',
          content: response.data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Refresh todos if action was performed
        if (response.data.actionResult !== null) {
          onTodosChange();
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'temp',
        role: 'ASSISTANT',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Chat with AI Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ color: '#a5b4fc' }}>
          Ask me to manage your todos naturally. I understand commands like adding, updating, and deleting tasks.
        </Typography>
      </Box>

      {/* Messages */}
      <Paper
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          mb: 2,
          backgroundColor: 'rgba(42, 45, 95, 0.3)',
          minHeight: 400,
          maxHeight: 600,
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
      >
        {messages.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.primary" gutterBottom sx={{ mb: 3 }}>
              👋 Welcome! Let's get started
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, color: '#a5b4fc' }}>
              Try these examples:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Paper sx={{ p: 1.5, backgroundColor: 'rgba(99, 102, 241, 0.1)', maxWidth: 400 }}>
                <Typography variant="body2" sx={{ color: '#818cf8' }}>
                  💡 "Add buy groceries tomorrow"
                </Typography>
              </Paper>
              <Paper sx={{ p: 1.5, backgroundColor: 'rgba(99, 102, 241, 0.1)', maxWidth: 400 }}>
                <Typography variant="body2" sx={{ color: '#818cf8' }}>
                  💡 "Show my pending todos"
                </Typography>
              </Paper>
              <Paper sx={{ p: 1.5, backgroundColor: 'rgba(99, 102, 241, 0.1)', maxWidth: 400 }}>
                <Typography variant="body2" sx={{ color: '#818cf8' }}>
                  💡 "Mark task as completed"
                </Typography>
              </Paper>
            </Box>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: message.role === 'USER' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.role === 'USER' ? '#6366f1' : 'rgba(21, 23, 61, 0.8)',
                  color: '#ffffff',
                  border: message.role === 'USER' ? '1px solid #818cf8' : '1px solid #2a2d5f',
                  boxShadow: message.role === 'USER'
                    ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Type your message here... (e.g., 'add buy milk tomorrow' or 'show my todos')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(42, 45, 95, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(42, 45, 95, 0.7)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(42, 45, 95, 0.8)',
              },
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: '#a5b4fc',
              opacity: 0.8,
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          sx={{ alignSelf: 'flex-end' }}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
