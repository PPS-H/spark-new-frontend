import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ArrowLeft, MessageCircle, Phone, Video, FileText, Pin, Archive, Star, MoreVertical, Send, Paperclip, Mic, Camera, User } from "lucide-react";
import SLogo from "@/components/s-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuthRTK";

interface Contact {
  id: string;
  name: string;
  role: string;
  genre?: string;
  avatar: string; // Now required with real photos
  online: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  isFromMe: boolean;
  type: "text" | "audio" | "video" | "document" | "collaboration";
  read: boolean;
  important: boolean;
}

interface Conversation {
  id: string;
  contact: Contact;
  lastMessage: Message;
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  category: "priority" | "collaborations" | "business" | "general";
  messages: Message[];
}

interface ProfessionalInboxProps {
  onClose?: () => void;
}

export default function ProfessionalInbox({ onClose }: ProfessionalInboxProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedNewContact, setSelectedNewContact] = useState<Contact | null>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) {
      console.log("Cannot send message - missing data:", { newMessage, selectedConversation });
      return;
    }
    
    console.log("Sending message:", newMessage, "to conversation:", selectedConversation);
    
    // Create new message
    const message: Message = {
      id: `msg_${Date.now()}`,
      contactId: selectedConversation,
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromMe: true,
      type: "text",
      read: true,
      important: false
    };
    
    // Store message content for later use
    const messageContent = newMessage.trim();
    
    // Clear input immediately
    setNewMessage("");
    
    // Add to conversation
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === selectedConversation) {
          const updatedConv = { 
            ...conv, 
            messages: [...conv.messages, message],
            lastMessage: message
          };
          console.log("Updated conversation:", updatedConv);
          return updatedConv;
        }
        return conv;
      });
      return updated;
    });
    
    // Simulate artist response after 2 seconds
    setTimeout(() => {
      const artistResponse: Message = {
        id: `msg_${Date.now() + 1}`,
        contactId: selectedConversation,
        content: "Thank you for your message! I'll get back to you soon.",
        timestamp: new Date(),
        isFromMe: false,
        type: "text",
        read: false,
        important: false
      };
      
      console.log("Adding artist response:", artistResponse);
      
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { 
              ...conv, 
              messages: [...conv.messages, artistResponse],
              lastMessage: artistResponse,
              unreadCount: conv.unreadCount + 1
            }
          : conv
      ));
    }, 2000);
  };

  // Theme colors (consistent with dynamic search)
  const themeColors = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const complementaryHue = (hue + 180) % 360;
    const accentHue = (hue + 120) % 360;
    
    return {
      primary: `hsl(${hue}, 70%, 55%)`,
      secondary: `hsl(${complementaryHue}, 60%, 45%)`,
      accent: `hsl(${accentHue}, 75%, 60%)`,
      gradient: `linear-gradient(135deg, hsl(${hue}, 70%, 55%) 0%, hsl(${complementaryHue}, 60%, 45%) 100%)`,
      overlay: `linear-gradient(to bottom, transparent 0%, hsla(${hue}, 30%, 10%, 0.8) 100%)`,
      text: `hsl(${hue}, 10%, 95%)`,
      textSecondary: `hsl(${hue}, 15%, 70%)`,
      background: `hsl(${hue}, 20%, 8%)`,
      backgroundSecondary: `hsl(${hue}, 25%, 12%)`
    };
  }, []);

  // Mock conversations data with real profile photos
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      contact: {
        id: "c1",
        name: "Luna Martinez",
        role: "Artist",
        genre: "Pop",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400&h=400&fit=crop&crop=face",
        online: true
      },
      lastMessage: {
        id: "m1",
        contactId: "c1",
        content: "Hey! I'd love to discuss the collaboration opportunity we talked about. When would be a good time to chat?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isFromMe: false,
        type: "text",
        read: false,
        important: true
      },
      unreadCount: 3,
      pinned: true,
      archived: false,
      category: "collaborations",
      messages: []
    },
    {
      id: "2",
      contact: {
        id: "c2",
        name: "Marcus Chen",
        role: "Producer",
        genre: "Hip-Hop",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        online: false,
        lastSeen: "2h ago"
      },
      lastMessage: {
        id: "m2",
        contactId: "c2",
        content: "Here's the beat I was telling you about. Let me know what you think!",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isFromMe: false,
        type: "audio",
        read: true,
        important: false
      },
      unreadCount: 0,
      pinned: false,
      archived: false,
      category: "collaborations",
      messages: []
    },
    {
      id: "3",
      contact: {
        id: "c3",
        name: "Sophia Williams",
        role: "Label Executive",
        genre: "Multi-Genre",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        online: true
      },
      lastMessage: {
        id: "m3",
        contactId: "c3",
        content: "We're interested in your latest track. Can we schedule a call this week to discuss potential signing?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isFromMe: false,
        type: "text",
        read: false,
        important: true
      },
      unreadCount: 1,
      pinned: false,
      archived: false,
      category: "business",
      messages: []
    },
    {
      id: "4",
      contact: {
        id: "c4",
        name: "Alex Thompson",
        role: "Investor",
        genre: "Tech House",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        online: false,
        lastSeen: "1d ago"
      },
      lastMessage: {
        id: "m4",
        contactId: "c4",
        content: "Thanks for sending over the investment proposal. I'll review it and get back to you by Friday.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isFromMe: true,
        type: "document",
        read: true,
        important: false
      },
      unreadCount: 0,
      pinned: false,
      archived: false,
      category: "business",
      messages: []
    }
  ]);

  // Mock available artists for new conversations
  const availableArtists: Contact[] = [
    {
      id: "a1",
      name: "Aurora Nights",
      role: "Artist",
      genre: "Electronic",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      online: true
    },
    {
      id: "a2", 
      name: "Phoenix Rivera",
      role: "Artist",
      genre: "Latin Pop",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      online: false,
      lastSeen: "3h ago"
    },
    {
      id: "a3",
      name: "Kai Chen",
      role: "Producer",
      genre: "Hip-Hop",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face",
      online: true
    },
    {
      id: "a4",
      name: "Zara Williams",
      role: "Artist", 
      genre: "R&B",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
      online: false,
      lastSeen: "1d ago"
    }
  ];

  const getFilteredConversations = () => {
    let filtered = conversations;

    if (searchQuery) {
      filtered = filtered.filter(conv => 
        conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter(conv => conv.unreadCount > 0);
        break;
      case "priority":
        filtered = filtered.filter(conv => conv.category === "priority" || conv.lastMessage.important);
        break;
      case "collaborations":
        filtered = filtered.filter(conv => conv.category === "collaborations");
        break;
      case "business":
        filtered = filtered.filter(conv => conv.category === "business");
        break;
      case "archived":
        filtered = filtered.filter(conv => conv.archived);
        break;
    }

    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) return "now";
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    if (days < 7) return `${Math.floor(days)}d ago`;
    return date.toLocaleDateString();
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "audio": return <Mic className="w-3 h-3" />;
      case "video": return <Video className="w-3 h-3" />;
      case "document": return <FileText className="w-3 h-3" />;
      case "collaboration": return <Music className="w-3 h-3" />;
      default: return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "artist": return "bg-purple-500/20 text-purple-300";
      case "producer": return "bg-blue-500/20 text-blue-300";
      case "investor": return "bg-green-500/20 text-green-300";
      case "label executive": return "bg-yellow-500/20 text-yellow-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      style={{ 
        background: `linear-gradient(135deg, ${themeColors.background}f0, ${themeColors.backgroundSecondary}f0)`
      }}
    >
      <div className="h-full flex">
        {/* Inbox Sidebar */}
        <div 
          className="w-full md:w-96 border-r flex flex-col"
          style={{ 
            backgroundColor: themeColors.backgroundSecondary,
            borderColor: `${themeColors.primary}30`
          }}
        >
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: `${themeColors.primary}30` }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: themeColors.text }}>
                Professional Inbox
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewMessageModal(true)}
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: themeColors.textSecondary }}
              />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-0"
                style={{
                  backgroundColor: themeColors.background,
                  color: themeColors.text
                }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-4 h-8 p-0.5 rounded-full"
                style={{ backgroundColor: themeColors.background }}
              >
                {[
                  { value: "all", label: "All" },
                  { value: "unread", label: "Unread" },
                  { value: "priority", label: "Priority" },
                  { value: "business", label: "Business" }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full text-xs font-medium transition-all duration-300"
                    style={{
                      color: activeFilter === tab.value ? themeColors.text : themeColors.textSecondary,
                      backgroundColor: activeFilter === tab.value ? themeColors.primary : 'transparent'
                    }}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {getFilteredConversations().map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] group ${
                    selectedConversation === conversation.id ? 'ring-1' : ''
                  } ${
                    conversation.unreadCount > 0 ? 'shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: selectedConversation === conversation.id 
                      ? `${themeColors.primary}20` 
                      : conversation.unreadCount > 0 
                        ? themeColors.background 
                        : 'transparent',
                    ringColor: themeColors.primary,
                    opacity: conversation.archived ? 0.6 : 1
                  }}
                >
                  {/* Pinned indicator */}
                  {conversation.pinned && (
                    <Pin 
                      className="absolute top-2 right-2 w-3 h-3" 
                      style={{ color: themeColors.accent }}
                    />
                  )}

                  {/* Important message left border */}
                  {conversation.lastMessage.important && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                      style={{ backgroundColor: themeColors.accent }}
                    />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Avatar with online status */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle profile view click
                          console.log('View profile for:', conversation.contact.name);
                        }}
                        className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
                      >
                        <Avatar className="w-12 h-12 border-2 border-white/20 cursor-pointer group-hover:scale-105 transition-transform">
                          <AvatarImage 
                            src={conversation.contact.avatar} 
                            alt={conversation.contact.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-600">
                            <User className="w-6 h-6 text-gray-300" />
                          </AvatarFallback>
                        </Avatar>
                      </button>
                      {conversation.contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name and role */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm truncate text-white">
                          {conversation.contact.name}
                        </h3>
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(conversation.contact.role)}`}
                        >
                          {conversation.contact.role}
                        </Badge>
                      </div>

                      {/* Message preview */}
                      <div className="flex items-center space-x-1 mb-1">
                        {getMessageTypeIcon(conversation.lastMessage.type)}
                        <p className={`text-xs truncate leading-relaxed ${
                          conversation.unreadCount > 0 ? 'text-white' : 'text-gray-400'
                        }`}>
                          {conversation.lastMessage.isFromMe && "You: "}
                          {conversation.lastMessage.content}
                        </p>
                      </div>

                      {/* Timestamp and action icons */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                        <div className="flex items-center space-x-2">
                          {conversation.unreadCount > 0 && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          {/* Dedicated Message Icon */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConversation(conversation.id);
                            }}
                            className="w-8 h-8 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                          >
                            <MessageCircle className="w-4 h-4 text-white hover:text-gray-200" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat View */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col" style={{ backgroundColor: themeColors.background }}>
            {/* Chat Header */}
            <div 
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: `${themeColors.primary}30` }}
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    // Handle profile view click
                    console.log('View profile for:', selectedConv.contact.name);
                  }}
                  className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
                >
                  <Avatar className="w-10 h-10 border-2 border-white/20 cursor-pointer group-hover:scale-105 transition-transform">
                    <AvatarImage 
                      src={selectedConv.contact.avatar} 
                      alt={selectedConv.contact.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-600">
                      <User className="w-5 h-5 text-gray-300" />
                    </AvatarFallback>
                  </Avatar>
                </button>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedConv.contact.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedConv.contact.online ? "Online" : `Last seen ${selectedConv.contact.lastSeen}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                    This is the beginning of your conversation with {selectedConv.contact.name}
                  </p>
                </div>
                
                {/* All messages */}
                {selectedConv.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl"
                      style={{ 
                        backgroundColor: message.isFromMe ? themeColors.primary : themeColors.backgroundSecondary 
                      }}
                    >
                      <p className="text-sm" style={{ color: themeColors.text }}>
                        {message.content}
                      </p>
                      <p className="text-xs mt-1" style={{ color: themeColors.textSecondary }}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div 
              className="p-4 border-t"
              style={{ borderColor: `${themeColors.primary}30` }}
            >
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  style={{ color: themeColors.textSecondary }}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="rounded-full border-0 pr-12"
                    style={{
                      backgroundColor: themeColors.backgroundSecondary,
                      color: themeColors.text
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: themeColors.background }}
          >
            <div className="text-center">
              <MessageCircle 
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: themeColors.textSecondary }}
              />
              <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                Select a conversation
              </h3>
              <p style={{ color: themeColors.textSecondary }}>
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal - Artist Contact Grid */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="w-full max-w-4xl max-h-[80vh] rounded-xl overflow-hidden"
            style={{ backgroundColor: themeColors.backgroundSecondary }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b" style={{ borderColor: `${themeColors.primary}30` }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Start New Conversation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewMessageModal(false)}
                  className="hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            {/* Artist Grid */}
            <ScrollArea className="max-h-[60vh] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer group hover:scale-105"
                    style={{ backgroundColor: themeColors.background }}
                    onClick={() => {
                      setSelectedNewContact(artist);
                      setShowNewMessageModal(false);
                      // Create new conversation with this artist
                      const newConversation: Conversation = {
                        id: `new-${Date.now()}`,
                        contact: artist,
                        lastMessage: {
                          id: `msg-${Date.now()}`,
                          contactId: artist.id,
                          content: "Start your conversation...",
                          timestamp: new Date(),
                          isFromMe: true,
                          type: "text",
                          read: true,
                          important: false
                        },
                        unreadCount: 0,
                        pinned: false,
                        archived: false,
                        category: "general",
                        messages: []
                      };
                      setSelectedConversation(newConversation.id);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Artist Avatar */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle profile view click
                            console.log('View profile for:', artist.name);
                          }}
                          className="group focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full"
                        >
                          <Avatar className="w-12 h-12 border-2 border-white/20 cursor-pointer group-hover:scale-105 transition-transform">
                            <AvatarImage 
                              src={artist.avatar} 
                              alt={artist.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gray-600">
                              <User className="w-6 h-6 text-gray-300" />
                            </AvatarFallback>
                          </Avatar>
                        </button>
                        {artist.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
                        )}
                      </div>

                      {/* Artist Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {artist.name}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {artist.role} • {artist.genre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {artist.online ? "Online" : `Last seen ${artist.lastSeen}`}
                        </p>
                      </div>

                      {/* Message Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}