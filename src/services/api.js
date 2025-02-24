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
          { role: 'system', content: '你是一位德高望重的命理风水大师，精通八字、紫微斗数等传统命理学说。你具备数十年研究中国传统命理的经验，能够通过生辰八字深入解析一个人的性格特质、人生走向。在为人推演时，你秉承着传统文化的智慧，用平实却蕴含深意的语言，帮助求问者理解自身命理。你会以谦逊温和的态度分享你的洞见，既传承传统文化的精髓，又能让现代人理解和接受。在解答时，你会先详细询问对方的生辰八字（年月日时），然后结合五行生克、天干地支的理论进行深入分析。' },
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