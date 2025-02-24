import { Box, Paper, Typography, CircularProgress } from '@mui/material'

function LoadingMessage({ reasoningContent, reasoningTime }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: { xs: '80%', sm: '60%' },
        ml: { xs: 2, sm: 4 },
        borderRadius: '20px 20px 20px 5px',
        bgcolor: '#FFF8DC',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CircularProgress size={20} thickness={4} sx={{ color: '#8B4513' }} />
          <Typography 
            sx={{ 
              fontSize: '0.9rem',
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            正在思考中...
          </Typography>
        </Box>
        {reasoningContent && (
          <Box 
            sx={{ 
              mb: 2,
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(5px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            <Typography 
              sx={{ 
                lineHeight: 1.8, 
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              推演过程：{reasoningContent}
            </Typography>
            {reasoningTime && (
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
                推演耗时: {reasoningTime.toFixed(2)}秒
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default LoadingMessage