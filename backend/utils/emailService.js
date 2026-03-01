const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── Lucide-style inline SVG icons (email-safe) ───────────────────────────────
const icons = {
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  gift: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,

  // Section / inline icons
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
};

// ── Per-status theme config ───────────────────────────────────────────────────
const statusConfig = {
  pending: {
    subject: '⏳ Order Received - Awaiting Confirmation',
    message: 'We have received your order and it is currently pending confirmation. We\'ll notify you as soon as it\'s confirmed.',
    icon: icons.clock,
    gradient: 'linear-gradient(145deg,#d97706 0%,#f59e0b 60%,#fbbf24 100%)',
    accent: '#d97706',
    accentLight: '#fffbeb',
    accentBorder: '#fde68a',
    badge: '#d97706',
    badgeBg: '#fef3c7',
  },
  paid: {
    subject: '✅ Payment Confirmed',
    message: 'Your payment has been successfully confirmed. Thank you for your purchase! We\'ll start processing your order right away.',
    icon: icons.checkCircle,
    gradient: 'linear-gradient(145deg,#059669 0%,#10b981 60%,#34d399 100%)',
    accent: '#059669',
    accentLight: '#ecfdf5',
    accentBorder: '#6ee7b7',
    badge: '#059669',
    badgeBg: '#d1fae5',
  },
  processing: {
    subject: '⚙️ Order is Being Processed',
    message: 'Your order is now being processed by our team. We\'re preparing your frames with care and attention to detail.',
    icon: icons.settings,
    gradient: 'linear-gradient(145deg,#2563eb 0%,#3b82f6 60%,#60a5fa 100%)',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    accentBorder: '#93c5fd',
    badge: '#2563eb',
    badgeBg: '#dbeafe',
  },
  shipped: {
    subject: '📦 Order Shipped!',
    message: 'Great news! Your order has been dispatched and is on its way to you. Sit tight — your frames will arrive soon!',
    icon: icons.truck,
    gradient: 'linear-gradient(145deg,#7c3aed 0%,#8b5cf6 60%,#a78bfa 100%)',
    accent: '#7c3aed',
    accentLight: '#f5f3ff',
    accentBorder: '#c4b5fd',
    badge: '#7c3aed',
    badgeBg: '#ede9fe',
  },
  delivered: {
    subject: '🎉 Order Delivered Successfully',
    message: 'Your order has been delivered successfully. We hope you absolutely love your new frames!',
    icon: icons.gift,
    gradient: 'linear-gradient(145deg,#0891b2 0%,#06b6d4 60%,#22d3ee 100%)',
    accent: '#0891b2',
    accentLight: '#ecfeff',
    accentBorder: '#67e8f9',
    badge: '#0891b2',
    badgeBg: '#cffafe',
  },
  cancelled: {
    subject: '❌ Order Cancelled',
    message: 'Your order has been cancelled. If this was a mistake or you have any questions, please don\'t hesitate to reach out to our support team.',
    icon: icons.xCircle,
    gradient: 'linear-gradient(145deg,#b91c1c 0%,#dc2626 60%,#ef4444 100%)',
    accent: '#dc2626',
    accentLight: '#fef2f2',
    accentBorder: '#fca5a5',
    badge: '#dc2626',
    badgeBg: '#fee2e2',
  },
};

// ── Email template builder ────────────────────────────────────────────────────
const getEmailTemplate = (status, orderDetails) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  const orderId = orderDetails.orderId || orderDetails._id;
  const totalAmt = Number(orderDetails.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const orderDate = orderDetails.createdAt
    ? new Date(orderDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const customerName = orderDetails.user?.name || 'Customer';

  const itemRows = (orderDetails.items || []).map((item) => `
    <tr>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;">
        <div style="font-size:14px;font-weight:600;color:#1f2937;">${icons.package}${item.product?.title || 'Frame Item'}</div>
      </td>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
        <span style="font-size:13px;color:#6b7280;">Qty: ${item.quantity || 1}</span>
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>${cfg.subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

            <!-- ── HEADER ── -->
            <tr>
              <td style="background:${cfg.gradient};padding:44px 32px 36px;text-align:center;">
                ${cfg.icon}
                <h1 style="color:#ffffff;margin:16px 0 6px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;letter-spacing:0.2px;">Order <strong style="color:#fff;">#${orderId}</strong></p>
                <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:50px;padding:6px 20px;">
                  <span style="color:#fff;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">${status}</span>
                </div>
              </td>
            </tr>

            <!-- ── BODY ── -->
            <tr>
              <td style="padding:36px 32px;">

                <!-- Greeting -->
                <h2 style="margin:0 0 8px;font-size:20px;color:#1f2937;">Hello, ${customerName}!</h2>
                <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.75;">${cfg.message}</p>

                <!-- Status Badge -->
                <div style="text-align:center;margin-bottom:30px;">
                  <span style="display:inline-block;background:${cfg.badgeBg};color:${cfg.badge};padding:10px 28px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid ${cfg.accentBorder};">
                    ${status.toUpperCase()}
                  </span>
                </div>

                <!-- Order Details -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ${cfg.accentBorder};">
                  ${icons.shoppingBag} Order Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Order ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:${cfg.accent};border-bottom:1px solid #f3f4f6;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Order Date</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${orderDate}</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Total Items</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${orderDetails.items?.length || 0} item(s)</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Total Amount</td>
                    <td style="padding:12px 18px;font-size:17px;font-weight:800;color:${cfg.accent};">₹${totalAmt}</td>
                  </tr>
                </table>

                <!-- Items List -->
                ${orderDetails.items?.length > 0 ? `
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ${cfg.accentBorder};">
                  ${icons.package} Items in Your Order
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid ${cfg.accentBorder};border-radius:12px;overflow:hidden;margin-bottom:28px;">
                  ${itemRows}
                </table>
                ` : ''}

                <!-- Shipped notice -->
                ${status === 'shipped' ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:${cfg.accentLight};border-left:4px solid ${cfg.accent};border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:${cfg.accent};margin-bottom:6px;">${icons.mapPin} Track Your Delivery</div>
                      <div style="font-size:13px;color:#374151;line-height:1.7;">Your order is on its way! Expected delivery within <strong>3–5 business days</strong>. You'll receive updates as your package moves.</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Delivered notice -->
                ${status === 'delivered' ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:${cfg.accentLight};border-left:4px solid ${cfg.accent};border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:${cfg.accent};margin-bottom:6px;">${icons.star} Share Your Experience</div>
                      <div style="font-size:13px;color:#374151;line-height:1.7;">We hope you love your frames! Your feedback means the world to us. Consider leaving a review — it helps us serve you better.</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Support -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 24px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Questions or concerns? We're always here for you.</div>
                      <a href="mailto:support@yourstore.com" style="color:#6366f1;font-weight:700;text-decoration:none;font-size:14px;">${icons.mail} support@yourstore.com</a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- ── FOOTER ── -->
            <tr>
              <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #f1f5f9;">
                <p style="margin:0;font-size:12px;color:#9ca3af;letter-spacing:0.3px;">© ${new Date().getFullYear()} <strong style="color:#6b7280;">Prem Color Lab</strong>. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>

    </body>
    </html>
  `;

  return {
    subject: `${cfg.subject} - Order #${orderId}`,
    html,
  };
};

// ── Send email function ───────────────────────────────────────────────────────
const sendOrderStatusEmail = async (userEmail, status, orderDetails) => {
  try {
    const emailContent = getEmailTemplate(status, orderDetails);

    const mailOptions = {
      from: `"Frame Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderStatusEmail };