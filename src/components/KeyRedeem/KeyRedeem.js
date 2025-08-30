import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { keyService } from '../../services/api';
import { Key, Gift, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const KeyRedeem = () => {
  const [keyValue, setKeyValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);
  const { user, updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!keyValue.trim()) {
      toast.error('Vui lòng nhập key');
      return;
    }

    setIsLoading(true);
    setRedeemResult(null);

    try {
      const result = await keyService.redeemKey({ key: keyValue });
      
      setRedeemResult({
        success: true,
        credits: result.credits || result.creditsAwarded || 100,
        message: result.message || 'Key đã được redeem thành công!'
      });

      // Update user credits
      if (result.user && result.user.credits !== undefined) {
        updateUser({ credits: result.user.credits });
      } else {
        // Estimate new credits if not provided
        const currentCredits = user?.credits || 0;
        const newCredits = currentCredits + (result.credits || result.creditsAwarded || 100);
        updateUser({ credits: newCredits });
      }

      setKeyValue('');
      toast.success('Key đã được redeem thành công!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Không thể redeem key';
      setRedeemResult({
        success: false,
        message: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyChange = (e) => {
    const value = e.target.value.toUpperCase();
    setKeyValue(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
          <Key className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Redeem Key</h1>
        <p className="mt-2 text-gray-600">
          Nhập key để quy đổi thành credits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Redeem Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Nhập Key</h3>
            <p className="text-sm text-gray-600">Key phải có định dạng: KEY-XXXXXXXXXX</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
                Key Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="key"
                  type="text"
                  value={keyValue}
                  onChange={handleKeyChange}
                  placeholder="KEY-XXXXXXXXXX"
                  className="input-field pl-10 font-mono"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !keyValue.trim()}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Redeem Key
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {redeemResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              redeemResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {redeemResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-red-600 mr-2"></div>
                )}
                <div>
                  <p className={`font-medium ${
                    redeemResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {redeemResult.message}
                  </p>
                  {redeemResult.success && redeemResult.credits && (
                    <p className="text-sm text-green-600 mt-1">
                      +{redeemResult.credits.toLocaleString()} credits
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info & Current Balance */}
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Số dư hiện tại</h3>
            </div>
            <div className="text-center py-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {user?.credits?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-600">Credits</p>
            </div>
          </div>

          {/* How it works */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Cách thức hoạt động</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Nhập Key</p>
                  <p className="text-sm text-gray-600">Nhập key có định dạng KEY-XXXXXXXXXX</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Xác thực</p>
                  <p className="text-sm text-gray-600">Hệ thống kiểm tra tính hợp lệ của key</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Nhận Credits</p>
                  <p className="text-sm text-gray-600">Credits được cộng vào tài khoản của bạn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Format Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Định dạng Key:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• Bắt đầu với "KEY-"</div>
              <div>• Theo sau là 10-12 ký tự</div>
              <div>• Ví dụ: KEY-ABC123DEF456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyRedeem;
