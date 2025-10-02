import { useState } from "react";
import { useAuth } from "@/hooks/useAuthRTK";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Palette,
  Instagram,
  Youtube,
  Upload,
  Globe,
} from "lucide-react";
import SLogo from "@/components/s-logo";
import { useRegisterMutation } from "@/store/features/api/authApi";
import VerifyEmail from "./verify-email";

interface ArtistRegistrationProps {
  onClose?: () => void;
}

export default function ArtistRegistration({
  onClose,
}: ArtistRegistrationProps) {
  // RTK Query mutation hook
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { toast } = useToast();

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

  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    password: "",
    confirmPassword: "",
    genre: "",
    country: "",
    bio: "",
    instagram: "",
    youtube: "",
    spotify: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptArtistContract, setAcceptArtistContract] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    email: string;
    userId: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Artist registration attempt:", formData);

    // Validation
    if (!formData.artistName || !formData.email || !formData.password) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Registration Failed",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use RTK Query mutation for artist registration
      const result = await register({
        username: formData.artistName,
        email: formData.email,
        password: formData.password,
        role: "artist",
        country: formData.country,
        favoriteGenre: formData.genre,
        artistBio: formData.bio,
        instagram: formData.instagram,
        youtube: formData.youtube,
        spotify: formData.spotify,
      }).unwrap();

      console.log("Artist registration successful:", result);

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
      console.error("Artist registration error:", error);
      
      let errorMessage = "Failed to create artist account";
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
            description: "Your artist account is now verified and ready to use!",
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <SLogo className="text-white" size={32} />
        </div>
        <CardTitle className="text-2xl font-bold">
          Join SPARK as an Artist
        </CardTitle>
        <p className="text-muted-foreground">
          Build your career and connect with fans worldwide
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artistName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Artist Name *
              </Label>
              <Input
                id="artistName"
                placeholder="Your stage name"
                value={formData.artistName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    artistName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Confirm Password *
              </Label>
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

          <div className="space-y-2">
            <Label htmlFor="genre" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Primary Genre
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, genre: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your music genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rap">Rap/Hip-Hop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="electronic">Electronic/EDM</SelectItem>
                <SelectItem value="rnb">R&B</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="indie">Indie</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="reggae">Reggae</SelectItem>
                <SelectItem value="afrobeats">Afrobeats</SelectItem>
                <SelectItem value="kpop">K-Pop</SelectItem>
                <SelectItem value="jpop">J-Pop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Artist Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell fans about your music and journey..."
              className="min-h-[100px]"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">
              Social Media Links (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  placeholder="Channel URL"
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      youtube: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spotify" className="flex items-center gap-2">
                  <SLogo size={16} />
                  Spotify
                </Label>
                <Input
                  id="spotify"
                  placeholder="Artist URL"
                  value={formData.spotify}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      spotify: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-800 underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-800 underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
                . By creating an artist account, I understand that SPARK will use my information to provide music investment services, showcase my work, and I may receive promotional communications.
              </label>
            </div>
          </div>

          {/* Artist Contract Acceptance */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptArtistContract"
                checked={acceptArtistContract}
                onChange={(e) => setAcceptArtistContract(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptArtistContract" className="text-sm text-gray-700">
                I accept the{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-800 underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Artist Contract
                </a>
                . I understand that by accepting this contract, I agree to the terms of collaboration with SPARK, including revenue sharing, intellectual property rights, and performance obligations as outlined in the artist agreement.
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRegisterLoading || !acceptTerms || !acceptArtistContract}
            >
              {isRegisterLoading
                ? "Creating Account..."
                : "Create Artist Account"}
            </Button>

            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
