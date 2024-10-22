// Function to send the user's message and get a response from the API
async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return; // Ensure there's input before sending a request

    addMessageToConversation(`<b>You:</b> ${userInput}`); // Display user's input
    
    const typingIndicator = document.createElement('div');
    typingIndicator.innerHTML = `<b>NiyamaShakthi:</b> ...typing`;
    document.getElementById('conversation').appendChild(typingIndicator);

    document.getElementById('userInput').value = '';  // Clear input field

    // Fetching response from API
    const response = await getResponseFromAPI(userInput);

    // Remove typing indicator
    typingIndicator.remove();

    // Display API's response in conversation area
    addMessageToConversation(`<b>NiyamaShakthi:</b> ${response}`);

    // Convert the response to speech
    speakResponse(response);
}

// Function to get a response from the Hugging Face API
async function getResponseFromAPI(input) {
    const apiKey = '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';  // Replace with your Hugging Face API key
    const url = "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407";  // Updated model URL

    const payload = {
        inputs: input,
        parameters: {
            max_length: 150,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 50
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data[0].generated_text; // Adjust as per the API's response structure
    } catch (error) {
        console.error('Error fetching response:', error);
        return "Sorry, I couldn't process your request.";
    }
}

// Function to clear chat
function clearChat() {
    document.getElementById('conversation').innerHTML = ''; // Clear the conversation area
}

// Function to start voice recognition (if needed)
function startVoice() {
    // Placeholder for voice functionality
    alert('Voice functionality coming soon!');
}

// Function to convert text to speech
function speakResponse(response) {
    const utterance = new SpeechSynthesisUtterance(response);
    const femaleVoice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English');
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    speechSynthesis.speak(utterance);
}

// Function to add messages to the conversation
function addMessageToConversation(message) {
    const conversationDiv = document.getElementById('conversation');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = message;
    conversationDiv.appendChild(messageDiv);
    conversationDiv.scrollTop = conversationDiv.scrollHeight; // Scroll to the bottom
}

// Function to fetch news from an API and display it
async function fetchNews() {
    const newsAPIKey = '29a2660929bc4eeba2995053b2e5e945'; // Replace with your news API key
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIKey}`; // Example API call

    try {
        const response = await fetch(url);
        const data = await response.json();
        const newsContainer = document.getElementById('news-container');

        // Clear existing news
        newsContainer.innerHTML = '';

        // Loop through news articles
        data.articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-headline">${article.title} <span class="speak-icon" onclick="speakResponse('${article.title}')">🔊</span></div>
                <p>${article.description}</p>
            `;
            newsContainer.appendChild(newsItem);
        });
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Loading overlay removal and fetch news on load
window.onload = function() {
    setTimeout(() => {
        document.querySelector('.loading-overlay').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-overlay').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block'; // Show chat container after loading
            fetchNews(); // Fetch news when the page loads
        }, 500);
    }, 2000); // Adjust the loading time as needed
};
