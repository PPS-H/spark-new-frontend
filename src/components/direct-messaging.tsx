import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, Send, Search, Filter, CheckCircle, Circle, 
  Clock, Star, MoreVertical, Phone, Video, Archive, Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArtists } from "@/hooks/use-artists";
import type { Artist } from "@/types/artist";

interface Message {
  id: string;
  sender: string;
  senderType: "fan" | "label" | "artist" | "system";
  content: string;
  timestamp: Date;
  read: boolean;
  priority: "normal" | "high" | "urgent";
}

interface Conversation {
  id: string;
  artistId: number;
  artistName: string;
  artistGenre: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  status: "active" | "archived" | "blocked";
  priority: "normal" | "high" | "urgent";
}

interface DirectMessagingProps {
  userId: string;
}

export default function DirectMessaging({ userId }: DirectMessagingProps) {
  const { data: artists = [] } = useArtists();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedArtistForNew, setSelectedArtistForNew] = useState<Artist | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "priority">("all");

  // Initialize with some sample conversations
  useEffect(() => {
    const sampleConversations: Conversation[] = artists.slice(0, 6).map((artist, index) => ({
      id: `conv-${artist.id}`,
      artistId: artist.id,
      artistName: artist.name,
      artistGenre: artist.genre,
      lastMessage: [
        "Thanks for your investment! Looking forward to working together.",
        "I have some exciting updates about my upcoming album release.",
        "The tour revenue projections are looking really promising.",
        "Could we schedule a call to discuss the marketing strategy?",
        "The streaming numbers have exceeded our expectations!",
        "I'd love to get your feedback on the new single."
      ][index],
      lastMessageTime: new Date(Date.now() - index * 3600000), // Spread over last few hours
      unreadCount: Math.floor(Math.random() * 3),
      messages: generateSampleMessages(artist.name, index),
      status: "active",
      priority: index < 2 ? "high" : "normal"
    }));
    setConversations(sampleConversations);
  }, [artists]);

  const generateSampleMessages = (artistName: string, seed: number): Message[] => {
    const messages: Message[] = [];
    const baseTime = Date.now() - seed * 3600000;
    
    // Initial investment discussion
    messages.push({
      id: `msg-${seed}-1`,
      sender: "You",
      senderType: "label",
      content: `Hi ${artistName}, I'm interested in investing in your music career. Your recent work shows great potential.`,
      timestamp: new Date(baseTime - 7200000),
      read: true,
      priority: "normal"
    });

    messages.push({
      id: `msg-${seed}-2`,
      sender: artistName,
      senderType: "artist",
      content: "Thank you for reaching out! I'm excited about the opportunity to work with you. What specific aspects of my career are you most interested in?",
      timestamp: new Date(baseTime - 6000000),
      read: true,
      priority: "normal"
    });

    // Follow-up messages
    if (seed % 2 === 0) {
      messages.push({
        id: `msg-${seed}-3`,
        sender: "You",
        senderType: "label",
        content: "I'm particularly interested in your streaming growth and international expansion potential. Could you share more details about your upcoming releases?",
        timestamp: new Date(baseTime - 3600000),
        read: true,
        priority: "normal"
      });

      messages.push({
        id: `msg-${seed}-4`,
        sender: artistName,
        senderType: "artist",
        content: "Absolutely! I have an album dropping next quarter and we're already seeing strong pre-save numbers. The lead single has great playlist potential.",
        timestamp: new Date(baseTime - 1800000),
        read: seed > 2,
        priority: seed < 2 ? "high" : "normal"
      });
    }

    return messages;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: "You",
      senderType: "label",
      content: newMessage,
      timestamp: new Date(),
      read: true,
      priority: "normal"
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        };
      }
      return conv;
    }));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date()
    } : null);

    setNewMessage("");

    // Simulate artist reply after a delay
    setTimeout(() => {
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        sender: selectedConversation.artistName,
        senderType: "artist",
        content: "Thanks for your message! I'll get back to you with more details soon.",
        timestamp: new Date(),
        read: false,
        priority: "normal"
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, reply],
            lastMessage: reply.content,
            lastMessageTime: new Date(),
            unreadCount: conv.unreadCount + 1
          };
        }
        return conv;
      }));
    }, 2000 + Math.random() * 3000);
  };

  const startNewConversation = () => {
    if (!selectedArtistForNew) return;

    const newConv: Conversation = {
      id: `conv-new-${Date.now()}`,
      artistId: selectedArtistForNew.id,
      artistName: selectedArtistForNew.name,
      artistGenre: selectedArtistForNew.genre,
      lastMessage: "New conversation started",
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
      status: "active",
      priority: "normal"
    };

    setConversations(prev => [newConv, ...prev]);
    setSelectedConversation(newConv);
    setShowNewMessageModal(false);
    setSelectedArtistForNew(null);
  };

  const markAsRead = (convId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case "unread":
        return conv.unreadCount > 0;
      case "priority":
        return conv.priority === "high" || conv.priority === "urgent";
      default:
        return true;
    }
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-1/3 bg-slate-900/50 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-cyan-400" />
              Messages
              {totalUnread > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{totalUnread}</Badge>
              )}
            </h2>
            <Button
              onClick={() => setShowNewMessageModal(true)}
              size="sm"
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              New
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                <TabsTrigger value="priority" className="text-xs">Priority</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  markAsRead(conv.id);
                }}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id
                    ? "bg-cyan-500/20 border border-cyan-500/50"
                    : "bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle profile view click
                      console.log('View profile for:', conv.artistName);
                    }}
                    className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
                  >
                    <Avatar className="w-10 h-10 cursor-pointer group-hover:scale-105 transition-transform">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-bold">
                        {conv.artistName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold truncate">{conv.artistName}</p>
                      <div className="flex items-center space-x-1">
                        {conv.priority === "high" && <Star className="w-3 h-3 text-yellow-400" />}
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">{conv.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-xs capitalize mb-1">{conv.artistGenre}</p>
                    <p className="text-gray-300 text-sm truncate">{conv.lastMessage}</p>
                    <p className="text-gray-500 text-xs">{formatTime(conv.lastMessageTime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-slate-900/50 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      // Handle profile view click
                      console.log('View profile for:', selectedConversation.artistName);
                    }}
                    className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
                  >
                    <Avatar className="w-10 h-10 cursor-pointer group-hover:scale-105 transition-transform">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-bold">
                        {selectedConversation.artistName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  <div>
                    <h3 className="text-white font-semibold">{selectedConversation.artistName}</h3>
                    <p className="text-gray-400 text-sm capitalize">{selectedConversation.artistGenre}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "You"
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-gray-200"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.sender === "You" && (
                          <div className="flex items-center">
                            {message.read ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Circle className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-700">
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-800 border-slate-600 text-white resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select a conversation to start messaging</p>
              <p className="text-gray-500 text-sm">Connect with artists and manage your communications</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-cyan-400" />
              Start New Conversation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Select Artist</label>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => setSelectedArtistForNew(artist)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedArtistForNew?.id === artist.id
                          ? "bg-cyan-500/20 border border-cyan-500/50"
                          : "bg-slate-800/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          {artist.imageUrl ? (
                            <img 
                              src={artist.imageUrl} 
                              alt={artist.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-bold text-sm">
                              {artist.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-white font-semibold">{artist.name}</p>
                          <p className="text-gray-400 text-sm capitalize">{artist.genre}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNewMessageModal(false)}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={startNewConversation}
                disabled={!selectedArtistForNew}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              >
                Start Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}