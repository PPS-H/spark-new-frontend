import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuthRTK";
import { LogIn, UserPlus } from "lucide-react";
import SLogo from "@/components/s-logo";
import FunctionalAuth from "@/components/functional-auth";
import UserMenu from "@/components/user-menu";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SLogo className="text-purple-500" size={32} />
            <span className="text-2xl font-bold text-white">SPARK</span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-300 hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Welcome to SPARK
            </DialogTitle>
          </DialogHeader>
          <FunctionalAuth onClose={() => setShowAuthModal(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}