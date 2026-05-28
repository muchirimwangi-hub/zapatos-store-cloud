"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Terminal, Cpu } from "lucide-react"
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
  text: "Welcome to Zapatos Cave. Operational systems online. I can assist with compression array specification analytics, tracksuit thermal parameters, order fulfillment status, and delivery routing queries. State your request below.",
  timestamp: new Date(),
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const easeQuint = [0.16, 1, 0.3, 1]

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

    // Simulate system response compilation latency
    setTimeout(() => {
      const match = findBestMatch(messageText)

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: match
          ? match.answer
          : "System query exception: Match parameters unresolved. Try tracking fields regarding sizing matrices, product specifications, distribution shipping, or order verification logs. You can also deploy an explicit record at our Contact page for manual operator diagnostics.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 500 + Math.random() * 600)
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
      {/* FLOATING TRIGGER BUTTON — INDUSTRIAL SYSTEM ICON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-zinc-950 dark:bg-white text-white dark:text-black border border-zinc-800 dark:border-zinc-200 shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-95 rounded-none"
            aria-label="Open system assistant terminal"
          >
            <Terminal className="h-5 w-5 stroke-[1.8]" />
            {/* Structural Pulse Ring Indicator */}
            <span className="absolute inset-0 border border-zinc-950 dark:border-white animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* SYSTEM CHAT RUNTIME WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: easeQuint }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 shadow-2xl flex flex-col overflow-hidden rounded-none transition-colors duration-500"
          >
            {/* TERMINAL HEADER */}
            <div className="bg-zinc-50 dark:bg-[#08080A] px-5 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center rounded-none">
                  <Cpu className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-white">CAVE.ASSISTANT_V1</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 dark:bg-emerald-400" />
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">SYS_ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all rounded-none"
                aria-label="Close terminal window"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            {/* MESSAGES CONSOLE PIPELINE */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white dark:bg-[#0C0C10] text-left">
              {/* Subtle grid pattern background simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.008] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} relative z-10`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 text-xs tracking-wide leading-relaxed font-light rounded-none ${
                      msg.role === "user"
                        ? "bg-zinc-50 dark:bg-[#121218] text-zinc-950 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                        : "bg-zinc-950 dark:bg-[#08080A] text-zinc-100 dark:text-zinc-300 border border-zinc-900 dark:border-zinc-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* TRANSLATION COMPUTING STATE INDICATOR */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start relative z-10"
                >
                  <div className="bg-zinc-950 dark:bg-[#08080A] border border-zinc-900 dark:border-zinc-900 px-4 py-3 rounded-none">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TACTICAL SUGGESTIONS INDEX */}
              {showSuggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 pt-2 relative z-10"
                >
                  <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
                    // CHOOSE INTERFACE ROUTE
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {defaultSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-[11px] uppercase tracking-wider text-left px-3 py-2 border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-[#08080A] hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none font-medium"
                      >
                        &gt; {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT INJECTION ZONE */}
            <div className="border-t border-zinc-200 dark:border-zinc-900 p-3 flex-shrink-0 bg-zinc-50 dark:bg-[#08080A] transition-colors duration-500">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter dynamic log search string..."
                  className="flex-1 px-3 py-2.5 text-xs rounded-none border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-mono"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all rounded-none"
                  aria-label="Send transmission packet"
                >
                  <Send className="h-3.5 w-3.5 stroke-[1.8]" />
                </button>
              </div>
              <p className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 text-center mt-2.5 uppercase tracking-widest">
                SYS.OPS COMPILER SECURED
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}