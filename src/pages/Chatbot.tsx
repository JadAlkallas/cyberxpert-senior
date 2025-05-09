
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Send, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// Types for our chat messages
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("cyberxpert-chat-history");
    if (storedHistory && user) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Only load messages for the current user
        const userHistory = parsedHistory[user.id] || [];
        setChatHistory(userHistory);
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast.error("Failed to load chat history");
      }
    }
  }, [user]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (user && chatHistory.length > 0) {
      const allHistory = JSON.parse(localStorage.getItem("cyberxpert-chat-history") || "{}");
      allHistory[user.id] = chatHistory;
      localStorage.setItem("cyberxpert-chat-history", JSON.stringify(allHistory));
    }
  }, [chatHistory, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    // Update chat with user message
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Simulate API call (in a real app, this would call your backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, create a mock response
      // In a real implementation, this would come from your backend
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${message}".\nThis is a simulated response from the CyberXpert assistant. In a production environment, this would connect to an actual API.`,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setChatHistory((prev) => [...prev, botResponse]);
      toast.success("Response received");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-cyber-dark-gray text-white">
              <h1 className="text-xl font-bold">CyberXpert Assistant</h1>
              <p className="text-sm text-gray-300">Chat with our AI assistant about security concerns</p>
            </div>
            
            {/* Chat history */}
            <div className="p-4 h-[400px] overflow-y-auto bg-gray-50">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <History className="h-12 w-12 mb-2" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`rounded-lg p-3 max-w-[80%] ${
                          chat.sender === "user" 
                            ? "bg-cyber-orange text-white" 
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{chat.content}</div>
                        <div className={`text-xs mt-1 ${
                          chat.sender === "user" ? "text-gray-200" : "text-gray-500"
                        }`}>
                          {formatDate(chat.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[80px]"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="self-end bg-cyber-orange hover:bg-cyber-orange/90"
                  disabled={isLoading || !message.trim()}
                >
                  <Send className="h-5 w-5" />
                  <span className="ml-2">Send</span>
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
