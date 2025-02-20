import { useState } from 'react'
import { Box, TextField, IconButton, Typography, Paper, Container, AppBar, Toolbar, ThemeProvider, createTheme, CircularProgress } from '@mui/material'
import { Send, Search } from '@mui/icons-material'
import './App.css'
import { sendMessage } from './services/api'

// 创建自定义主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
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
        // setReasoningContent('')
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
        <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              LifeCoach AI
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            flexGrow: 1,
            mb: 4,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            px: { xs: 2, sm: 4, md: 6 },
          }}>
            {messages.map((message, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  maxWidth: { xs: '80%', sm: '60%' },
                  ml: message.sender === 'user' ? 'auto' : { xs: 2, sm: 4 },
                  mr: message.sender === 'user' ? { xs: 2, sm: 4 } : 'auto',
                  borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  animation: 'fadeIn 0.3s ease-out',
                  '@keyframes fadeIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(10px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                {message.sender === 'ai' && reasoningContent && (
                  <Box 
                    sx={{ 
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={() => toggleReasoning(message.id)}
                  >
                    <Typography 
                      sx={{ 
                        lineHeight: 1.8, 
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      思考过程 {expandedMessages[message.id] ? '▶': '▼'}
                    </Typography>
                    { !expandedMessages[message.id] && (
                      <Box sx={{ mt: 1 }}>
                        <Typography 
                          sx={{ 
                            lineHeight: 1.8, 
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}
                        >
                          {/* {message.reasoning} */}
                          {reasoningContent}
                        </Typography>
                        {message.reasoningTime && (
                          <Typography 
                            sx={{ 
                              mt: 1,
                              fontSize: '0.8rem',
                              color: 'text.secondary',
                              display: 'inline-block',
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            思考耗时: {message.reasoningTime.toFixed(2)}秒
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
                <Typography sx={{ lineHeight: 1.8, fontSize: { xs: '0.9rem', sm: '1rem' } }}>{message.text}</Typography>
              </Paper>
            ))}
            { loading && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  maxWidth: { xs: '80%', sm: '60%' },
                  ml: { xs: 2, sm: 4 },
                  borderRadius: '20px 20px 20px 5px',
                  bgcolor: 'background.paper',
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <Box>
                  {reasoningContent && (
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        sx={{ 
                          lineHeight: 1.8, 
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        思考过程：{reasoningContent}
                      </Typography>
                      {reasoningTime && (
                        <Typography 
                          sx={{ 
                            mt: 1,
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                            display: 'inline-block',
                            bgcolor: 'action.hover',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          思考耗时: {reasoningTime.toFixed(2)}秒
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
            
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 2,
            p: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            maxWidth: '1000px',
            mx: 'auto',
            width: '100%',
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="随便问点什么"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                sx: { bgcolor: 'background.default', fontSize: { xs: '0.9rem', sm: '1rem' } },
              }}
            />
            <IconButton
              onClick={handleSend}
              color="primary"
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: { xs: 1.5, sm: 2 },
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
            </IconButton>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
