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
  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,

  alertTriangle: (c = '#dc2626') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  user: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  tag: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="${c}"/></svg>`,
  palette: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><circle cx="13.5" cy="6.5" r=".5" fill="${c}"/><circle cx="17.5" cy="10.5" r=".5" fill="${c}"/><circle cx="8.5" cy="7.5" r=".5" fill="${c}"/><circle cx="6.5" cy="12.5" r=".5" fill="${c}"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  mapPin: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  receipt: (c = '#059669') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/></svg>`,
  clipboardList: (c = '#1e40af') => `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
  image: (c = '#9ca3af') => `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:5px;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
};

const sendNameplateAdminNotification = async (order) => {
  const money = (value) => Number(value).toFixed(2);
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team.zentrixinfotech@gmail.com';

  try {
    const orderId = order.orderId || order._id?.toString().slice(-6);
    const totalAmount = money(order.pricing?.total || 0);

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
                    <span style="color:#fff;font-size:13px;font-weight:600;">Order #${orderId} &nbsp;·&nbsp; ₹${totalAmount}</span>
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
                        <div style="font-size:14px;font-weight:700;color:#dc2626;">${icons.alertTriangle('#dc2626')} Action Required: New Nameplate Order</div>
                        <div style="font-size:13px;color:#991b1b;margin-top:6px;line-height:1.65;">Review customer design → Verify specifications → Start production</div>
                      </td>
                    </tr>
                  </table>

                  <!-- Customer Information -->
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

                  <!-- Nameplate Specifications -->
                  <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                    ${icons.tag('#059669')} Nameplate Specifications
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 18px;font-weight:600;color:#374151;width:36%;border-bottom:1px solid #f3f4f6;">Size</td>
                      <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.size?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Dimensions</td>
                      <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${order.size?.dimensions || 'N/A'}</td>
                    </tr>
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Size Price</td>
                      <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">₹${money(order.size?.price || 0)}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 18px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">Payment Method</td>
                      <td style="padding:12px 18px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${(order.payment?.method || 'COD').toUpperCase()}</td>
                    </tr>
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 18px;font-weight:600;color:#374151;">Payment Status</td>
                      <td style="padding:12px 18px;">
                        <span style="background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:50px;font-size:12px;font-weight:700;letter-spacing:0.4px;">${(order.payment?.status || 'PENDING').toUpperCase()}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Customer Design Image -->
                  ${order.design?.customizedImage ? `
                  <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                    ${icons.palette('#059669')} Customer Design
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #d1fae5;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                    <tr>
                      <td style="padding:20px;text-align:center;">
                        <img src="${order.design.customizedImage}" alt="Nameplate Design" style="max-width:100%;height:auto;border:1.5px solid #e5e7eb;border-radius:10px;" />
                        <div style="margin-top:10px;font-size:12px;color:#9ca3af;">${icons.image('#9ca3af')} Customer-submitted design preview</div>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Shipping Address -->
                  <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                    ${icons.mapPin('#059669')} Shipping Address
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #d1fae5;border-radius:12px;margin-bottom:28px;">
                    <tr>
                      <td style="padding:18px 20px;font-size:13px;color:#374151;line-height:1.9;">
                        <strong style="color:#1f2937;">${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong><br>
                        ${order.shippingAddress?.flatHouse || ''}<br>
                        ${order.shippingAddress?.areaStreet || ''}<br>
                        ${order.shippingAddress?.townCity || ''}, ${order.shippingAddress?.state || ''} – ${order.shippingAddress?.pinCode || ''}<br>
                        <span style="color:#6b7280;">${order.shippingAddress?.country || 'India'}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Pricing Breakdown -->
                  <div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #d1fae5;">
                    ${icons.receipt('#059669')} Pricing Breakdown
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin-bottom:28px;font-size:13px;">
                    <tr>
                      <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">Subtotal</td>
                      <td style="padding:12px 18px;text-align:right;color:#374151;border-bottom:1px solid #f3f4f6;">₹${money(order.pricing?.subtotal || 0)}</td>
                    </tr>
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">Shipping</td>
                      <td style="padding:12px 18px;text-align:right;color:#374151;border-bottom:1px solid #f3f4f6;">₹${money(order.pricing?.shippingCharges || 0)}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">Tax</td>
                      <td style="padding:12px 18px;text-align:right;color:#374151;border-bottom:1px solid #f3f4f6;">₹${money(order.pricing?.tax || 0)}</td>
                    </tr>
                    <tr style="background:#f9fafb;">
                      <td style="padding:12px 18px;color:#374151;border-bottom:1px solid #f3f4f6;">Discount</td>
                      <td style="padding:12px 18px;text-align:right;color:#dc2626;border-bottom:1px solid #f3f4f6;">−₹${money(order.pricing?.discount || 0)}</td>
                    </tr>
                    <tr style="background:#f0fdf4;">
                      <td style="padding:14px 18px;font-weight:800;color:#065f46;font-size:15px;">TOTAL</td>
                      <td style="padding:14px 18px;text-align:right;font-weight:800;color:#059669;font-size:18px;">₹${totalAmount}</td>
                    </tr>
                  </table>

                  <!-- Next Steps -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:12px;">
                    <tr>
                      <td style="padding:20px 22px;">
                        <div style="font-size:14px;font-weight:700;color:#1e40af;margin-bottom:10px;">${icons.clipboardList('#1e40af')} Next Steps</div>
                        <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:2;">
                          <li>Review the customer design image above</li>
                          <li>Start nameplate production</li>
                          <li>Update order status once shipped</li>
                          <li>Add tracking number for the customer</li>
                        </ul>
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

    await transporter.sendMail({
      from: `"Prem Color Lab - NEW ORDER" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 NEW NAMEPLATE ORDER #${orderId} | ₹${totalAmount}`,
      html: adminEmailHtml,
    });

    console.log("📧 Nameplate admin notification email sent successfully");
  } catch (err) {
    console.error("❌ Nameplate admin email error:", err.message);
    throw err;
  }
};

module.exports = { sendNameplateAdminNotification };