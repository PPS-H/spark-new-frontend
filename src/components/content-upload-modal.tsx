import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Music, Video, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadContentMutation } from "@/store/features/api/authApi";

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function ContentUploadModal({ isOpen, onClose, onUploadSuccess }: ContentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  
  // RTK Query mutation hook
  const [uploadContent, { isLoading: isUploading }] = useUploadContentMutation();

  // Liste complète des genres musicaux
  const musicGenres = [
    "Rap", "Pop", "Rock", "Electronic", "R&B", "Hip-Hop", 
    "Jazz", "Blues", "Country", "Reggae", "Classical", 
    "Folk", "Indie", "Alternative", "Metal", "Punk",
    "Funk", "Soul", "Disco", "House", "Techno", "Trance",
    "Dubstep", "Trap", "Drill", "Afrobeat", "Amapiano",
    "Reggaeton", "Latin", "Salsa", "Bachata", "Merengue",
    "K-pop", "J-pop", "Bollywood", "Arabic", "World",
    "Gospel", "Christian", "Spiritual", "Ambient", "Chillout",
    "Lo-fi", "Experimental", "Avant-garde", "Post-rock",
    "Shoegaze", "Emo", "Hardcore", "Metalcore", "Deathcore",
    "Black Metal", "Death Metal", "Progressive", "Psychedelic",
    "Garage", "Surf", "Rockabilly", "Swing", "Bebop",
    "Fusion", "Smooth Jazz", "New Age", "Meditation",
    "Synthwave", "Vaporwave", "Future Bass", "Drum & Bass",
    "Jungle", "Breakbeat", "UK Garage", "Grime", "Dancehall",
    "Soca", "Calypso", "Cumbia", "Tango", "Flamenco",
    "Celtic", "Nordic", "Tribal", "Ethnic", "Traditional",
    "Instrumental", "Acoustic", "Unplugged", "Live",
    "Remix", "Cover", "Mashup", "Autres"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-generate title from filename if not set
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setTitle(fileName);
      }
    }
  };

  const getFileIcon = () => {
    if (!file) return Upload;
    
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('image/')) return Image;
    return Upload;
  };

  const getFileTypeLabel = () => {
    if (!file) return 'Select a file';
    
    if (file.type.startsWith('audio/')) return 'Audio';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type.startsWith('image/')) return 'Photo';
    return 'File';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a title",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await uploadContent({
        title: title.trim(),
        genre: genre,
        description: description.trim(),
        file: file
      }).unwrap();
      if (result.success) { 
        toast({
          title: "Success!",
        });

        // Reset form
        setFile(null);
        setTitle("");
        setGenre("");
        setDescription("");
        
        // Trigger event for instant refresh
        window.dispatchEvent(new CustomEvent('contentUploaded'));
        
        // Close modal and refresh content
        onClose();
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = "Upload failed. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setGenre("");
    setDescription("");
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  const FileIcon = getFileIcon();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-gray-300">File</Label>
            <div 
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${file 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 hover:border-purple-500 bg-slate-800/50'
                }
              `}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept="audio/*,video/*,image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              
              <FileIcon className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-green-400' : 'text-gray-400'}`} />
              
              {file ? (
                <div className="space-y-1">
                  <p className="text-green-400 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {getFileTypeLabel()} • {formatFileSize(file.size)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 mb-1">Click to select</p>
                  <p className="text-sm text-gray-500">Audio, video or image (max 50MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              className="bg-slate-800 border-gray-600 text-white"
              disabled={isUploading}
            />
          </div>

          {/* Genre Select */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-gray-300">Genre</Label>
            <Select value={genre} onValueChange={setGenre} disabled={isUploading}>
              <SelectTrigger className="bg-slate-800 border-gray-600 text-white">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-gray-600">
                {musicGenres.map((genreOption) => (
                  <SelectItem key={genreOption} value={genreOption.toLowerCase()} className="text-white hover:bg-slate-700">
                    {genreOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="bg-slate-800 border-gray-600 text-white resize-none"
              rows={3}
              disabled={isUploading}
            />
          </div>



          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !file || !title.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}