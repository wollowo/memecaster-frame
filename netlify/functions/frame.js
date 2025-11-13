exports.handler = async (event) => {
  // Автоматически определяем URL из окружения Netlify
  const baseUrl = process.env.URL;
  
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/html'},
      body: `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://i.imgur.com/6JKR5Ex.png" />
  <meta property="fc:frame:input:text" content="Enter meme text" />
  <meta property="fc:frame:button:1" content="🎨 Generate meme!" />
  <meta property="fc:frame:post_url" content="${baseUrl}/.netlify/functions/frame" />
</head>
<body></body>
</html>`
    };
  }
  
  // POST запрос - генерация мема
  try {
    const body = JSON.parse(event.body);
    const userText = body.untrustedData?.inputText || 'Hello Farcaster!';
    const memeImageUrl = `https://api.memegen.link/images/custom/_/${encodeURIComponent(userText)}.png?background=https://i.imgur.com/6JKR5Ex.png`;

    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/html'},
      body: `<!DOCTYPE html>
<html>
<head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${memeImageUrl}" />
  <meta property="fc:frame:button:1" content="🔄 Create new" />
  <meta property="fc:frame:button:1:action" content="post" />
  <meta property="fc:frame:button:1:target" content="${baseUrl}/.netlify/functions/frame" />
  <meta property="fc:frame:button:2" content="🐦 Share on Warpcast" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=I created a meme: ${encodeURIComponent(userText)}&embeds[]=${encodeURIComponent(memeImageUrl)}" />
</head>
<body></body>
</html>`
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error generating meme'
    };
  }
};