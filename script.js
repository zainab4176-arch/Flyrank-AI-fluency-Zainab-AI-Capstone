/* =========================================
   ZIA — ZAINAB'S INTELLIGENT ASSISTANT
   Frontend Chat
   ========================================= */

const ziaInput = document.getElementById("ziaInput");
const ziaSend = document.getElementById("ziaSend");
const ziaMessages = document.getElementById("ziaMessages");

let conversationHistory = [];


/* =========================================
   ADD MESSAGE TO CHAT
   ========================================= */

function addZiaMessage(text, sender = "zia") {

    const messageWrapper = document.createElement("div");

    messageWrapper.classList.add(
        "message",
        sender === "user"
            ? "user-message"
            : "zia-message"
    );


    const avatar = document.createElement("div");

    avatar.classList.add("message-avatar");

    avatar.textContent =
        sender === "user"
            ? "Y"
            : "Z";


    const content = document.createElement("div");

    content.classList.add("message-content");


    /*
       Allow multiple paragraphs
    */

    const paragraphs = String(text).split(/\n\s*\n/);

    paragraphs.forEach(paragraphText => {

        const paragraph = document.createElement("p");

        paragraph.innerHTML = paragraphText
    .trim()
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        content.appendChild(paragraph);

    });


    messageWrapper.appendChild(avatar);

    messageWrapper.appendChild(content);

    ziaMessages.appendChild(messageWrapper);


    /*
       Scroll to newest message
    */

    ziaMessages.scrollTop =
        ziaMessages.scrollHeight;


    return messageWrapper;
}


/* =========================================
   SEND MESSAGE TO BACKEND
   ========================================= */

async function sendZiaMessage() {

    const message = ziaInput.value.trim();

   if (!message || ziaSend.disabled) {
    return;
}


    /*
       Show user's message
    */

    addZiaMessage(
        message,
        "user"
    );


    /*
       Clear input
    */

    ziaInput.value = "";


    /*
       Disable send button while waiting
    */

    ziaSend.disabled = true;


    /*
       Show thinking message
    */

    const thinkingMessage = addZiaMessage(
    "ZIA is thinking...",
    "zia"
);

const thinkingText = thinkingMessage.querySelector(".message-content p");

thinkingText.classList.add("zia-thinking");

thinkingText.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
`;


    try {

        /*
           Send message to Node.js backend
        */

        const response = await fetch(
            "https://zainab-ai-zia.onrender.com/api/chat",
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


        /*
           Check server response
        */

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        /*
           Convert response to JSON
        */

        const data = await response.json();


        /*
           Remove thinking message
        */

        thinkingMessage.remove();


        /*
           Check whether backend returned a reply
        */

        if (!data.reply) {

            throw new Error(
                "No reply received from ZIA."
            );

        }


        /*
           Display ZIA's answer
        */

        addZiaMessage(
            data.reply,
            "zia"
        );


        /*
           Save conversation history
        */

        conversationHistory.push({

            role: "user",

            content: message

        });


        conversationHistory.push({

            role: "assistant",

            content: data.reply

        });


    } catch (error) {

        console.error(
            "ZIA connection error:",
            error
        );


        /*
           Remove thinking message
        */

        thinkingMessage.remove();


        /*
           Display error message
        */

        addZiaMessage(
            "I couldn't connect to ZIA. Please make sure the ZIA backend server is running.",
            "zia"
        );

    } finally {

        /*
           Enable button again
        */

        ziaSend.disabled = false;

        ziaInput.focus();

    }
}


/* =========================================
   ENTER KEY SUPPORT
   ========================================= */

ziaInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendZiaMessage();

        }

    }
);


/* =========================================
   SEND BUTTON
   ========================================= */

ziaSend.addEventListener(
    "click",
    sendZiaMessage
);


/* =========================================
   SUGGESTED QUESTIONS
   ========================================= */

function askZia(question) {

    ziaInput.value = question;

    sendZiaMessage();

}