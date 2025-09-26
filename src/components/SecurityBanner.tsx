import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

export const SecurityBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-4 border border-red-500/30 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold text-sm mb-2">Güvenlik Uyarısı</h3>
          <div className="text-gray-300 text-xs space-y-1">
            <p>• Birden fazla hesap açmak yasaktır ve ban sebebidir</p>
            <p>• Sistem otomatik olarak şüpheli aktiviteleri tespit eder</p>
            <p>• VPN kullanımı ve sahte bilgiler ban sebebidir</p>
            <p>• Hesabınızı güvende tutmak için güçlü şifre kullanın</p>
          </div>
        </div>
        <Shield className="h-5 w-5 text-blue-400" />
      </div>
    </div>
  );
};