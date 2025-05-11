import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Send, History, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

// Types for our chat messages and conversations
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}
interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  endedAt: Date | null;
}
const Chatbot = () => {
  const {
    user
  } = useAuth();
  const [message, setMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [pastConversations, setPastConversations] = useState<Conversation[]>([]);
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewedConversation, setViewedConversation] = useState<Conversation | null>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    if (user) {
      try {
        // Load past conversations
        const storedConversations = localStorage.getItem("cyberxpert-conversations");
        if (storedConversations) {
          const parsedConversations = JSON.parse(storedConversations);
          const userConversations = parsedConversations[user.id] || [];
          // Parse dates properly
          const conversations = userConversations.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            endedAt: conv.endedAt ? new Date(conv.endedAt) : null,
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setPastConversations(conversations);
        }

        // Check for active conversation
        const activeConversation = localStorage.getItem("cyberxpert-active-conversation");
        if (activeConversation) {
          const parsedConversation = JSON.parse(activeConversation);
          if (parsedConversation && parsedConversation.userId === user.id) {
            // Parse dates properly
            setCurrentConversation({
              ...parsedConversation.conversation,
              createdAt: new Date(parsedConversation.conversation.createdAt),
              endedAt: parsedConversation.conversation.endedAt ? new Date(parsedConversation.conversation.endedAt) : null,
              messages: parsedConversation.conversation.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            });
          }
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        toast.error("Failed to load chat history");
      }
    }
  }, [user]);

  // Save active conversation to localStorage whenever it changes
  useEffect(() => {
    if (user && currentConversation) {
      localStorage.setItem("cyberxpert-active-conversation", JSON.stringify({
        userId: user.id,
        conversation: currentConversation
      }));
    }
  }, [currentConversation, user]);

  // Save past conversations to localStorage whenever they change
  useEffect(() => {
    if (user && pastConversations.length > 0) {
      const allConversations = JSON.parse(localStorage.getItem("cyberxpert-conversations") || "{}");
      allConversations[user.id] = pastConversations;
      localStorage.setItem("cyberxpert-conversations", JSON.stringify(allConversations));
    }
  }, [pastConversations, user]);

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversation ${new Date().toLocaleString()}`,
      messages: [],
      createdAt: new Date(),
      endedAt: null
    };
    setCurrentConversation(newConversation);
    setViewedConversation(null);
    setShowConversationHistory(false);
    toast.success("New conversation started");
  };

  const endCurrentConversation = () => {
    if (currentConversation) {
      const endedConversation = {
        ...currentConversation,
        endedAt: new Date()
      };

      // Add to past conversations
      setPastConversations(prev => [endedConversation, ...prev]);

      // Clear current conversation
      setCurrentConversation(null);

      // Remove active conversation from localStorage
      localStorage.removeItem("cyberxpert-active-conversation");
      toast.success("Conversation ended and saved");
      
      // If we're viewing a conversation, keep showing it
      if (viewedConversation) {
        setShowConversationHistory(false);
      }
    }
  };

  const viewConversation = (conversation: Conversation) => {
    setViewedConversation(conversation);
    setShowConversationHistory(false);
  };

  const loadConversation = (conversation: Conversation) => {
    if (currentConversation && currentConversation.messages.length > 0) {
      toast.error("Please end your current conversation before starting another one");
      // Show the conversation as viewed only
      setViewedConversation(conversation);
      setShowConversationHistory(false);
      return;
    }
    
    // If no active conversation or it's empty, activate this one
    // If the conversation was previously ended, reactivate it by setting endedAt to null
    const reactivatedConversation = {
      ...conversation,
      endedAt: null
    };
    
    // Update past conversations list to remove this conversation (since it's now active)
    setPastConversations(prev => prev.filter(conv => conv.id !== conversation.id));
    
    // Set as current conversation
    setCurrentConversation(reactivatedConversation);
    setViewedConversation(null);
    setShowConversationHistory(false);
    toast.success("Conversation reopened");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create a new conversation if none exists
    if (!currentConversation) {
      startNewConversation();
      return;
    }

    // Create a new user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date()
    };

    // Update chat with user message
    setCurrentConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, userMessage]
      };
    });
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
        timestamp: new Date()
      };
      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, botResponse]
        };
      });
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
  
  const backToConversations = () => {
    setViewedConversation(null);
    setShowConversationHistory(true);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-cyber-dark-gray text-white flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">CyberXpert Assistant</h1>
                <p className="text-sm text-gray-300">Chat with our AI assistant about security concerns</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowConversationHistory(!showConversationHistory)} className="text-white hover:bg-gray-700">
                  <History className="h-5 w-5" />
                  <span className="ml-2">{showConversationHistory ? "Hide History" : "Show History"}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={startNewConversation} className="border-white bg-cyber-orange text-[cyber-dark-gray] text-cyber-black">
                  <MessageSquare className="h-5 w-5" />
                  <span className="ml-2">New Chat</span>
                </Button>
                {currentConversation && <Button variant="destructive" size="sm" onClick={endCurrentConversation} className="hover:bg-red-700">
                    <X className="h-5 w-5" />
                    <span className="ml-2">End Chat</span>
                  </Button>}
              </div>
            </div>
            
            {showConversationHistory ? (
              <ScrollArea className="p-4 h-[400px] bg-gray-50">
                <h2 className="text-lg font-semibold mb-4">Conversation History</h2>
                {pastConversations.length === 0 ? <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <History className="h-12 w-12 mb-2" />
                    <p>No past conversations yet</p>
                  </div> : <div className="space-y-2">
                    {pastConversations.map(conv => <div key={conv.id} onClick={() => viewConversation(conv)} className="p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium">{conv.title}</div>
                        <div className="text-sm text-gray-500 flex justify-between">
                          <span>{formatDate(conv.createdAt)}</span>
                          <span>{conv.messages.length} messages</span>
                        </div>
                      </div>)}
                  </div>}
              </ScrollArea>
            ) : viewedConversation ? (
              <div className="h-[400px] flex flex-col">
                <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">{viewedConversation.title} (View only)</h2>
                    <p className="text-sm text-gray-500">Created on {formatDate(viewedConversation.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={backToConversations}>
                      <History className="h-4 w-4 mr-2" />
                      Back to History
                    </Button>
                    <Button size="sm" onClick={() => loadConversation(viewedConversation)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Resume Chat
                    </Button>
                  </div>
                </div>
                <ScrollArea className="p-4 flex-1 bg-gray-50">
                  <div className="space-y-4">
                    {viewedConversation.messages.map(chat => <div key={chat.id} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-lg p-3 max-w-[80%] ${chat.sender === "user" ? "bg-cyber-orange text-white" : "bg-white border border-gray-200"}`}>
                          <div className="whitespace-pre-wrap">{chat.content}</div>
                          <div className={`text-xs mt-1 ${chat.sender === "user" ? "text-gray-200" : "text-gray-500"}`}>
                            {formatDate(chat.timestamp)}
                          </div>
                        </div>
                      </div>)}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <ScrollArea className="p-4 h-[400px] bg-gray-50">
                {!currentConversation ? <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="h-12 w-12 mb-2" />
                    <p>Start a new conversation!</p>
                    <Button variant="outline" size="sm" onClick={startNewConversation} className="mt-4">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>New Chat</span>
                    </Button>
                  </div> : <div className="space-y-4">
                    {currentConversation.messages.length === 0 ? <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p>Type a message to start chatting!</p>
                      </div> : currentConversation.messages.map(chat => <div key={chat.id} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`rounded-lg p-3 max-w-[80%] ${chat.sender === "user" ? "bg-cyber-orange text-white" : "bg-white border border-gray-200"}`}>
                            <div className="whitespace-pre-wrap">{chat.content}</div>
                            <div className={`text-xs mt-1 ${chat.sender === "user" ? "text-gray-200" : "text-gray-500"}`}>
                              {formatDate(chat.timestamp)}
                            </div>
                          </div>
                        </div>)}
                  </div>}
              </ScrollArea>
            )}
            
            {/* Message input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Textarea 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  placeholder={viewedConversation ? "End current chat to resume this conversation..." : "Type your message here..."} 
                  className="flex-1 min-h-[80px]" 
                  disabled={isLoading || !currentConversation || viewedConversation !== null} 
                />
                <Button 
                  type="submit" 
                  className="self-end bg-cyber-orange hover:bg-cyber-orange/90" 
                  disabled={isLoading || !currentConversation || !message.trim() || viewedConversation !== null}
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
