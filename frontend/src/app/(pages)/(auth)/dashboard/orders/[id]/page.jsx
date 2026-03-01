'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
    ArrowLeft,
    User,
    Mail,
    Image as ImageIcon,
    Package,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Phone,
    MapPin
} from 'lucide-react';
import Link from 'next/link';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [address, setAddress] = useState(null);  // ✅ KEEP THIS
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchFullOrderData = async () => {
            try {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                // Fetch order
                const orderRes = await axios.get(`http://localhost:4000/api/order/${id}`, config);
                const orderData = orderRes.data;
                setOrder(orderData);
                setItems(orderData.items || []);

                // ✅ FETCH ADDRESS using order.orderId (NOT MongoDB _id)
                if (orderData.orderId) {
                    const addressRes = await axios.get(
                        `http://localhost:4000/api/address/${orderData.orderId}`,
                        config
                    );
                    setAddress(addressRes.data);  // Single address OR first address
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchFullOrderData();
    }, [id]);

    // Base URL because imageUrl in DB is like "/uploads/xyz.jpg"
    const baseImageUrl = 'http://localhost:4000';

    // Helper function to get the correct image URL
    // const getImageUrl = (imageUrl) => {
    //     if (!imageUrl) return '';
    //     // If it's already a base64 data URI, return as-is
    //     if (imageUrl.startsWith('data:')) return imageUrl;
    //     // Otherwise, prepend the base URL
    //     return `${baseImageUrl}${imageUrl}`;
    // };

    const getImageUrl = (imageUrl) => {
        return imageUrl?.startsWith('data:') ? imageUrl : `http://localhost:4000${imageUrl}`;
    };

    const handleDownloadImage = async (imageUrl) => {
        if (!imageUrl) return;

        try {
            if (imageUrl.startsWith('data:')) {
                const base64Data = imageUrl.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteArray = new Uint8Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteArray[i] = byteCharacters.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'image/jpeg' });
                downloadBlob(blob, `order-${order._id}-image.jpg`);
            } else {
                const res = await fetch(`${baseImageUrl}${imageUrl}`);
                const blob = await res.blob();
                downloadBlob(blob, `order-${order._id}-image.jpg`);
            }
        } catch (err) {
            console.error('Failed to download image', err);
        }
    };

    // Helper function
    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const handleDownloadReceipt = async () => {
        try {
            const getTextWidth = (text, fontSize = 10) => text.length * (fontSize * 0.55);
            const item = order?.items?.[0];

            const orderData = {
                orderId: String(order.orderId || order._id || ''),
                totalAmount: String(order.totalAmount || '0'),
                paymentStatus: String(order.paymentStatus || 'PENDING'),
                paymentMethod: String(order.paymentMethod || 'COD'),
                orderStatus: String(order.status || 'PENDING'),
                orderDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : 'N/A',
                customerName: String(address?.firstName && address?.lastName ? `${address.firstName} ${address.lastName}` : order.user?.name || 'Unknown'),
                customerEmail: String(address?.email || order.user?.email || 'N/A'),
                customerPhone: String(address?.phone || 'N/A'),
                shippingAddress: {
                    name: String(address?.firstName && address?.lastName ? `${address.firstName} ${address.lastName}` : 'N/A'),
                    address1: String(address?.address || 'N/A'),
                    address2: String(address?.area || ''),
                    city: String(address?.city || 'N/A'),
                    state: String(address?.state || 'N/A'),
                    pincode: String(address?.pincode || 'N/A')
                },
                products: order.items?.map(it => ({
                    name: String(it.productName || it.product?.name || it.product?.title || 'Custom Frame'),
                    size: String(it.size || 'N/A'),
                    material: String(it.frameMaterial || 'N/A'),
                    frameColor: String(it.frameColor || 'N/A'),
                    thickness: String(it.frameThickness ? `${it.frameThickness}mm` : 'N/A'),
                    quantity: String(it.quantity || 1),
                    price: String(it.price ? `₹${it.price}` : '₹0')
                })) || []
            };

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = margin;

            const addText = (text, x, y, size = 10, style = 'normal', color = [0, 0, 0]) => {
                pdf.setFontSize(size);
                pdf.setFont('helvetica', style);
                pdf.setTextColor(...color);
                pdf.text(text, x, y);
            };

            const addLine = (y) => {
                pdf.setDrawColor(200, 200, 200);
                pdf.line(margin, y, pageWidth - margin, y);
            };

            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(88, 28, 135);
            pdf.text('ORDER RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
            yPosition += 15;

            addText(`Order ID: ${orderData.orderId}`, margin, yPosition, 10, 'normal');
            const dateText = `Date: ${orderData.orderDate}`;
            const dateWidth = getTextWidth(dateText);

            addText(dateText, pageWidth - margin - dateWidth, yPosition, 10, 'normal');
            yPosition += 10;

            addLine(yPosition);
            yPosition += 10;

            addText('ORDER STATUS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 8;

            addText(`Payment Status: ${orderData.paymentStatus}`, margin, yPosition, 10, 'normal');
            addText(`Order Status: ${orderData.orderStatus}`, margin + 80, yPosition, 10, 'normal');
            yPosition += 6;

            addText(`Payment Method: ${orderData.paymentMethod}`, margin, yPosition, 10, 'normal');
            yPosition += 12;

            addLine(yPosition);
            yPosition += 10;

            addText('CUSTOMER INFORMATION', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 8;

            addText(`Name: ${orderData.customerName}`, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(`Email: ${orderData.customerEmail}`, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(`Phone: ${orderData.customerPhone}`, margin, yPosition, 10, 'normal');
            yPosition += 12;

            addLine(yPosition);
            yPosition += 10;

            addText('SHIPPING ADDRESS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 8;

            addText(orderData.shippingAddress.name, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(orderData.shippingAddress.address1, margin, yPosition, 10, 'normal');
            yPosition += 6;
            if (orderData.shippingAddress.address2) {
                addText(orderData.shippingAddress.address2, margin, yPosition, 10, 'normal');
                yPosition += 6;
            }
            addText(`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}`, margin, yPosition, 10, 'normal');
            yPosition += 12;

            addLine(yPosition);
            yPosition += 10;

            addText('PRODUCT DETAILS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 10;

            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

            addText('Product', margin + 2, yPosition, 10, 'bold');
            addText('Specs', margin + 45, yPosition, 10, 'bold');
            addText('Qty', pageWidth - margin - 55, yPosition, 10, 'bold');
            addText('Price', pageWidth - margin - 25, yPosition, 10, 'bold');
            yPosition += 10;

            orderData.products.forEach((product, index) => {
                if (yPosition > pageHeight - 40) {
                    pdf.addPage();
                    yPosition = margin;
                }

                addText(product.name, margin + 2, yPosition, 10, 'bold');  // Changed from product.type
                const specs = `${product.size}, ${product.material}`;
                addText(specs, margin + 45, yPosition, 9, 'normal');

                const qtyText = product.quantity;
                const qtyWidth = getTextWidth(qtyText, 10);
                addText(qtyText, pageWidth - margin - 50, yPosition, 10, 'normal');

                const priceText = product.price;
                const priceWidth = getTextWidth(priceText, 10);
                addText(priceText, pageWidth - margin - priceWidth, yPosition, 10, 'normal');
                yPosition += 8;
            });

            yPosition += 5;
            addLine(yPosition);
            yPosition += 10;

            pdf.setFillColor(88, 28, 135);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');

            addText('TOTAL AMOUNT', margin + 2, yPosition + 2, 12, 'bold', [255, 255, 255]);

            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const totalAmount = `₹${orderData.totalAmount}`;
            const totalWidth = getTextWidth(totalAmount, 14);
            pdf.text(totalAmount, pageWidth - margin - totalWidth - 2, yPosition + 2);
            pdf.setTextColor(0, 0, 0);
            yPosition += 20;

            yPosition = pageHeight - 30;
            addLine(yPosition);
            yPosition += 8;

            pdf.setTextColor(100, 100, 100);
            pdf.text('Thank you for your order!', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 6;
            pdf.text('For any queries, please contact customer support', pageWidth / 2, yPosition, { align: 'center' });

            pdf.save(`Order-Receipt-${orderData.orderId}.pdf`);

        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#12002c] text-purple-100">
                Loading order…
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#12002c] text-purple-100">
                <p className="mb-4 text-red-400">{error || 'Order not found.'}</p>
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>
            </div>
        );
    }

    const created = new Date(order.createdAt);
    const dateStr = created.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const statusColor =
        order.status === 'completed' || order.status === 'delivered'
            ? 'bg-green-500/20 text-green-300 border-green-400/60'
            : order.status === 'cancelled'
                ? 'bg-red-500/20 text-red-300 border-red-400/60'
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/60';

    const paymentColor =
        order.paymentStatus === 'paid'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
            : 'bg-orange-500/20 text-orange-300 border-orange-400/60';

    return (
        <div className="py-20 bg-linear-to-br from-[#150042] via-[#210057] to-[#2c006b] text-purple-50 min-h-screen">
            <div id="receipt" className="max-w-6xl mx-auto px-4 py-4 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/50">
                                <Package className="w-5 h-5 text-purple-100" />
                            </span>
                            Order Details
                        </h1>
                        <p className="text-sm text-purple-200/80 mt-1">
                            Order ID: <span className="font-mono font-semibold text-purple-100">{order.orderId || order._id}</span>
                        </p>
                    </div>
                    <Link
                        href="/dashboard/orders"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-purple-600/80 hover:bg-purple-500 text-sm font-medium shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> All Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-purple-500/40 border border-purple-300/40 p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">TOTAL AMOUNT</p>
                            <p className="text-2xl font-bold text-emerald-300">₹{order.totalAmount?.toLocaleString()}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-emerald-300/50" />
                    </div>

                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-pink-500/40 border border-purple-300/40 p-5">
                        <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">PAYMENT STATUS</p>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase ${paymentColor}`}>
                                {order.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {order.paymentStatus}
                            </span>
                        </div>
                        <p className="text-[11px] text-purple-200/70 mt-2 uppercase">Method: {order.paymentMethod || 'Online'}</p>
                    </div>

                    <div className="rounded-2xl bg-linear-to-br from-purple-600/70 to-orange-500/40 border border-purple-300/40 p-5">
                        <p className="text-xs font-semibold tracking-wide text-purple-200/80 mb-1">ORDER STATUS</p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase ${statusColor}`}>
                            {order.status}
                        </span>
                        <p className="text-[11px] text-purple-200/70 mt-2">Placed: {dateStr}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4 lg:col-span-1">
                        <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2 border-b border-purple-400/20 pb-2">
                                <User className="w-4 h-4 text-purple-200" /> Customer Information
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg font-bold shadow-inner">
                                    {address?.firstName ? address.firstName[0] : (order.user?.name ? order.user.name[0] : 'U')}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-white">
                                        {address?.firstName && address?.lastName
                                            ? `${address.firstName} ${address.lastName}`
                                            : order.user?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-purple-200/70 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {address?.email || order.user?.email || 'No email'}
                                    </p>
                                    <p className="text-xs text-purple-200/70 flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> {address?.phone || 'No phone'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/5 border border-purple-400/40 p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-purple-100 flex items-center gap-2 border-b border-purple-400/20 pb-2">
                                <MapPin className="w-4 h-4 text-purple-200" /> Shipping Address
                            </h2>
                            <div className="text-sm text-purple-100/90 leading-relaxed">
                                {address ? (
                                    <>
                                        <p className="font-medium text-white">{address.firstName} {address.lastName}</p>
                                        <p>{address.address}</p>
                                        <p>{address.area}</p>
                                        <p>{address.city}, {address.state} - <span className="font-mono">{address.pincode}</span></p>
                                    </>
                                ) : (
                                    <p className="text-purple-300/50 italic">No address details found for this order.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-purple-400/40 p-6">
                        <div className="flex items-center justify-between mb-6 border-b border-purple-400/20 pb-4">
                            <h2 className="text-lg font-bold text-purple-100 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-200" />
                                Products ({items.length})
                            </h2>
                        </div>

                        {/* ✅ MULTIPLE ITEMS GRID */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {items.map((item, index) => (
                                <div key={index} className="space-y-4">
                                    <div className="relative rounded-2xl overflow-hidden bg-black/40 border-4 border-purple-500/40 shadow-2xl aspect-[4/5]">
                                        <img
                                            src={getImageUrl(item.imageUrl)}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-contain object-center bg-black/50 hover:scale-105 transition-all duration-500 p-4"
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-purple-600/95 backdrop-blur-md text-xs font-bold uppercase text-white">
                                            {item.orientation?.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleDownloadImage(item.imageUrl)}
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold shadow-lg hover:shadow-purple-700/50 hover:-translate-y-0.5 transition-all"
                                        >
                                            Download Image
                                        </button>
                                        <button
                                            onClick={handleDownloadReceipt}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-sm font-medium shadow-lg transition-all"
                                        >
                                            <CreditCard className="w-4 h-4" /> Download Receipt
                                        </button>

                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            // { label: 'Type', value: item?.frameType || item?.product?.name || 'Photo Frame' },
                                            { label: 'Type', value: item?.productName || item?.product?.name || item?.product?.title || item?.frameType || 'Custom Frame' },
                                            { label: 'Size', value: item?.size || 'N/A' },
                                            { label: 'Frame Color', value: item?.frameColor || 'N/A' },
                                            { label: 'Material', value: item?.frameMaterial || 'N/A' },
                                            { label: 'Thickness', value: item?.frameThickness ? `${item.frameThickness}mm` : 'N/A' },
                                            { label: 'Price', value: `₹${item?.price || 0}` }
                                        ].map((spec, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-3 border border-purple-400/10">
                                                <p className="text-[10px] uppercase text-purple-300/60 font-bold">{spec.label}</p>
                                                <p className="text-sm font-semibold text-white mt-1">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}