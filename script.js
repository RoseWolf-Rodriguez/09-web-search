// Get references to DOM elements
const topicSelect = document.getElementById('topicSelect');
const responseDiv = document.getElementById('response');

// Add change event listener to the select
topicSelect.addEventListener('change', async () => {
  try {
    // Show loading state
    responseDiv.textContent = 'Loading...';
    
    // Get the selected topic
    const topic = topicSelect.value;

    // Prepare the prompt
    const prompt = `Give me a recent story about ${topic}.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        web_search_options: {
          search_context_size: "medium",
        }, // <-- Added missing comma here
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes recent stories about the provided topic from this week. Keep your answers brief, clear, and engaging for a general audience. Include ONLY US-based stories.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    // Parse the response
    const data = await response.json();
    
    // Format and update the UI with the response
    const text = data.choices[0].message.content;

    // Function to turn URLs into clickable links
    function linkify(text) {
      // Regex to match URLs (http or https)
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
    }

    const formattedText = text
      .split('\n\n')  // Split into paragraphs
      .filter(para => para.trim() !== '')  // Remove empty paragraphs
      .map(para => `<p>${linkify(para)}</p>`)  // Wrap in p tags and linkify
      .join('');
    
    responseDiv.innerHTML = formattedText;

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
