import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Location() {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummyKey&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    const location = { lat: 15.3694, lng: 44.2044 };
    const mapElement = document.getElementById('map');
    if (mapElement && typeof (window as any).google !== 'undefined') {
      const newMap = new (window as any).google.maps.Map(mapElement, {
        zoom: 15,
        center: location,
      });

      new (window as any).google.maps.Marker({
        position: location,
        map: newMap,
        title: 'Boulevard Sanaa',
      });

      setMap(newMap);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a1f15] text-[#d4a574]">
      <Sidebar />
      <WhatsAppButton phoneNumber="967123456789" message="مرحبا بك في بوليفارد صنعاء! كيف يمكنني مساعدتك؟" />

      <main className="md:ml-64 pb-24">
        <section className="pt-20 pb-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#d4a574] mb-4">موقعنا</h1>
            <p className="text-lg text-[#d4a574]/80">تجربة فاخرة وآمنة في قلب صنعاء</p>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-[#d4a574]/30 h-96">
              <div id="map" className="w-full h-full bg-[#3d2e24]"></div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#3d2e24] rounded-xl p-6 shadow-lg border border-[#d4a574]/30">
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#d4a574] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-[#d4a574] mb-2">العنوان</h3>
                    <p className="text-[#d4a574]/80">صنعاء - حي الروضة</p>
                    <p className="text-[#d4a574]/80">اليمن</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#3d2e24] rounded-xl p-6 shadow-lg border border-[#d4a574]/30">
                <div className="flex items-start gap-4">
                  <Phone className="text-[#d4a574] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-[#d4a574] mb-2">الهاتف</h3>
                    <p className="text-[#d4a574]/80">+967 1 234 5678</p>
                    <p className="text-[#d4a574]/80">+967 123 456 789</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#3d2e24] rounded-xl p-6 shadow-lg border border-[#d4a574]/30">
                <div className="flex items-start gap-4">
                  <Mail className="text-[#d4a574] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-[#d4a574] mb-2">البريد الإلكتروني</h3>
                    <p className="text-[#d4a574]/80">info@boulevard.com</p>
                    <p className="text-[#d4a574]/80">contact@boulevard.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#3d2e24] rounded-xl p-6 shadow-lg border border-[#d4a574]/30">
                <div className="flex items-start gap-4">
                  <Clock className="text-[#d4a574] flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-[#d4a574] mb-2">ساعات العمل</h3>
                    <p className="text-[#d4a574]/80">من 10 صباحاً</p>
                    <p className="text-[#d4a574]/80">إلى 12 منتصف الليل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[#3d2e24] rounded-xl p-8 shadow-lg border border-[#d4a574]/30">
              <h2 className="text-2xl font-bold text-[#d4a574] mb-4">كيفية الوصول إلينا</h2>
              <p className="text-[#d4a574]/80 mb-4">
                يمكنك الوصول إلينا بسهولة من خلال الخريطة أعلاه، أو استخدام تطبيق Google Maps والبحث عن Boulevard Sanaa.
              </p>
              <a
                href="https://maps.app.goo.gl/Vg3cbhDDHSeBNdEq7?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-[#d4a574] text-[#2a1f15] font-bold rounded-lg hover:bg-[#c99a5f] transition-colors"
              >
                فتح في Google Maps
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
