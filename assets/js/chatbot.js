const chatWidget = document.getElementById('chatWidget');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

function toggleChat() {
  if(chatMessages.style.display === 'none' || chatMessages.style.display === ''){
    chatMessages.style.display = 'block';
  } else {
    chatMessages.style.display = 'none';
  }
}

// Simple bot responses
const botResponses = {
  'hello': 'Hello! I am Hakeem, your AI assistant. How can I help you today?',
  'courses': 'You can view all available courses in the Academy section.',
  'projects': 'To submit a project, go to the Client Dashboard and use the Submit Project form.',
  'faq': 'Ask me any question and I will try to assist you!',
  'default': 'I am sorry, I did not understand. Please try asking differently.'
};

export function sendMessage() {
  const userMsg = chatInput.value.trim();
  if(!userMsg) return;

  // Show user message
  appendMessage(userMsg, 'user');

  // Generate bot response
  const key = Object.keys(botResponses).find(k => userMsg.toLowerCase().includes(k)) || 'default';
  setTimeout(() => appendMessage(botResponses[key], 'bot'), 500);

  chatInput.value = '';
}

// Append message to chat
function appendMessage(msg, sender){
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = msg;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
