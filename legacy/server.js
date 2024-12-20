const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const port = 3000;

let messageCount = 0; // メッセージの送信回数をカウント

app.use(bodyParser.urlencoded({ extended: true }));

// ルートにアクセスしたときにclient.htmlを表示
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

// WebSocketサーバを作成
const wss = new WebSocket.Server({ server: app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}) });

// WebSocket接続時の処理
wss.on('connection', (ws) => {
  console.log('New client connected');

  // 新しいクライアントに現在のメッセージ回数を送信
  ws.send(JSON.stringify({ type: 'count', count: messageCount }));

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    console.log(`Received message: ${message}`);
    // メッセージ回数をインクリメント
    messageCount++;

    // すべてのクライアントにメッセージとカウントを送信
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', message:message }));
        client.send(JSON.stringify({ type: 'count', count: messageCount }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
