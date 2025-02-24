import { Box, Paper, Typography, Avatar } from '@mui/material'
import { Person, SmartToy } from '@mui/icons-material'

function MessageBubble({ message, expanded, onToggleReasoning }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 2
    }}>
      <Avatar
        sx={{
          bgcolor: message.sender === 'user' ? 'primary.main' : '#8B4513',
          mt: 1
        }}
      >
        {message.sender === 'user' ? <Person /> : <SmartToy />}
      </Avatar>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: { xs: 'calc(80% - 56px)', sm: 'calc(60% - 56px)' },
          borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
          bgcolor: message.sender === 'user' ? 'primary.main' : '#FFF8DC',
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
        {message.sender === 'ai' && message.reasoning && (
          <Box 
            sx={{ 
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => onToggleReasoning(message.id)}
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
              推演过程 {expanded ? '▼' : '▶'}
            </Typography>
            {expanded && (
              <Box sx={{ mt: 1 }}>
                <Typography 
                  sx={{ 
                    lineHeight: 1.8, 
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  {message.reasoning}
                </Typography>
                {message.reasoningTime && (
                  <Typography 
                    sx={{ 
                      mt: 1,
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      display: 'inline-block',
                      bgcolor: '#F5DEB3',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    推演耗时: {message.reasoningTime.toFixed(2)}秒
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
        <Typography sx={{ lineHeight: 1.8, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {message.text}
        </Typography>
      </Paper>
    </Box>
  )
}

export default MessageBubble