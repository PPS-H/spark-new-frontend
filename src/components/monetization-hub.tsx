import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Music, 
  ShoppingBag, 
  Crown, 
  Lock, 
  Gift,
  Zap,
  Star,
  Heart,
  Download,
  Play,
  Upload,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Sparkles,
  Plus
} from "lucide-react";

interface MonetizationHubProps {
  onCreateProduct: (product: any) => void;
}

export default function MonetizationHub({ onCreateProduct }: MonetizationHubProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "music",
    price: "",
    description: "",
    limited: false,
    quantity: ""
  });

  const products = [
    {
      id: 1,
      name: "Midnight Dreams EP",
      type: "music",
      price: 9.99,
      sales: 234,
      revenue: 2324.66,
      status: "active"
    },
    {
      id: 2,
      name: "Producer Pack Vol. 1",
      type: "pack",
      price: 24.99,
      sales: 89,
      revenue: 2224.11,
      status: "active"
    },
    {
      id: 3,
      name: "Limited Edition T-Shirt",
      type: "merch",
      price: 29.99,
      sales: 156,
      revenue: 4678.44,
      status: "active"
    },
    {
      id: 4,
      name: "VIP Fan Experience",
      type: "experience",
      price: 149.99,
      sales: 23,
      revenue: 3449.77,
      status: "active"
    }
  ];

  const vipOffers = [
    {
      id: 1,
      name: "Early Access Tier",
      subscribers: 89,
      monthlyRevenue: 890,
      price: 9.99,
      benefits: ["24h early access", "Exclusive demos", "Monthly Q&A"]
    },
    {
      id: 2,
      name: "Producer's Circle",
      subscribers: 34,
      monthlyRevenue: 1696,
      price: 49.99,
      benefits: ["Stems & loops", "Production tutorials", "1-on-1 feedback"]
    },
    {
      id: 3,
      name: "Inner Circle",
      subscribers: 12,
      monthlyRevenue: 1199.88,
      price: 99.99,
      benefits: ["All content", "Video calls", "Co-writing sessions"]
    }
  ];

  const preOrders = [
    {
      id: 1,
      name: "Lunar Eclipse Album",
      price: 14.99,
      orders: 567,
      releaseDate: "2024-12-15",
      revenue: 8499.33
    },
    {
      id: 2,
      name: "Acoustic Sessions EP",
      price: 7.99,
      orders: 234,
      releaseDate: "2024-11-30",
      revenue: 1869.66
    }
  ];

  const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0) + 
                      vipOffers.reduce((sum, offer) => sum + offer.monthlyRevenue, 0) + 
                      preOrders.reduce((sum, order) => sum + order.revenue, 0);

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.price) {
      onCreateProduct(newProduct);
      setNewProduct({
        name: "",
        type: "music",
        price: "",
        description: "",
        limited: false,
        quantity: ""
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Monetization Hub</h2>
          <p className="text-gray-400">Sell music, merchandise, and exclusive content</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-500/20 text-green-300">
            €{totalRevenue.toFixed(2)} total revenue
          </Badge>
          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="artist-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300">+12%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white">€{products.filter(p => p.type === 'music').reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}</h3>
            <p className="text-blue-300">Music Sales</p>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 text-purple-400" />
              <Badge className="bg-purple-500/20 text-purple-300">+28%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white">€{products.filter(p => p.type === 'merch').reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}</h3>
            <p className="text-purple-300">Merchandise</p>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <Badge className="bg-yellow-500/20 text-yellow-300">+45%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white">€{vipOffers.reduce((sum, offer) => sum + offer.monthlyRevenue, 0).toFixed(2)}</h3>
            <p className="text-yellow-300">VIP Subscriptions</p>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-300">+67%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white">€{preOrders.reduce((sum, order) => sum + order.revenue, 0).toFixed(2)}</h3>
            <p className="text-green-300">Pre-Orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Management */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="w-5 h-5 mr-2 text-cyan-400" />
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      {product.type === 'music' && <Music className="w-5 h-5 text-white" />}
                      {product.type === 'pack' && <Package className="w-5 h-5 text-white" />}
                      {product.type === 'merch' && <ShoppingBag className="w-5 h-5 text-white" />}
                      {product.type === 'experience' && <Star className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{product.name}</h4>
                      <p className="text-sm text-gray-400">{product.sales} sales • €{product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">€{product.price}</span>
                    <Badge className="ml-2 bg-green-500/20 text-green-300">{product.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="w-5 h-5 mr-2 text-cyan-400" />
              VIP Fan Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vipOffers.map((offer) => (
                <div key={offer.id} className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{offer.name}</h4>
                    <span className="text-lg font-bold text-yellow-400">€{offer.price}/mo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-400">Subscribers</span>
                      <p className="font-semibold text-white">{offer.subscribers}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Monthly Revenue</span>
                      <p className="font-semibold text-green-400">€{offer.monthlyRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {offer.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Orders & Gated Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
              Pre-Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preOrders.map((order) => (
                <div key={order.id} className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{order.name}</h4>
                    <span className="text-lg font-bold text-green-400">€{order.price}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-400">Orders</span>
                      <p className="font-semibold text-white">{order.orders}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Revenue</span>
                      <p className="font-semibold text-green-400">€{order.revenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Release</span>
                      <p className="font-semibold text-cyan-400">{new Date(order.releaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="artist-metric-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-cyan-400" />
              Create New Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Product Name</label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Enter product name..."
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Type</label>
                <select 
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                  className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-md text-white"
                >
                  <option value="music">Music</option>
                  <option value="pack">Producer Pack</option>
                  <option value="merch">Merchandise</option>
                  <option value="experience">Experience</option>
                  <option value="nft">NFT</option>
                </select>
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Price (€)</label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00"
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Product description..."
                className="bg-slate-800/50 border-slate-600 text-white"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-400">
                <input 
                  type="checkbox"
                  checked={newProduct.limited}
                  onChange={(e) => setNewProduct({...newProduct, limited: e.target.checked})}
                  className="rounded"
                />
                <span>Limited Edition</span>
              </label>
              {newProduct.limited && (
                <Input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  placeholder="Quantity"
                  className="w-24 bg-slate-800/50 border-slate-600 text-white"
                />
              )}
            </div>
            
            <Button 
              onClick={handleCreateProduct}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}