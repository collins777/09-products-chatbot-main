// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Toggle chat visibility and swap icons
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        openIcon.style.display = chatBox.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = chatBox.classList.contains('active') ? 'block' : 'none';
    });

    // Handle user input and process messages
    function handleUserInput(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';

            // Display the user's message
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);

            // Simulate bot response
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot');
            botMessage.textContent = "I'm here to help!"; // Replace with actual bot logic
            chatMessages.appendChild(botMessage);

            // Scroll to the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Listen for form submission
    document.getElementById('chatForm').addEventListener('submit', handleUserInput);
}

// Initialize the chat interface
initChat();
