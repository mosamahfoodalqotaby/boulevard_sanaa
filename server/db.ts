import { InsertUser, users, customers, bookings, activityLogs, feedback, qrContent, packages, invoices } from "../drizzle/schema";
import { ENV } from './_core/env';

// في الذاكرة التخزين - بدون قاعدة بيانات خارجية
const inMemoryData = {
  users: new Map<number, any>(),
  customers: new Map<number, any>(),
  bookings: new Map<number, any>(),
  activityLogs: new Map<number, any>(),
  feedback: new Map<number, any>(),
  qrContent: new Map<number, any>(),
  packages: new Map<number, any>(),
  invoices: new Map<number, any>(),
};

let nextIds = {
  users: 1,
  customers: 1,
  bookings: 1,
  activityLogs: 1,
  feedback: 1,
  qrContent: 1,
  packages: 1,
  invoices: 1,
};

let _db: any = null;

// Initialize in-memory database
export async function getDb() {
  if (!_db) {
    try {
      console.log("[Database] Using In-Memory Storage (Development Mode)");
      _db = {
        insert: (table: any) => ({
          values: (data: any) => {
            const tableName = table._.name;
            const id = nextIds[tableName as keyof typeof nextIds]++;
            const record = { id, ...data };
            inMemoryData[tableName as keyof typeof inMemoryData].set(id, record);
            console.log(`[Database] Inserted into ${tableName}:`, record);
            return { insertId: id, changes: 1 };
          }
        }),
        select: (table: any) => ({
          from: (fromTable: any) => ({
            where: (condition: any) => {
              const tableName = fromTable._.name;
              const records = Array.from(inMemoryData[tableName as keyof typeof inMemoryData].values());
              return records;
            },
            limit: (limit: number) => {
              const tableName = fromTable._.name;
              const records = Array.from(inMemoryData[tableName as keyof typeof inMemoryData].values());
              return records.slice(0, limit);
            }
          }),
          execute: () => {
            const tableName = table._.name;
            return Array.from(inMemoryData[tableName as keyof typeof inMemoryData].values());
          }
        })
      };
      
      console.log("[Database] Connected to In-Memory Storage");
    } catch (error) {
      console.error("[Database] Failed to initialize database:", error);
      _db = null;
    }
  }
  return _db;
}

// Initialize database tables on startup
export async function initializeDatabase() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Database] Cannot initialize: database not available");
      return;
    }
    
    console.log("[Database] Database initialized successfully");
  } catch (error) {
    console.error("[Database] Failed to initialize database:", error);
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const existingUser = Array.from(inMemoryData.users.values()).find(u => u.openId === user.openId);
  
  if (existingUser) {
    Object.assign(existingUser, user);
    console.log("[Database] Updated user:", existingUser);
  } else {
    const id = nextIds.users++;
    const newUser = { id, ...user, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.users.set(id, newUser);
    console.log("[Database] Created user:", newUser);
  }
}

export async function getUserByOpenId(openId: string) {
  const user = Array.from(inMemoryData.users.values()).find(u => u.openId === openId);
  return user || undefined;
}

export async function getUserById(id: number) {
  return inMemoryData.users.get(id) || undefined;
}

// دوال العملاء (Customers)
export async function createCustomer(data: any) {
  try {
    const id = nextIds.customers++;
    const customer = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.customers.set(id, customer);
    console.log("[Database] Created customer:", customer);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create customer:", error);
    throw error;
  }
}

export async function getCustomerByQRCode(qrCode: string) {
  try {
    const customer = Array.from(inMemoryData.customers.values()).find(c => c.qrCode === qrCode);
    return customer || undefined;
  } catch (error) {
    console.error("[Database] Failed to get customer by QR code:", error);
    return undefined;
  }
}

export async function getCustomerById(id: number) {
  const customer = inMemoryData.customers.get(id);
  return customer || undefined;
}

// دوال الحجوزات (Bookings)
export async function createBooking(data: any) {
  try {
    const id = nextIds.bookings++;
    const booking = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.bookings.set(id, booking);
    console.log("[Database] Created booking:", booking);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create booking:", error);
    throw error;
  }
}

export async function getBookingsByCustomerId(customerId: number) {
  try {
    const bookings = Array.from(inMemoryData.bookings.values()).filter(b => b.customerId === customerId);
    return bookings;
  } catch (error) {
    console.error("[Database] Failed to get bookings:", error);
    return [];
  }
}

export async function getAllBookings() {
  try {
    return Array.from(inMemoryData.bookings.values());
  } catch (error) {
    console.error("[Database] Failed to get all bookings:", error);
    return [];
  }
}

export async function getBookingById(id: number) {
  try {
    const booking = inMemoryData.bookings.get(id);
    return booking || undefined;
  } catch (error) {
    console.error("[Database] Failed to get booking:", error);
    return undefined;
  }
}

export async function updateBooking(id: number, data: any) {
  try {
    const booking = inMemoryData.bookings.get(id);
    if (booking) {
      Object.assign(booking, data, { updatedAt: new Date() });
      console.log("[Database] Updated booking:", booking);
      return booking;
    }
    return undefined;
  } catch (error) {
    console.error("[Database] Failed to update booking:", error);
    throw error;
  }
}

export async function deleteBooking(id: number) {
  try {
    const deleted = inMemoryData.bookings.delete(id);
    console.log("[Database] Deleted booking:", id);
    return deleted;
  } catch (error) {
    console.error("[Database] Failed to delete booking:", error);
    throw error;
  }
}

// دوال الفواتير (Invoices)
export async function createInvoice(data: any) {
  try {
    const id = nextIds.invoices++;
    const invoice = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.invoices.set(id, invoice);
    console.log("[Database] Created invoice:", invoice);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create invoice:", error);
    throw error;
  }
}

export async function getInvoicesByBookingId(bookingId: number) {
  try {
    const invoices = Array.from(inMemoryData.invoices.values()).filter(i => i.bookingId === bookingId);
    return invoices;
  } catch (error) {
    console.error("[Database] Failed to get invoices:", error);
    return [];
  }
}

export async function getInvoiceById(id: number) {
  try {
    const invoice = inMemoryData.invoices.get(id);
    return invoice || undefined;
  } catch (error) {
    console.error("[Database] Failed to get invoice:", error);
    return undefined;
  }
}

// دوال سجل العمليات (Activity Log)
export async function logActivity(data: any) {
  try {
    const id = nextIds.activityLogs++;
    const log = {
      id,
      userId: data.userId || 1,
      action: data.action || 'unknown',
      entityType: data.entityType || '',
      entityId: data.entityId || null,
      details: data.details || '',
      createdAt: new Date(),
    };
    inMemoryData.activityLogs.set(id, log);
    console.log("[Database] Logged activity:", log);
    return id;
  } catch (error) {
    console.error("[Database] Failed to log activity:", error);
    throw error;
  }
}

export async function getActivityLogs(limit: number = 100) {
  try {
    const logs = Array.from(inMemoryData.activityLogs.values()).slice(-limit);
    return logs;
  } catch (error) {
    console.error("[Database] Failed to get activity logs:", error);
    return [];
  }
}

// دوال الملاحظات (Feedback)
export async function createFeedback(data: any) {
  try {
    const id = nextIds.feedback++;
    const feedbackRecord = { id, ...data, createdAt: new Date() };
    inMemoryData.feedback.set(id, feedbackRecord);
    console.log("[Database] Created feedback:", feedbackRecord);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create feedback:", error);
    throw error;
  }
}

export async function getFeedback() {
  try {
    return Array.from(inMemoryData.feedback.values());
  } catch (error) {
    console.error("[Database] Failed to get feedback:", error);
    return [];
  }
}

// دوال محتوى QR (QR Content)
export async function createQRContent(data: any) {
  try {
    const id = nextIds.qrContent++;
    const qr = { id, ...data, createdAt: new Date() };
    inMemoryData.qrContent.set(id, qr);
    console.log("[Database] Created QR content:", qr);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create QR content:", error);
    throw error;
  }
}

export async function getQRContent(qrCode: string) {
  try {
    const qr = Array.from(inMemoryData.qrContent.values()).find(q => q.qrCode === qrCode);
    return qr || undefined;
  } catch (error) {
    console.error("[Database] Failed to get QR content:", error);
    return undefined;
  }
}

// دوال الحزم (Packages)
export async function createPackage(data: any) {
  try {
    const id = nextIds.packages++;
    const pkg = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryData.packages.set(id, pkg);
    console.log("[Database] Created package:", pkg);
    return id;
  } catch (error) {
    console.error("[Database] Failed to create package:", error);
    throw error;
  }
}

export async function getAllPackages() {
  try {
    return Array.from(inMemoryData.packages.values());
  } catch (error) {
    console.error("[Database] Failed to get packages:", error);
    return [];
  }
}

export async function getPackageById(id: number) {
  try {
    const pkg = inMemoryData.packages.get(id);
    return pkg || undefined;
  } catch (error) {
    console.error("[Database] Failed to get package:", error);
    return undefined;
  }
}

// دالة للحصول على الإحصائيات
export async function getStatistics() {
  try {
    const bookings = Array.from(inMemoryData.bookings.values());
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    
    return {
      totalBookings,
      totalRevenue,
      confirmedBookings,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    };
  } catch (error) {
    console.error("[Database] Failed to get statistics:", error);
    return {
      totalBookings: 0,
      totalRevenue: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
    };
  }
}
