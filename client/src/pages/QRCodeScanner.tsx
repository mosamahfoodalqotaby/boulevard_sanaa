import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { X } from 'lucide-react';

interface ScanResult {
  customerName: string;
  bookingId: string;
  phone: string;
  checkInDate: string;
}

interface FormData {
  guestCount: string;
  specialRequests: string;
  notes: string;
  mealPreferences: string;
}

// روابط الصور مرتبة حسب أرقام أسماء الملفات (1, 2, 3, 4)
const QRCodeImages = {
  section1: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/qr-section4-invitation_0e5d79ac.jpeg',
  section2: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/qr-section1-policies_641abc05.jpeg',
  section3: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/qr-section3-membership_796f2529.jpeg',
  section4: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/qr-section2-welcome_67be340d.jpeg',
};

export default function QRCodeScanner() {
  const [location, setLocation] = useLocation();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    guestCount: '',
    specialRequests: '',
    notes: '',
    mealPreferences: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // قراءة المعاملات من الرابط
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('name');
    const phone = params.get('phone');
    const date = params.get('date');

    if (id && name) {
      setScanResult({
        customerName: decodeURIComponent(name),
        bookingId: decodeURIComponent(id),
        phone: phone ? decodeURIComponent(phone) : '',
        checkInDate: date ? decodeURIComponent(date) : '',
      });
    }
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // يمكن إضافة منطق حفظ البيانات هنا
      console.log('Form submitted:', {
        booking: scanResult,
        additionalInfo: formData,
      });

      // إظهار رسالة نجاح
      alert('تم تسجيل معلوماتك بنجاح! شكراً لاختيارك بوليفارد صنعاء');
      
      // إعادة تعيين النموذج
      setFormData({
        guestCount: '',
        specialRequests: '',
        notes: '',
        mealPreferences: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ في تسجيل المعلومات. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setShowForm(false);
    setFormData({
      guestCount: '',
      specialRequests: '',
      notes: '',
      mealPreferences: '',
    });
    setLocation('/qr-code-scanner');
  };

  // صفحة النموذج (بعد الترحيب)
  if (showForm && scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a1f15] via-[#3d2e24] to-[#2a1f15] p-4" dir="rtl">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="flex justify-center mb-4">
              <img src="/logo-gold.png" alt="Boulevard Sana'a" className="h-32 w-auto drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold text-[#d4a574] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
              بوليفارد صنعاء
            </h1>
            <p className="text-[#d4a574] text-lg" style={{ fontFamily: 'Amiri, serif' }}>
              Boulevard Sana'a
            </p>
          </div>

          {/* Form Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#d4a574] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
              معلومات إضافية
            </h2>
            <p className="text-[#a89968] text-lg" style={{ fontFamily: 'Amiri, serif' }}>
              يرجى ملء البيانات التالية لتحسين تجربتك
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="bg-[#3d2e24]/50 border border-[#d4a574]/30 rounded-lg p-8 mb-8">
            {/* Guest Count */}
            <div className="mb-6">
              <label className="block text-[#d4a574] font-bold mb-2 text-right" style={{ fontFamily: 'Amiri, serif' }}>
                عدد الضيوف المتوقع
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleFormChange}
                placeholder="أدخل عدد الضيوف"
                className="w-full bg-[#2a1f15] border border-[#d4a574] rounded px-4 py-2 text-[#d4a574] text-right placeholder-[#a89968]"
                style={{ fontFamily: 'Amiri, serif' }}
              />
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block text-[#d4a574] font-bold mb-2 text-right" style={{ fontFamily: 'Amiri, serif' }}>
                طلبات خاصة
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleFormChange}
                placeholder="أخبرنا عن أي طلبات خاصة لديك"
                rows={3}
                className="w-full bg-[#2a1f15] border border-[#d4a574] rounded px-4 py-2 text-[#d4a574] text-right placeholder-[#a89968] resize-none"
                style={{ fontFamily: 'Amiri, serif' }}
              />
            </div>

            {/* Meal Preferences */}
            <div className="mb-6">
              <label className="block text-[#d4a574] font-bold mb-2 text-right" style={{ fontFamily: 'Amiri, serif' }}>
                تفضيلات الطعام
              </label>
              <textarea
                name="mealPreferences"
                value={formData.mealPreferences}
                onChange={handleFormChange}
                placeholder="أخبرنا عن تفضيلاتك الغذائية"
                rows={3}
                className="w-full bg-[#2a1f15] border border-[#d4a574] rounded px-4 py-2 text-[#d4a574] text-right placeholder-[#a89968] resize-none"
                style={{ fontFamily: 'Amiri, serif' }}
              />
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <label className="block text-[#d4a574] font-bold mb-2 text-right" style={{ fontFamily: 'Amiri, serif' }}>
                ملاحظات إضافية
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="أي ملاحظات أخرى تود إضافتها"
                rows={3}
                className="w-full bg-[#2a1f15] border border-[#d4a574] rounded px-4 py-2 text-[#d4a574] text-right placeholder-[#a89968] resize-none"
                style={{ fontFamily: 'Amiri, serif' }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d4a574] hover:bg-[#c9945f] disabled:bg-[#a89968] text-[#2a1f15] font-bold py-3 px-8 rounded-lg transition-all"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ المعلومات'}
              </button>
              <button
                type="button"
                onClick={resetScan}
                className="bg-transparent border border-[#d4a574] hover:bg-[#3d2e24] text-[#d4a574] font-bold py-3 px-8 rounded-lg transition-all"
                style={{ fontFamily: 'Amiri, serif' }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // صفحة الترحيب (بعد قراءة الباركود)
  if (scanResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a1f15] via-[#3d2e24] to-[#2a1f15] p-4" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="flex justify-center mb-4">
              <img src="/logo-gold.png" alt="Boulevard Sana'a" className="h-32 w-auto drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold text-[#d4a574] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
              بوليفارد صنعاء
            </h1>
            <p className="text-[#d4a574] text-xl" style={{ fontFamily: 'Amiri, serif' }}>
              Boulevard Sana'a
            </p>
          </div>

          {/* Customer Name */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#d4a574] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
              أهلاً وسهلاً
            </h2>
            <p className="text-4xl font-bold text-[#c9945f] mb-4" style={{ fontFamily: 'Amiri, serif' }}>
              {scanResult.customerName}
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mx-auto"></div>
          </div>

          {/* Content Sections - صور بدل النصوص */}
          <div className="space-y-0">
            {/* Section 1 - الرسالة الترحيبية */}
            <div className="overflow-hidden">
              <img
                src={QRCodeImages.section1}
                alt="ميثاق الود - الرسالة الترحيبية"
                className="w-full h-auto object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Section 2 - رحلة العبور */}
            <div className="overflow-hidden">
              <img
                src={QRCodeImages.section2}
                alt="رحلة العبور نحو نخبة النخبة"
                className="w-full h-auto object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Section 3 - حالات تجميد العضوية */}
            <div className="overflow-hidden">
              <img
                src={QRCodeImages.section3}
                alt="حالات تجميد العضوية"
                className="w-full h-auto object-contain"
                style={{ display: 'block' }}
              />
            </div>

            {/* Section 4 - الدعوة الرسمية */}
            <div className="overflow-hidden">
              <img
                src={QRCodeImages.section4}
                alt="دعوة رسمية إلى أصحاب المقام الرفيع"
                className="w-full h-auto object-contain"
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-12 mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#d4a574] hover:bg-[#c9945f] text-[#2a1f15] font-bold py-3 px-8 rounded-lg transition-all"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              إضافة معلومات
            </button>
            <button
              onClick={resetScan}
              className="flex items-center gap-2 bg-transparent border border-[#d4a574] hover:bg-[#3d2e24] text-[#d4a574] font-bold py-3 px-8 rounded-lg transition-all"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              <X className="w-5 h-5" />
              مسح جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  // صفحة فارغة (لم يتم مسح أي باركود)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f15] via-[#3d2e24] to-[#2a1f15] flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo-gold.png" alt="Boulevard Sana'a" className="h-32 w-auto drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-bold text-[#d4a574] mb-2" style={{ fontFamily: 'Amiri, serif' }}>
          بوليفارد صنعاء
        </h1>
        <p className="text-[#d4a574] text-lg mb-8" style={{ fontFamily: 'Amiri, serif' }}>
          Boulevard Sana'a
        </p>
        <p className="text-[#a89968] text-lg" style={{ fontFamily: 'Amiri, serif' }}>
          يرجى مسح الباركود من الفاتورة المطبوعة
        </p>
      </div>
    </div>
  );
}
