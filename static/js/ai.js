const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// Function to add message to the chat
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = content;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Fetch AI response from the server
async function fetchAIResponse(prompt) {
    const response = await fetch('/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.response;  // Assuming the AI's response is in the 'response' field
}

// Handle sending message
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        // User's message
        addMessage(message, 'user-message');
        userInput.value = '';

        // Show typing animation while waiting for the AI response
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'ai-message', 'typing-message');
        typingDiv.textContent = "AI is typing...";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

        // Get AI's response and add to the chat
        const aiResponse = await fetchAIResponse(message);

        // Remove typing animation and display the AI's response
        typingDiv.remove();
        setTimeout(() => {
            addMessage(aiResponse, 'ai-message');
        }, 500);  // Optional delay for effect
    }
});

// Handle Enter key to send message
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {  // Allow Enter key to send message
        event.preventDefault();  // Prevent newline from being added
        sendButton.click();
    }
});