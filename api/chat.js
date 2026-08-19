const ziaInput = document.getElementById("ziaInput");
const ziaSend = document.getElementById("ziaSend");
const ziaMessages = document.getElementById("ziaMessages");

let conversationHistory = [];

async function sendZiaMessage() {

    const message = ziaInput.value.trim();

    if (!message) {
        return;
    }

    addZiaMessage(message, "user-message");

    ziaInput.value = "";

    ziaSend.disabled = true;

    const thinkingMessage = addZiaMessage(
        "ZIA is thinking...",
        "zia-message"
    );

    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message,
                    history: conversationHistory
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Server error: ${response.status}`
            );
        }

        const data = await response.json();

        thinkingMessage.remove();

        if (!data.reply) {
            throw new Error("No reply received.");
        }

        addZiaMessage(
            data.reply,
            "zia-message"
        );

        conversationHistory.push({
            role: "user",
            content: message
        });

        conversationHistory.push({
            role: "assistant",
            content: data.reply
        });

    } catch (error) {

        console.error("ZIA error:", error);

        thinkingMessage.remove();

        addZiaMessage(
            "I couldn't connect to ZIA. Please make sure the backend server is running.",
            "zia-message"
        );

    } finally {

        ziaSend.disabled = false;

    }
}

function addZiaMessage(text, messageClass) {

    const message = document.createElement("div");

    message.className =
        `message ${messageClass}`;

    const avatar = document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        messageClass === "user-message"
            ? "Y"
            : "Z";

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    const paragraphs =
        String(text).split(/\n\s*\n/);

    paragraphs.forEach(paragraphText => {

        const paragraph =
            document.createElement("p");

        paragraph.textContent =
            paragraphText.trim();

        content.appendChild(paragraph);

    });

    message.appendChild(avatar);
    message.appendChild(content);

    ziaMessages.appendChild(message);

    ziaMessages.scrollTop =
        ziaMessages.scrollHeight;

    return message;
}

function askZia(question) {

    ziaInput.value = question;

    sendZiaMessage();

}

ziaSend.addEventListener(
    "click",
    sendZiaMessage
);

ziaInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendZiaMessage();

        }

    }
);