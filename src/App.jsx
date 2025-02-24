import { useState } from 'react'
import { Box, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import { sendMessage } from './services/api'
import Header from './components/Header'
import MessageList from './components/MessageList'
import InputArea from './components/InputArea'

// 创建自定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#2B5F75', // 青色，代表智慧和沉稳
    },
    background: {
      default: '#F7F3E9', // 米黄色背景，营造古朴氛围
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.1)', // 赭石色阴影
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(139, 69, 19, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(43, 95, 117, 0.2)',
            },
          },
        },
      },
    },
  },
})

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')
  const [reasoningContent, setReasoningContent] = useState('')
  const [reasoningStartTime, setReasoningStartTime] = useState(Date.now())
  const [reasoningTime, setReasoningTime] = useState(Date.now())
  const [expandedMessages, setExpandedMessages] = useState({})

  const handleSend = async () => {
    if (input.trim() && !loading) {
      const userMessage = { text: input, sender: 'user' }
      setMessages([...messages, userMessage])
      setInput('')
      setLoading(true)
      setCurrentStreamingMessage('')
      setReasoningContent('')
      setReasoningStartTime(Date.now())
      setReasoningTime(null)
  
      try {
        const aiResponse = await sendMessage(
          [{ role: 'user', content: input }],
          (chunk) => {
            if (chunk.type === 'reasoning') {
              setReasoningContent(prev => prev + chunk.content)
            } else if (chunk.type === 'content') {
              if (reasoningStartTime) {
                setReasoningTime((Date.now() - reasoningStartTime) / 1000)
                setReasoningStartTime(null)
              }
              setCurrentStreamingMessage(prev => prev + chunk.content)
            }
          }
        )
        const messageId = Date.now().toString()
        setExpandedMessages(prev => ({ ...prev, [messageId]: true }))
        setMessages(prev => [...prev, { 
          id: messageId,
          text: aiResponse, 
          sender: 'ai',
          reasoning: reasoningContent,
          reasoningTime: reasoningTime
        }])
      } catch (error) {
        setMessages(prev => [...prev, { text: error.message, sender: 'ai' }])
      } finally {
        setLoading(false)
        setCurrentStreamingMessage('')
      }
    }
  }

  const toggleReasoning = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}>
        <Header />
        <MessageList
          messages={messages}
          expandedMessages={expandedMessages}
          onToggleReasoning={toggleReasoning}
          loading={loading}
          reasoningContent={reasoningContent}
          reasoningTime={reasoningTime}
        />
        <InputArea
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          loading={loading}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App
