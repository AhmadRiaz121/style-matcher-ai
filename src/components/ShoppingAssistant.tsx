import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ExternalLink, Sparkles, ShoppingBag, Key, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGeminiApi } from '@/hooks/useGeminiApi';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SHOPPING_SITES = [
  { name: 'Amazon', url: 'https://www.amazon.com/s?k=', icon: '🛒' },
  { name: 'Daraz', url: 'https://www.daraz.pk/catalog/?q=', icon: '🛍️' },
  { name: 'AliExpress', url: 'https://www.aliexpress.com/wholesale?SearchText=', icon: '🌏' },
  { name: 'eBay', url: 'https://www.ebay.com/sch/i.html?_nkw=', icon: '🏷️' },
  { name: 'ASOS', url: 'https://www.asos.com/search/?q=', icon: '👗' },
  { name: 'Zara', url: 'https://www.zara.com/pk/en/search?searchTerm=', icon: '✨' },
];

interface ShoppingAssistantProps {
  onOpenApiSettings: () => void;
}

export function ShoppingAssistant({ onOpenApiSettings }: ShoppingAssistantProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>('shopping-chat-history', []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const { hasApiKey, apiKey } = useGeminiApi();
  const { clothes } = useWardrobe();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only auto-scroll when new messages are added, not on manual scroll
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const wardrobeSummary = clothes.length > 0
      ? `User's wardrobe contains ${clothes.length} items:\n${clothes.map(c => `- ${c.name} (${c.category}, ${c.color || 'color not specified'})`).join('\n')}`
      : 'User has not added any items to their wardrobe yet.';

    // Build conversation history for context
    const conversationHistory = messages.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const response = await fetch(`${API_BASE_URL}/api/gemini/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-flash-lite-latest',
        prompt: `Previous conversation:
${conversationHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n')}

Current message:
You are StyleAI Shopping Assistant, a fashion-savvy AI that helps users find trendy clothing and accessories. You specialize in:
            
1. Recommending current fashion trends
2. Suggesting products that match user's style and existing wardrobe
3. Providing search terms for popular shopping sites (Amazon, Daraz.pk, AliExpress, eBay, ASOS, Zara)
4. Offering styling tips and outfit combinations
5. Analyzing websites to find the best matching products

IMPORTANT: You have access to the user's previous chat history above. Reference it when relevant to provide personalized recommendations.

${wardrobeSummary}

When suggesting products, always:
- Give specific search terms users can copy
- Mention price ranges when relevant
- Consider the user's existing wardrobe for complementary pieces
- Suggest trending items and seasonal must-haves
- Reference previous conversations when the user asks follow-up questions
- Be enthusiastic and helpful!

If the user provides a website URL, analyze it and suggest the best items that would fit their wardrobe and style.

Format your responses with clear sections and use emojis to make it engaging.

User's question: ${userMessage}`
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  };

  const handleSend = async () => {
    if (!input.trim() || !hasApiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Shopping Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const extractSearchTerms = (text: string): string[] => {
    const patterns = [
      /"([^"]+)"/g,
      /search for[:\s]+([^,.\n]+)/gi,
      /try[:\s]+([^,.\n]+)/gi,
    ];

    const terms: string[] = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1] && match[1].length < 50) {
          terms.push(match[1].trim());
        }
      }
    });

    return [...new Set(terms)].slice(0, 3);
  };

  if (!hasApiKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-600 mx-auto mb-4 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-3xl font-semibold mb-2">Shopping Assistant</h2>
          <p className="text-muted-foreground">
            Your AI-powered fashion shopping companion
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-card border border-slate-100 shadow-soft text-center"
        >
          <Key className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="font-display text-xl font-medium mb-2">API Key Required</h3>
          <p className="text-muted-foreground mb-6">
            Add your Gemini API key to start chatting with your personal shopping assistant.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft rounded-2xl px-6" onClick={onOpenApiSettings}>
            <Key className="w-4 h-4" />
            Add API Key
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h2 className="font-display text-3xl font-semibold">Shopping Assistant</h2>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear History
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Ask me about fashion trends, product recommendations, and styling tips!
        </p>
      </div>

      {/* Quick Shop Links */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {SHOPPING_SITES.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
          >
            <span>{site.icon}</span>
            <span>{site.name}</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </a>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-card rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="font-display text-lg font-medium mb-2">Start a Conversation</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Ask me anything about fashion! Try:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "What's trending this season?",
                  "Find me a casual outfit",
                  "Best accessories under $50",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-muted hover:bg-indigo-50 text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-muted'
                    }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}

                  {/* Show quick shop buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {extractSearchTerms(message.content).map((term, idx) => (
                        <div key={idx} className="flex gap-1">
                          {SHOPPING_SITES.slice(0, 3).map((site) => (
                            <a
                              key={site.name}
                              href={`${site.url}${encodeURIComponent(term)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/50 hover:bg-background text-xs transition-colors"
                              title={`Search "${term}" on ${site.name}`}
                            >
                              <span>{site.icon}</span>
                              <span className="max-w-[80px] truncate">{term}</span>
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about fashion trends, products, or styling tips..."
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft h-11 w-11 flex-shrink-0"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
