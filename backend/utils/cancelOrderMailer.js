const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send order cancellation emails to BOTH customer and admin.
 * @param {Object} order    - Cancelled order document
 * @param {Object} customer - { firstName, lastName, email, phone } from User or order
 */
const sendOrderCancellationEmails = async (order, customer) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'team.zentrixinfotech@gmail.com';
  const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const orderId = order.orderId || order._id?.toString()?.slice(-8).toUpperCase();
  const totalAmt = order.totalAmount || 0;
  const cancelDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // ── Lucide-style SVG icons (inline, email-safe) ──────────────────────────
  const icons = {
    xCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
    alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    // Admin icons
    ban: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    zap: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  };

  const itemRows = (order.items || []).map((item, i) => `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid #fde8e8;">
        <div style="font-size:14px;font-weight:600;color:#1f2937;">Frame ${i + 1} &nbsp;·&nbsp; <span style="color:#ef4444;">${item.size || 'Custom'}"</span></div>
        <div style="font-size:12px;color:#9ca3af;margin-top:3px;">${item.frameColor || 'Black'} &nbsp;·&nbsp; ${item.frameMaterial || 'Wood'} &nbsp;·&nbsp; ${item.orientation || 'Portrait'}</div>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid #fde8e8;text-align:right;white-space:nowrap;">
        <div style="font-size:12px;color:#9ca3af;">Qty: ${item.quantity || 1}</div>
        <div style="font-size:15px;font-weight:700;color:#dc2626;text-decoration:line-through;">₹${money(item.price)}</div>
      </td>
    </tr>
  `).join('');

  // ============== CUSTOMER EMAIL ==============
  const customerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Order Cancelled – Prem Color Lab</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

            <!-- ── HEADER ── -->
            <tr>
              <td style="background:linear-gradient(145deg,#b91c1c 0%,#dc2626 55%,#ef4444 100%);padding:44px 32px 36px;text-align:center;">
                ${icons.xCircle}
                <h1 style="color:#ffffff;margin:16px 0 6px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Order Cancelled</h1>
                <p style="color:#fecaca;margin:0;font-size:14px;letter-spacing:0.3px;">Order <strong style="color:#fff;">#${orderId}</strong> has been cancelled</p>
                <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,0.15);border-radius:50px;padding:6px 18px;">
                  <span style="color:#fff;font-size:12px;letter-spacing:0.5px;">${icons.clock} ${cancelDate}</span>
                </div>
              </td>
            </tr>

            <!-- ── BODY ── -->
            <tr>
              <td style="padding:36px 32px;">

                <!-- Alert -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1.5px solid #fca5a5;border-radius:14px;margin-bottom:30px;">
                  <tr>
                    <td style="padding:20px 24px;">
                      <div style="font-size:15px;font-weight:700;color:#991b1b;">${icons.alertTriangle} Your order has been cancelled</div>
                      <div style="font-size:13px;color:#b91c1c;margin-top:8px;line-height:1.7;">
                        If this was a mistake or you didn't request this cancellation, please reach out to our support team immediately. We're here to help.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Order Summary -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fde8e8;">
                  ${icons.package} Order Summary
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;font-size:14px;">
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #f3f4f6;">Order ID</td>
                    <td style="padding:10px 0;text-align:right;border-bottom:1px solid #f3f4f6;"><strong style="color:#ef4444;">#${orderId}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #f3f4f6;">Payment Method</td>
                    <td style="padding:10px 0;text-align:right;border-bottom:1px solid #f3f4f6;color:#374151;">${order.paymentMethod || 'COD'}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;">Status</td>
                    <td style="padding:10px 0;text-align:right;">
                      <span style="background:#fee2e2;color:#991b1b;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:0.5px;">CANCELLED</span>
                    </td>
                  </tr>
                </table>

                <!-- Items -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fde8e8;">
                  ${icons.image} Cancelled Items
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #fde8e8;border-radius:12px;overflow:hidden;margin-bottom:10px;">
                  ${itemRows}
                  <tr style="background:#fef2f2;">
                    <td style="padding:14px 18px;font-weight:700;color:#991b1b;font-size:14px;">Total (Cancelled)</td>
                    <td style="padding:14px 18px;text-align:right;font-size:19px;font-weight:800;color:#dc2626;text-decoration:line-through;">₹${money(totalAmt)}</td>
                  </tr>
                </table>

                <div style="height:28px;"></div>

                <!-- Refund Info -->
                ${order.paymentMethod !== 'COD' ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:8px;">${icons.creditCard} Refund Information</div>
                      <div style="font-size:13px;color:#374151;line-height:1.75;">
                        Since you paid online, your refund will be processed within <strong>5–7 business days</strong> to your original payment method. Please contact our support team if you haven't received it after that window.
                      </div>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Support -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:8px;">
                  <tr>
                    <td style="padding:20px 24px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Questions? We're always here for you.</div>
                      <a href="mailto:${process.env.EMAIL_USER}" style="color:#6366f1;font-weight:700;text-decoration:none;font-size:14px;">${icons.mail} ${process.env.EMAIL_USER || 'support@premcolorlab.com'}</a>
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

  // ============== ADMIN EMAIL ==============
  const adminItemRows = (order.items || []).map((item, i) => `
    <tr>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;">
        <div style="font-size:13px;font-weight:600;color:#1f2937;">Frame ${i + 1} &nbsp;·&nbsp; <span style="color:#ef4444;">${item.size || 'Custom'}"</span></div>
        <div style="font-size:11px;color:#9ca3af;margin-top:3px;">${item.frameColor || 'Black'} · ${item.frameMaterial || 'Wood'} · ${item.orientation || 'Portrait'}</div>
      </td>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
        <div style="font-size:11px;color:#9ca3af;">Qty: ${item.quantity || 1}</div>
        <div style="font-size:14px;font-weight:700;color:#dc2626;text-decoration:line-through;">₹${money(item.price)}</div>
      </td>
    </tr>
  `).join('');

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Order Cancelled – Admin Alert</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

            <!-- ── HEADER ── -->
            <tr>
              <td style="background:linear-gradient(145deg,#111827 0%,#1f2937 60%,#374151 100%);padding:40px 32px 32px;text-align:center;">
                ${icons.ban}
                <h1 style="color:#ffffff;margin:14px 0 6px;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Order Cancellation Alert</h1>
                <p style="color:#9ca3af;margin:0;font-size:13px;">Admin Notification &nbsp;·&nbsp; Prem Color Lab</p>
                <div style="margin-top:16px;background:rgba(239,68,68,0.18);border:1px solid rgba(239,68,68,0.4);border-radius:50px;display:inline-block;padding:6px 20px;">
                  <span style="color:#fca5a5;font-size:13px;font-weight:600;">Order #${orderId} &nbsp;·&nbsp; ₹${money(totalAmt)} &nbsp;·&nbsp; ${cancelDate}</span>
                </div>
              </td>
            </tr>

            <!-- ── BODY ── -->
            <tr>
              <td style="padding:32px 30px;">

                <!-- Alert Banner -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1.5px solid #fca5a5;border-radius:14px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:#dc2626;">${icons.alertTriangle} Order Cancelled by Customer</div>
                      <div style="font-size:13px;color:#991b1b;margin-top:6px;line-height:1.65;">
                        Please update production/inventory accordingly. &nbsp;${icons.clock} Cancelled at: <strong>${cancelDate}</strong>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Customer Info -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fde8e8;">
                  ${icons.user} Customer Information
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:38%;border-bottom:1px solid #f3f4f6;">Full Name</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${customer.firstName || customer.name || ''} ${customer.lastName || ''}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Email</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${customer.email || 'N/A'}</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Phone</td>
                    <td style="padding:12px 18px;color:#1f2937;">${customer.phone || 'N/A'}</td>
                  </tr>
                </table>

                <!-- Order Details -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fde8e8;">
                  ${icons.package} Cancelled Order Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                  <tr style="background:#fef2f2;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:38%;border-bottom:1px solid #fde8e8;">Order ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:#ef4444;border-bottom:1px solid #fde8e8;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Payment Method</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.paymentMethod || 'COD'}</td>
                  </tr>
                  <tr style="background:#fef2f2;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Order Value</td>
                    <td style="padding:12px 18px;font-size:18px;font-weight:800;color:#dc2626;text-decoration:line-through;">₹${money(totalAmt)}</td>
                  </tr>
                </table>

                <!-- Items -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fde8e8;">
                  ${icons.image} Cancelled Items <span style="font-size:13px;font-weight:400;color:#9ca3af;">(${(order.items || []).length} item${(order.items || []).length !== 1 ? 's' : ''})</span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #fde8e8;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                  ${adminItemRows}
                </table>

                ${order.paymentMethod !== 'COD' ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:12px;margin-bottom:10px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:#b45309;margin-bottom:6px;">${icons.zap} Action Required: Process Refund</div>
                      <div style="font-size:13px;color:#92400e;line-height:1.65;">This order was paid online. Initiate the refund via the Razorpay dashboard if it hasn't been auto-processed.</div>
                    </td>
                  </tr>
                </table>
                ` : ''}

              </td>
            </tr>

            <!-- ── FOOTER ── -->
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

  // ============== SEND BOTH ==============
  try {
    await transporter.sendMail({
      from: `"Prem Color Lab" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `❌ Order #${orderId} Cancelled – Prem Color Lab`,
      html: customerHtml,
    });
    console.log('✅ Cancellation customer email sent to:', customer.email);
  } catch (err) {
    console.error('⚠️ Cancellation customer email failed:', err.message);
  }

  try {
    await transporter.sendMail({
      from: `"Prem Color Lab Admin" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🚫 ORDER CANCELLED #${orderId} | ₹${money(totalAmt)} | ${customer.firstName || customer.name || 'Customer'}`,
      html: adminHtml,
    });
    console.log('✅ Cancellation admin email sent to:', ADMIN_EMAIL);
  } catch (err) {
    console.error('⚠️ Cancellation admin email failed:', err.message);
  }
};

module.exports = { sendOrderCancellationEmails };