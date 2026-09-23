import express from "express";
import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion
} from "@qvac/sdk";

const app = express();
const PORT = 3000;

app.use(express.json());

let modelId = null;

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>QVAC Local AI</title>
        <style>
          body {
            font-family: Arial;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
          }
          textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
          }
          button {
            padding: 12px 20px;
            cursor: pointer;
          }
          #answer {
            margin-top: 20px;
            white-space: pre-wrap;
          }
        </style>
      </head>

      <body>
        <h1>QVAC Local AI</h1>
        <p>Ask a question and get a local AI answer.</p>

        <textarea id="question" placeholder="Ask something..."></textarea>
        <br>
        <button onclick="ask()">Ask AI</button>

        <div id="answer"></div>

        <script>
          async function ask() {
            const question = document.getElementById("question").value;
            const answer = document.getElementById("answer");

            answer.textContent = "Thinking...";

            const response = await fetch("/ask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ question })
            });

            const data = await response.json();
            answer.textContent = data.answer || data.error;
          }
        </script>
      </body>
    </html>
  `);
});

app.post("/ask", async (req, res) => {
  try {
    if (!modelId) {
      modelId = await loadModel({
        modelSrc: LLAMA_3_2_1B_INST_Q4_0
      });
    }

    const result = completion({
      modelId,
      history: [
        {
          role: "user",
          content: req.body.question
        }
      ],
      stream: true
    });

    let answer = "";

    for await (const token of result.tokenStream) {
      answer += token;
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`QVAC Local AI running on port ${PORT}`);
});