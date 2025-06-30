document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const levelSlider = document.getElementById('level-slider');
    const levelLabel = document.getElementById('level-label');
    const explainButton = document.getElementById('explain-button');
    const outputDisplay = document.getElementById('output-display');

    const GROQ_API_KEY = "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"; // <-- IMPORTANT: Replace with your key

    const levels = ['a child', 'a beginner in the field', 'a detailed and nuanced way', 'an academic, using precise terminology', 'an expert in the field, with deep technical insights'];

    levelSlider.addEventListener('input', () => {
        const levelDescriptions = ['Child', 'Simple', 'Detailed', 'Academic', 'Expert'];
        levelLabel.textContent = levelDescriptions[levelSlider.value];
    });

    explainButton.addEventListener('click', async () => {
        const textToExplain = textInput.value;
        const explanationLevel = levels[levelSlider.value];

        if (!textToExplain) {
            alert('Please enter some text to explain.');
            return;
        }
        
        if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY") {
            alert('Please add your Groq API key to script.js');
            return;
        }

        outputDisplay.innerHTML = '<p class="text-gray-500">Generating explanation...</p>';
        explainButton.disabled = true;
        explainButton.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        {
                            role: "system",
                            content: `You are a world-class explainer. Your goal is to explain the provided text clearly and concisely. Explain it to me like I am ${explanationLevel}.`
                        },
                        {
                            role: "user",
                            content: textToExplain
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const explanation = data.choices[0].message.content;

            // Simple markdown-to-HTML conversion
            let formattedExplanation = explanation.replace(/\n/g, '<br>');
            outputDisplay.innerHTML = formattedExplanation;

        } catch (error) {
            console.error('Error:', error);
            outputDisplay.innerHTML = `<p class="text-red-500">Error: ${error.message}. Check the console for more details.</p>`;
        } finally {
            explainButton.disabled = false;
            explainButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}); 