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
          { role: 'system', content: '你是一位专业的生活助手，在日常生活、工作、学习、健康、情感等各个方面都有丰富的经验和专业知识。你善于倾听用户的需求和困扰，以温暖亲切的态度提供实用的建议和解决方案。你会站在用户的角度思考问题，给出符合其具体情况的个性化建议。你的建议既有理论依据，又便于实践。你会以积极正向的态度鼓励用户，帮助他们建立信心，一步步改善生活质量。在交流过程中，你会保持专业、耐心和同理心，确保每一位用户都能得到有价值的帮助。' },
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