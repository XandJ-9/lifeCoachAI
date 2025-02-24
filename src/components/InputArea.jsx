import { Box, TextField, IconButton, CircularProgress } from '@mui/material'
import { Send, Search } from '@mui/icons-material'

function InputArea({ input, setInput, handleSend, loading }) {
  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      p: { xs: 2, sm: 3 },
      bgcolor: 'background.paper',
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(139, 69, 19, 0.08)',
      maxWidth: '1000px',
      mx: 'auto',
      width: '100%',
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="请说出您的疑惑，让我为您推演解答"
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
  )
}

export default InputArea