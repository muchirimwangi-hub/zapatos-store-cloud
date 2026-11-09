"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MessageSquare, ArrowLeft, Headphones } from "lucide-react"

// Enhanced Message interface to support direct product/page links
interface Message {
  id: string
  role: "user" | "bot"
  text: string
  link?: { label: string; href: string }
  timestamp: Date
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Welcome to Zapatos Cave. I can assist with sizing, collections, order tracking, and wholesale inquiries. What are you looking for today?",
  timestamp: new Date(),
}

// Preset quick-select options for customers
const defaultSuggestions = [
  "Shop Tracksuits",
  "View Compression Wear",
  "Men's Collection",
  "Sizing Guide"
]

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

  // BACK BUTTON LOGIC: Clears chat history to start over
  const handleReset = () => {
    setMessages([GREETING])
    setInput("")
  }

  // SMART RESPONSE LOGIC WITH PRIORITY ORDERING
  const generateBotResponse = (userInput: string): Omit<Message, 'id' | 'timestamp'> => {
    const text = userInput.toLowerCase()
    
    // --- 1. SPECIFIC ITEM + GENDER LOGIC (Highest Priority) ---
    
    // T-SHIRTS & SHIRTS
    if (text.includes("t-shirt") || text.includes("tshirt") || text.includes("shirt") || text.includes("tee")) {
      if (text.includes("women") || text.includes("girl") || text.includes("lady") || text.includes("ladies") || text.includes("womens")) {
        return {
          role: "bot",
          text: "Our women's performance tees are designed for maximum breathability and comfort. Let me take you there.",
          link: { label: "SHOP WOMEN'S T-SHIRTS →", href: "/shop?category=tshirts&gender=women" }
        }
      }
      if (text.includes("men") || text.includes("guy") || text.includes("boy") || text.includes("mens")) {
        return {
          role: "bot",
          text: "We offer premium men's training shirts engineered for elite movement. Would you like to see them?",
          link: { label: "SHOP MEN'S T-SHIRTS →", href: "/shop?category=tshirts&gender=men" }
        }
      }
      return {
        role: "bot",
        text: "Looking for shirts? We offer high-performance athletic tees and comfortable everyday options. Check out our full collection.",
        link: { label: "SHOP ALL SHIRTS →", href: "/shop?category=tshirts" }
      }
    }

    // SHORTS
    if (text.includes("short")) {
      if (text.includes("men") || text.includes("guy") || text.includes("boy") || text.includes("mens")) {
        return {
          role: "bot",
          text: "We have a premium selection of men's training and casual shorts engineered for elite movement. Would you like to see them?",
          link: { label: "SHOP MEN'S SHORTS →", href: "/shop?category=shorts&gender=men" }
        }
      }
      if (text.includes("women") || text.includes("girl") || text.includes("lady") || text.includes("ladies") || text.includes("womens")) {
        return {
          role: "bot",
          text: "Our women's performance shorts offer maximum mobility and responsive support. Check out the latest arrivals.",
          link: { label: "SHOP WOMEN'S SHORTS →", href: "/shop?category=shorts&gender=women" }
        }
      }
      return {
        role: "bot",
        text: "Looking for shorts? We offer high-performance athletic shorts and comfortable everyday options. Check out our full collection.",
        link: { label: "SHOP ALL SHORTS →", href: "/shop?category=shorts" }
      }
    }

    // --- 2. PRODUCT CATEGORY ROUTING ---
    if (text.includes("tracksuit") || text.includes("essential")) {
      return {
        role: "bot",
        text: "Our Premium Zapatos Tracksuits are tailored for thermal balance and breathable performance. Would you like to view the latest collection?",
        link: { label: "SHOP TRACKSUITS →", href: "/shop?category=tracksuits" }
      }
    }
    
    if (text.includes("compression") || text.includes("onli") || text.includes("fresh")) {
      return {
        role: "bot",
        text: "Our ONLI_FRESH Compression wear maps perfectly to human movement to support targeted muscle groups. Check out the Core Edition.",
        link: { label: "SHOP COMPRESSION →", href: "/shop?category=compression" }
      }
    }

    // --- 3. GENERAL GENDER SPECIFIC ROUTING ---
    if (text.includes("women") || text.includes("ladies") || text.includes("womens")) {
      return {
        role: "bot",
        text: "Explore our Women's collection, featuring high-end technical activewear, responsive compression, and premium sets.",
        link: { label: "SHOP WOMEN'S →", href: "/shop?gender=women" }
      }
    }
    if (text.includes("men") || text.includes("guys") || text.includes("mens")) {
      return {
        role: "bot",
        text: "Explore our Men's collection, featuring premium activewear, tracksuits, and compression gear tailored for peak performance.",
        link: { label: "SHOP MEN'S →", href: "/shop?gender=men" }
      }
    }
    
    // --- 4. UTILITY / LOGISTICS ROUTING ---
    if (text.includes("wholesale") || text.includes("bulk") || text.includes("corporate")) {
      return {
        role: "bot",
        text: "We equip entire units and offer comprehensive bulk distribution for corporate events and retail partners. Contact our team in Nakuru directly.",
        link: { label: "WHOLESALE INQUIRY →", href: "/contact" }
      }
    }

    if (text.includes("size") || text.includes("fit") || text.includes("measure")) {
      return {
        role: "bot",
        text: "Our gear is designed for an athletic, true-to-size fit. If you're between sizes, we recommend sizing up for tracksuits and staying true to size for compression.",
        link: { label: "VIEW SIZE GUIDE →", href: "/size-guide" }
      }
    }

    if (text.includes("ship") || text.includes("deliver") || text.includes("track")) {
      return {
        role: "bot",
        text: "Standard delivery within Kenya takes 1-3 business days. You can track your existing order directly through your account dashboard.",
        link: { label: "ORDER TRACKING →", href: "/account/orders" }
      }
    }

    // --- 5. DEFAULT FALLBACK ---
    return {
      role: "bot",
      text: "I can help with that. Could you provide a bit more detail? You can also browse our full collection or reach out to our support team.",
      link: { label: "EXPLORE SHOP →", href: "/shop" }
    }
  }

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

    // Simulate network delay
    setTimeout(() => {
      const responseData = generateBotResponse(messageText)
      
      const botMsg: Message = {
        id: crypto.randomUUID(),
        ...responseData,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
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
      {/* FLOATING TRIGGER BUTTON */}
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
            aria-label="Open support chat"
          >
            <MessageSquare className="h-5 w-5 stroke-[1.8]" />
            <span className="absolute inset-0 border border-zinc-950 dark:border-white animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* RETAIL ASSISTANT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: easeQuint }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white dark:bg-[#0C0C10] border border-zinc-200 dark:border-zinc-900 shadow-2xl flex flex-col overflow-hidden rounded-none transition-colors duration-500"
          >
            {/* SUPPORT HEADER */}
            <div className="bg-zinc-50 dark:bg-[#08080A] px-4 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 flex-shrink-0">
              
              <div className="flex items-center gap-3">
                {/* BACK / RESET BUTTON */}
                {messages.length > 1 && (
                  <button
                    onClick={handleReset}
                    className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                    aria-label="Back to start"
                  >
                    <ArrowLeft className="h-4 w-4 stroke-[2]" />
                  </button>
                )}
                
                <div className="w-8 h-8 bg-zinc-950 dark:bg-white text-white dark:text-black flex items-center justify-center rounded-none shrink-0">
                  <Headphones className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-white">ZAPATOS CONCIERGE</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 dark:bg-emerald-400" />
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">ONLINE & READY</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all rounded-none"
                aria-label="Close window"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            {/* CHAT FEED */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white dark:bg-[#0C0C10] text-left">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} relative z-10`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-xs tracking-wide leading-relaxed font-light rounded-none ${
                      msg.role === "user"
                        ? "bg-zinc-50 dark:bg-[#121218] text-zinc-950 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                        : "bg-zinc-950 dark:bg-[#08080A] text-zinc-100 dark:text-zinc-300 border border-zinc-900 dark:border-zinc-900"
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {/* EMBEDDED PRODUCT / PAGE LINK */}
                    {msg.link && (
                      <a 
                        href={msg.link.href}
                        className="mt-3 inline-block w-full text-center px-4 py-2 bg-white text-black dark:bg-zinc-800 dark:text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        {msg.link.label}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* TYPING INDICATOR */}
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

              {/* QUICK SUGGESTIONS */}
              {showSuggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 pt-2 relative z-10"
                >
                  <p className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
                    COMMON INQUIRIES
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

            {/* MESSAGE INPUT */}
            <div className="border-t border-zinc-200 dark:border-zinc-900 p-3 flex-shrink-0 bg-zinc-50 dark:bg-[#08080A] transition-colors duration-500">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, sizing, or orders..."
                  className="flex-1 px-3 py-2.5 text-xs rounded-none border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#0C0C10] text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all rounded-none"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5 stroke-[1.8]" />
                </button>
              </div>
              <p className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 text-center mt-2.5 uppercase tracking-widest">
                SECURE RETAIL SUPPORT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}