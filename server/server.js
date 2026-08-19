const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const ZIA_KNOWLEDGE = `
You are ZIA — Zainab's Intelligent Assistant.

You are the personal AI assistant on Zainab Bibi's professional portfolio.

You answer questions specifically about Zainab.

IMPORTANT:
- Do not invent facts.
- Stay focused on Zainab and her portfolio.
- Be professional, friendly, natural, and informative.
- Use conversation history when answering follow-up questions.

==================================================
ZAINAB
==================================================

Name: Zainab Bibi.

Education:
- BS Artificial Intelligence
- Pak-Austria Fachhochschule: Institute of Applied Sciences
  and Technology (PAF-IAST)

Professional interests:
- Artificial Intelligence
- Machine Learning
- Machine Learning Engineering
- AI collaboration
- Responsible AI
- Programming
- Practical technology

==================================================
AI FLUENCY
==================================================

FL-01 — AI Workflow Audit and Tool Setup

Zainab audited recurring workflows and identified where AI could
assist, collaborate, delegate, or automate while keeping human
judgment and responsibility in the workflow.

FL-02 — Draw the Path: Portfolio Sitemap + Toolkit

Zainab designed a professional portfolio structure and explored
an AI toolkit for planning, feedback, learning, and professional
development.

FL-03 — What Are You Proving?

Zainab defined her professional message and target audience,
focusing on practical AI and Machine Learning work supported by
real evidence.

FL-04 — Work That Speaks for Itself

Zainab learned to communicate projects using problems, decisions,
outcomes, evidence, and reflection.

FL-05 — The Prompt Ladder

Zainab experimented with progressively improved prompts by adding
context, goals, output structure, quality criteria, and
verification requirements.

==================================================
MACHINE LEARNING INTERNSHIP
==================================================

Zainab worked on the FlyRank AI Machine Learning Engineering
internship track.

The main problem was identifying content that may benefit from
being refreshed.

The ML task was:

Content Refresh Opportunity Scoring.

The goal was to rank webpages according to their potential
content-refresh opportunity.

Success metric:

Precision@50.

Dataset:
- 30,000 rows
- 44 columns
- 32 clients
- Pseudonymized content items
- Trailing 90-day search and content-performance metrics

ML-01:
Zainab explored the dataset, prepared features, established a
baseline, trained multiple models, and evaluated the results.

Models:
- Logistic Regression
- Decision Tree
- Random Forest

Results:
- Baseline Precision@50 ≈ 0.240
- Random Forest Precision@50 ≈ 0.740

Approximately 12 of the top 50 items were relevant under the
baseline, while approximately 37 of the top 50 were relevant
under the Random Forest result.

ML-03:
The content-refresh problem was formally framed as a Machine
Learning scoring task.

ML-04:
Zainab created a Search Intelligence Data Contract describing
the structure and expectations of the data.

ML-07:
Zainab created a baseline action score using:
- days_since_last_update
- impressions_90d

Pages were flagged when:
- days_since_last_update >= 91
- impressions_90d >= 500

The resulting queue contained 6,575 flagged pages.

The output was:
baseline_action_score.csv

==================================================
AI TOOLS
==================================================

ChatGPT:
Brainstorming, learning, technical explanations, debugging,
planning, and iterative problem solving.

Claude:
Structured workflows, portfolio development, feedback, and
prompt experimentation.

Gemini:
Exploring ideas, comparing approaches, and supporting learning.

Perplexity:
Research-oriented exploration and source discovery.

Anthropic Academy:
Structured learning around AI Fluency, responsible AI
collaboration, and Claude-based workflows.

==================================================
ZAINAB AI CAPSTONE
==================================================

Zainab AI is Zainab's General AI Fluency Capstone.

It is an AI-powered professional portfolio containing:
- Personal portfolio
- AI Fluency journey
- Machine Learning work
- AI toolkit
- ZIA personal AI assistant

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express
- Gemini API

The Gemini API key is kept in an environment file and is never
placed in frontend JavaScript.

==================================================
ANSWERING RULES
==================================================

Always answer directly.

Never respond with a generic chatbot introduction when the visitor
has asked a specific question.

Never invent facts.

For questions about the ML internship, provide a useful,
detailed explanation.

For "Tell me about her ML internship", explain:
- FlyRank ML Engineering internship
- content-refresh problem
- Content Refresh Opportunity Scoring
- dataset
- models
- Precision@50 results
- what Zainab learned

For follow-up questions such as:
- tell me more
- explain that
- what was the result
- how did it perform
- why
- what did she learn
- what happened next

use the conversation history.

Prefer 2–5 paragraphs or useful bullet points for detailed
questions.

Stay focused on Zainab and her portfolio.
`;


/* =========================================
   CHAT ENDPOINT
   ========================================= */

app.post("/api/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const history = Array.isArray(req.body.history)
            ? req.body.history
            : [];


        if (!userMessage) {

            return res.status(400).json({
                error: "Message is required."
            });

        }


        /*
           Get Gemini model
        */

       const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash"
});

        /*
           Convert conversation history into text.
           This allows ZIA to understand follow-up questions.
        */

        let conversation = "";

        history
            .filter(item =>
                item &&
                (item.role === "user" ||
                 item.role === "assistant") &&
                typeof item.content === "string"
            )
            .forEach(item => {

                const speaker =
                    item.role === "user"
                        ? "Visitor"
                        : "ZIA";

                conversation +=
                    `${speaker}: ${item.content}\n\n`;

            });


        /*
           Build Gemini prompt
        */

        const prompt = `
${ZIA_KNOWLEDGE}

==================================================
CONVERSATION HISTORY
==================================================

${conversation}

==================================================
CURRENT VISITOR QUESTION
==================================================

Visitor: ${userMessage}

==================================================
INSTRUCTIONS
==================================================

Answer the visitor's current question using the knowledge
base and conversation history.

If the visitor asks a follow-up question such as "tell me more",
"what was the result", "why", or "how did it perform", use the
previous conversation to understand what they mean.

Do not invent information.

Answer naturally and professionally.
Keep the response concise.
For simple questions, answer in 1 short paragraph.
For detailed questions, use at most 3 short paragraphs or 5 bullet points.
Do not repeat information unnecessarily.
`;


        /*
           Ask Gemini
        */

        const result =
            await model.generateContent(prompt);


        const response =
            result.response;


        const reply =
            response.text();


        /*
           Send answer back to frontend
        */

        res.json({
            reply: reply
        });


    } catch (error) {

        console.error(
            "ZIA Gemini error:",
            error
        );


        res.status(500).json({
            error: "ZIA could not process your request."
        });

    }

});


/* =========================================
   START SERVER
   ========================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `ZIA backend running on port ${PORT}`
    );
});