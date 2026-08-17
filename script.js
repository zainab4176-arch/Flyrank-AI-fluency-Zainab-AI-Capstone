/* =========================================
   ZIA — ZAINAB'S INTELLIGENT ASSISTANT
   Local Prototype
   ========================================= */


/*
   ZIA KNOWLEDGE BASE

   This contains verified information from
   Zainab's portfolio and FlyRank work.
*/

const ziaKnowledge = {

    identity: `
        Zainab is a BS Artificial Intelligence student
        interested in Artificial Intelligence, Machine Learning,
        programming, and practical AI development.
    `,

    education: `
        Zainab is studying BS Artificial Intelligence at
        Pak-Austria Fachhochschule: Institute of Applied Sciences
        and Technology.
    `,

    aiFluency: `
        Zainab completed five General AI Fluency assignments:

        FL-01 — AI Workflow Audit and Tool Setup.
        FL-02 — Draw the Path: Portfolio Sitemap + Toolkit.
        FL-03 — What Are You Proving?
        FL-04 — Frame It as Cases: Work That Speaks for Itself.
        FL-05 — The Prompt Ladder.

        These assignments focused on responsible AI collaboration,
        portfolio planning, professional positioning,
        evidence-based communication, and systematic prompt improvement.
    `,

    mlInternship: `
        Zainab is completing a Machine Learning Engineering
        internship track at FlyRank AI.

        Her completed Machine Learning assignments include:

        ML-01 — Run the Starter Notebooks.
        ML-02 — Research Question and Provisional Aim.
        ML-03 — Frame Your Lane as an ML Task.
        ML-04 — Search Intelligence Data Contract.
        ML-05 — Baseline Action Score and Top-10 Review.
    `,

    mlTask: `
        Zainab's Machine Learning work focuses on a
        content-refresh opportunity problem.

        The task involves identifying and prioritizing
        content that may benefit from being refreshed.
    `,

    models: `
        In the starter Machine Learning work, Zainab worked with
        Logistic Regression, Decision Tree, and Random Forest.

        One reported comparison showed Precision@50 of
        approximately 0.240 for the baseline and 0.740
        for Random Forest.
    `,

    aiTools: `
        Zainab's AI toolkit includes ChatGPT, Claude,
        Gemini, Perplexity, and Anthropic Academy.

        She uses AI for learning, brainstorming, research,
        portfolio development, programming support,
        prompt experimentation, and structured workflows.
    `,

    principles: `
        Zainab's approach to AI emphasizes human judgment,
        evidence before claims, verification of important outputs,
        responsible AI collaboration, and continuous learning.
    `,

    capstone: `
        Zainab's General AI Fluency capstone is Zainab AI,
        a personal AI-powered portfolio website featuring
        ZIA — Zainab's Intelligent Assistant.

        The goal is to combine personal branding,
        AI Fluency learning, practical web development,
        and a personal AI agent into one project.
    `

};


/* =========================================
   DOM ELEMENTS
   ========================================= */

const ziaInput = document.getElementById("ziaInput");

const ziaSend = document.getElementById("ziaSend");

const ziaMessages = document.getElementById("ziaMessages");


/* =========================================
   ADD MESSAGE TO CHAT
   ========================================= */

function addZiaMessage(message, sender = "zia") {

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


    const paragraph = document.createElement("p");

    paragraph.textContent = message;


    content.appendChild(paragraph);

    messageWrapper.appendChild(avatar);

    messageWrapper.appendChild(content);

    ziaMessages.appendChild(messageWrapper);


    /*
       Automatically scroll to newest message
    */

    ziaMessages.scrollTop =
        ziaMessages.scrollHeight;
}


/* =========================================
   ZIA RESPONSE ENGINE
   ========================================= */

function generateZiaResponse(question) {

    const q = question.toLowerCase();


    /* Greeting */

    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        return `
            Hi! I'm ZIA, Zainab's Intelligent Assistant.
            Ask me about her education, AI Fluency journey,
            Machine Learning work, projects, or AI tools.
        `;
    }


    /* Education */

    if (
        q.includes("study") ||
        q.includes("studying") ||
        q.includes("education") ||
        q.includes("degree") ||
        q.includes("university")
    ) {

        return ziaKnowledge.education;
    }


    /* Identity */

    if (
        q.includes("who is zainab") ||
        q.includes("about zainab") ||
        q.includes("who is she")
    ) {

        return ziaKnowledge.identity;
    }


    /* AI Fluency */

    if (
        q.includes("ai fluency") ||
        q.includes("fl-01") ||
        q.includes("fl-02") ||
        q.includes("fl-03") ||
        q.includes("fl-04") ||
        q.includes("fl-05") ||
        q.includes("prompt ladder")
    ) {

        return ziaKnowledge.aiFluency;
    }


    /* ML internship */

    if (
        q.includes("machine learning") ||
        q.includes("ml internship") ||
        q.includes("flyrank") ||
        q.includes("ml assignment")
    ) {

        return ziaKnowledge.mlInternship;
    }


    /* ML task */

    if (
        q.includes("content refresh") ||
        q.includes("ml task") ||
        q.includes("machine learning task")
    ) {

        return ziaKnowledge.mlTask;
    }


    /* Models */

    if (
        q.includes("random forest") ||
        q.includes("logistic regression") ||
        q.includes("decision tree") ||
        q.includes("precision")
    ) {

        return ziaKnowledge.models;
    }


    /* AI tools */

    if (
        q.includes("ai tools") ||
        q.includes("tools") ||
        q.includes("chatgpt") ||
        q.includes("claude") ||
        q.includes("gemini") ||
        q.includes("perplexity")
    ) {

        return ziaKnowledge.aiTools;
    }


    /* AI principles */

    if (
        q.includes("responsible ai") ||
        q.includes("ai principles") ||
        q.includes("human judgment") ||
        q.includes("verify")
    ) {

        return ziaKnowledge.principles;
    }


    /* Capstone */

    if (
        q.includes("capstone") ||
        q.includes("zia") ||
        q.includes("personal agent") ||
        q.includes("website")
    ) {

        return ziaKnowledge.capstone;
    }


    /* Unknown question */

    return `
        I don't have enough verified information about that
        in my current knowledge base.

        Try asking me about Zainab's education, AI Fluency
        assignments, Machine Learning internship, projects,
        AI tools, or this capstone.
    `;
}


/* =========================================
   SEND MESSAGE
   ========================================= */

function sendZiaMessage() {

    const question =
        ziaInput.value.trim();


    /*
       Don't send empty messages
    */

    if (!question) {

        return;
    }


    /*
       Display user's message
    */

    addZiaMessage(
        question,
        "user"
    );


    /*
       Clear input
    */

    ziaInput.value = "";


    /*
       Small delay makes the interaction
       feel more natural.
    */

    setTimeout(() => {

        const response =
            generateZiaResponse(question);


        addZiaMessage(
            response,
            "zia"
        );

    }, 500);
}


/* =========================================
   ENTER KEY SUPPORT
   ========================================= */

ziaInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

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