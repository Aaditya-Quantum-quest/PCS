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
  // Header
  badgeCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,

  // Section icons
  shoppingBag: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  image: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  mapPin: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: (c = '#1e40af') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  creditCard: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>`,
  user: (c = '#374151') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  zapInline: (c = '#b45309') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  checkCircle: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
};

/**
 * Send Razorpay payment success emails to BOTH customer and admin.
 * @param {Object} order        - Saved order document
 * @param {Object} customer     - Customer form data (firstName, lastName, email, phone, address, city, state, pincode)
 * @param {Object} paymentInfo  - { razorpayOrderId, razorpayPaymentId, razorpaySignature }
 */
const sendRazorpaySuccessEmails = async (order, customer, paymentInfo = {}) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'team.zentrixinfotech@gmail.com';
  const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const orderId = order.orderId || order._id?.toString()?.slice(-8).toUpperCase();
  const totalAmt = order.totalAmount || 0;
  const paidDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // ── Item rows (shared) ───────────────────────────────────────────────────────
  const itemRows = (order.items || []).map((item, i) => `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid #f3f4f6;">
        <div style="font-size:14px;font-weight:700;color:#1f2937;">
          ${icons.image('#6366f1')} Frame ${i + 1} &nbsp;·&nbsp; <span style="color:#6366f1;">${item.size || 'Custom'}"</span>
        </div>
        <div style="font-size:12px;color:#9ca3af;margin-top:4px;">
          ${item.frameColor || 'Black'} &nbsp;·&nbsp; ${item.frameMaterial || 'Wood'} &nbsp;·&nbsp; ${item.frameThickness || 20}mm &nbsp;·&nbsp; ${item.orientation || 'Portrait'}
        </div>
        ${item.imageUrl ? `<div style="font-size:12px;color:#059669;margin-top:3px;">${icons.checkCircle('#059669')} Image uploaded</div>` : ''}
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
        <div style="font-size:12px;color:#9ca3af;">Qty: ${item.quantity || 1}</div>
        <div style="font-size:15px;font-weight:700;color:#6366f1;">₹${money(item.price)}</div>
      </td>
    </tr>
  `).join('');

  // ── CUSTOMER EMAIL ────────────────────────────────────────────────────────────
  const customerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>Payment Successful – Prem Color Lab</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(145deg,#047857 0%,#059669 55%,#10b981 100%);padding:44px 32px 36px;text-align:center;">
                ${icons.badgeCheck}
                <h1 style="color:#ffffff;margin:16px 0 6px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Payment Successful!</h1>
                <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px;">Thank you — your order is confirmed.</p>
                <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,0.18);border-radius:50px;padding:7px 22px;">
                  <span style="color:#fff;font-size:13px;font-weight:600;">Order #${orderId}</span>
                </div>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:36px 32px;">

                <!-- Payment Banner -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1.5px solid #6ee7b7;border-radius:14px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:15px;font-weight:700;color:#065f46;">
                        ${icons.checkCircle('#059669')} Payment of <span style="color:#059669;">₹${money(totalAmt)}</span> received!
                      </div>
                      <div style="font-size:13px;color:#047857;margin-top:6px;">
                        Razorpay Payment ID: &nbsp;<code style="background:#d1fae5;padding:2px 8px;border-radius:4px;font-size:12px;color:#065f46;">${paymentInfo.razorpayPaymentId || 'N/A'}</code>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Order Summary -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                  ${icons.shoppingBag('#059669')} Order Summary
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:14px;">
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Order ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:#6366f1;border-bottom:1px solid #f3f4f6;">#${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Payment Date</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">${paidDate}</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Payment Method</td>
                    <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">Razorpay (Online)</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Payment Status</td>
                    <td style="padding:12px 18px;">
                      <span style="background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:0.5px;">${icons.checkCircle('#065f46')} PAID</span>
                    </td>
                  </tr>
                </table>

                <!-- Frame Details -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                  ${icons.image('#059669')} Frame Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #d1fae5;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                  ${itemRows}
                  <tr style="background:#ecfdf5;">
                    <td style="padding:14px 18px;font-weight:700;color:#065f46;font-size:15px;">Total Paid</td>
                    <td style="padding:14px 18px;text-align:right;font-size:20px;font-weight:800;color:#059669;">₹${money(totalAmt)}</td>
                  </tr>
                </table>

                <!-- Shipping Address -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                  ${icons.mapPin('#059669')} Shipping Address
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #f3f4f6;border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 20px;font-size:14px;color:#374151;line-height:1.8;">
                      <strong style="color:#1f2937;">${customer.firstName || ''} ${customer.lastName || ''}</strong><br>
                      ${customer.address || ''}, ${customer.area || ''}<br>
                      ${customer.city || ''}, ${customer.state || ''} – ${customer.pincode || ''}<br>
                      <span style="margin-top:6px;display:block;"><strong>Phone:</strong> ${customer.phone || 'N/A'} &nbsp;&nbsp; <strong>Email:</strong> ${customer.email || 'N/A'}</span>
                    </td>
                  </tr>
                </table>

                <!-- What's Next -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #6366f1;border-radius:12px;margin-bottom:10px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:10px;">${icons.clock('#1e40af')} What Happens Next?</div>
                      <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:2;">
                        <li>Our team will review &amp; start production</li>
                        <li>You'll receive shipping updates via email &amp; SMS</li>
                        <li>Estimated delivery: <strong>5–7 business days</strong></li>
                        <li>Track using Order ID: <strong style="color:#4f46e5;">#${orderId}</strong></li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <div style="height:24px;"></div>

                <!-- Support -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 24px;text-align:center;">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Questions about your order?</div>
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

  // ── ADMIN EMAIL ───────────────────────────────────────────────────────────────
  const adminItemRows = (order.items || []).map((item, i) => `
    <tr>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;">
        <div style="font-size:13px;font-weight:700;color:#1f2937;">
          ${icons.image('#6366f1')} Frame ${i + 1} &nbsp;·&nbsp; <span style="color:#6366f1;">${item.size || 'Custom'}"</span>
        </div>
        <div style="font-size:11px;color:#9ca3af;margin-top:3px;">
          ${item.frameColor || 'Black'} · ${item.frameMaterial || 'Wood'} · ${item.frameThickness || 20}mm · ${item.orientation || 'Portrait'}
        </div>
        ${item.imageUrl ? `<div style="font-size:11px;color:#059669;margin-top:2px;">${icons.checkCircle('#059669')} Image uploaded</div>` : ''}
      </td>
      <td style="padding:13px 18px;border-bottom:1px solid #f3f4f6;text-align:right;white-space:nowrap;">
        <div style="font-size:11px;color:#9ca3af;">Qty: ${item.quantity || 1}</div>
        <div style="font-size:14px;font-weight:700;color:#6366f1;">₹${money(item.price)}</div>
      </td>
    </tr>
  `).join('');

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <title>New Payment – Admin Alert</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr><td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(145deg,#4c1d95 0%,#6d28d9 55%,#7c3aed 100%);padding:40px 32px 32px;text-align:center;">
                ${icons.zap}
                <h1 style="color:#ffffff;margin:14px 0 6px;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Razorpay Payment Received</h1>
                <p style="color:#ddd6fe;margin:0;font-size:13px;">Admin Notification &nbsp;·&nbsp; Prem Color Lab</p>
                <div style="margin-top:16px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:50px;display:inline-block;padding:6px 22px;">
                  <span style="color:#fff;font-size:13px;font-weight:600;">Order #${orderId} &nbsp;·&nbsp; ₹${money(totalAmt)} &nbsp;·&nbsp; ${paidDate}</span>
                </div>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:32px 30px;">

                <!-- Action Banner -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:18px 22px;">
                      <div style="font-size:14px;font-weight:700;color:#b45309;">${icons.zapInline('#b45309')} Action Required: Start Production</div>
                      <div style="font-size:13px;color:#92400e;margin-top:6px;line-height:1.65;">A new paid order has arrived. Please review, process, and prepare for shipping.</div>
                    </td>
                  </tr>
                </table>

                <!-- Payment Details -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #ede9fe;">
                  ${icons.creditCard('#7c3aed')} Payment Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                  <tr style="background:#f5f3ff;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:40%;border-bottom:1px solid #f3f4f6;">Razorpay Order ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:#6366f1;border-bottom:1px solid #f3f4f6;">${paymentInfo.razorpayOrderId || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Razorpay Payment ID</td>
                    <td style="padding:12px 18px;font-weight:700;color:#059669;border-bottom:1px solid #f3f4f6;">${paymentInfo.razorpayPaymentId || 'N/A'}</td>
                  </tr>
                  <tr style="background:#f5f3ff;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Payment Status</td>
                    <td style="padding:12px 18px;border-bottom:1px solid #f3f4f6;">
                      <span style="background:#d1fae5;color:#065f46;padding:3px 12px;border-radius:50px;font-size:12px;font-weight:700;">${icons.checkCircle('#065f46')} VERIFIED</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Amount Received</td>
                    <td style="padding:12px 18px;font-size:19px;font-weight:800;color:#059669;">₹${money(totalAmt)}</td>
                  </tr>
                </table>

                <!-- Customer Details -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #ede9fe;">
                  ${icons.user('#7c3aed')} Customer Details
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;width:36%;border-bottom:1px solid #f3f4f6;">Name</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${customer.firstName || ''} ${customer.lastName || ''}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Email</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${customer.email || 'N/A'}</td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Phone</td>
                    <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${customer.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 18px;font-weight:600;color:#374151;">Address</td>
                    <td style="padding:12px 18px;color:#1f2937;line-height:1.7;">
                      ${customer.address || ''}, ${customer.area || ''}<br>
                      ${customer.city || ''}, ${customer.state || ''} – ${customer.pincode || ''}
                    </td>
                  </tr>
                </table>

                <!-- Ordered Items -->
                <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #ede9fe;">
                  ${icons.image('#7c3aed')} Ordered Items <span style="font-size:13px;font-weight:400;color:#9ca3af;">(${(order.items || []).length} item${(order.items || []).length !== 1 ? 's' : ''})</span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #ede9fe;border-radius:12px;overflow:hidden;margin-bottom:10px;">
                  ${adminItemRows}
                  <tr style="background:#f5f3ff;">
                    <td style="padding:14px 18px;font-weight:700;color:#5b21b6;font-size:15px;">TOTAL</td>
                    <td style="padding:14px 18px;text-align:right;font-size:20px;font-weight:800;color:#7c3aed;">₹${money(totalAmt)}</td>
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

  // ── SEND BOTH ─────────────────────────────────────────────────────────────────
  try {
    await transporter.sendMail({
      from: `"Prem Color Lab" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `💳 Payment Successful! Order #${orderId} Confirmed – Prem Color Lab`,
      html: customerHtml,
    });
    console.log('✅ Razorpay customer email sent to:', customer.email);
  } catch (err) {
    console.error('⚠️ Razorpay customer email failed:', err.message);
  }

  try {
    await transporter.sendMail({
      from: `"Prem Color Lab - Payment Alert" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `💰 NEW PAYMENT ₹${money(totalAmt)} | Order #${orderId} | Razorpay Verified`,
      html: adminHtml,
    });
    console.log('✅ Razorpay admin email sent to:', ADMIN_EMAIL);
  } catch (err) {
    console.error('⚠️ Razorpay admin email failed:', err.message);
  }
};

module.exports = { sendRazorpaySuccessEmails };

