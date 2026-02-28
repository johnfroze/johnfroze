import { useState } from 'react';
import { useWemixPrice } from './hooks/useWemixPrice';
import { 
  DollarSign, 
  Wallet, 
  Calculator, 
  RefreshCw, 
  Globe,
  Activity,
  ChevronDown,
  Link2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Currency = 'USD' | 'PHP';

function App() {
  const { usdPrice, phpPrice, lastUpdated, isLoading, refetch } = useWemixPrice(30000);
  const [myPrice, setMyPrice] = useState<string>('');
  const [myHoldings, setMyHoldings] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PHP');
  const [isLive, setIsLive] = useState(true);

  const currencies = {
    USD: { symbol: '$', flag: '🇺🇸', name: 'USD' },
    PHP: { symbol: '₱', flag: '🇵🇭', name: 'PHP' },
  };

  const currentCurrency = currencies[selectedCurrency];
  const currentPrice = selectedCurrency === 'PHP' ? phpPrice : usdPrice;

  const myPriceNum = parseFloat(myPrice) || 0;
  const myHoldingsNum = parseFloat(myHoldings) || 0;
  
  // Calculate: Total = Holdings × (WEMIX Price + My Price per token)
  const combinedPricePerToken = currentPrice + myPriceNum;
  const totalValue = myHoldingsNum * combinedPricePerToken;

  const formatPrice = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/50">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <h1 
              className="text-2xl md:text-4xl font-bold"
              style={{
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(96, 165, 250, 0.5)',
              }}
            >
              Jfroze Wemix Price Calculator
            </h1>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            <p className="text-cyan-300 text-sm flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Live Crypto Price Tracker
            </p>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          </div>
        </div>

        {/* Currency Selector */}
        <div className="w-full max-w-sm mb-5">
          <Label className="text-slate-300 text-sm mb-2 block">Select Currency</Label>
          <div className="relative">
            <button 
              className="w-full flex items-center justify-between bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white hover:bg-slate-900/80 transition-colors backdrop-blur-sm"
              onClick={() => setSelectedCurrency(prev => prev === 'USD' ? 'PHP' : 'USD')}
            >
              <span className="flex items-center gap-2">
                <span>{currentCurrency.flag}</span>
                <span>{currentCurrency.name}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Selected: {currentCurrency.flag} {currentCurrency.name} ({currentCurrency.symbol})
          </p>
        </div>

        {/* Live Price Card */}
        <div className="w-full max-w-sm mb-5 relative group">
          {/* Gradient border effect */}
          <div 
            className="absolute -inset-[1px] rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              filter: 'blur(2px)',
            }}
          />
          <Card className="relative bg-slate-950/80 border-0 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">W</span>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm">Current WEMIX Price</h2>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Live from CoinGecko
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsLive(false)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!isLive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    Cached
                  </button>
                  <button 
                    onClick={() => setIsLive(true)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-400'}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700/50 ml-1"
                    onClick={refetch}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  {currentCurrency.symbol}
                  {isLoading && currentPrice === 0 ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    formatPrice(currentPrice)
                  )}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                {isLoading ? 'Loading...' : 'Live price data'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calculator Inputs */}
        <div className="w-full max-w-sm mb-5 relative group">
          {/* Gradient border effect */}
          <div 
            className="absolute -inset-[1px] rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              filter: 'blur(2px)',
            }}
          />
          <Card className="relative bg-slate-950/80 border-0 backdrop-blur-xl">
            <CardContent className="pt-5 space-y-4">
              {/* My Price Input */}
              <div>
                <Label className="text-slate-300 flex items-center gap-2 mb-2 text-sm">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  My Price (per WEMIX)
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={myPrice}
                  onChange={(e) => setMyPrice(e.target.value)}
                  className="bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:border-cyan-500/50 h-10"
                />
                <p className="text-slate-400 text-xs mt-1">Additional price per WEMIX token</p>
              </div>

              {/* My WEMIX Holdings Input */}
              <div>
                <Label className="text-slate-300 flex items-center gap-2 mb-2 text-sm">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  My WEMIX Holdings
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={myHoldings}
                  onChange={(e) => setMyHoldings(e.target.value)}
                  className="bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:border-cyan-500/50 h-10"
                />
                <p className="text-slate-400 text-xs mt-1">Enter how many WEMIX tokens you own</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Price Card */}
        <div className="w-full max-w-sm relative group">
          {/* Gradient border effect */}
          <div 
            className="absolute -inset-[1px] rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
              filter: 'blur(2px)',
            }}
          />
          <Card className="relative bg-slate-950/80 border-0 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm">Total Price</h2>
                    <p className="text-slate-400 text-xs">Holdings × (WEMIX Price + My Price)</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  Result
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-3">
                <div className="flex items-center justify-center gap-1">
                  <span 
                    className="text-4xl font-bold"
                    style={{
                      background: 'linear-gradient(90deg, #34d399, #60a5fa)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {currentCurrency.symbol}
                    {formatPrice(totalValue)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1.5 pt-3 border-t border-slate-700/50">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">WEMIX Price:</span>
                  <span className="text-slate-300">{currentCurrency.symbol}{formatPrice(currentPrice)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">My Price (per token):</span>
                  <span className="text-slate-300">{currentCurrency.symbol}{formatPrice(myPriceNum)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Combined Price:</span>
                  <span className="text-slate-300">{currentCurrency.symbol}{formatPrice(combinedPricePerToken)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Holdings ({myHoldingsNum || 0} tokens):</span>
                  <span className="text-slate-300">{currentCurrency.symbol}{formatPrice(totalValue)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1.5 border-t border-slate-700/30">
                  <span className="text-slate-300 font-medium">Total Value:</span>
                  <span className="text-emerald-400 font-bold">{currentCurrency.symbol}{formatPrice(totalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Prices update automatically every 30 seconds
          </p>
          <p className="text-slate-500 text-xs mt-1.5">
            Data provided by{' '}
            <a 
              href="https://www.coingecko.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              CoinGecko
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
