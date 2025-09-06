import { Download, CheckCircle, Code, Database, CreditCard, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DownloadPage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/spark-platform-download.tar.gz';
    link.download = 'spark-platform-complete.tar.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            SPARK Platform - Application Complète
          </h1>
          <p className="text-xl text-gray-300">
            Plateforme d'investissement musical niveau entreprise international
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <Code className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <CardTitle className="text-white text-sm">Frontend React</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 text-sm">TypeScript + Tailwind CSS</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-white text-sm">Backend Node.js</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 text-sm">Express + PostgreSQL</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-white text-sm">Paiements Stripe</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 text-sm">Intégration complète</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <Smartphone className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <CardTitle className="text-white text-sm">Mobile Ready</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 text-sm">Responsive design</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Fonctionnalités Complètes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Authentification complète</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Dashboards multiples (Fan, Artist, Investor, Label)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Système de paiement Stripe intégré</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Base de données PostgreSQL</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Interface mobile responsive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Portfolio tracking en temps réel</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Navigation complète fonctionnelle</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Architecture entreprise niveau international</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
          <CardHeader className="text-center">
            <Download className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">Télécharger SPARK Platform</CardTitle>
            <p className="text-gray-300">
              Application complète (107MB) - Prête pour déploiement
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger SPARK Platform
            </Button>
            <p className="text-gray-400 text-sm mt-4">
              Fichier: spark-platform-complete.tar.gz
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Installation Rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-4 rounded-lg">
              <code className="text-green-400 text-sm">
                # Extraire l'archive<br/>
                tar -xzf spark-platform-complete.tar.gz<br/>
                cd spark-platform<br/><br/>
                
                # Installer les dépendances<br/>
                npm install<br/><br/>
                
                # Configurer les variables d'environnement<br/>
                # Ajouter vos clés Stripe dans .env<br/><br/>
                
                # Lancer l'application<br/>
                npm run dev
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}