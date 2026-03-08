import { Menu, X, MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الحجوزات', href: '/bookings' },
    { label: 'عننا', href: '/about' },
    { label: 'التواصل', href: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1CPvnCx7m2/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/boulevardsanaa?igsh=Yzl5MzU3d3BjdmVo', label: 'Instagram' },
    { icon: MessageCircle, href: 'https://wa.me/967784442228', label: 'WhatsApp' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#d4a574] text-[#2a1f15] hover:bg-[#c9945f] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#2a1f15] border-r border-[#d4a574]/20 shadow-lg transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-[#d4a574]/20 flex flex-col items-center">
          <img src="/logo.png" alt="بوليفارد صنعاء" className="h-24 w-auto mb-1" />
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-[#a08070] hover:bg-[#3d2e22] hover:text-[#d4a574] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Contact Info */}
        <div className="p-6 border-t border-[#d4a574]/20 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-[#d4a574] flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-[#d4a574]">العنوان</p>
              <p className="text-[#a08070]">صنعاء، اليمن</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="text-[#d4a574] flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-[#d4a574]">الهاتف</p>
              <p className="text-[#a08070] dir-ltr">+967784442228</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="text-[#d4a574] flex-shrink-0 mt-1" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-[#d4a574]">البريد</p>
              <p className="text-[#a08070] dir-ltr">Zaidmotahr@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 border-t border-[#d4a574]/20">
          <p className="text-sm font-semibold text-[#d4a574] mb-3">تابعنا</p>
          <div className="flex gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="p-2 rounded-lg bg-[#3d2e22] text-[#d4a574] hover:bg-[#4a3a2f] transition-colors"
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
