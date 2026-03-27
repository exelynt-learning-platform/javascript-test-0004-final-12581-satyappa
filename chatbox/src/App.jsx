import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]); 
  const [loading, setLoading] = useState(false);

  const hfToken = process.env.REACT_APP_HF_TOKEN;
  const ULR = process.env.URL;
  const askQuestion = async () => {
    if (!question.trim()) return;

    setConversation(prev => [...prev, { type: 'user', text: question }]);
    setLoading(true);

    try {
      const hfUrl = `${ULR}`;
      const response = await fetch(hfUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken} `, 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: question })
      });

      const data = await response.json();
      let aiText = "No response";

      if (Array.isArray(data) && data[0]?.generated_text) {
        aiText = data[0].generated_text;
      } else if (data.error) {
        aiText = "Error: " + data.error;
      } else {
        aiText = JSON.stringify(data);
      }
      setConversation(prev => [...prev, { type: 'ai', text: aiText }]);
    } catch (err) {
      console.error(err);
      setConversation(prev => [...prev, { type: 'ai', text: "Error fetching response." }]);
    }

    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="col-span-1 bg-zinc-800 p-2 overflow-auto">
        <h2 className="text-white text-lg mb-2" style={{display:'flex',alignItems:"center",justifyContent:'center'}}>User History</h2>
        {conversation.filter(msg => msg.type === 'user').map((msg, idx) => (
          <div key={idx} className="bg-blue-600 text-white p-2 m-1 rounded-xl break-words">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="col-span-4 flex flex-col justify-end items-center p-4">
        <div className="container h-140 w-4/5 max-w-xl p-4 bg-zinc-700 text-white rounded-xl mb-5 overflow-auto flex flex-col gap-2">
        <h1 style={{display:"flex", alignItems:"center", justifyContent:"center"}}>Wlcome chatBox</h1>
          {conversation.map((msg, idx) => (
            <div key={idx} className={`p-2 rounded-xl max-w-[80%] break-words ${msg.type==='user'? 'bg-blue-600 self-end':'bg-green-600 self-start'}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="p-2 bg-yellow-500 rounded-xl self-start">AI is thinking...</div>}
        </div>

        <div className="bg-zinc-800 w-4/5 max-w-xl p-2 text-white rounded-3xl border border-zinc-400 flex items-center gap-2 mb-5">
          <input
            type="text"
            className="flex-1 p-3 text-white bg-zinc-800 rounded-2xl outline-none"
            placeholder="Ask me anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl disabled:opacity-50"
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;