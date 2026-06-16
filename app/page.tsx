"use client";

import { useState } from "react";

type Message = {
  sender: string;
  text: string;
};

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState("");

  const handleSend = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

if (!pdfFile) {
  alert("Please upload a PDF first");
  return;
}
console.log(pdfFile);
const formData = new FormData();
formData.append("pdf", pdfFile);

    setMessages((prev) => [
      ...prev,
      {
        sender: "You",
        text: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  message: trimmedQuestion,
  fileName: fileName,
  hasPdf: true,
}),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        LearnSphere AI 🎓
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Your AI-powered learning assistant
      </p>

      <div className="flex flex-col items-center gap-4">
        <input
  type="file"
  accept=".pdf"
  onChange={async (e) => {
  if (e.target.files && e.target.files[0]) {
    setFileName(e.target.files[0].name);
    setPdfFile(e.target.files[0]);

    console.log("PDF Selected:", e.target.files[0].name);
  }
}}
/>

        {fileName && (
          <p className="text-black">
            Selected File: {fileName}
          </p>
        )}

        <button
  onClick={() => setShowChat(!showChat)}
  className="bg-green-500 text-white px-6 py-3 rounded-lg"
>
  AI Chat
</button>

<button
  onClick={() => {
    alert(
      "Artificial Intelligence is the simulation of human intelligence in machines. AI helps computers learn, reason, and solve problems."
    );
  }}
  className="bg-orange-500 text-white px-6 py-3 rounded-lg"
>
  Summarize
</button>

<button
  onClick={async () => {
    const response = await fetch("/api/quiz", {
      method: "POST",
    });

    const data = await response.json();

    setQuiz(data.quiz);
  }}
  className="bg-purple-500 text-white px-6 py-3 rounded-lg"
>
  Generate Quiz
</button>
{quiz && (
  <div className="bg-white border-2 border-purple-500 p-4 rounded-lg w-80 text-black">
    <h3 className="font-bold mb-2">Generated Quiz</h3>

    <pre className="whitespace-pre-wrap font-sans">
      {quiz}
    </pre>
  </div>
)}

        {showChat && (
          <div className="border-2 border-black p-4 bg-white rounded-lg flex flex-col gap-3">
            <input
              type="text"
              placeholder="Ask something about your PDF..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="border-2 border-blue-500 p-2 w-80 text-black rounded"
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

            <div className="mt-4 w-80">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-2 rounded mb-2 text-black"
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}