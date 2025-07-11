// Variable to store rental data
let rentalData = null;

// Function to load rental data from JSON file
async function loadRentalData() {
  try {
    const response = await fetch("./rentals.json");
    if (!response.ok) {
      throw new Error(`Failed to load rental data: ${response.status}`);
    }
    rentalData = await response.json();
    console.log("Rental data loaded successfully");
  } catch (error) {
    console.error("Error loading rental data:", error);
  }
}

// Store the conversation history for the API
let conversationHistory = [
  {
    role: "system",
    content: `You are a helpful assistant for Offbeat Retreats, a vacation rental company specializing in unique and quirky accommodations. 

Your goal is to guide users through a short conversation (2-3 questions) to match them with the perfect rental from our available properties.

AVAILABLE RENTAL DATA:
${JSON.stringify(rentalData, null, 2)}

CONVERSATION FLOW:
1. First, greet them warmly and ask about their preferred theme/vibe (funny, spooky, cozy, weird, etc.)
2. Then ask about their preferred location or climate preferences
3. Finally, ask about group size or any special interests they have

After gathering their answers, recommend 1-2 properties that best match their preferences.

FORMATTING GUIDELINES:
- Use line breaks between different sections of your response
- Format recommendations clearly with bullet points like this:
  🏠 **Property Name**
  📍 Location
  ⭐ Rating: X/5 stars
  📝 Description
  ✨ Why it's perfect for you: [explain based on their answers]

- Keep your tone friendly, enthusiastic, and conversational
- Use emojis sparingly to make responses more engaging
- Ask one question at a time to keep the conversation flowing naturally

Start the conversation by greeting them warmly and asking your first question about their preferred vibe!`,
  },
];

// Function to update the system message with rental data
function updateSystemMessage() {
  if (rentalData) {
    conversationHistory[0].content = `You are a helpful assistant for Offbeat Retreats, a vacation rental company specializing in unique and quirky accommodations. 

Your goal is to guide users through a short conversation (2-3 questions) to match them with the perfect rental from our available properties.

AVAILABLE RENTAL DATA:
${JSON.stringify(rentalData, null, 2)}

CONVERSATION FLOW:
1. First, greet them warmly and ask about their preferred theme/vibe (funny, spooky, cozy, weird, etc.)
2. Then ask about their preferred location or climate preferences
3. Finally, ask about group size or any special interests they have

After gathering their answers, recommend 1-2 properties that best match their preferences.

FORMATTING GUIDELINES:
- Use line breaks between different sections of your response
- Format recommendations clearly with bullet points like this:
  🏠 **Property Name**
  📍 Location
  ⭐ Rating: X/5 stars
  📝 Description
  ✨ Why it's perfect for you: [explain based on their answers]

- Keep your tone friendly, enthusiastic, and conversational
- Use emojis sparingly to make responses more engaging
- Ask one question at a time to keep the conversation flowing naturally

Start the conversation by greeting them warmly and asking your first question about their preferred vibe!`;
  }
}

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
        temperature: 0.8, // Increased for more natural conversation
        max_tokens: 800, // Increased for more detailed responses
        presence_penalty: 0.1, // Slightly reduce repetition
        frequency_penalty: 0.1, // Encourage variety in responses
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
async function initChat() {
  // Load rental data first
  await loadRentalData();
  // Update system message with rental data
  updateSystemMessage();

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

      // Display the AI's response with preserved formatting
      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "bot");
      // Use innerHTML to preserve line breaks and convert \n to <br>
      botMessage.innerHTML = aiResponse.replace(/\n/g, "<br>");
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
