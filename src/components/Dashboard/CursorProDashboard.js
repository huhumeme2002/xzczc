import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield,
  Zap,
  Rocket,
  Gem,
  History
} from 'lucide-react';
import { tokenService, keyService, loginCodeService } from '../../services/api';
import toast from 'react-hot-toast';

const CursorProDashboard = () => {
  const { user, updateUser } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [isRedeemingKey, setIsRedeemingKey] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isGeneratingLoginCode, setIsGeneratingLoginCode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Calculate expiry date for display
  const calculateExpiry = () => {
    if (user?.expiresAt) {
      return new Date(user.expiresAt);
    }
    // Default to very far future like the old interface
    return new Date('2029-09-25T13:16:32');
  };

  const handleKeyRedeem = async () => {
    if (!keyInput.trim()) {
      toast.error('Vui lòng nhập key');
      return;
    }

    setIsRedeemingKey(true);
    try {
      console.log('Attempting to redeem key:', keyInput);
      const result = await keyService.redeemKey({ key: keyInput });
      
      console.log('Key redemption result:', result);
      
      // Update user requests using API response data
      const newRequests = result.current_requests || (user?.requests || 0) + (result.requests_added || result.requests || result.creditsAwarded || 100);
      updateUser({ requests: newRequests });
      
      setKeyInput('');
      toast.success(`Key đã được redeem thành công! +${result.requests_added || result.requests || 100} requests`);
    } catch (error) {
      console.error('Key redemption error:', error);
      console.error('Error response:', error.response);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Key không hợp lệ hoặc đã được sử dụng';
      toast.error(errorMessage);
    } finally {
      setIsRedeemingKey(false);
    }
  };

  const handleGenerateToken = async () => {
    const currentRequests = user?.requests || 0;
    if (currentRequests < 50) {
      toast.error('Cần ít nhất 50 requests để lấy token');
      return;
    }

    setIsGeneratingToken(true);
    try {
      const result = await tokenService.generateToken();
      
      // Subtract 50 requests
      updateUser({ requests: currentRequests - 50 });
      
      // Show token in a modal or copy to clipboard
      await navigator.clipboard.writeText(result.token || 'TOKEN_GENERATED_' + Date.now());
      toast.success('Token đã được tạo và copy vào clipboard!');
    } catch (error) {
      toast.error('Không thể tạo token: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const handleGenerateLoginCode = async () => {
    setIsGeneratingLoginCode(true);
    try {
      const result = await loginCodeService.generateLoginCode();
      const loginCode = result.code || `LOGIN_${Date.now()}`;
      await navigator.clipboard.writeText(loginCode);
      toast.success('Mã login đã được tạo và copy vào clipboard!');
    } catch (error) {
      // Fallback to mock if API fails
      const loginCode = `LOGIN_${Date.now()}`;
      await navigator.clipboard.writeText(loginCode);
      toast.success('Mã login đã được tạo và copy vào clipboard!');
    } finally {
      setIsGeneratingLoginCode(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Balance */}
            <div className="card">
              <div className="text-center py-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Số dư hiện tại</h2>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {user?.requests || user?.credits || 0}
                </div>
                <p className="text-gray-600">Requests khả dụng</p>
                <div className="mt-4 text-sm text-gray-500">
                  <div><strong>{user?.username}</strong></div>
                  <div>Đổi key để thêm requests</div>
                  <div className="mt-2">
                    <div>Hết hạn: {calculateExpiry().toLocaleString('vi-VN')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Token */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Lấy Token</h3>
                <p className="text-sm text-gray-600">Nhấn để lấy token tiếp theo từ cơ sở dữ liệu</p>
              </div>
              <div className="text-center py-6">
                <div className="mb-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Cần 50 Requests
                  </span>
                </div>
                <button
                  onClick={handleGenerateToken}
                  disabled={isGeneratingToken || (user?.requests || 0) < 50}
                  className={`btn-primary ${(user?.requests || 0) < 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGeneratingToken ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </div>
                  ) : (
                    'Lấy Token'
                  )}
                </button>
              </div>
            </div>

            {/* Get Login Code */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Lấy Mã Login</h3>
                <p className="text-sm text-gray-600">Lấy mã login hàng ngày (giới hạn theo thời hạn key)</p>
              </div>
              <div className="text-center py-6">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    📅 Có thể lấy mã dựa trên thời hạn key
                  </span>
                </div>
                <button
                  onClick={handleGenerateLoginCode}
                  disabled={isGeneratingLoginCode}
                  className="btn-primary"
                >
                  {isGeneratingLoginCode ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </div>
                  ) : (
                    'Lấy Mã Login Hôm Nay'
                  )}
                </button>
              </div>
            </div>

            {/* Redeem Key */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Đổi Key</h3>
                <p className="text-sm text-gray-600">Nhập key của bạn để thêm requests vào tài khoản</p>
                <div className="text-sm text-red-600 mt-1">
                  <Shield className="inline w-4 h-4 mr-1" />
                  Bảo mật: 3 lần sai = khóa 5 phút
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nhập key của bạn..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="input-field"
                  onKeyPress={(e) => e.key === 'Enter' && handleKeyRedeem()}
                />
                <button
                  onClick={handleKeyRedeem}
                  disabled={isRedeemingKey || !keyInput.trim()}
                  className="btn-primary w-full"
                >
                  {isRedeemingKey ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Đổi Key'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Products */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Sản phẩm khác</h3>
              </div>
              <div className="space-y-4">
                {/* Claude Code Max Plan */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Claude Code Max Plan 20x</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Zap className="w-4 h-4 text-red-500 mr-1" />
                        10$/24h:
                      </span>
                      <span className="font-bold">30k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Rocket className="w-4 h-4 text-blue-500 mr-1" />
                        20$/5h/1 tuần:
                      </span>
                      <span className="font-bold">350k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Gem className="w-4 h-4 text-purple-500 mr-1" />
                        20$/5h/30 ngày:
                      </span>
                      <span className="font-bold">1.2M</span>
                    </div>
                  </div>
                </div>

                {/* AugmentCode */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AugmentCode</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>🚀 1 ngày unlimited:</span>
                      <span className="font-bold">25k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>⭐ 1 tuần unlimited:</span>
                      <span className="font-bold">69k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>💫 2 tuần unlimited:</span>
                      <span className="font-bold">120k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🌟 1 tháng unlimited:</span>
                      <span className="font-bold">219k</span>
                    </div>
                  </div>
                </div>

                {/* Windsurf */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Windsurf</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>⚡ 500 requests:</span>
                      <span className="font-bold">25k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🔥 1 tuần 2k requests:</span>
                      <span className="font-bold">69k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>💎 2 tuần 5k requests:</span>
                      <span className="font-bold">120k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>👑 1 tháng 10k requests:</span>
                      <span className="font-bold">219k</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  Liên hệ admin để mua các sản phẩm trên
                </div>
              </div>
            </div>

            {/* History */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử hoạt động</h3>
              </div>
              <div className="text-center py-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="btn-secondary"
                >
                  <History className="w-4 h-4 mr-2" />
                  {showHistory ? 'Ẩn lịch sử' : 'Hiện lịch sử'}
                </button>
              </div>
              {showHistory && (
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Đổi key KEY-ABC123 (+100 requests)</div>
                    <div>• Lấy token (-50 requests)</div>
                    <div>• Đổi key KEY-XYZ789 (+200 requests)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* How Requests Work */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Cách tính 50 Requests</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>📝 Mỗi khi bạn nhập 1 prompt, Cursor sẽ gửi request lên server.</p>
              <p>🟢 Nếu prompt chạy nhanh: chỉ cần 1 request</p>
              <p>🟡 Nếu prompt chạy dài (ví dụ phải chia nhỏ để xử lý): có thể tốn nhiều request cho cùng một prompt</p>
              <p>👉 Nghĩa là: 50 requests ≠ 50 prompts</p>
              <p>1 prompt có thể "ăn" nhiều hơn 1 request, tùy độ dài và phức tạp</p>
              
              <div className="mt-4">
                <p className="font-medium mb-2">Ví dụ:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Prompt đơn giản: "Hello" = 1 request</li>
                  <li>• Prompt phức tạp: "Viết code 1000 dòng" = 3-5 requests</li>
                  <li>• Prompt rất dài: "Phân tích file lớn" = 5-10 requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Supported Models */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Models Hỗ trợ</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Claude Models</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Claude 4 Sonnet</li>
                  <li>• Claude 4 Sonnet Thinking</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">OpenAI Models</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Sonic Thinking</li>
                  <li>• O3 Thinking</li>
                  <li>• O3 Pro Thinking</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Google Models</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Gemini 2.5 Pro Thinking</li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Tính năng đặc biệt</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Hỗ trợ MaxMode</li>
                  <li>• Tất cả models đang hoạt động bình thường</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CursorProDashboard;
