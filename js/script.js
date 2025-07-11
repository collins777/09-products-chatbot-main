// Store the conversation history for the API
let conversationHistory = [
  {
    role: "system",
    content:
      "You are a helpful assistant for Offbeat Retreats, a vacation rental company specializing in unique and quirky accommodations.",
  },
];

// Function to call OpenAI Chat Completions API
async function callOpenAI(messages) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

// Main function to initialize the chat interface
function initChat() {
  // Get all required DOM elements
  const chatToggle = document.getElementById("chatToggle");
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const openIcon = document.querySelector(".open-icon");
  const closeIcon = document.querySelector(".close-icon");

  // Toggle chat visibility and swap icons
  chatToggle.addEventListener("click", function () {
    chatBox.classList.toggle("active");
    openIcon.style.display = chatBox.classList.contains("active")
      ? "none"
      : "block";
    closeIcon.style.display = chatBox.classList.contains("active")
      ? "block"
      : "none";
  });

  // Handle user input and process messages
  async function handleUserInput(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
      userInput.value = "";

      // Display the user's message
      const userMessage = document.createElement("div");
      userMessage.classList.add("message", "user");
      userMessage.textContent = message;
      chatMessages.appendChild(userMessage);

      // Add user message to conversation history
      conversationHistory.push({
        role: "user",
        content: message,
      });

      // Show typing indicator
      const typingMessage = document.createElement("div");
      typingMessage.classList.add("message", "bot", "typing");
      typingMessage.textContent = "Typing...";
      chatMessages.appendChild(typingMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Get AI response from OpenAI API
      const aiResponse = await callOpenAI(conversationHistory);

      // Remove typing indicator
      chatMessages.removeChild(typingMessage);

      // Display the AI's response
      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "bot");
      botMessage.textContent = aiResponse;
      chatMessages.appendChild(botMessage);

      // Add AI response to conversation history
      conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      // Scroll to the latest message
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Listen for form submission
  document
    .getElementById("chatForm")
    .addEventListener("submit", handleUserInput);
}

// Initialize the chat interface
initChat();
