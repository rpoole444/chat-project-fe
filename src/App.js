import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

function App() {
  const [chatClient, setChatClient] = useState(null);

  const apiKeys = process.env.REACT_APP_API_KEY

  
  useEffect(() => {
    const initChat = async () => {
      const userId = '1';
      const apiKey = apiKeys;

      const response = await fetch(`http://localhost:3001/token/${userId}`);
      const { token } = await response.json();

      const client = new StreamChat(apiKey);
      await client.connectUser({ id: userId }, token);

      const channel = client.channel('messaging', 'channel-1');
      await channel.watch();

      channel.on('message.new', (event) => handleIncomingMessage(event, client));

      setChatClient(client);
    };

    function handleIncomingMessage(event, client) {
      if (client && event.user.id !== client.user.id) {
        addResponseMessage(event.message.text);
      }
    }
    initChat();
  }, []);

  async function handleNewUserMessage(message) {
    console.log('New message:', message);

    const channel = chatClient.channel('messaging', 'channel-1');
    await channel.sendMessage({ text: message });
  }

  return (
    <div className="App">
      {chatClient && (
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title="My Chat App"
          subtitle="Welcome to our chat"
        />
      )}
    </div>
  );
}

export default App;

