import Anthropic from '@anthropic-ai/sdk';
import { getPrismaClient } from '../db/client';
import { ChatIntent } from '../types';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const MODEL = 'claude-3-5-sonnet-20241022';

export class ClaudeService {
  async processUserMessage(userId: string, message: string): Promise<ChatIntent> {
    try {
      // Fetch user's recent todos for context
      const prisma = getPrismaClient();
      const todos = await prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // Build system prompt with context
      const systemPrompt = this.buildSystemPrompt(todos);

      // Call Claude API
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      });

      // Parse response
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      const parsed = this.parseClaudeResponse(content.text);

      logger.info('Claude API response processed', {
        userId,
        intent: parsed.intent,
        hasAction: !!parsed.action,
      });

      return parsed;
    } catch (error) {
      logger.error('Claude API error', { error, userId });

      // Fallback response
      return {
        intent: 'CHAT',
        reply: 'Sorry, I encountered an error processing your message. Please try again.',
      };
    }
  }

  private buildSystemPrompt(todos: any[]): string {
    const todoList = todos.length > 0
      ? todos.map(t => `- [${t.status}] ${t.title} (Priority: ${t.priority}, Due: ${t.dueDate || 'None'})`).join('\n')
      : '(No todos yet)';

    return `You are a helpful todo assistant. The user's current todos are:

${todoList}

Parse the user's message and determine their intent. Respond with a JSON object in this exact format:

{
  "intent": "CREATE" | "UPDATE" | "DELETE" | "QUERY" | "CHAT",
  "action": {
    "type": "create" | "update" | "delete" | "query",
    "todoId": "uuid-if-updating-or-deleting",
    "data": {
      "title": "extracted title",
      "description": "extracted description",
      "dueDate": "ISO8601 datetime if mentioned",
      "priority": "LOW" | "MEDIUM" | "HIGH"
    },
    "filters": {
      "status": "PENDING" | "COMPLETED",
      "dueBefore": "ISO8601 datetime",
      "priority": "LOW" | "MEDIUM" | "HIGH"
    }
  },
  "reply": "Natural language response to the user"
}

Intent types:
- CREATE: User wants to add a new todo (e.g., "add buy groceries", "remind me to call mom tomorrow")
- UPDATE: User wants to modify an existing todo (e.g., "mark buy groceries as done", "change priority to high")
- DELETE: User wants to remove a todo (e.g., "delete the groceries task", "remove my first todo")
- QUERY: User wants to see filtered todos (e.g., "show completed tasks", "what's due today?")
- CHAT: General conversation, no todo action needed

For CREATE intent:
- Extract title (required)
- Extract description if provided
- Parse due dates from natural language (e.g., "tomorrow" = tomorrow's date, "next week" = 7 days from now)
- Infer priority from keywords (urgent/important = HIGH, normal = MEDIUM, later/someday = LOW)

For UPDATE intent:
- Identify which todo by matching title or position (e.g., "first todo", "groceries task")
- Extract what to update (status, title, priority, due date)

For DELETE intent:
- Identify which todo to delete

For QUERY intent:
- Extract filters (status, due date range, priority)

For CHAT intent:
- Respond conversationally, no action needed

Always include a friendly, natural reply to the user. Be concise and helpful.`;
  }

  private parseClaudeResponse(text: string): ChatIntent {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.intent || !parsed.reply) {
        throw new Error('Missing required fields in response');
      }

      return parsed as ChatIntent;
    } catch (error) {
      logger.warn('Failed to parse Claude response, using fallback', { error, text });

      // Fallback: treat as chat
      return {
        intent: 'CHAT',
        reply: text || 'I understood your message. How can I help you with your todos?',
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      });

      return response.content.length > 0;
    } catch (error) {
      logger.error('Claude API connection test failed', { error });
      return false;
    }
  }
}

export const claudeService = new ClaudeService();
