let host, connection;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('message-input').addEventListener("keyup", evt => {
    evt.preventDefault();
      if (evt.keyCode === 13) {
        document.getElementById('message-send').click();
        document.getElementById('message-input').value = '';
      }
  });
  startClient();
});

const startClient = () => {
  host = window.location.host;
  connection = new WebSocket(`ws://${host}`);
  connection.onmessage = function (message) {
    let node = document.createElement('li');
    let nodeData = document.createTextNode(message.data);
    node.appendChild(nodeData);
    document.getElementById('message-list').appendChild(node);
  };
  connection.onopen = () => connection.send('Hello, I am a client!');
};

const sendMessage = () => {
  let message = document.getElementById('message-input').value;
  connection.send(message);
}