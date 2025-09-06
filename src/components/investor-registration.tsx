import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, User, Mail, Lock, Target, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegisterMutation } from "@/store/features/api/authApi";

interface InvestorRegistrationProps {
  onClose?: () => void;
}

export default function InvestorRegistration({ onClose }: InvestorRegistrationProps) {
  const { t } = useTranslation();
  // RTK Query mutation hook
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    investorName: "",
    email: "",
    password: "",
    confirmPassword: "",
    investmentFocus: "",
    investmentRange: "",
    experience: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.investorName.trim()) newErrors.investorName = t("form.errors.investorName");
    if (!formData.email.trim()) newErrors.email = t("form.errors.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("form.errors.emailInvalid");
    if (!formData.password) newErrors.password = t("form.errors.passwordRequired");
    else if (formData.password.length < 6) newErrors.password = t("form.errors.passwordLength");
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("form.errors.passwordMismatch");
    if (!formData.investmentFocus) newErrors.investmentFocus = t("form.errors.investmentFocus");
    if (!formData.investmentRange) newErrors.investmentRange = t("form.errors.investmentRange");
    if (!formData.experience) newErrors.experience = t("form.errors.experience");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await register({
        username: formData.investorName,
        email: formData.email,
        password: formData.password,
        role: "fan", // Use fan role since investor is not in the backend enum
        favoriteGenre: formData.investmentFocus,
        aboutTxt: `Investment Focus: ${formData.investmentFocus}, Investment Range: ${formData.investmentRange}, Experience: ${formData.experience}`,
      }).unwrap();

      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDescription"),
      });

      onClose?.();
    } catch (error: any) {
      console.error("Investor registration error:", error);
      
      let errorMessage = "Failed to create investor account";
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
        title: t("toast.errorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border-cyan-500/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            {t("title")}
          </CardTitle>
          <p className="text-gray-300 text-sm">{t("subtitle")}</p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="investorName" className="text-white text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                {t("form.investorName")} *
              </Label>
              <Input
                id="investorName"
                value={formData.investorName}
                onChange={(e) => handleInputChange("investorName", e.target.value)}
                placeholder={t("placeholders.name")}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
              />
              {errors.investorName && <p className="text-red-400 text-xs mt-1">{errors.investorName}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {t("form.email")} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("placeholders.email")}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                {t("form.password")} *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t("placeholders.password")}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                {t("form.confirmPassword")} *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder={t("placeholders.confirmPassword")}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Label className="text-white text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-2" />
                {t("form.investmentFocus")}
              </Label>
              <Select value={formData.investmentFocus} onValueChange={(value) => handleInputChange("investmentFocus", value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder={t("placeholders.investmentFocus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">{t("genres.pop")}</SelectItem>
                  <SelectItem value="hip-hop">{t("genres.hiphop")}</SelectItem>
                  <SelectItem value="electronic">{t("genres.electronic")}</SelectItem>
                  <SelectItem value="rock">{t("genres.rock")}</SelectItem>
                  <SelectItem value="r&b">{t("genres.rnb")}</SelectItem>
                  <SelectItem value="country">{t("genres.country")}</SelectItem>
                  <SelectItem value="indie">{t("genres.indie")}</SelectItem>
                  <SelectItem value="jazz">{t("genres.jazz")}</SelectItem>
                  <SelectItem value="classical">{t("genres.classical")}</SelectItem>
                  <SelectItem value="world">{t("genres.world")}</SelectItem>
                  <SelectItem value="all">{t("genres.all")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.investmentFocus && <p className="text-red-400 text-xs mt-1">{errors.investmentFocus}</p>}
            </div>

            <div>
              <Label className="text-white text-sm font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("form.investmentRange")}
              </Label>
              <Select value={formData.investmentRange} onValueChange={(value) => handleInputChange("investmentRange", value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder={t("placeholders.investmentRange")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">{t("ranges.starter")}</SelectItem>
                  <SelectItem value="growth">{t("ranges.growth")}</SelectItem>
                  <SelectItem value="serious">{t("ranges.serious")}</SelectItem>
                  <SelectItem value="premium">{t("ranges.premium")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.investmentRange && <p className="text-red-400 text-xs mt-1">{errors.investmentRange}</p>}
            </div>

            <div>
              <Label className="text-white text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t("form.experience")}
              </Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder={t("placeholders.experience")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t("experience.beginner")}</SelectItem>
                  <SelectItem value="intermediate">{t("experience.intermediate")}</SelectItem>
                  <SelectItem value="advanced">{t("experience.advanced")}</SelectItem>
                  <SelectItem value="expert">{t("experience.expert")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
            </div>

            <Button type="submit" disabled={isRegisterLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg">
              {isRegisterLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t("loading")}
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {t("submit")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}