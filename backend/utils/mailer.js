const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Lucide-style inline SVG icons (email-safe) ───────────────────────────────
const icons = {
  // Header
  partyPopper: `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,

  // Section icons
  package: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  palette: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><circle cx="13.5" cy="6.5" r=".5" fill="${c}"/><circle cx="17.5" cy="10.5" r=".5" fill="${c}"/><circle cx="8.5" cy="7.5" r=".5" fill="${c}"/><circle cx="6.5" cy="12.5" r=".5" fill="${c}"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  ruler: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>`,
  tag: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="${c}"/></svg>`,
  mapPin: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  user: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  alertTriangle: (c = '#dc2626') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  checkCircle: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  type: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
};

const sendOrderConfirmation = async (order) => {
  const money = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team.zentrixinfotech@gmail.com';

  try {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    const totalAmount = money(order.pricing?.total || order.payment?.amount || 0);

    // ── Design detail rows (shared) ──────────────────────────────────────
    const buildDesignRows = () => {
      const design = order.design;
      let rows = `
                <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:38%;border-bottom:1px solid #f3f4f6;">Design Type</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">Custom Nameplate Design</td>
                </tr>
            `;

      if (design.customizedImage) {
        rows += `
                <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Custom Image</td>
                    <td style="padding:12px 18px;border-bottom:1px solid #f3f4f6;">
                        <span style="color:#059669;font-size:13px;">${icons.checkCircle('#059669')} Uploaded &amp; Processed</span>
                    </td>
                </tr>
                `;
      }

      if (design.backgroundImage) {
        rows += `
                <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Background</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${icons.checkCircle('#059669')} Background Applied</td>
                </tr>
                `;
      }

      if (design.texts && design.texts.length > 0) {
        design.texts.forEach((text, index) => {
          rows += `
                    <tr style="${index % 2 === 0 ? '' : 'background:#f9fafb;'}">
                        <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">
                            ${icons.type('#6366f1')} Text ${index + 1}
                        </td>
                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">
                            <strong style="color:#4f46e5;">"${text.content}"</strong><br>
                            <span style="font-size:12px;color:#9ca3af;">${text.fontSize}px &nbsp;·&nbsp; ${text.color}</span>
                        </td>
                    </tr>
                    `;
        });
      }

      return rows;
    };

    // ── CUSTOMER EMAIL ────────────────────────────────────────────────────
    const customerEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>Order Confirmed – Prem Color Lab</title>
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:linear-gradient(145deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%);padding:44px 32px 36px;text-align:center;">
                                ${icons.partyPopper}
                                <h1 style="color:#ffffff;margin:16px 0 6px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Order Confirmed!</h1>
                                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Thank you for choosing <strong style="color:#fff;">Prem Color Lab</strong></p>
                                <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:50px;padding:7px 22px;">
                                    <span style="color:#fff;font-size:13px;font-weight:600;">Order #${order.orderId}</span>
                                </div>
                            </td>
                        </tr>

                        <!-- BODY -->
                        <tr>
                            <td style="padding:36px 32px;">

                                <h2 style="margin:0 0 6px;font-size:20px;color:#1f2937;">Hello, ${order.customer?.firstName || 'Customer'}!</h2>
                                <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.75;">Your custom nameplate order has been successfully placed. We'll keep you updated at every step!</p>

                                <!-- Order Summary -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e0e7ff;">
                                    ${icons.package('#6366f1')} Order Summary
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Order ID</td>
                                        <td style="padding:12px 18px;font-weight:700;color:#6366f1;border-bottom:1px solid #f3f4f6;">#${order.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Order Date</td>
                                        <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${orderDate}</td>
                                    </tr>
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;">Status</td>
                                        <td style="padding:12px 18px;">
                                            <span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:0.5px;">${order.status.toUpperCase()}</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Design Details -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e0e7ff;">
                                    ${icons.palette('#6366f1')} Design Details
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e0e7ff;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                                    ${buildDesignRows()}
                                </table>

                                <!-- Specifications -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e0e7ff;">
                                    ${icons.ruler('#6366f1')} Specifications
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Size</td>
                                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.size?.name || 'N/A'} &nbsp;·&nbsp; ${order.size?.dimensions || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;">Quantity</td>
                                        <td style="padding:12px 18px;color:#1f2937;">1 piece</td>
                                    </tr>
                                </table>

                                <!-- Pricing -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e0e7ff;">
                                    ${icons.tag('#6366f1')} Pricing
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #e0e7ff;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                                    <tr style="background:#eef2ff;">
                                        <td style="padding:16px 18px;font-weight:700;color:#374151;font-size:15px;">Total Amount</td>
                                        <td style="padding:16px 18px;text-align:right;font-size:20px;font-weight:800;color:#4f46e5;">₹${totalAmount}</td>
                                    </tr>
                                </table>

                                <!-- Shipping Address -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #e0e7ff;">
                                    ${icons.mapPin('#6366f1')} Shipping Address
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:12px;margin-bottom:28px;">
                                    <tr>
                                        <td style="padding:18px 20px;font-size:14px;color:#374151;line-height:1.8;">
                                            <strong style="color:#1f2937;">${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong><br>
                                            ${order.shippingAddress?.flatHouse || 'N/A'}<br>
                                            ${order.shippingAddress?.areaStreet || 'N/A'}<br>
                                            ${order.shippingAddress?.townCity || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} – ${order.shippingAddress?.pinCode || 'N/A'}<br>
                                            <span style="margin-top:8px;display:block;"><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</span>
                                            <strong>Email:</strong> ${order.customer?.email || 'N/A'}
                                        </td>
                                    </tr>
                                </table>

                                <!-- What's Next -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:12px;margin-bottom:10px;">
                                    <tr>
                                        <td style="padding:20px 22px;">
                                            <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:10px;">${icons.clock('#1e40af')} What Happens Next?</div>
                                            <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:2;">
                                                <li>Your order is being reviewed and processed</li>
                                                <li>You'll receive email &amp; SMS updates at every stage</li>
                                                <li>Estimated delivery: <strong>5–7 business days</strong></li>
                                                <li>Track with Order ID: <strong style="color:#2563eb;">#${order.orderId}</strong></li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>

                                <div style="height:24px;"></div>

                                <!-- Support -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                                    <tr>
                                        <td style="padding:18px 24px;text-align:center;">
                                            <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Need help with your order?</div>
                                            <a href="mailto:${process.env.EMAIL_USER || 'support@premcolorlab.com'}" style="color:#6366f1;font-weight:700;text-decoration:none;font-size:14px;">${icons.mail} ${process.env.EMAIL_USER || 'support@premcolorlab.com'}</a>
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

    // ── ADMIN EMAIL ───────────────────────────────────────────────────────
    const adminEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>New Nameplate Order – Admin Alert</title>
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
                <tr><td align="center">
                    <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:linear-gradient(145deg,#064e3b 0%,#065f46 55%,#059669 100%);padding:40px 32px 32px;text-align:center;">
                                ${icons.bell}
                                <h1 style="color:#ffffff;margin:14px 0 6px;font-size:24px;font-weight:700;letter-spacing:-0.5px;">New Nameplate Order Received</h1>
                                <p style="color:#a7f3d0;margin:0;font-size:13px;">Admin Notification &nbsp;·&nbsp; Prem Color Lab</p>
                                <div style="margin-top:16px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;display:inline-block;padding:6px 22px;">
                                    <span style="color:#fff;font-size:13px;font-weight:600;">Order #${order.orderId} &nbsp;·&nbsp; ₹${totalAmount}</span>
                                </div>
                            </td>
                        </tr>

                        <!-- BODY -->
                        <tr>
                            <td style="padding:32px 30px;">

                                <!-- Urgent Alert -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1.5px solid #fca5a5;border-radius:14px;margin-bottom:28px;">
                                    <tr>
                                        <td style="padding:18px 22px;">
                                            <div style="font-size:14px;font-weight:700;color:#dc2626;">${icons.alertTriangle('#dc2626')} Action Required: New Production Order</div>
                                            <div style="font-size:13px;color:#991b1b;margin-top:6px;line-height:1.65;">Review design specifications → Verify custom image → Start production</div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Customer Info -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                                    ${icons.user('#059669')} Customer Information
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;width:36%;border-bottom:1px solid #f3f4f6;">Name</td>
                                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Phone</td>
                                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.customer?.phone || 'N/A'}</td>
                                    </tr>
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Email</td>
                                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.customer?.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;">Order Value</td>
                                        <td style="padding:12px 18px;font-size:18px;font-weight:800;color:#059669;">₹${totalAmount}</td>
                                    </tr>
                                </table>

                                <!-- Design Specs -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                                    ${icons.palette('#059669')} Design Specifications
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #d1fae5;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                                    ${buildDesignRows()}
                                </table>

                                <!-- Size -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                                    ${icons.ruler('#059669')} Size &amp; Specs
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                                    <tr style="background:#f9fafb;">
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;width:36%;border-bottom:1px solid #f3f4f6;">Size</td>
                                        <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;"><strong>${order.size?.name || 'N/A'}</strong> &nbsp;·&nbsp; ${order.size?.dimensions || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 18px;font-weight:600;color:#374151;">Quantity</td>
                                        <td style="padding:12px 18px;color:#1f2937;">1 piece</td>
                                    </tr>
                                </table>

                                <!-- Shipping -->
                                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                                    ${icons.mapPin('#059669')} Shipping Address
                                </div>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #d1fae5;border-radius:12px;margin-bottom:10px;">
                                    <tr>
                                        <td style="padding:18px 20px;font-size:13px;color:#374151;line-height:1.8;">
                                            <strong style="color:#1f2937;">${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong><br>
                                            ${order.shippingAddress?.flatHouse || 'N/A'}<br>
                                            ${order.shippingAddress?.areaStreet || 'N/A'}<br>
                                            ${order.shippingAddress?.townCity || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} – ${order.shippingAddress?.pinCode || 'N/A'}
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#f8fafc;padding:18px 30px;text-align:center;border-top:1px solid #f1f5f9;">
                                <p style="margin:0;font-size:12px;color:#9ca3af;letter-spacing:0.3px;">© ${new Date().getFullYear()} <strong style="color:#6b7280;">Prem Color Lab</strong> Admin Panel &nbsp;·&nbsp; Internal Use Only</p>
                            </td>
                        </tr>

                    </table>
                </td></tr>
            </table>

        </body>
        </html>
        `;

    // **SEND BOTH EMAILS**
    await transporter.sendMail({
      from: `"Prem Color Lab" <${process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: `✅ Order Confirmed | ${order.orderId} | Prem Color Lab`,
      html: customerEmailHtml,
    });

    await transporter.sendMail({
      from: `"Prem Color Lab - NEW ORDER" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 NEW ORDER #${order.orderId} | ₹${money(order.pricing?.total || 0)}`,
      html: adminEmailHtml,
    });

    console.log("📧 Customer email sent to:", order.customer.email);
    console.log("📧 Admin notification sent to:", ADMIN_EMAIL);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    throw err;
  }
};

module.exports = { sendOrderConfirmation };