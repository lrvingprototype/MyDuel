class Player{
  constructor(){
      this.id=-1;
      this.name="";
      this.LP=8000;     
      this.password="" 
      this.coin=true;
      this.dice=1;
  }
  diceroll(){
    this.dice=Math.floor(Math.random()*6+1)
  }
  cointoss(){
    this.coin=(Math.random()<0.5)
  }
  reset(){
  
    this.LP=8000;     
    this.password="" 
    this.coin=true;
    this.dice=1;
  }
  RegistName(name) {
      this.name=name;
  }
  CalculateLP(num,operator){
      switch(operator){
          case 0:
          case "+":
          this.decrementLP(-num);
          break;
          case 1:
          case "-":
          this.decrementLP(num);
          break;
          case 2:
          case "/2":
          this.decrementLP(this.LP/2);
      }
  }
  decrementLP(num){
      this.LP=Math.round(this.LP-num);
      if(this.LP<0)this.LP=0;
  }

  setPassword(password){
      this.password=password;
  }
  
}

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const port = 3000;

let messageCount = 0; // メッセージの送信回数をカウント

app.use(bodyParser.urlencoded({ extended: true }));

const player1 = new Player();
player1.id=1;
const player2 = new Player();
player2.id=2;
const player_dummy=new Player();
console.log(JSON.stringify(player1))
app.use(express.static(path.join(__dirname, 'img')));
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
  
  ws.send(JSON.stringify({type:"player",playerData:player1}));
  ws.send(JSON.stringify({type:"player",playerData:player2}));
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // JSON形式のメッセージをパース
    const data = JSON.parse(message);
    
    // メッセージ回数をインクリメント
    messageCount++;
    if(data.type==="calculate"){
      console.log(data)
      let player=player_dummy;
      if(data.id===1){
        player=player1
        
      }else if(data.id===2){
        player=player2
      }else{
        player=player_dummy
      }
      player.CalculateLP(data.LP,data.operator);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {            
          client.send(JSON.stringify({ type: 'player', playerData:player  }));
        }
      });
    }
    if(data.type==="reset"){
      if(data.id===1){
        player=player1
        
      }
      else if(data.id===2){
        player=player2
      }else{
        player=player_dummy
      }
      player.reset()
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {            
          client.send(JSON.stringify({ type: 'player', playerData:player  }));
        }
      });
    }
    if(data.type==="dice"){
      if(data.id===1){
        player=player1
        
      }
      else if(data.id===2){
        player=player2
      }else{
        player=player_dummy
      }
      player.diceroll()
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {            
          client.send(JSON.stringify({ type: 'player', playerData:player  }));
        }
      });
    }
    if(data.type==="coin"){
      if(data.id===1){
        player=player1
        
      }
      else if(data.id===2){
        player=player2
      }else{
        player=player_dummy
      }
      player.cointoss()
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {            
          client.send(JSON.stringify({ type: 'coin', playerData:player  }));
        }
      });
    }
    if(data.type==="turn"){
      wss.clients.forEach(client => {
          let turn=Math.floor(Math.random()*2+1)
        if (client.readyState === WebSocket.OPEN) {            
          client.send(JSON.stringify({ type: 'turn', data:turn  }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

});
