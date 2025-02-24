import { AppBar, Toolbar, Typography } from '@mui/material'

function Header() {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#1a237e',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 0,
            fontWeight: 600,
            color: '#ffffff',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            letterSpacing: '1px',
            cursor: 'default',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            fontFamily: '"KaiTi", "楷体", serif'
          }}
        >
          中国传统风水命理研究派
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header