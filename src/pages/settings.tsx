import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuthRTK";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUpdateUserMutation, useChangePasswordMutation } from "@/store/features/api/authApi";
import { useConnectSpotifyMutation } from "@/store/features/api/socialMediaApi";
import { useToast } from "@/hooks/use-toast";
import SubscriptionSwiper from "@/components/subscription-swiper";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Volume2,
  Mail,
  Smartphone,
  Eye,
  LogOut,
  Crown,
  Zap,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [connectSpotify, { isLoading: isConnectingSpotify }] = useConnectSpotifyMutation();
  
  // Local state for form fields
  const [displayName, setDisplayName] = useState(user?.username || "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
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
    }
  }, [user]);

  // Handle profile name update
  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid display name.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUser({ username: displayName.trim() }).unwrap();
      setIsEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your display name has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: error?.data?.message || "Failed to update profile. Please try again.",
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
        title: "Setting Updated",
        description: "Your preference has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Setting update error:", error);
      toast({
        title: "Update Failed",
        description: error?.data?.message || "Failed to update setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await updateUser({ language: newLanguage === 'en' }).unwrap();
      setLanguage(newLanguage as any);
      toast({
        title: "Language Updated",
        description: "Your language preference has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Language update error:", error);
      toast({
        title: "Update Failed",
        description: error?.data?.message || "Failed to update language. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      toast({
        title: "Missing Current Password",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword.trim()) {
      toast({
        title: "Missing New Password",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
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
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      
      // Reset form and close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(false);
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: "Password Change Failed",
        description: error?.data?.message || "Failed to change password. Please try again.",
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
  const isPaidUser =
    user?.role && ["artist", "investor", "label", "admin"].includes(user.role);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Account Info */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-cyan-400" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${
                  roleInfo.color === "purple"
                    ? "from-purple-500 to-pink-500"
                    : roleInfo.color === "blue"
                    ? "from-blue-500 to-cyan-500"
                    : roleInfo.color === "green"
                    ? "from-green-500 to-emerald-500"
                    : roleInfo.color === "red"
                    ? "from-red-500 to-orange-500"
                    : "from-gray-500 to-gray-600"
                } rounded-full flex items-center justify-center`}
              >
                <roleInfo.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">
                  {user?.username || "User"}
                </h3>
                <p className="text-gray-400">
                  {user?.email || "email@example.com"}
                </p>
                <Badge
                  className={`${
                    roleInfo.color === "purple"
                      ? "bg-purple-500/20 text-purple-300"
                      : roleInfo.color === "blue"
                      ? "bg-blue-500/20 text-blue-300"
                      : roleInfo.color === "green"
                      ? "bg-green-500/20 text-green-300"
                      : roleInfo.color === "red"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-gray-500/20 text-gray-300"
                  } mt-1`}
                >
                  <roleInfo.icon className="w-3 h-3 mr-1" />
                  {roleInfo.name}
                </Badge>
              </div>
              <Button
                variant="outline"
                className="border-cyan-500/30 text-cyan-300"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                  disabled={!isEditingProfile}
                />
                {isEditingProfile && (
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white"
                    size="sm"
                  >
                    {isUpdating ? "Updating..." : "Update Name"}
                  </Button>
                )}
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Email
                </label>
                <Input
                  value={user?.email || ""}
                  className="bg-slate-800/50 border-slate-600 text-white"
                  disabled={true}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-cyan-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    Email Notifications
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Investment updates and news
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('emailNotifications', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  <p className="text-gray-400 text-sm">
                    Real-time alerts on your device
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('pushNotifications', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">Funding Alerts</h4>
                  <p className="text-gray-400 text-sm">
                    When campaigns reach milestones
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.fundingAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange('fundingAlerts', checked)
                }
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-cyan-400" />
              {t("settings.privacy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">Public Profile</h4>
                  <p className="text-gray-400 text-sm">
                    Allow others to discover your profile
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.publicProfile}
                onCheckedChange={(checked) =>
                  handleSettingChange('publicProfile', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    Investment Activity
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Show your investments publicly
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.investmentActivity}
                onCheckedChange={(checked) =>
                  handleSettingChange('investmentActivity', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">Direct Messages</h4>
                  <p className="text-gray-400 text-sm">
                    Allow artists and labels to contact you
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.directMessages}
                onCheckedChange={(checked) =>
                  handleSettingChange('directMessages', checked)
                }
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-cyan-400" />
              {t("settings.app_preferences")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("settings.dark_mode")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("settings.dark_mode_desc")}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleSettingChange('darkMode', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("settings.audio_preview")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("settings.audio_preview_desc")}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.autoPreview}
                onCheckedChange={(checked) =>
                  handleSettingChange('autoPreview', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-white font-medium">
                    {t("settings.language")}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("settings.language_desc")}
                  </p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-800/50 border border-slate-600 rounded-md px-3 py-2 text-white"
                disabled={isUpdating}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Connect Your Accounts - Artist Only */}
        {user?.role === "artist" && (
          <Card className="artist-metric-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-cyan-400" />
                Connect Your Accounts
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
                    {isConnectingSpotify ? "Connecting..." : "Spotify"}
                  </span>
                </div>

                {/* YouTube Icon */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">YouTube</span>
                </div>

                {/* Deezer Icon */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.68 5.47H22V8h-4.32V5.47zM15.15 8H19.5v2.53h-4.35V8zM12.6 10.53H17v2.53h-4.4v-2.53zM10.05 13.07h4.47v2.53h-4.47v-2.53zM7.5 15.6h4.47v2.53H7.5V15.6zM4.95 18.13h4.47V20.7H4.95v-2.57zM2.4 20.7h4.47v2.53H2.4V20.7zM17.68 8H22v2.53h-4.32V8zM15.15 10.53H19.5V13h-4.35v-2.47zM12.6 13H17v2.53h-4.4V13zM10.05 15.53h4.47v2.53h-4.47v-2.53zM7.5 18.07h4.47v2.53H7.5v-2.53zM4.95 20.6h4.47v2.53H4.95V20.6zM2.4 23.13h4.47v2.53H2.4v-2.53z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Deezer</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-cyan-400" />
              {t("Account Actions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              {t("Change Password")}
            </Button>

            {/* <Button
              variant="outline"
              className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
            >
              {t("downloadMyData")}
            </Button> */}

            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            <div className="pt-4 border-t border-slate-700">
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Delete Account
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This action cannot be undone and will permanently delete your
                account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Change Password</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
