'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Play, Send, CheckCircle, Loader2, User, Bot, Volume2, VolumeX } from 'lucide-react'
import { useSpeech } from '@/hooks/use-speech'
import { addInterviewMessage, completeMockInterview } from '@/app/dashboard/student/_actions'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'interviewer' | 'candidate'
  content: string
}

interface MockInterviewProps {
  interviewId: string
  role: string
  initialMessages?: Message[]
}

export function MockInterview({ interviewId, role, initialMessages = [] }: MockInterviewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isFinishing, setIsFinishing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text')
  const [typedText, setTypedText] = useState('')
  const { transcript, isListening, startListening, stopListening, resetTranscript, error, speak, isSpeaking } = useSpeech()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-speak when interviewer message arrives
  useEffect(() => {
    if (isSoundOn && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === 'interviewer' && lastMsg.content) {
        speak(lastMsg.content)
      }
    }
  }, [messages, isSoundOn, speak])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Trigger first question if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const initInterview = async () => {
        setIsLoadingAI(true)
        try {
          // Initialize with a welcome message
          const welcomeMsg = "Hello! I'm your AI interviewer today. I see you're applying for the " + role + " position. Could you start by introducing yourself and tell me about your background?"
          
          // Save the welcome message
          await addInterviewMessage(interviewId, 'interviewer', welcomeMsg)
          setMessages([{ id: Date.now().toString(), role: 'interviewer', content: welcomeMsg }])
          
          // Then trigger AI to generate a real first question
          const result = await addInterviewMessage(interviewId, 'candidate', 'Please ask me the first question')
          if (result.content) {
            setMessages(prev => [...prev, { id: result.id, role: 'interviewer', content: result.content! }])
          }
        } catch (err) {
          console.error('Failed to start interview:', err)
        } finally {
          setIsLoadingAI(false)
        }
      }
      initInterview()
    }
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const tempId = Date.now().toString()
    setMessages(prev => [...prev, { id: tempId, role: 'candidate', content }])
    resetTranscript()
    setIsLoadingAI(true)

    try {
      const result = await addInterviewMessage(interviewId, 'candidate', content)
      if (result.content) {
        setMessages(prev => [...prev, { id: result.id, role: 'interviewer', content: result.content! }])
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleFinish = async () => {
    setIsFinishing(true)
    try {
      await completeMockInterview(interviewId)
      setIsAnalyzing(true)
      // Feedback redirection will happen here later
    } catch (err) {
      console.error('Failed to finish interview:', err)
    } finally {
      setIsFinishing(false)
    }
  }

  const Waveform = () => (
    <div className="flex items-center gap-1 h-8">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isListening ? [4, 24, 8, 20, 4] : 4,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-1 bg-primary rounded-full"
        />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bot className="text-primary" />
            Interviewing for {role}
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">AI Mock Session</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSoundOn(!isSoundOn)} className="text-muted-foreground hover:text-foreground transition-colors">
            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {isSpeaking && (
            <span className="text-xs text-primary animate-pulse">Speaking...</span>
          )}
          <button
            onClick={handleFinish}
            disabled={isFinishing || messages.length < 2}
            className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            {isFinishing ? <Loader2 className="animate-spin" size={18} /> : 'Complete Interview'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Mic size={48} className="text-primary animate-pulse" />
            <p className="text-lg font-medium">Click "Start Listening" to begin your response.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'candidate' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg",
              msg.role === 'candidate' ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
            )}>
              {msg.role === 'candidate' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.role === 'candidate' 
                ? "bg-primary/20 text-foreground border border-primary/20 rounded-tr-none" 
                : "bg-white/5 text-foreground border border-white/10 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isLoadingAI && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Bot size={20} className="animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}

        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-[85%] ml-auto flex-row-reverse opacity-70"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Mic className="animate-pulse" size={18} />
            </div>
            <div className="p-4 rounded-2xl text-sm bg-primary/10 border border-dashed border-primary/30 italic">
              {transcript}...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setInputMode('text')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              inputMode === 'text' ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground hover:text-foreground"
            )}
          >
            Type
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              inputMode === 'voice' ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground hover:text-foreground"
            )}
          >
            Voice
          </button>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10">
          {inputMode === 'voice' && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                isListening ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-primary text-primary-foreground hover:scale-105"
              )}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          )}
          
          <div className="flex-1 px-2">
            {inputMode === 'voice' ? (
              isListening ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium animate-pulse text-primary">Recording Answer...</span>
                  <Waveform />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-medium">
                  {transcript ? transcript : "Click mic to speak, or switch to Type mode"}
                </p>
              )
            ) : (
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && typedText.trim()) {
                    handleSendMessage(typedText)
                    setTypedText('')
                  }
                }}
              />
            )}
          </div>

          <button
            disabled={inputMode === 'voice' ? (isListening || !transcript.trim()) : !typedText.trim()}
            onClick={() => {
              if (inputMode === 'voice') {
                handleSendMessage(transcript)
                resetTranscript()
              } else {
                handleSendMessage(typedText)
                setTypedText('')
              }
            }}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
          >
            <Send size={20} className={inputMode === 'voice' ? (transcript.trim() ? "text-primary" : "") : (typedText.trim() ? "text-primary" : "")} />
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2 px-2">Error: {error}</p>}
      </div>
    </div>
  )
}
