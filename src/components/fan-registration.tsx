import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User, Globe, Heart } from "lucide-react";
import SLogo from "@/components/s-logo";
import { useRegisterMutation } from "@/store/features/api/authApi";
import VerifyEmail from "./verify-email";

interface FanRegistrationProps {
  onClose?: () => void;
}

export default function FanRegistration({ onClose }: FanRegistrationProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    favoriteGenres: [] as string[],
    country: "",
    musicPlatforms: [] as string[],
    bio: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    email: string;
    userId: string;
  } | null>(null);

  // RTK Query mutation hook
  const [register, { isLoading: isSubmitting }] = useRegisterMutation();

  const genres = [
    "rap",
    "pop",
    "afrobeats",
    "k-pop",
    "j-pop",
    "indie",
    "rock",
    "electronic",
    "r&b",
    "jazz",
    "classical",
    "country",
    "reggae",
  ];

  // Array with both label (for UI) and value (for backend)
  const platforms = [
    { label: "Spotify", value: "spotify" },
    { label: "Apple Music", value: "apple_music" },
    { label: "YouTube Music", value: "youtube_music" },
    { label: "SoundCloud", value: "soundcloud" },
    { label: "Deezer", value: "deezer" },
    { label: "Tidal", value: "tidal" },
    { label: "Bandcamp", value: "bandcamp" },
    { label: "Amazon Music", value: "amazon_music" },
  ];


  const countries = [
    "France",
    "United States",
    "United Kingdom",
    "Germany",
    "Spain",
    "Italy",
    "Canada",
    "Australia",
    "Japan",
    "South Korea",
    "Brazil",
    "Mexico",
    "Nigeria",
    "Ghana",
    "South Africa",
    "India",
    "Other",
  ];

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Fan registration attempt:", formData);

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.favoriteGenres.length === 0) {
      toast({
        title: "Select Genres",
        description: "Please select at least one favorite genre",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use RTK Query mutation for fan registration
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "fan",
        country: formData.country,
        favoriteGenre: formData.favoriteGenres[0] || "normal",
        musicPlatforms: formData.musicPlatforms,
        aboutTxt: formData.bio,
      }).unwrap();

      console.log("Fan registration successful:", result);

      toast({
        title: "Account Created!",
        description: "Please verify your email to complete registration.",
      });

      // Show verification screen
      setVerificationData({
        email: formData.email,
        userId: result.data._id,
      });
      setShowVerification(true);
    } catch (error: any) {
      console.error("Fan registration error:", error);

      let errorMessage = "Failed to create fan account";
      if (error?.data?.message?.includes("username is already taken")) {
        errorMessage =
          "This username is already taken. Please choose a different one.";
      } else if (error?.data?.message?.includes("email already exists")) {
        errorMessage = "An account with this email already exists.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Show verification screen if needed
  if (showVerification && verificationData) {
    return (
      <VerifyEmail
        email={verificationData.email}
        userId={verificationData.userId}
        onVerificationSuccess={() => {
          toast({
            title: "Welcome to SPARK!",
            description: "Your fan account is now verified and ready to use!",
          });
          if (onClose) {
            onClose();
          }
          window.location.href = "/";
        }}
        onBack={() => setShowVerification(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto z-50">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Join SPARK as a Fan
        </CardTitle>
        <p className="text-muted-foreground">
          Discover amazing artists and join the community - 100% FREE!
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username *
              </Label>
              <Input
                id="username"
                placeholder="Your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, country: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Favorite Genres */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <SLogo size={16} />
              Favorite Genres *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  type="button"
                  variant={
                    formData.favoriteGenres.includes(genre)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleGenreToggle(genre)}
                  className={`text-sm ${formData.favoriteGenres.includes(genre)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50"
                    }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Music Platforms */}
          <div className="space-y-3">
            <Label>Music Platforms You Use</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.value}
                  type="button"
                  variant={
                    formData.musicPlatforms.includes(platform.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      musicPlatforms: prev.musicPlatforms.includes(platform.value)
                        ? prev.musicPlatforms.filter((p) => p !== platform.value)
                        : [...prev.musicPlatforms, platform.value],
                    }))
                  }
                  className={`text-sm ${formData.musicPlatforms.includes(platform.value)
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-cyan-50"
                    }`}
                >
                  {platform.label}
                </Button>
              ))}
            </div>

          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your music taste..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
                . By creating an account, I understand that SPARK will use my information to provide music investment services and I may receive promotional communications.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !acceptTerms}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Join SPARK for FREE"
              )}
            </Button>

            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancle
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
