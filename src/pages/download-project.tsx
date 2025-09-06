import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileArchive, Info, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function DownloadProject() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Récupérer les informations du projet
  const { data: projectInfo, isLoading } = useQuery({
    queryKey: ['/api/download/info'],
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Créer le lien de téléchargement
      const response = await fetch('/api/download/project');
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Créer un blob et le télécharger
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spark-platform-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Download error:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Télécharger SPARK</h1>
          <p className="text-slate-300 text-lg">Récupérez votre plateforme d'investissement musical complète</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Informations du projet */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="w-5 h-5" />
                Informations du Projet
              </CardTitle>
              <CardDescription className="text-slate-300">
                Détails de votre plateforme SPARK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Nom:</span>
                    <span className="text-white font-medium">{projectInfo?.name || 'SPARK Platform'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Version:</span>
                    <span className="text-white font-medium">{projectInfo?.version || '1.0.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Taille:</span>
                    <span className="text-white font-medium">{projectInfo?.size || 'Calculé...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Fichiers:</span>
                    <span className="text-white font-medium">{projectInfo?.files || 0}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Téléchargement */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileArchive className="w-5 h-5" />
                Téléchargement
              </CardTitle>
              <CardDescription className="text-slate-300">
                Archive ZIP complète de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  <p>Le téléchargement inclut :</p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Code source complet (client, server, shared)</li>
                    <li>• Configuration et dépendances</li>
                    <li>• Guide d'installation</li>
                    <li>• Documentation technique</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Téléchargement en cours...
                    </>
                  ) : downloaded ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Téléchargé avec succès !
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le projet
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Instructions d'Installation</CardTitle>
            <CardDescription className="text-slate-300">
              Comment installer et démarrer votre plateforme SPARK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-slate-300 mb-2">1. Extraire l'archive :</p>
                <code className="text-green-400">unzip spark-platform-*.zip</code>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-slate-300 mb-2">2. Installer les dépendances :</p>
                <code className="text-green-400">npm install</code>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-slate-300 mb-2">3. Démarrer l'application :</p>
                <code className="text-green-400">npm run dev</code>
              </div>
              
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-slate-300 mb-2">4. Accéder à l'application :</p>
                <code className="text-green-400">http://localhost:5000</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}