'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { url } from "./constants";

interface Message {
  user: string;
  content: string;
}

const languages = ["English", "Urdu", "French", "Spanish", "Arabic"];
const userId = "user" + Math.floor(Math.random() * 1000);

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const chatWindowRef = useRef<HTMLDivElement>(null); 
  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(true);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { user: "You", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); // Show spinner

    try {
      const response = await axios.post(url, {
        user_id: userId,
        message: input,
        language,
      });

      const botMessage: Message = { user: "Bot", content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botError: Message = { user: "Bot", content: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, botError]);
    } finally {
      setIsLoading(false); // Hide spinner
    }

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setButtonIsDisabled(true);
    }
  };

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <label htmlFor="language" className="mr-2 font-medium">
          Choose Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div
        ref={chatWindowRef}
        className="w-4/5 h-2/3 p-4 overflow-y-scroll bg-white border border-gray-300 rounded-md shadow-md"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.user === "You" ? "text-right text-blue-600" : "text-left text-green-600"
              }`}
          >
            <strong>{msg.user}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">
            <svg
              className="w-5 h-5 mx-auto animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <p>Bot is typing...</p>
          </div>
        )}
      </div>
      <div className="flex items-center w-4/5 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => { 
            setInput(e.target.value);
            setButtonIsDisabled(!e.target.value.trim());
          } }
          onKeyDown={handleKeyPress} 
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="p-2 ml-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
          disabled={buttonIsDisabled}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
