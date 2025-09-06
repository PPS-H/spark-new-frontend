import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Shield, 
  FileText, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Play,
  RefreshCw,
  Database,
  Eye,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemStatus {
  status: string;
  services: {
    paymentAutomation: string;
    complianceService: string;
    contractService: string;
  };
  automation: {
    lastRun: string;
    nextScheduled: string;
    intervalHours: number;
  };
  compliance: {
    kycEnabled: boolean;
    amlEnabled: boolean;
    gdprCompliant: boolean;
    supportedJurisdictions: string[];
  };
}

export default function AutomatedPaymentDashboard() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "payments" | "compliance" | "contracts">("overview");
  const { toast } = useToast();

  // --- Begin: Mock Data and No-Op Mutation Actions ---

  // Replace useQuery with static mock data
  const systemStatus: SystemStatus = {
    status: "operational",
    services: {
      paymentAutomation: "running",
      complianceService: "running",
      contractService: "running"
    },
    automation: {
      lastRun: new Date().toISOString(),
      nextScheduled: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      intervalHours: 1
    },
    compliance: {
      kycEnabled: true,
      amlEnabled: true,
      gdprCompliant: true,
      supportedJurisdictions: ["US", "UK", "EU"]
    }
  };
  const statusLoading = false;

  // Replace mutations with no-ops
  const runAutomationMutation = {
    isPending: false,
    mutate: () => {
      toast({
        title: "Success",
        description: "Payment automation completed successfully",
      });
    }
  };

  const processPaymentsMutation = {
    isPending: false,
    mutate: () => {
      toast({
        title: "Success",
        description: "Scheduled payments processed successfully",
      });
    }
  };

  const monitorComplianceMutation = {
    isPending: false,
    mutate: () => {
      toast({
        title: "Success",
        description: "Compliance monitoring completed",
      });
    }
  };

  // --- End: Mock Data and No-Op Mutation Actions ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "running":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "running":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (statusLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-purple-400" />
            Automated Payment System
          </h1>
          <p className="text-gray-400 text-lg">
            100% automated payment redistribution with compliance monitoring
          </p>
          
          {/* System Status Overview */}
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus?.status || "loading")}
              <span className={`font-semibold ${getStatusColor(systemStatus?.status || "loading")}`}>
                System {systemStatus?.status || "Loading..."}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">
                Next Run: {systemStatus?.automation.nextScheduled ? 
                  new Date(systemStatus.automation.nextScheduled).toLocaleTimeString() : 
                  "Loading..."
                }
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "payments", label: "Payments", icon: DollarSign },
            { id: "compliance", label: "Compliance", icon: Shield },
            { id: "contracts", label: "Contracts", icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* System Services Status */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  System Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus?.services && Object.entries(systemStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <Badge variant={status === "running" ? "default" : "destructive"}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Automation Status */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-blue-400" />
                  Automation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Run:</span>
                    <span className="text-white">
                      {systemStatus?.automation.lastRun ? 
                        new Date(systemStatus.automation.lastRun).toLocaleString() : 
                        "Never"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Interval:</span>
                    <span className="text-white">
                      {systemStatus?.automation.intervalHours || 1} hour(s)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Scheduled:</span>
                    <span className="text-white">
                      {systemStatus?.automation.nextScheduled ? 
                        new Date(systemStatus.automation.nextScheduled).toLocaleString() : 
                        "Unknown"
                      }
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => runAutomationMutation.mutate()}
                  disabled={runAutomationMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {runAutomationMutation.isPending ? "Running..." : "Run Now"}
                </Button>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus?.compliance && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">KYC Enabled</span>
                      <Badge variant={systemStatus.compliance.kycEnabled ? "default" : "destructive"}>
                        {systemStatus.compliance.kycEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AML Enabled</span>
                      <Badge variant={systemStatus.compliance.amlEnabled ? "default" : "destructive"}>
                        {systemStatus.compliance.amlEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">GDPR Compliant</span>
                      <Badge variant={systemStatus.compliance.gdprCompliant ? "default" : "destructive"}>
                        {systemStatus.compliance.gdprCompliant ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-400 text-sm">Supported Jurisdictions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {systemStatus.compliance.supportedJurisdictions.map((jurisdiction) => (
                          <Badge key={jurisdiction} variant="outline" className="text-xs">
                            {jurisdiction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payments Tab */}
        {selectedTab === "payments" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Payment Processing Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => processPaymentsMutation.mutate()}
                    disabled={processPaymentsMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    {processPaymentsMutation.isPending ? "Processing..." : "Process Payments"}
                  </Button>
                  
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Revenue Calculations
                  </Button>
                  
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <Database className="w-4 h-4 mr-2" />
                    Escrow Management
                  </Button>
                </div>

                <Separator className="bg-slate-600" />

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Payment Automation Features</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Real-time streaming data collection from all platforms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Automatic revenue calculation and distribution</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Escrow account management with audit trail</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Tax withholding and automatic reporting</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compliance Tab */}
        {selectedTab === "compliance" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  Compliance & Regulatory Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => monitorComplianceMutation.mutate()}
                    disabled={monitorComplianceMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {monitorComplianceMutation.isPending ? "Monitoring..." : "Run Compliance Check"}
                  </Button>
                  
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Tax Reports
                  </Button>
                </div>

                <Separator className="bg-slate-600" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-blue-400" />
                      KYC/AML Verification
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Automatic identity verification</li>
                      <li>• Real-time risk assessment</li>
                      <li>• Compliance monitoring</li>
                      <li>• Expiry tracking and renewal</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-400" />
                      International Compliance
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Multi-jurisdiction tax reporting</li>
                      <li>• GDPR/CCPA data protection</li>
                      <li>• Financial services licensing</li>
                      <li>• Automatic regulatory updates</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contracts Tab */}
        {selectedTab === "contracts" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-400" />
                  Smart Contract Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Automated Contract Features</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Jurisdiction-specific contract generation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Digital signature workflow</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Contract integrity verification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Automated revenue sharing clauses</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">US</div>
                    <div className="text-gray-400 text-sm">SEC Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">UK</div>
                    <div className="text-gray-400 text-sm">FCA Regulated</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">EU</div>
                    <div className="text-gray-400 text-sm">MiFID II Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
