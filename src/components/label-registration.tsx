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
  User,
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.labelName.trim()) {
      newErrors.labelName = "Label name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.companyType) {
      newErrors.companyType = "Company type is required";
    }

    if (!formData.genreFocus) {
      newErrors.genreFocus = "Genre focus is required";
    }

    if (!formData.teamSize) {
      newErrors.teamSize = "Team size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
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
      // window.location.href = result.checkoutUrl;
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
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Join SPARK as a Label
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Discover and sign the next generation of artists
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="labelName"
                className="text-white text-sm font-medium flex items-center"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Label Name *
              </Label>
              <Input
                id="labelName"
                value={formData.labelName}
                onChange={(e) => handleInputChange("labelName", e.target.value)}
                placeholder="Your record label name"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
              {errors.labelName && (
                <p className="text-red-400 text-xs mt-1">{errors.labelName}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-white text-sm font-medium flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-white text-sm font-medium flex items-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Minimum 6 characters"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-white text-sm font-medium flex items-center"
              >
                <Lock className="w-4 h-4 mr-2" />
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
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <Label
                htmlFor="country"
                className="text-white text-sm font-medium flex items-center"
              >
                <Globe className="w-4 h-4 mr-2" />
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
                className="text-white text-sm font-medium flex items-center"
              >
                <Briefcase className="w-4 h-4 mr-2" />
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
              {errors.companyType && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.companyType}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="genreFocus"
                className="text-white text-sm font-medium flex items-center"
              >
                <Target className="w-4 h-4 mr-2" />
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
              {errors.genreFocus && (
                <p className="text-red-400 text-xs mt-1">{errors.genreFocus}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="teamSize"
                className="text-white text-sm font-medium flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
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
              {errors.teamSize && (
                <p className="text-red-400 text-xs mt-1">{errors.teamSize}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="website"
                className="text-white text-sm font-medium flex items-center"
              >
                <Globe className="w-4 h-4 mr-2" />
                Website (Optional)
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-white text-sm font-medium flex items-center"
              >
                <Target className="w-4 h-4 mr-2" />
                Company Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of your label and mission..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400"
                rows={3}
              />
            </div>

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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
