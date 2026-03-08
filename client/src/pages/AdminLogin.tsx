import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  email: string;
}

const ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'المدير العام',
    role: 'admin',
    email: 'admin@boulevard.com',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    name: 'مدير العمليات',
    role: 'manager',
    email: 'manager@boulevard.com',
  },
  {
    id: '3',
    username: 'staff',
    password: 'staff123',
    name: 'الموظف',
    role: 'staff',
    email: 'staff@boulevard.com',
  },
];

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // محاكاة تأخير الخادم
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = ADMIN_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // حفظ بيانات المستخدم في localStorage
      localStorage.setItem(
        'adminUser',
        JSON.stringify({
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email,
        })
      );
      setLocation('/admin');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f15] via-[#3d2e24] to-[#2a1f15]">
      <Sidebar />
      <WhatsAppButton phoneNumber="967123456789" message="مرحبا بك في بوليفارد صنعاء! كيف يمكنني مساعدتك؟" />

      <main className="md:ml-64 pb-24 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#d4a574] mb-2">
              بوليفارد صنعاء
            </h1>
            <p className="text-gray-400">لوحة التحكم الإدارية</p>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-yellow-600/30">
            <h2 className="text-2xl font-bold text-[#d4a574] mb-6 text-center">
              تسجيل الدخول
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-[#d4a574] mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full pr-10 pl-4 py-3 border border-yellow-600/50 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#d4a574] mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 text-gray-500" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full pr-10 pl-4 py-3 border border-yellow-600/50 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#6b5a4a] to-[#5a4a3a] hover:from-yellow-700 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-300 active:scale-95"
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-8 border-t border-yellow-600/30">
              <p className="text-sm text-gray-400 mb-4 text-center">
                بيانات الدخول التجريبية:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500">المدير العام</p>
                  <p className="text-sm text-[#d4a574]">
                    admin / admin123
                  </p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500">مدير العمليات</p>
                  <p className="text-sm text-[#d4a574]">
                    manager / manager123
                  </p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-500">الموظف</p>
                  <p className="text-sm text-[#d4a574]">
                    staff / staff123
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-[#d4a574] hover:text-yellow-300 transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
