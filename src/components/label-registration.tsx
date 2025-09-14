import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Lock,
  Target,
  Users,
  Globe,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegisterMutation } from "@/store/features/api/authApi";

interface LabelRegistrationProps {
  onClose?: () => void;
}

export default function LabelRegistration({ onClose }: LabelRegistrationProps) {
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
    labelName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyType: "",
    foundedYear: "",
    genreFocus: "",
    teamSize: "",
    country: "",
    website: "",
    description: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.labelName || !formData.email || !formData.password) {
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

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (!formData.companyType) {
      toast({
        title: "Missing Information",
        description: "Please select a company type",
        variant: "destructive",
      });
      return;
    }

    if (!formData.genreFocus) {
      toast({
        title: "Missing Information",
        description: "Please select a genre focus",
        variant: "destructive",
      });
      return;
    }

    if (!formData.teamSize) {
      toast({
        title: "Missing Information",
        description: "Please select a team size",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        username: formData.labelName,
        email: formData.email,
        password: formData.password,
        role: "label",
        country: formData.country,
        favoriteGenre: formData.genreFocus,
        companyType: formData.companyType,
        teamSize: formData.teamSize,
        website: formData.website,
        companyDescription: formData.description,
      }).unwrap();
      toast({
        title: "Registration Successful!",
        description: "Welcome to SPARK! Your label account has been created.",
      });

      // Close the popup and redirect
      if (onClose) {
        onClose();
      }
      window.location.href = "/";
    } catch (error: any) {
      console.error("Label registration error:", error);
      
      let errorMessage = "Failed to create label account";
      if (error?.data?.message?.includes("username is already taken")) {
        errorMessage =
          "This label name is already taken. Please choose a different one.";
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Join SPARK as a Label
          </CardTitle>
          <p className="text-muted-foreground">
            Discover and sign the next generation of artists
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="labelName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Label Name *
              </Label>
              <Input
                id="labelName"
                value={formData.labelName}
                onChange={(e) => handleInputChange("labelName", e.target.value)}
                placeholder="Your record label name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
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
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm your password"
              />
            </div>

            {/* Country */}
            <div>
              <Label
                htmlFor="country"
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Country
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  handleInputChange("country", value)
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
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

            <div>
              <Label
                htmlFor="companyType"
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Company Type *
              </Label>
              <Select
                value={formData.companyType}
                onValueChange={(value) =>
                  handleInputChange("companyType", value)
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent_label">Independent Label</SelectItem>
                  <SelectItem value="major_label">Major Label</SelectItem>
                  <SelectItem value="music_distributor">Music Distributor</SelectItem>
                  <SelectItem value="music_publisher">Music Publisher</SelectItem>
                  <SelectItem value="artist_management">Artist Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="genreFocus"
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Primary Genre Focus *
              </Label>
              <Select
                value={formData.genreFocus}
                onValueChange={(value) =>
                  handleInputChange("genreFocus", value)
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select primary genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop Music</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop/Rap</SelectItem>
                  <SelectItem value="electronic">Electronic/EDM</SelectItem>
                  <SelectItem value="rock">Rock/Alternative</SelectItem>
                  <SelectItem value="r&b">R&B/Soul</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="indie">Indie/Alternative</SelectItem>
                  <SelectItem value="jazz">Jazz/Blues</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="world">World Music</SelectItem>
                  <SelectItem value="all">All Genres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="teamSize"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Team Size *
              </Label>
              <Select
                value={formData.teamSize}
                onValueChange={(value) => handleInputChange("teamSize", value)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo_1">Solo (1 person)</SelectItem>
                  <SelectItem value="small_2_5">Small (2-5 people)</SelectItem>
                  <SelectItem value="medium_6_20">Medium (6-20 people)</SelectItem>
                  <SelectItem value="large_21_50">Large (21-50 people)</SelectItem>
                  <SelectItem value="enterprise_50_plus">
                    Enterprise (50+ people)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="website"
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Website (Optional)
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Company Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of your label and mission..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
              >
                {isRegisterLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 mr-2" />
                    Create Label Account
                  </>
                )}
              </Button>

              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isRegisterLoading}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
    </Card>
  );
}
