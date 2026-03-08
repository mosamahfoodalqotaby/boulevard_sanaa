import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  serviceType: 'chalet' | 'hall' | 'both';
  checkInDate: string;
  eventDate?: string;
  guestCount: number;
  totalPrice?: string;
  paidAmount?: string;
  remainingAmount?: string;
  specialRequests?: string;
  additionalDetails?: string;
  generateQRCode?: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// تحويل ملف إلى base64
async function fileToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

// بناء حقل بيانات بشكل أفقي مع فاصل نقطي - في الوسط
function buildField(label: string, value: string): string {
  return `
    <div style="display:flex;align-items:center;margin-bottom:10px;font-size:12px;direction:rtl;justify-content:center;">
      <span style="font-weight:bold;color:#8b6f47;min-width:130px;text-align:right;flex-shrink:0;">${label} /</span>
      <span style="width:180px;border-bottom:1px dashed rgba(139,111,71,0.4);margin:0 8px;min-height:14px;"></span>
      <span style="color:#6b5538;text-align:right;min-width:100px;word-break:break-word;">${value}</span>
    </div>
  `;
}

export async function printBookingPDF(booking: Booking) {
  try {
    // توليد QR Code
    const qrCodeUrl = `${window.location.origin}/qr-code-scanner?id=${encodeURIComponent(booking.id)}&name=${encodeURIComponent(booking.name)}`;
    
    let qrCodeImage = '';
    if (booking.generateQRCode) {
      qrCodeImage = await QRCode.toDataURL(
        qrCodeUrl,
        {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 250,
          margin: 1,
          color: { dark: '#000000', light: '#FFFFFF' },
        }
      );
    }

    // تحويل الشعار والخطوط إلى base64 لضمان ظهورهما في PDF
    const logoBase64 = await fileToBase64('/logo-gold.png');
    // تحميل خط Cairo من CDN
    const cairoRegularBase64 = await fileToBase64('https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/Cairo-Regular_e0244124.ttf');
    const cairoBoldBase64 = await fileToBase64('https://d2xsxph8kpxj0f.cloudfront.net/310519663380986397/ALmxfXzXdGwygXSTLhzNJo/Cairo-Bold_04b1eaa6.ttf');

    const serviceTypeText = booking.serviceType === 'chalet' ? 'شاليه' : booking.serviceType === 'hall' ? 'قاعة' : 'شاليه وقاعة';

    // بناء حقول البيانات
    const dataFields: string[] = [];
    if (booking.name) dataFields.push(buildField('الاسم', booking.name));
    if (booking.serviceType) dataFields.push(buildField('نوع الخدمة', serviceTypeText));
    if (booking.checkInDate) dataFields.push(buildField('تاريخ الحجز', booking.checkInDate));
    if (booking.eventDate) dataFields.push(buildField('تاريخ المناسبة', booking.eventDate));
    if (booking.guestCount) dataFields.push(buildField('عدد الضيوف', `${booking.guestCount} نفر`));
    if (booking.totalPrice) dataFields.push(buildField('المبلغ الإجمالي', `${booking.totalPrice} ريال`));
    if (booking.paidAmount) dataFields.push(buildField('المبلغ المدفوع', `${booking.paidAmount} ريال`));
    if (booking.remainingAmount) dataFields.push(buildField('المبلغ المتبقي', `${booking.remainingAmount} ريال`));
    if (booking.specialRequests) dataFields.push(buildField('طلبات خاصة', booking.specialRequests));
    if (booking.additionalDetails) dataFields.push(buildField('تفاصيل إضافية', booking.additionalDetails));

    // تضمين خط Cairo مباشرة كـ base64 لضمان الربط الصحيح للحروف العربية
    const fontFaceCSS = `
      @font-face {
        font-family: 'Cairo';
        font-weight: 400;
        font-style: normal;
        src: url('${cairoRegularBase64}') format('truetype');
      }
      @font-face {
        font-family: 'Cairo';
        font-weight: 700;
        font-style: normal;
        src: url('${cairoBoldBase64}') format('truetype');
      }
    `;

    const fontFamily = "'Cairo', Arial, Tahoma, sans-serif";

    // بناء صفحة الفاتورة
    const invoicePageHTML = `
      <div style="width:210mm;min-height:296mm;padding:12mm 18mm 15mm 18mm;background:#2a1f15;position:relative;direction:rtl;font-family:${fontFamily};color:#d4a574;box-sizing:border-box;">
        <!-- الشعار بارز في الوسط بحجم مناسب -->
        <div style="text-align:center;margin-bottom:12px;padding-top:8mm;">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="width:140px;height:140px;object-fit:contain;display:inline-block;" />` : ''}
          <div style="font-size:24px;font-weight:bold;color:#8b6f47;margin-top:6px;font-family:${fontFamily};">بوليفارد صنعاء</div>
          <div style="font-size:13px;color:#6b5538;font-weight:bold;font-style:italic;margin-top:2px;">Boulevard Sana'a</div>
        </div>
        <!-- خط زخرفي -->
        <div style="display:flex;align-items:center;margin:12px 0 18px 0;">
          <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8b6f47);"></div>
          <div style="margin:0 12px;font-size:10px;color:#8b6f47;">&#9830;</div>
          <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8b6f47);"></div>
        </div>
        <!-- عنوان الفاتورة -->
        <div style="text-align:center;margin-bottom:18px;">
          <span style="font-size:18px;font-weight:bold;color:#8b6f47;border-bottom:2px solid #8b6f47;padding-bottom:4px;font-family:${fontFamily};">فاتورة حجز</span>
          <div style="font-size:10px;color:#6b5538;margin-top:6px;">رقم الحجز: ${booking.id}</div>
        </div>
        <!-- بيانات الحجز -->
        <div style="background:rgba(42,31,21,0.8);border:1px solid rgba(139,111,71,0.4);border-radius:6px;padding:15px 10mm;margin-bottom:15px;display:flex;flex-direction:column;align-items:center;">
          ${dataFields.join('')}
        </div>
        <!-- خط فاصل زخرفي -->
        <div style="display:flex;align-items:center;margin:12px 0;">
          <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8b6f47);"></div>
          <div style="margin:0 12px;font-size:10px;color:#8b6f47;">&#9830;</div>
          <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8b6f47);"></div>
        </div>
        <!-- شروط وأحكام الحجز -->
        <div style="margin-bottom:10px;">
          <div style="font-size:14px;font-weight:bold;color:#8b6f47;margin-bottom:8px;text-align:center;font-family:${fontFamily};">شروط وأحكام الحجز</div>
          <div style="font-size:9.5px;color:#6b5538;line-height:1.7;text-align:right;">
            <div style="margin-bottom:5px;">&#8226; <strong>تأكيد الحجز:</strong> يعد العربون تأكيداً نهائياً للحجز لضمان حصرية المرفق لكم في التاريخ المحدد، ولا يسترد إلا في حال وجود بديل.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>اكتمال الإجراءات:</strong> لضمان تجربة متكاملة بلا انقطاع، يرجى سداد كامل مبلغ الحجز وتقديم وثيقة السلامة قبل موعد الدخول.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>سلامة المرفق:</strong> يعد الضيف مسؤولاً عن سلامة وتجهيزات المرفق (الأثاث، المسبح، المساحات الخضراء)، ويتم تغطية أي تلفيات ناتجة عن سوء الاستخدام.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>الهوية والخصوصية:</strong> يرجى إبراز الهوية الشخصية عند الدخول وتسليم قائمة بأسماء الضيوف مسبقاً.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>بروتوكول الصوت:</strong> يسمح باستخدام نظام صوتي محدد (سماعتين فقط) مع إيقاف السماعات الخارجية في الأوقات المحددة.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>ميثاق السكينة:</strong> يمنع استخدام الأسلحة أو الألعاب النارية أو أي مواد خطرة داخل المرفق.</div>
            <div style="margin-bottom:5px;">&#8226; <strong>إخلاء المسؤولية:</strong> تخلي إدارة بوليفارد صنعاء مسؤوليتها عن فقدان المقتنيات الشخصية أو الحوادث الناتجة عن سوء الاستخدام.</div>
          </div>
        </div>
        <!-- التذييل -->
        <div style="position:absolute;bottom:10mm;left:18mm;right:18mm;text-align:center;font-size:8px;color:#8b6f47;border-top:1px solid rgba(139,111,71,0.4);padding-top:6px;">Boulevard Sana'a | بوليفارد صنعاء</div>
      </div>
    `;

    // صفحة الباركود (فقط إذا تم اختيار توليد الباركود)
    const barcodePageHTML = (booking.generateQRCode && qrCodeImage) ? `
      <div style="width:210mm;min-height:296mm;padding:20mm;background:#2a1f15;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;direction:rtl;font-family:${fontFamily};color:#d4a574;box-sizing:border-box;page-break-before:always;">
        <!-- الشعار في صفحة الباركود -->
        <div style="text-align:center;margin-bottom:18px;">
          ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="width:120px;height:120px;object-fit:contain;display:inline-block;" />` : ''}
          <div style="font-size:22px;font-weight:bold;color:#8b6f47;margin-top:5px;font-family:${fontFamily};">بوليفارد صنعاء</div>
          <div style="font-size:12px;color:#6b5538;font-weight:bold;font-style:italic;">Boulevard Sana'a</div>
        </div>
        <!-- خط زخرفي -->
        <div style="display:flex;align-items:center;width:70%;margin:10px 0 20px 0;">
          <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8b6f47);"></div>
          <div style="margin:0 12px;font-size:10px;color:#8b6f47;">&#9830;</div>
          <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8b6f47);"></div>
        </div>
        <!-- عنوان QR Code -->
        <div style="font-size:16px;font-weight:bold;color:#8b6f47;text-align:center;margin-bottom:20px;font-family:${fontFamily};">رمز الاستجابة السريعة للحجز</div>
        <!-- QR Code -->
        <div style="border:3px solid #8b6f47;padding:15px;background:#2a1f15;display:inline-flex;align-items:center;justify-content:center;">
          <div style="background:white;padding:10px;display:inline-flex;align-items:center;justify-content:center;">
            <img src="${qrCodeImage}" alt="QR Code" style="width:240px;height:240px;display:block;" />
          </div>
        </div>
        <!-- معلومات الحجز -->
        <div style="text-align:center;margin-top:22px;font-size:11px;color:#8b6f47;">
          ${booking.id ? `<div style="margin-bottom:6px;"><span style="font-weight:bold;">رقم الحجز:</span> ${booking.id}</div>` : ''}
          ${booking.name ? `<div style="margin-bottom:6px;"><span style="font-weight:bold;">اسم الضيف:</span> ${booking.name}</div>` : ''}
          ${booking.checkInDate ? `<div style="margin-bottom:6px;"><span style="font-weight:bold;">تاريخ الحجز:</span> ${booking.checkInDate}</div>` : ''}
          ${booking.serviceType ? `<div style="margin-bottom:6px;"><span style="font-weight:bold;">نوع الخدمة:</span> ${serviceTypeText}</div>` : ''}
        </div>
        <div style="text-align:center;margin-top:18px;font-size:9px;color:#8b6f47;max-width:80%;">امسح رمز الاستجابة السريعة للوصول إلى تفاصيل حجزك والاستمتاع بالامتيازات الحصرية</div>
        <!-- التذييل -->
        <div style="position:absolute;bottom:15mm;left:20mm;right:20mm;text-align:center;font-size:8px;color:#8b6f47;border-top:1px solid rgba(139,111,71,0.4);padding-top:6px;">Boulevard Sana'a | بوليفارد صنعاء</div>
      </div>
    ` : '';

    // بناء HTML الكامل مع تضمين الخط
    // عندما يكون generateQRCode = false، عرض الصفحة الأولى فقط
    const fullHTML = `
      <div style="font-family:${fontFamily};">
        <style>
          ${fontFaceCSS}
          body { font-family: ${fontFamily}; }
        </style>
        ${invoicePageHTML}
        ${booking.generateQRCode ? barcodePageHTML : ''}
      </div>
    `;

    // إنشاء عنصر DOM مرئي مؤقتاً لتوليد PDF
    const wrapper = document.createElement('div');
    wrapper.innerHTML = fullHTML;
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.zIndex = '-9999';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    document.body.appendChild(wrapper);

    // انتظار تحميل الصور والخط
    const images = wrapper.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }));

    // انتظار تحميل خط Google
    try {
      await document.fonts.ready;
    } catch {}

    // انتظار للتأكد من الرسم وتحميل الخط
    await new Promise(resolve => setTimeout(resolve, 1200));

    const contentEl = wrapper.firstElementChild as HTMLElement;

    const opt = {
      margin: 0,
      filename: `booking-${booking.id}.pdf`,
      image: { type: 'png' as const, quality: 0.92 },
      html2canvas: { 
        scale: 1.5, 
        backgroundColor: '#2a1f15', 
        useCORS: true,
        logging: false,
        width: contentEl ? contentEl.scrollWidth : undefined,
        height: contentEl ? contentEl.scrollHeight : undefined,
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all'] as string[] }
    };

    await (html2pdf() as any).set(opt).from(contentEl).save();
    
    // تنظيف
    document.body.removeChild(wrapper);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('حدث خطأ في إنشاء الفاتورة. يرجى المحاولة مرة أخرى.');
  }
}
