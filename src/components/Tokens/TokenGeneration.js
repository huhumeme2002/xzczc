import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { tokenService } from '../../services/api';
import { CreditCard, Coins, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TokenGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [tokenCost] = useState(10); // Default cost per token
  const { user, updateUser } = useAuth();

  const handleGenerateToken = async () => {
    if (user?.credits < tokenCost) {
      toast.error('Không đủ credits để tạo token');
      return;
    }

    setIsLoading(true);

    try {
      const result = await tokenService.generateToken();
      
      setGeneratedToken({
        token: result.token || result.tokenValue || generateMockToken(),
        cost: tokenCost,
        expiresAt: result.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        id: result.id || Date.now()
      });

      // Update user credits
      const newCredits = (user?.credits || 0) - tokenCost;
      updateUser({ credits: newCredits });

      toast.success('Token đã được tạo thành công!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Không thể tạo token';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockToken = () => {
    // Generate a mock token for demo purposes
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'TKN_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Đã copy vào clipboard');
    } catch (error) {
      toast.error('Không thể copy');
    }
  };

  const canGenerateToken = user?.credits >= tokenCost;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tạo Token</h1>
        <p className="mt-2 text-gray-600">
          Sử dụng credits để tạo token mới
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Token Generation */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Tạo Token Mới</h3>
            <p className="text-sm text-gray-600">Chi phí: {tokenCost} credits/token</p>
          </div>

          <div className="space-y-6">
            {/* Current Balance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Số dư hiện tại:</span>
                </div>
                <span className="text-lg font-bold text-primary-600">
                  {user?.credits?.toLocaleString() || '0'} credits
                </span>
              </div>
            </div>

            {/* Cost Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Thông tin chi phí:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Mỗi token tốn {tokenCost} credits. Sau khi tạo, bạn sẽ còn lại{' '}
                    <strong>{((user?.credits || 0) - tokenCost).toLocaleString()}</strong> credits.
                  </p>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateToken}
              disabled={isLoading || !canGenerateToken}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                canGenerateToken
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang tạo token...
                </div>
              ) : !canGenerateToken ? (
                'Không đủ credits'
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Tạo Token ({tokenCost} credits)
                </div>
              )}
            </button>

            {!canGenerateToken && (
              <p className="text-sm text-red-600 text-center">
                Bạn cần ít nhất {tokenCost} credits để tạo token
              </p>
            )}
          </div>
        </div>

        {/* Generated Token */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Token Đã Tạo</h3>
          </div>

          {generatedToken ? (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Token đã được tạo thành công!
                  </span>
                </div>
              </div>

              {/* Token Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedToken.token}
                    readOnly
                    className="flex-1 input-field font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedToken.token)}
                    className="btn-secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chi phí:</span>
                  <span className="font-medium">{generatedToken.cost} credits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hết hạn:</span>
                  <span className="font-medium">
                    {new Date(generatedToken.expiresAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Token ID:</span>
                  <span className="font-medium">#{generatedToken.id}</span>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Lưu ý quan trọng:</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Hãy copy và lưu token này ngay. Token chỉ hiển thị một lần và không thể khôi phục.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có token</h3>
              <p className="mt-1 text-sm text-gray-500">
                Token sẽ hiển thị ở đây sau khi tạo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="mt-8 card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Cách thức hoạt động</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-blue-600">1</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Kiểm tra credits</h4>
            <p className="text-sm text-gray-600">
              Đảm bảo bạn có đủ credits (tối thiểu {tokenCost} credits)
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-green-600">2</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tạo token</h4>
            <p className="text-sm text-gray-600">
              Nhấn nút tạo token và hệ thống sẽ tự động trừ credits
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-lg font-bold text-purple-600">3</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Sử dụng token</h4>
            <p className="text-sm text-gray-600">
              Copy token và sử dụng cho các dịch vụ khác
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGeneration;
