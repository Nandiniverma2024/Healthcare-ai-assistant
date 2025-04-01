document.addEventListener('DOMContentLoaded', function() {
    // Enter key event for input
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Click event for send button
    document.getElementById('sendButton').addEventListener('click', sendMessage);
});

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) return;

    const chatBox = document.getElementById('chatBox');
    
    // Display USER message
    chatBox.innerHTML += `<div class="bg-primary text-white px-4 py-3 my-2 rounded-[18px_18px_0_18px] max-w-[80%] ml-auto shadow">${message}</div>`;
    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show loading spinner
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'text-center py-3 text-primary';
    loadingDiv.innerHTML = `
        <div class="inline-block w-5 h-5 border-[3px] border-white/30 rounded-full border-t-primary animate-spin-slow mr-2"></div>
        Thinking...
    `;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // API Call to Flask
    fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        // Remove loading spinner
        chatBox.removeChild(loadingDiv);

        if (data.error) {
            chatBox.innerHTML += `<div class="bg-bot-bubble text-red-400 px-4 py-3 my-2 rounded-[18px_18px_18px_0] max-w-[80%] shadow">${data.error}</div>`;
        } else {
            chatBox.innerHTML += `<div class="bg-bot-bubble text-white px-4 py-3 my-2 rounded-[18px_18px_18px_0] max-w-[80%] shadow">${data.response}</div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        chatBox.removeChild(loadingDiv);
        chatBox.innerHTML += `<div class="bg-bot-bubble text-red-400 px-4 py-3 my-2 rounded-[18px_18px_18px_0] max-w-[80%] shadow">Error: ${error.message}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
