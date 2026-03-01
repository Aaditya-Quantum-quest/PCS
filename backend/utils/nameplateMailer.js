// utils/nameplateMailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── Lucide-style inline SVG icons (email-safe) ───────────────────────────────
const icons = {
  // Header icons per status
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  checkCircleLg: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  gift: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  tag: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="#ffffff"/></svg>`,

  // Section icons (inline)
  package: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  palette: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><circle cx="13.5" cy="6.5" r=".5" fill="${c}"/><circle cx="17.5" cy="10.5" r=".5" fill="${c}"/><circle cx="8.5" cy="7.5" r=".5" fill="${c}"/><circle cx="6.5" cy="12.5" r=".5" fill="${c}"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  mapPin: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  navigation: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  star: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  image: (c = '#9ca3af') => `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
};

// ── Per-status theme config ───────────────────────────────────────────────────
const statusConfig = {
  pending: {
    subject: '⏳ Nameplate Order Received - Awaiting Confirmation',
    message: "We've received your nameplate order and it's currently pending confirmation. We'll notify you as soon as it's confirmed.",
    headerIcon: icons.clock,
    gradient: 'linear-gradient(145deg,#d97706 0%,#f59e0b 60%,#fbbf24 100%)',
    accent: '#d97706',
    accentLight: '#fffbeb',
    accentBorder: '#fde68a',
    badge: '#d97706',
    badgeBg: '#fef3c7',
  },
  confirmed: {
    subject: '✅ Nameplate Order Confirmed',
    message: "Your nameplate order has been confirmed and will be processed soon. Our team is getting everything ready!",
    headerIcon: icons.checkCircleLg,
    gradient: 'linear-gradient(145deg,#059669 0%,#10b981 60%,#34d399 100%)',
    accent: '#059669',
    accentLight: '#ecfdf5',
    accentBorder: '#6ee7b7',
    badge: '#059669',
    badgeBg: '#d1fae5',
  },
  processing: {
    subject: '⚙️ Your Nameplate is Being Created',
    message: "Great news! Our artisans are now handcrafting your custom nameplate with care and precision.",
    headerIcon: icons.settings,
    gradient: 'linear-gradient(145deg,#2563eb 0%,#3b82f6 60%,#60a5fa 100%)',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    accentBorder: '#93c5fd',
    badge: '#2563eb',
    badgeBg: '#dbeafe',
  },
  shipped: {
    subject: '📦 Your Nameplate Has Been Shipped!',
    message: "Your custom nameplate has been dispatched and is on its way to you. It'll be with you soon!",
    headerIcon: icons.truck,
    gradient: 'linear-gradient(145deg,#7c3aed 0%,#8b5cf6 60%,#a78bfa 100%)',
    accent: '#7c3aed',
    accentLight: '#f5f3ff',
    accentBorder: '#c4b5fd',
    badge: '#7c3aed',
    badgeBg: '#ede9fe',
  },
  delivered: {
    subject: '🎉 Nameplate Delivered Successfully',
    message: "Your nameplate has been delivered! We hope you absolutely love how it turned out.",
    headerIcon: icons.gift,
    gradient: 'linear-gradient(145deg,#0891b2 0%,#06b6d4 60%,#22d3ee 100%)',
    accent: '#0891b2',
    accentLight: '#ecfeff',
    accentBorder: '#67e8f9',
    badge: '#0891b2',
    badgeBg: '#cffafe',
  },
  cancelled: {
    subject: '❌ Nameplate Order Cancelled',
    message: "Your nameplate order has been cancelled. If this was a mistake or you have any questions, our support team is ready to help.",
    headerIcon: icons.xCircle,
    gradient: 'linear-gradient(145deg,#b91c1c 0%,#dc2626 60%,#ef4444 100%)',
    accent: '#dc2626',
    accentLight: '#fef2f2',
    accentBorder: '#fca5a5',
    badge: '#dc2626',
    badgeBg: '#fee2e2',
  },
};

// ── Template builder ──────────────────────────────────────────────────────────
const getNameplateEmailTemplate = (status, orderDetails) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  const orderId = orderDetails.orderId || orderDetails._id;
  const orderDate = orderDetails.createdAt
    ? new Date(orderDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const totalAmt = Number(orderDetails.pricing?.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const customerName = orderDetails.customer?.firstName || 'Customer';

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

            <!-- HEADER -->
            <tr>
              <td style="background:${cfg.gradient};padding:44px 32px 36px;text-align:center;">
                ${cfg.headerIcon}
                <h1 style="color:#ffffff;margin:16px 0 6px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Custom Nameplate Update</h1>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Order <strong style="color:#fff;">#${orderId}</strong></p>
                <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:50px;padding:6px 20px;">
                  <span style="color:#fff;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">${status}</span>
                </div>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:36px 32px;">

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
                  ${icons.package(cfg.accent)} Order Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Order ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:${cfg.accent};border-bottom:1px solid #f3f4f6;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Size</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${orderDetails.size?.name || 'N/A'} &nbsp;·&nbsp; ${orderDetails.size?.dimensions || 'N/A'}</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Order Date</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Total Amount</td>
                    <td style="padding:12px 18px;font-size:17px;font-weight:800;color:${cfg.accent};">₹${totalAmt}</td>
                  </tr>
                </table>

                <!-- Design Preview -->
                ${orderDetails.design?.customizedImage ? `
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ${cfg.accentBorder};">
                  ${icons.palette(cfg.accent)} Your Custom Design
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid ${cfg.accentBorder};border-radius:12px;overflow:hidden;margin-bottom:28px;">
                  <tr>
                    <td style="padding:20px;text-align:center;">
                      <img src="cid:nameplateDesign" alt="Custom Nameplate Design" style="max-width:100%;height:auto;border:1.5px solid #e5e7eb;border-radius:10px;" />
                      <div style="margin-top:10px;font-size:12px;color:#9ca3af;">${icons.image('#9ca3af')} Your submitted nameplate design</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Shipped tracking -->
                ${status === 'shipped' && orderDetails.shipping?.trackingNumber ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:${cfg.accentLight};border-left:4px solid ${cfg.accent};border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:${cfg.accent};margin-bottom:8px;">${icons.navigation(cfg.accent)} Track Your Delivery</div>
                      <div style="font-size:13px;color:#374151;line-height:1.75;">
                        Tracking Number: <strong>${orderDetails.shipping.trackingNumber}</strong><br>
                        Estimated Delivery: <strong>${orderDetails.shipping?.estimatedDelivery ? new Date(orderDetails.shipping.estimatedDelivery).toLocaleDateString('en-IN') : '3–5 business days'}</strong>
                      </div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Delivered review nudge -->
                ${status === 'delivered' ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:${cfg.accentLight};border-left:4px solid ${cfg.accent};border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:${cfg.accent};margin-bottom:8px;">${icons.star(cfg.accent)} Share Your Experience</div>
                      <div style="font-size:13px;color:#374151;line-height:1.75;">We hope you love your custom nameplate! Share a photo with us — we'd love to see it displayed in your home.</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Shipping Address -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid ${cfg.accentBorder};">
                  ${icons.mapPin(cfg.accent)} Shipping Address
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 20px;font-size:14px;color:#374151;line-height:1.8;">
                      ${orderDetails.shippingAddress?.flatHouse || ''}<br>
                      ${orderDetails.shippingAddress?.areaStreet || ''}<br>
                      ${orderDetails.shippingAddress?.townCity || ''}, ${orderDetails.shippingAddress?.state || ''} – ${orderDetails.shippingAddress?.pinCode || ''}
                    </td>
                  </tr>
                </table>

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

            <!-- FOOTER -->
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

// ── Send function ─────────────────────────────────────────────────────────────
const sendNameplateStatusEmail = async (userEmail, status, orderDetails) => {
  try {
    const emailContent = getNameplateEmailTemplate(status, orderDetails);

    // Prepare attachments array
    const attachments = [];
    let hasCustomImage = true;

    // If there's a base64 image, attach it
    if (orderDetails.design?.customizedImage) {
      const base64Data = orderDetails.design.customizedImage.replace(/^data:image\/\w+;base64,/, '');

      attachments.push({
        filename: 'nameplate-design.png',
        content: base64Data,
        encoding: 'base64',
        cid: 'nameplateDesign' // Content ID for referencing in HTML
      });

      hasCustomImage = true;
    }

    const mailOptions = {
      from: `"Nameplate Store" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Nameplate status email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendNameplateStatusEmail };