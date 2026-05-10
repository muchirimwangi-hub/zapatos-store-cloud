"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, ArrowRight } from "lucide-react"
import { findBestMatch, defaultSuggestions } from "@/lib/data/chatbot-qa"

interface Message {
  id: string
  role: "user" | "bot"
  text: string
  timestamp: Date
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Welcome to Zapatos! I can help you with fragrance advice, body care tips, our Scent Personality Test, gift curation, and more. Ask me anything or pick a suggestion below.",
  timestamp: new Date(),
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const match = findBestMatch(messageText)

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: match
          ? match.answer
          : "I'm not sure about that one, but I'd love to help! Try asking about our fragrances, body care products, the Scent Personality Test, gift curation, or orders. You can also visit our Contact page for personalised assistance.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showSuggestions = messages.length <= 2

  return (
    <>
      {/* Floating trigger button — styled "A" */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-zapatos-obsidian shadow-2xl flex items-center justify-center group transition-shadow hover:shadow-zapatos-gold/20"
            aria-label="Open chat"
          >
            <span className="text-2xl font-serif font-light text-zapatos-cream group-hover:text-zapatos-gold transition-colors">
              A
            </span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-zapatos-gold/30 animate-ping opacity-40" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-zapatos-cream rounded-2xl shadow-2xl border border-zapatos-taupe/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-zapatos-obsidian px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zapatos-gold/20 flex items-center justify-center">
                  <span className="text-lg font-serif font-light text-zapatos-gold">A</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zapatos-cream">Zapatos Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[11px] text-zapatos-cream/60">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-zapatos-cream/70" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-zapatos-gold/15 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <span className="text-xs font-serif font-light text-zapatos-gold">A</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zapatos-obsidian text-zapatos-cream rounded-2xl rounded-br-sm"
                        : "bg-white text-zapatos-charcoal rounded-2xl rounded-bl-sm border border-zapatos-taupe/20"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-zapatos-gold/15 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <span className="text-xs font-serif font-light text-zapatos-gold">A</span>
                  </div>
                  <div className="bg-white text-zapatos-charcoal rounded-2xl rounded-bl-sm border border-zapatos-taupe/20 px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-zapatos-charcoal/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-zapatos-charcoal/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-zapatos-charcoal/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick suggestions */}
              {showSuggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 pt-2"
                >
                  <p className="text-[11px] text-zapatos-charcoal/40 uppercase tracking-wider px-1">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {defaultSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-zapatos-taupe/30 bg-white hover:bg-zapatos-taupe/10 text-zapatos-charcoal/80 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zapatos-taupe/20 p-3 flex-shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about fragrance, body care..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-full border border-zapatos-taupe/30 bg-zapatos-cream/50 focus:outline-none focus:border-zapatos-gold/50 transition-colors placeholder:text-zapatos-charcoal/40"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-full bg-zapatos-obsidian text-zapatos-cream hover:bg-zapatos-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-zapatos-charcoal/30 text-center mt-2">
                Zapatos Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
