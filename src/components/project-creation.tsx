import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  Music,
  Image,
  Video,
  DollarSign,
  Calendar,
  Target,
  Users,
  Plus,
  X,
  CheckCircle
} from "lucide-react";

interface ProjectCreationProps {
  onClose?: () => void;
  onProjectCreated?: (project: any) => void;
}

export default function ProjectCreation({ onClose, onProjectCreated }: ProjectCreationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    genre: "",
    fundingGoal: "",
    duration: "30",
    tags: [] as string[],
    media: {
      audio: null as File | null,
      cover: null as File | null,
      video: null as File | null
    }
  });

  const [currentTag, setCurrentTag] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const genres = ["rap", "pop", "afrobeats", "k-pop", "j-pop", "indie", "rock", "jazz", "electronic", "country"];

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      
      // Add text data
      Object.keys(data).forEach(key => {
        if (key !== "media" && key !== "tags") {
          formData.append(key, data[key]);
        }
      });
      
      // Add tags as JSON
      formData.append("tags", JSON.stringify(data.tags));
      
      // Add media files
      if (data.media.audio) formData.append("audio", data.media.audio);
      if (data.media.cover) formData.append("cover", data.media.cover);
      if (data.media.video) formData.append("video", data.media.video);

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return response.json();
    },
    onSuccess: (project) => {
      toast({
        title: "Project Created!",
        description: "Your project has been successfully created and is now live.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onProjectCreated?.(project);
      onClose?.();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = (type: 'audio' | 'cover' | 'video', file: File) => {
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProjectData(prev => ({
            ...prev,
            media: { ...prev.media, [type]: file }
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const addTag = () => {
    if (currentTag.trim() && !projectData.tags.includes(currentTag.trim())) {
      setProjectData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return projectData.title.trim() && projectData.description.trim();
      case 2:
        return projectData.genre && projectData.fundingGoal;
      case 3:
        return projectData.media.audio || projectData.media.cover;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">Project Title *</Label>
              <Input
                id="title"
                value={projectData.title}
                onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your project title..."
                className="mt-2 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Description *</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell the world about your project..."
                rows={4}
                className="mt-2 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white">Genre *</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {genres.map(genre => (
                  <Button
                    key={genre}
                    variant={projectData.genre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProjectData(prev => ({ ...prev, genre }))}
                    className={
                      projectData.genre === genre
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "border-slate-700 text-white hover:bg-slate-800"
                    }
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fundingGoal" className="text-white">Funding Goal (USD) *</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fundingGoal"
                  type="number"
                  value={projectData.fundingGoal}
                  onChange={(e) => setProjectData(prev => ({ ...prev, fundingGoal: e.target.value }))}
                  placeholder="5000"
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration" className="text-white">Campaign Duration (days)</Label>
              <select
                id="duration"
                value={projectData.duration}
                onChange={(e) => setProjectData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full mt-2 p-2 bg-slate-800/50 border border-slate-700 rounded text-white"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <div>
              <Label className="text-white">Tags</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="bg-slate-800/50 border-slate-700 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onClick={addTag} size="icon" variant="outline" className="border-slate-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {projectData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {projectData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Audio Upload */}
            <div>
              <Label className="text-white">Audio Track</Label>
              <div className="mt-2 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                {projectData.media.audio ? (
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{projectData.media.audio.name}</p>
                      <p className="text-gray-400 text-sm">Audio uploaded successfully</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Upload your track</p>
                    <p className="text-gray-400 text-sm mb-4">MP3, WAV, or FLAC up to 50MB</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('audio', file);
                      }}
                      className="hidden"
                      id="audio-upload"
                    />
                    <Label
                      htmlFor="audio-upload"
                      className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded inline-block"
                    >
                      Choose Audio File
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label className="text-white">Cover Image</Label>
              <div className="mt-2 border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                {projectData.media.cover ? (
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{projectData.media.cover.name}</p>
                      <p className="text-gray-400 text-sm">Cover image uploaded successfully</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Upload cover artwork</p>
                    <p className="text-gray-400 text-sm mb-4">JPG, PNG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('cover', file);
                      }}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Label
                      htmlFor="cover-upload"
                      className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded inline-block"
                    >
                      Choose Image
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h3>
              <p className="text-gray-400">Review your project details before publishing</p>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-white">{projectData.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{projectData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-white ml-2">{projectData.genre}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Goal:</span>
                    <span className="text-white ml-2">${projectData.fundingGoal}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-2">{projectData.duration} days</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Media:</span>
                    <span className="text-white ml-2">
                      {[
                        projectData.media.audio && "Audio",
                        projectData.media.cover && "Cover",
                        projectData.media.video && "Video"
                      ].filter(Boolean).join(", ") || "None"}
                    </span>
                  </div>
                </div>

                {projectData.tags.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {projectData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">Create New Project</CardTitle>
            <Badge variant="outline" className="border-purple-500 text-purple-300">
              Step {step} of 4
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="border-slate-700 text-white"
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={() => createProjectMutation.mutate(projectData)}
                disabled={createProjectMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {createProjectMutation.isPending ? "Creating..." : "Launch Project"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}