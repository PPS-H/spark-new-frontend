import { AlertTriangle, CreditCard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSetupNoticeProps {
  onClose: () => void;
}

export default function PaymentSetupNotice({ onClose }: PaymentSetupNoticeProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full space-y-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h3 className="text-white font-bold text-lg">Configuration de paiement requise</h3>
        </div>
        
        <div className="space-y-3 text-gray-300">
          <p>
            SPARK nécessite une configuration de processeur de paiement réel pour permettre 
            aux utilisateurs d'investir avec leurs vraies cartes bancaires.
          </p>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">Fonctionnalités disponibles avec Stripe :</span>
            </div>
            <ul className="text-sm space-y-1 ml-6">
              <li>• Cartes bancaires réelles de vos utilisateurs</li>
              <li>• Sécurité 3D Secure</li>
              <li>• Paiements internationaux</li>
              <li>• Gestion automatique des remboursements</li>
              <li>• Conformité PCI DSS</li>
            </ul>
          </div>
          
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-200 text-sm">
              Pour activer les paiements réels, configurez vos clés API Stripe dans les variables d'environnement :
              <code className="block mt-1 bg-blue-800/50 p-1 rounded text-xs">
                STRIPE_SECRET_KEY=sk_...
              </code>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-600 text-gray-300"
            onClick={onClose}
          >
            Comprendre
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurer Stripe
          </Button>
        </div>
      </div>
    </div>
  );
}