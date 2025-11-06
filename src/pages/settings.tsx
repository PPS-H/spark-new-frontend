import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuthRTK";
import { useI18n } from "@/hooks/useI18n";
import { i18n } from "@/lib/i18n";
import { useUpdateUserMutation, useChangePasswordMutation } from "@/store/features/api/authApi";
import { useConnectSpotifyMutation } from "@/store/features/api/socialMediaApi";
import { useConnectStripeMutation } from "@/store/features/api/labelApi";
import { useGetStripeProductsQuery, useCreateSubscriptionCheckoutMutation, useGetUserSubscriptionQuery } from "@/store/features/api/stripeApi";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  Volume2,
  Mail,
  Smartphone,
  Eye,
  LogOut,
  Crown,
  Zap,
  Lock,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, changeLanguage, language } = useI18n();
  const { toast } = useToast();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [connectSpotify, { isLoading: isConnectingSpotify }] = useConnectSpotifyMutation();
  const [connectStripe, { isLoading: isConnectingStripe }] = useConnectStripeMutation();
  
  // Subscription-related API calls
  const { data: stripeProducts, isLoading: isLoadingProducts } = useGetStripeProductsQuery({ 
    type: user?.role === 'artist' ? 'artist' : user?.role === 'label' ? 'label' : undefined 
  });
  const [createSubscriptionCheckout, { isLoading: isCreatingCheckout }] = useCreateSubscriptionCheckoutMutation();
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetUserSubscriptionQuery(user?._id || '');
  
  // Local state for form fields
  const [displayName, setDisplayName] = useState(user?.username || "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  
  // Change password modal state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Settings state - initialize with user data or defaults
  const [settings, setSettings] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    pushNotifications: user?.pushNotifications ?? true,
    fundingAlerts: user?.fundingAlerts ?? true,
    publicProfile: user?.publicProfile ?? true,
    investmentActivity: user?.investmentActivity ?? false,
    directMessages: user?.directMessages ?? true,
    autoPreview: user?.autoPreview ?? true,
    darkMode: user?.darkMode ?? true,
  });

  // Update local settings when user data changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.username || "");
      setSettings({
        emailNotifications: user.emailNotifications ?? true,
        pushNotifications: user.pushNotifications ?? true,
        fundingAlerts: user.fundingAlerts ?? true,
        publicProfile: user.publicProfile ?? true,
        investmentActivity: user.investmentActivity ?? false,
        directMessages: user.directMessages ?? true,
        autoPreview: user.autoPreview ?? true,
        darkMode: user.darkMode ?? true,
      });
      
      // Initialize language from user data
      if (user.language && typeof user.language === 'string') {
        i18n.initializeFromUser(user.language);
      }
    }
  }, [user]);

  // Cleanup profile picture preview on unmount
  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  // Clear profile picture when editing is cancelled
  useEffect(() => {
    if (!isEditingProfile) {
      clearProfilePicture();
    }
  }, [isEditingProfile]);

  // Handle profile picture file selection
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: t("invalidFileType"),
          description: t("pleaseSelectImageFile"),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("fileTooLarge"),
          description: t("pleaseSelectImageSmallerThan5MB"),
          variant: "destructive",
        });
        return;
      }

      setProfilePicture(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    }
  };

  // Clear profile picture selection
  const clearProfilePicture = () => {
    setProfilePicture(null);
    if (profilePicturePreview) {
      URL.revokeObjectURL(profilePicturePreview);
    }
    setProfilePicturePreview(null);
  };

  // Handle profile name update
  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: t("invalidName"),
        description: t("pleaseEnterValidDisplayName"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('username', displayName.trim());
      
      // Add file if selected
      if (profilePicture) {
        formData.append('file', profilePicture);
      }

      await updateUser(formData).unwrap();
      
      // Clear profile picture state after successful update
      clearProfilePicture();
      setIsEditingProfile(false);
      
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedSuccessfully"),
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: t("updateFailed"),
        description: error?.data?.message || t("failedToUpdateProfile"),
        variant: "destructive",
      });
    }
  };

  // Handle setting toggle
  const handleSettingChange = async (setting: keyof typeof settings, value: boolean) => {
    try {
      await updateUser({ [setting]: value }).unwrap();
      setSettings(prev => ({ ...prev, [setting]: value }));
      toast({
        title: t("settingUpdated"),
        description: t("preferenceUpdatedSuccessfully"),
      });
    } catch (error: any) {
      console.error("Setting update error:", error);
      toast({
        title: t("updateFailed"),
        description: error?.data?.message || t("failedToUpdateSetting"),
        variant: "destructive",
      });
    }
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await updateUser({ language: newLanguage as any }).unwrap();
      changeLanguage(newLanguage as any);
      toast({
        title: t("languageUpdated"),
        description: t("languagePreferenceUpdatedSuccessfully"),
      });
    } catch (error: any) {
      console.error("Language update error:", error);
      toast({
        title: t("updateFailed"),
        description: error?.data?.message || t("failedToUpdateLanguage"),
        variant: "destructive",
      });
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      toast({
        title: t("missingCurrentPassword"),
        description: t("pleaseEnterCurrentPassword"),
        variant: "destructive",
      });
      return;
    }

    if (!newPassword.trim()) {
      toast({
        title: t("missingNewPassword"),
        description: t("pleaseEnterNewPassword"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t("passwordMismatch"),
        description: t("newPasswordAndConfirmPasswordDoNotMatch"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t("weakPassword"),
        description: t("passwordMustBeAtLeast6Characters"),
        variant: "destructive",
      });
      return;
    }

    try {
      await changePassword({
        oldPassword: currentPassword.trim(),
        password: newPassword.trim()
      }).unwrap();
      
      toast({
        title: t("passwordChanged"),
        description: t("passwordUpdatedSuccessfully"),
      });
      
      // Reset form and close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(false);
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: t("passwordChangeFailed"),
        description: error?.data?.message || t("failedToChangePassword"),
        variant: "destructive",
      });
    }
  };

  // Handle Spotify connection
  const handleConnectSpotify = async () => {
    try {
      const result = await connectSpotify().unwrap();
      
      if (result.success && result.data?.authUrl) {
        // Open Spotify authorization URL in a new tab
        window.open(result.data.authUrl, '_blank');
        
        toast({
          title: "Spotify Connection",
          description: "Opening Spotify authorization page in a new tab.",
        });
      }
    } catch (error: any) {
      console.error("Spotify connection error:", error);
      toast({
        title: "Connection Failed",
        description: error?.data?.message || "Failed to connect Spotify. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle Stripe Connect
  const handleConnectStripe = async () => {
    try {
      const result = await connectStripe().unwrap();
      
      if (result.success && result.accountLink?.url) {
        // Redirect to Stripe Connect page
        window.location.href = result.accountLink.url;
      }
    } catch (error: any) {
      console.error("Stripe connection error:", error);
      toast({
        title: "Connection Failed",
        description: error?.data?.message || "Failed to connect to Stripe. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle subscription upgrade
  const handleUpgradeToPro = async (priceId: string) => {
    if (!user?._id) {
      toast({
        title: "Error",
        description: "User ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createSubscriptionCheckout({
        priceId,
        userId: user._id
      }).unwrap();

      if (result.success && result.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.url;
      }
    } catch (error: any) {
      console.error("Subscription checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: error?.data?.message || "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get role-specific display information
  const getRoleInfo = () => {
    if (!user) return { name: "Free User", color: "gray", icon: User };

    const roleData = {
      fan: { name: "Free User", color: "gray", icon: User },
      user: { name: "Free User", color: "gray", icon: User },
      artist: { name: "Artist Pro", color: "purple", icon: Crown },
      investor: { name: "Investor Pro", color: "blue", icon: Crown },
      label: { name: "Label Pro", color: "green", icon: Crown },
      admin: { name: "Admin", color: "red", icon: Shield },
    };

    return roleData[user.role as keyof typeof roleData] || roleData.fan;
  };

  const roleInfo = getRoleInfo();

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-white">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">
              Please log in to access settings
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Solid base layer to avoid white flash on initial paint/scroll */}
      <div className="fixed inset-0 bg-[#0B0B15] z-0" />
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(122,90,248,0.1)_0%,transparent_50%)] pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transform-gpu [will-change:transform]" />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 relative z-10">
        {/* Premium Header */}
        <div 
          className="text-center space-y-6 pt-6 sm:pt-10 rounded-3xl mx-4 sm:mx-0 p-8 sm:p-12 relative overflow-hidden md:backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #0B0B15 0%, #141428 70%, rgba(122,90,248,0.08) 100%)',
            border: '1px solid rgba(122, 90, 248, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse transform-gpu [will-change:transform,opacity]" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#7A5AF8] rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#FFD580] rounded-full animate-pulse" />
          
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <Settings className="text-purple-400 text-2xl sm:text-3xl animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white px-4 mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            {t("settings")}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 px-4 font-medium">
            {t("manageAccountPreferences")}
          </p>
        </div>

        {/* Account Info */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50 z-0" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              {t("accountInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${
                      roleInfo.color === "purple"
                        ? "from-purple-500 to-pink-500"
                        : roleInfo.color === "blue"
                        ? "from-blue-500 to-cyan-500"
                        : roleInfo.color === "green"
                        ? "from-green-500 to-emerald-500"
                        : roleInfo.color === "red"
                        ? "from-red-500 to-orange-500"
                        : "from-gray-500 to-gray-600"
                    } rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    style={{
                      boxShadow: roleInfo.color === "purple"
                        ? '0 8px 32px rgba(147, 51, 234, 0.3)'
                        : roleInfo.color === "blue"
                        ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                        : roleInfo.color === "green"
                        ? '0 8px 32px rgba(34, 197, 94, 0.3)'
                        : roleInfo.color === "red"
                        ? '0 8px 32px rgba(239, 68, 68, 0.3)'
                        : '0 8px 32px rgba(107, 114, 128, 0.3)'
                    }}
                  >
                    <roleInfo.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg sm:text-xl truncate bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {user?.username || "User"}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base truncate font-medium">
                    {user?.email || "email@example.com"}
                  </p>
                  <Badge
                    className={`${
                      roleInfo.color === "purple"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : roleInfo.color === "blue"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : roleInfo.color === "green"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : roleInfo.color === "red"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                    } mt-2 text-sm px-3 py-1 rounded-full font-semibold shadow-lg`}
                    style={{
                      boxShadow: roleInfo.color === "purple"
                        ? '0 4px 16px rgba(147, 51, 234, 0.2)'
                        : roleInfo.color === "blue"
                        ? '0 4px 16px rgba(59, 130, 246, 0.2)'
                        : roleInfo.color === "green"
                        ? '0 4px 16px rgba(34, 197, 94, 0.2)'
                        : roleInfo.color === "red"
                        ? '0 4px 16px rgba(239, 68, 68, 0.2)'
                        : '0 4px 16px rgba(107, 114, 128, 0.2)'
                    }}
                  >
                    <roleInfo.icon className="w-4 h-4 mr-2" />
                    {roleInfo.name}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 text-sm px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto flex-shrink-0"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? t("cancel") : t("editProfile")}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("displayName")}
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-800/40 border-slate-600/30 text-white rounded-xl px-4 py-3 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  disabled={!isEditingProfile}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("email")}
                </label>
                <Input
                  value={user?.email || ""}
                  className="bg-slate-800/40 border-slate-600/30 text-gray-400 rounded-xl px-4 py-3 cursor-not-allowed"
                  disabled={true}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.3) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  {t("emailCannotBeChanged")}
                </p>
              </div>
            </div>

            {/* Profile Picture Field - Only show when editing */}
            {isEditingProfile && (
              <div className="mt-6">
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("profilePicture")}
                </label>
                <div className="flex items-center space-x-6">
                  {/* Current/Preview Image */}
                  <div className="relative">
                      <img
                        src={
                          profilePicturePreview || 
                          (user?.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}/${user.profilePicture}` : "https://cdn-icons-png.flaticon.com/512/0/93.png")
                        }
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30 shadow-lg"
                        style={{
                          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)'
                        }}
                      />
                    {profilePicturePreview && (
                      <button
                        onClick={clearProfilePicture}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  {/* File Input */}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:cursor-pointer cursor-pointer rounded-xl p-3 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {t("selectImageFile")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Update Button - Only show when editing */}
            {isEditingProfile && (
              <div className="mt-6">
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  size="sm"
                >
                  {isUpdating ? t("updating") : t("updateProfile")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50 z-0" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              {t("notifications")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-20">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/20 border border-slate-600/20 hover:border-purple-500/30 transition-all duration-300 relative z-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">
                    {t("emailNotifications")}
                  </h4>
                  <p className="text-gray-300 text-sm font-medium">
                    {t("investmentUpdatesAndNews")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('emailNotifications', checked)
                }
                disabled={isUpdating}
                className="data-[state=checked]:bg-purple-500 relative z-30"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/20 border border-slate-600/20 hover:border-cyan-500/30 transition-all duration-300 relative z-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{t("pushNotifications")}</h4>
                  <p className="text-gray-300 text-sm font-medium">
                    {t("realTimeAlertsOnDevice")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('pushNotifications', checked)
                }
                disabled={isUpdating}
                className="data-[state=checked]:bg-cyan-500 relative z-30"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/20 border border-slate-600/20 hover:border-green-500/30 transition-all duration-300 relative z-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{t("fundingAlerts")}</h4>
                  <p className="text-gray-300 text-sm font-medium">
                    {t("whenCampaignsReachMilestones")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.fundingAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange('fundingAlerts', checked)
                }
                disabled={isUpdating}
                className="data-[state=checked]:bg-green-500 relative z-30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50 z-0" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              {t("privacy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-20">
            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">{t("publicProfile")}</h4>
                  <p className="text-gray-400 text-sm">
                    {t("allowOthersToDiscoverProfile")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.publicProfile}
                onCheckedChange={(checked) =>
                  handleSettingChange('publicProfile', checked)
                }
                disabled={isUpdating}
                className="relative z-30"
              />
            </div>

            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("investmentActivity")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("showInvestmentsPublicly")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.investmentActivity}
                onCheckedChange={(checked) =>
                  handleSettingChange('investmentActivity', checked)
                }
                disabled={isUpdating}
                className="relative z-30"
              />
            </div>

            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">{t("directMessages")}</h4>
                  <p className="text-gray-400 text-sm">
                    {t("allowArtistsAndLabelsToContact")}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.directMessages}
                onCheckedChange={(checked) =>
                  handleSettingChange('directMessages', checked)
                }
                disabled={isUpdating}
                className="relative z-30"
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50 z-0" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                <Settings className="w-6 h-6 text-cyan-400" />
              </div>
              {t("appPreferences")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-20">
            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("darkMode")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("darkModeDescription")}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleSettingChange('darkMode', checked)
                }
                disabled={isUpdating}
                className="relative z-30"
              />
            </div>

            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("audioPreview")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("audioPreviewDescription")}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.autoPreview}
                onCheckedChange={(checked) =>
                  handleSettingChange('autoPreview', checked)
                }
                disabled={isUpdating}
                className="relative z-30"
              />
            </div>

            <div className="flex items-center justify-between relative z-20">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("language")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("languageDescription")}
                  </p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-800/40 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 relative z-30"
                disabled={isUpdating}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Connect Your Accounts - Artist Only (Music Platforms + Stripe) */}
        {user?.role === "artist" && (
          <Card className="artist-metric-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                {t("connectYourAccounts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8 py-6">
                {/* Spotify Icon */}
                <div 
                  className="flex flex-col items-center space-y-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={handleConnectSpotify}
                >
                  <div className={`w-16 h-16 bg-green-500 rounded-full flex items-center justify-center ${isConnectingSpotify ? 'opacity-75' : ''}`}>
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">
                    {isConnectingSpotify ? t("connecting") : t("spotify")}
                  </span>
                </div>

                {/* YouTube Icon */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">{t("youtube")}</span>
                </div>

                {/* Deezer Icon */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.68 5.47H22V8h-4.32V5.47zM15.15 8H19.5v2.53h-4.35V8zM12.6 10.53H17v2.53h-4.4v-2.53zM10.05 13.07h4.47v2.53h-4.47v-2.53zM7.5 15.6h4.47v2.53H7.5V15.6zM4.95 18.13h4.47V20.7H4.95v-2.57zM2.4 20.7h4.47v2.53H2.4V20.7zM17.68 8H22v2.53h-4.32V8zM15.15 10.53H19.5V13h-4.35v-2.47zM12.6 13H17v2.53h-4.4V13zM10.05 15.53h4.47v2.53h-4.47v-2.53zM7.5 18.07h4.47v2.53H7.5v-2.53zM4.95 20.6h4.47v2.53H4.95V20.6zM2.4 23.13h4.47v2.53H2.4v-2.53z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">{t("deezer")}</span>
                </div>

                {/* Stripe Connect Icon - Only show for Pro users */}
                {user?.isProMember ? (
                  <div 
                    className="flex flex-col items-center space-y-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={handleConnectStripe}
                  >
                    <div className={`w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center ${isConnectingStripe ? 'opacity-75' : ''}`}>
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {isConnectingStripe ? t("connecting") : user?.isStripeAccountConnected ? t("stripeConnected") : t("connectStripe")}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center opacity-50">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      {t("proRequired")}
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      {t("upgradeToProToConnectStripe")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connect Stripe Account - Label Only */}
        {user?.role === "label" && (
          <Card className="artist-metric-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                {t("connectStripeAccount")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                {/* Stripe Connect Icon - Only show for Pro users */}
                {user?.isProMember ? (
                  <div 
                    className="flex flex-col items-center space-y-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={handleConnectStripe}
                  >
                    <div className={`w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center ${isConnectingStripe ? 'opacity-75' : ''}`}>
                      <CreditCard className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-white text-lg font-medium">
                      {isConnectingStripe ? t("connecting") : user?.isStripeAccountConnected ? t("stripeConnected") : t("connectStripe")}
                    </span>
                    <span className="text-gray-400 text-sm text-center max-w-xs">
                      {t("connectStripeAccountToReceivePayments")}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center opacity-50">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-gray-400 text-lg font-medium">
                      {t("proRequired")}
                    </span>
                    <span className="text-xs text-gray-500 text-center max-w-xs">
                      {t("upgradeToProToReceivePayments")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Section - Only show for artists and labels */}
        {(user?.role === 'artist' || user?.role === 'label') && (
          <Card className="artist-metric-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2 text-cyan-400" />
                {t("subscriptionAndProFeatures")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Subscription Status */}
              {subscriptionData?.data ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="text-white font-medium">{t("proMember")}</h4>
                        <p className="text-green-400 text-sm">
                          {subscriptionData.data.planType === 'artist' ? t("artistPro") : t("labelPro")} - ${(subscriptionData.data.amount / 100).toFixed(0)}/{subscriptionData.data.interval}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {t("nextBilling")}: {new Date(subscriptionData.data.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">
                      {subscriptionData.data.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="text-white font-medium">{t("freePlan")}</h4>
                        <p className="text-yellow-400 text-sm">
                          {t("upgradeToProForPremiumFeatures")}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      {t("free")}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Available Plans */}
              {!subscriptionData?.data && stripeProducts?.data && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">{t("availablePlans")}</h4>
                  {stripeProducts.data.map((product) => (
                    <div key={product.id} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-white font-medium">{product.name}</h5>
                          <p className="text-gray-400 text-sm">{product.description}</p>
                          {product.price && (
                            <p className="text-cyan-400 font-semibold">
                              ${(product.price.amount / 100).toFixed(0)}/{product.price.interval}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => product.price && handleUpgradeToPro(product.price.id)}
                          disabled={!product.price || isCreatingCheckout}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          {isCreatingCheckout ? t("processing") : t("upgradeToPro")}
                        </Button>
                      </div>
                      {product.features.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-white text-sm font-medium mb-2">{t("features")}:</h6>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {(isLoadingProducts || isLoadingSubscription) && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  <span className="ml-3 text-gray-400">{t("loadingSubscriptionDetails")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50 z-0" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center text-xl sm:text-2xl font-bold">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mr-3">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              {t("accountActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <Button
              variant="outline"
              className="w-full border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400/50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              {t("changePassword")}
            </Button>

            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("signOut")}
            </Button>

            <div className="pt-6 border-t border-slate-600/20">
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400/60 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                {t("deleteAccount")}
              </Button>
              <p className="text-xs text-gray-400 mt-3 text-center font-medium">
                {t("deleteAccountWarning")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="relative overflow-hidden border border-slate-600/30 rounded-3xl p-8 w-full max-w-md mx-4"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-50" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {t("changePassword")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-full p-2 transition-all duration-200"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("currentPassword")}
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("enterCurrentPassword")}
                  className="bg-slate-800/40 border-slate-600/30 text-white rounded-xl px-4 py-3 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("newPassword")}
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("enterNewPassword")}
                  className="bg-slate-800/40 border-slate-600/30 text-white rounded-xl px-4 py-3 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  {t("confirmNewPassword")}
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmNewPasswordPlaceholder")}
                  className="bg-slate-800/40 border-slate-600/30 text-white rounded-xl px-4 py-3 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  {isChangingPassword ? t("changing") : t("changePasswordButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
