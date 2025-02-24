import { Box } from '@mui/material'
import MessageBubble from './MessageBubble'
import LoadingMessage from './LoadingMessage'

function MessageList({ messages, expandedMessages, onToggleReasoning, loading, reasoningContent, reasoningTime }) {
  return (
    <Box sx={{
      flexGrow: 1,
      mb: 4,
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      px: { xs: 2, sm: 4, md: 6 },
    }}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          expanded={expandedMessages[message.id]}
          onToggleReasoning={onToggleReasoning}
        />
      ))}
      {loading && <LoadingMessage reasoningContent={reasoningContent} reasoningTime={reasoningTime} />}
    </Box>
  )
}

export default MessageList