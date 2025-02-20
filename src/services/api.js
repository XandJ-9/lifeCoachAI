const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;
const API_MODEL = import.meta.env.VITE_API_MODEL;

export async function sendMessage(messages, onProgress) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: API_MODEL,
        messages: [
          { role: 'system', content: '你是一个专业的生活教练AI助手，你的目标是帮助用户解决生活中的各种问题，提供专业的建议和指导。' },
          ...messages
        ],
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content || '';
            const reasoningContent = data.choices[0]?.delta?.reasoning_content || '';
            if (reasoningContent) {
              const timestamp = new Date().toLocaleTimeString();
              onProgress?.({ type: 'reasoning', content: reasoningContent, timestamp });
            }
            if (content) {
              accumulatedResponse += content;
              onProgress?.({ type: 'content', content });
            }
          } catch (e) {
            console.error('解析流数据错误:', e);
          }
        }
      }
    }

    return accumulatedResponse;
  } catch (error) {
    console.error('API调用错误:', error);
    throw new Error('抱歉，服务暂时不可用，请稍后再试。');
  }
}