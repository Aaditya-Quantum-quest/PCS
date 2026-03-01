


'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Download, Image as ImageIcon, FileText, Package, User, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { RefreshCw, Send, Truck, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

import jsPDF from 'jspdf';


export default function NameplateOrderDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (!token || !isAdmin) {
            router.replace('/');
            return;
        }

        async function fetchOrder() {
            try {
                const res = await axios.get(
                    `http://localhost:4000/api/admin/nameplate-orders/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setOrder(res.data);
            } catch (err) {
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [id, router]);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
            setTrackingNumber(order.shipping?.trackingNumber || '');
        }
    }, [order]);

    // const handleDownloadReceipt = async () => {
    //     try {
    //         console.log("Starting PDF generation...");

    //         // You'll need to import jsPDF library
    //         //   const { jsPDF } = window.jspdf;
    //         const pdf = new jsPDF('p', 'mm', 'a4');

    //         const orderData = {
    //             orderId: String(order._id || 'N/A'),
    //             totalAmount: String(`₹${order.pricing?.total || '0'}`),
    //             paymentStatus: String(order.payment?.status || 'PENDING'),
    //             paymentMethod: String(order.payment?.method?.toUpperCase() || 'N/A'),
    //             orderStatus: String(order.status || 'PENDING'),
    //             orderDate: String(new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) || new Date().toLocaleDateString()),

    //             customerName: String(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`),
    //             customerEmail: String(order.customer?.email || 'N/A'),
    //             customerPhone: String(order.customer?.phone || 'N/A'),

    //             shippingAddress: {
    //                 name: String(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`),
    //                 address1: String(order.shippingAddress?.flatHouse || ''),
    //                 address2: String(order.shippingAddress?.areaStreet || ''),
    //                 city: String(order.shippingAddress?.townCity || ''),
    //                 state: String(order.shippingAddress?.state || ''),
    //                 pincode: String(order.shippingAddress?.pinCode || '')
    //             },

    //             products: [{
    //                 name: String(order.size?.name || 'Nameplate'),
    //                 size: String(order.size?.dimensions || 'N/A'),
    //                 material: 'Nameplate Material',
    //                 frameColor: 'Custom Design',
    //                 thickness: 'Standard',
    //                 quantity: '1',
    //                 price: String(`₹${order.size?.price || '0'}`)
    //             }]
    //         };

    //         // const pdf = new jsPDF('p', 'mm', 'a4');
    //         const pageWidth = pdf.internal.pageSize.getWidth();
    //         const pageHeight = pdf.internal.pageSize.getHeight();
    //         const margin = 20;
    //         let yPosition = margin;

    //         const addText = (text, x, y, size = 10, style = 'normal', color = [0, 0, 0]) => {
    //             pdf.setFontSize(size);
    //             pdf.setFont('helvetica', style);
    //             pdf.setTextColor(...color);
    //             pdf.text(text, x, y);
    //         };

    //         const addLine = (y) => {
    //             pdf.setDrawColor(200, 200, 200);
    //             pdf.line(margin, y, pageWidth - margin, y);
    //         };

    //         pdf.setFontSize(24);
    //         pdf.setFont('helvetica', 'bold');
    //         pdf.setTextColor(88, 28, 135);
    //         pdf.text('ORDER RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
    //         pdf.setTextColor(0, 0, 0);
    //         yPosition += 15;

    //         addText(`Order ID: ${orderData.orderId}`, margin, yPosition, 10, 'normal');
    //         const dateText = `Date: ${orderData.orderDate}`;
    //         const dateWidth = pdf.getTextWidth(dateText);
    //         addText(dateText, pageWidth - margin - dateWidth, yPosition, 10, 'normal');
    //         yPosition += 10;

    //         addLine(yPosition);
    //         yPosition += 10;

    //         addText('ORDER STATUS', margin, yPosition, 12, 'bold', [88, 28, 135]);
    //         yPosition += 8;

    //         addText(`Payment Status: ${orderData.paymentStatus}`, margin, yPosition, 10, 'normal');
    //         addText(`Order Status: ${orderData.orderStatus}`, margin + 80, yPosition, 10, 'normal');
    //         yPosition += 6;

    //         addText(`Payment Method: ${orderData.paymentMethod}`, margin, yPosition, 10, 'normal');
    //         yPosition += 12;

    //         addLine(yPosition);
    //         yPosition += 10;

    //         addText('CUSTOMER INFORMATION', margin, yPosition, 12, 'bold', [88, 28, 135]);
    //         yPosition += 8;

    //         addText(`Name: ${orderData.customerName}`, margin, yPosition, 10, 'normal');
    //         yPosition += 6;
    //         addText(`Email: ${orderData.customerEmail}`, margin, yPosition, 10, 'normal');
    //         yPosition += 6;
    //         addText(`Phone: ${orderData.customerPhone}`, margin, yPosition, 10, 'normal');
    //         yPosition += 12;

    //         addLine(yPosition);
    //         yPosition += 10;

    //         addText('SHIPPING ADDRESS', margin, yPosition, 12, 'bold', [88, 28, 135]);
    //         yPosition += 8;

    //         addText(orderData.shippingAddress.name, margin, yPosition, 10, 'normal');
    //         yPosition += 6;
    //         addText(orderData.shippingAddress.address1, margin, yPosition, 10, 'normal');
    //         yPosition += 6;
    //         addText(orderData.shippingAddress.address2, margin, yPosition, 10, 'normal');
    //         yPosition += 6;
    //         addText(`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}`, margin, yPosition, 10, 'normal');
    //         yPosition += 12;

    //         addLine(yPosition);
    //         yPosition += 10;

    //         addText('PRODUCT DETAILS', margin, yPosition, 12, 'bold', [88, 28, 135]);
    //         yPosition += 10;

    //         pdf.setFillColor(240, 240, 240);
    //         pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

    //         addText('Item', margin + 2, yPosition, 10, 'bold');
    //         addText('Specifications', margin + 60, yPosition, 10, 'bold');
    //         addText('Qty', pageWidth - margin - 55, yPosition, 10, 'bold');
    //         addText('Price', pageWidth - margin - 25, yPosition, 10, 'bold');
    //         yPosition += 10;

    //         orderData.products.forEach((product) => {
    //             if (yPosition > pageHeight - 40) {
    //                 pdf.addPage();
    //                 yPosition = margin;
    //             }

    //             addText(product.name, margin + 2, yPosition, 10, 'normal');

    //             const specs = `${product.size}, ${product.material}, ${product.frameColor}`;
    //             addText(specs, margin + 60, yPosition, 9, 'normal');

    //             const qtyText = product.quantity;
    //             addText(qtyText, pageWidth - margin - 50, yPosition, 10, 'normal');

    //             const priceText = product.price;
    //             const priceWidth = pdf.getTextWidth(priceText);
    //             addText(priceText, pageWidth - margin - priceWidth, yPosition, 10, 'normal');
    //             yPosition += 8;
    //         });

    //         yPosition += 5;
    //         addLine(yPosition);
    //         yPosition += 10;

    //         pdf.setFillColor(88, 28, 135);
    //         pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');

    //         addText('TOTAL AMOUNT', margin + 2, yPosition + 2, 12, 'bold', [255, 255, 255]);

    //         pdf.setFontSize(14);
    //         pdf.setFont('helvetica', 'bold');
    //         pdf.setTextColor(255, 255, 255);
    //         const totalWidth = pdf.getTextWidth(orderData.totalAmount);
    //         pdf.text(orderData.totalAmount, pageWidth - margin - totalWidth - 2, yPosition + 2);
    //         pdf.setTextColor(0, 0, 0);

    //         yPosition = pageHeight - 30;
    //         addLine(yPosition);
    //         yPosition += 8;

    //         pdf.setFontSize(10);
    //         pdf.setFont('helvetica', 'italic');
    //         pdf.setTextColor(100, 100, 100);
    //         pdf.text('Thank you for your order!', pageWidth / 2, yPosition, { align: 'center' });
    //         yPosition += 6;
    //         pdf.setFont('helvetica', 'normal');
    //         pdf.text('For any queries, please contact customer support', pageWidth / 2, yPosition, { align: 'center' });

    //         pdf.save(`Order-Receipt-${orderData.orderId}.pdf`);
    //         console.log("PDF successfully saved.");

    //     } catch (err) {
    //         console.error("PDF generation failed:", err);
    //         alert("Failed to generate PDF: " + err.message);
    //     }
    // };


    const handleDownloadReceipt = async () => {
        try {
            console.log("Starting PDF generation...");

            const pdf = new jsPDF('p', 'mm', 'a4');

            const orderData = {
                orderId: String(order._id || 'N/A'),
                totalAmount: String(`₹${order.pricing?.total || '0'}`),
                paymentStatus: String(order.payment?.status || 'PENDING'),
                paymentMethod: String(order.payment?.method?.toUpperCase() || 'N/A'),
                orderStatus: String(order.status || 'PENDING'),
                orderDate: String(new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) || new Date().toLocaleDateString()),

                customerName: String(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`),
                customerEmail: String(order.customer?.email || 'N/A'),
                customerPhone: String(order.customer?.phone || 'N/A'),

                shippingAddress: {
                    name: String(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`),
                    address1: String(order.shippingAddress?.flatHouse || ''),
                    address2: String(order.shippingAddress?.areaStreet || ''),
                    city: String(order.shippingAddress?.townCity || ''),
                    state: String(order.shippingAddress?.state || ''),
                    pincode: String(order.shippingAddress?.pinCode || '')
                },

                products: [{
                    name: String(order.size?.name || 'Nameplate'),
                    size: String(order.size?.dimensions || 'N/A'),
                    material: 'Nameplate Material',
                    frameColor: 'Custom Design',
                    thickness: 'Standard',
                    quantity: '1',
                    price: String(`₹${order.size?.price || '0'}`)
                }]
            };

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

            // Title
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(88, 28, 135);
            pdf.text('ORDER RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
            pdf.setTextColor(0, 0, 0);
            yPosition += 15;

            // Order ID and Date
            addText(`Order ID: ${orderData.orderId}`, margin, yPosition, 10, 'normal');
            const dateText = `Date: ${orderData.orderDate}`;
            const dateWidth = pdf.getTextWidth(dateText);
            addText(dateText, pageWidth - margin - dateWidth, yPosition, 10, 'normal');
            yPosition += 10;

            addLine(yPosition);
            yPosition += 10;

            // Order Status
            addText('ORDER STATUS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 8;

            addText(`Payment Status: ${orderData.paymentStatus}`, margin, yPosition, 10, 'normal');
            addText(`Order Status: ${orderData.orderStatus}`, margin + 80, yPosition, 10, 'normal');
            yPosition += 6;

            addText(`Payment Method: ${orderData.paymentMethod}`, margin, yPosition, 10, 'normal');
            yPosition += 12;

            addLine(yPosition);
            yPosition += 10;

            // Customer Information
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

            // Shipping Address
            addText('SHIPPING ADDRESS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 8;

            addText(orderData.shippingAddress.name, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(orderData.shippingAddress.address1, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(orderData.shippingAddress.address2, margin, yPosition, 10, 'normal');
            yPosition += 6;
            addText(`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}`, margin, yPosition, 10, 'normal');
            yPosition += 12;

            addLine(yPosition);
            yPosition += 10;

            // // Product Details Header
            // addText('PRODUCT DETAILS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            // yPosition += 10;

            // // Table Header
            // pdf.setFillColor(240, 240, 240);
            // pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

            // // Define column positions for better alignment
            // const colItem = margin + 2;
            // const colSpecs = margin + 40;
            // const colQty = pageWidth - margin - 35;
            // const colPrice = pageWidth - margin - 20;

            // addText('Item', colItem, yPosition, 10, 'bold');
            // addText('Specifications', colSpecs, yPosition, 10, 'bold');
            // addText('Qty', colQty, yPosition, 10, 'bold');
            // addText('Price', colPrice, yPosition, 10, 'bold');
            // yPosition += 10;

            // // Product rows
            // orderData.products.forEach((product) => {
            //     if (yPosition > pageHeight - 40) {
            //         pdf.addPage();
            //         yPosition = margin;
            //     }

            //     // Item name
            //     addText(product.name, colItem, yPosition, 10, 'normal');

            //     // Specifications
            //     const specs = `${product.size}, ${product.material}, ${product.frameColor}`;
            //     addText(specs, colSpecs, yPosition, 9, 'normal');

            //     // Quantity
            //     addText(product.quantity, colQty, yPosition, 10, 'normal');

            //     // Price (right-aligned)
            //     const priceText = product.price;
            //     const priceWidth = pdf.getTextWidth(priceText);
            //     addText(priceText, pageWidth - margin - priceWidth - 2, yPosition, 10, 'normal');
            //     yPosition += 8;
            // });

            // yPosition += 5;
            // addLine(yPosition);
            // yPosition += 10;

            // // Total Amount Section
            // pdf.setFillColor(88, 28, 135);
            // pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');

            // // Total label (left side)
            // pdf.setFontSize(12);
            // pdf.setFont('helvetica', 'bold');
            // pdf.setTextColor(255, 255, 255);
            // pdf.text('TOTAL AMOUNT', margin + 2, yPosition + 2);

            // // Total amount (right side, properly aligned)
            // pdf.setFontSize(14);
            // pdf.setFont('helvetica', 'bold');
            // const totalWidth = pdf.getTextWidth(orderData.totalAmount);
            // pdf.text(orderData.totalAmount, pageWidth - margin - totalWidth - 2, yPosition + 2);

            // pdf.setTextColor(0, 0, 0);
            // pdf.setFont('helvetica', 'normal');



            // Product Details Header
            addText('PRODUCT DETAILS', margin, yPosition, 12, 'bold', [88, 28, 135]);
            yPosition += 10;

            // Table Header
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

            // Define column positions - using actual measurements
            const colItem = margin + 2;           // 22mm from left
            const colSpecs = margin + 20;         // 40mm from left
            const colQty = pageWidth - 70;        // Fixed position for Qty
            const colPrice = pageWidth - 32;      // Fixed position for Price

            addText('Item', colItem, yPosition, 10, 'bold');
            addText('Specifications', colSpecs, yPosition, 10, 'bold');
            addText('Qty', colQty, yPosition, 10, 'bold');
            addText('Price', colPrice, yPosition, 10, 'bold');
            yPosition += 10;

            // Product rows
            orderData.products.forEach((product) => {
                if (yPosition > pageHeight - 40) {
                    pdf.addPage();
                    yPosition = margin;
                }

                const startY = yPosition;

                // Item name
                addText(product.name, colItem, startY, 10, 'normal');

                // Specifications (each on new line)
                addText(product.size, colSpecs, startY, 9, 'normal');
                addText(product.material, colSpecs, startY + 5, 9, 'normal');
                addText(product.frameColor, colSpecs, startY + 10, 9, 'normal');

                // Quantity
                addText(product.quantity, colQty, startY, 10, 'normal');

                // Price
                addText(product.price, colPrice, startY, 10, 'normal');

                yPosition += 18;
            });

            yPosition += 5;
            addLine(yPosition);
            yPosition += 10;

            // Total Amount Section
            pdf.setFillColor(88, 28, 135);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');

            // Total label
            addText('TOTAL AMOUNT', margin + 2, yPosition + 3, 12, 'bold', [255, 255, 255]);

            // Total amount (right aligned)
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const totalAmount = orderData.totalAmount;
            pdf.text(totalAmount, pageWidth - 40, yPosition + 3);

            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');

            // Footer
            yPosition = pageHeight - 30;
            addLine(yPosition);
            yPosition += 8;

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(100, 100, 100);
            pdf.text('Thank you for your order!', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 6;
            pdf.setFont('helvetica', 'normal');
            pdf.text('For any queries, please contact customer support', pageWidth / 2, yPosition, { align: 'center' });

            pdf.save(`Order-Receipt-${orderData.orderId}.pdf`);
            console.log("PDF successfully saved.");

        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF: " + err.message);
        }
    };



    const handleDownloadImage = async () => {
        if (!order?.design?.customizedImage) return;

        try {
            const res = await fetch(order.design.customizedImage);
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `order-${order._id}-nameplate.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download image', err);
            alert('Failed to download image');
        }
    };

    const handleStatusUpdate = async () => {
        const token = localStorage.getItem('token');

        try {
            setUpdating(true);
            setSuccessMessage('');

            const updateData = { status: selectedStatus };
            if (trackingNumber) updateData.trackingNumber = trackingNumber;

            const res = await axios.patch(
                `http://localhost:4000/api/admin/nameplate-orders/${id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrder(res.data.order);
            setShowStatusModal(false);
            setSuccessMessage('✅ Order status updated and email sent to customer!');
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setError('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
            confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
            processing: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
            shipped: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
            delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
            cancelled: 'bg-red-500/20 text-red-300 border-red-500/50'
        };
        return colors[status] || colors.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-purple-200">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center bg-red-500/10 border border-red-500/20 rounded-xl p-8">
                    <p className="text-red-400 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-6xl mx-auto">

                {/* Header Card
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Nameplate Order</h1>
                            <p className="text-purple-200 text-sm">Order ID: {order._id}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium shadow-lg">
                                {order.status}
                            </span>
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">Receipt</span>
                            </button>
                            <button
                                onClick={handleDownloadImage}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Image</span>
                            </button>
                        </div>
                    </div>
                </div> */}
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-300" />
                        <p className="text-emerald-200">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-300" />
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Header Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Nameplate Order</h1>
                            <p className="text-purple-200 text-sm">Order ID: {order._id}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Update Status
                            </button>
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">Receipt</span>
                            </button>
                            <button
                                onClick={handleDownloadImage}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Image</span>
                            </button>
                        </div>
                    </div>

                    {/* Current Status Display */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="text-purple-200 text-sm">Current Status:</span>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Customer Details */}
                    <InfoCard icon={<User className="w-5 h-5" />} title="Customer Details">
                        <InfoRow label="Name" value={`${order.customer.firstName} ${order.customer.lastName}`} />
                        <InfoRow label="Email" value={order.customer.email} />
                        <InfoRow label="Phone" value={order.customer.phone} />
                    </InfoCard>

                    {/* Size & Pricing */}
                    <InfoCard icon={<Package className="w-5 h-5" />} title="Size & Pricing">
                        <InfoRow label="Size" value={order.size.name} />
                        <InfoRow label="Dimensions" value={order.size.dimensions} />
                        <InfoRow label="Price" value={`₹${order.size.price}`} />
                    </InfoCard>

                    {/* Shipping Address */}
                    <InfoCard icon={<MapPin className="w-5 h-5" />} title="Shipping Address">
                        <div className="text-purple-100 leading-relaxed">
                            {order.shippingAddress.flatHouse}<br />
                            {order.shippingAddress.areaStreet}<br />
                            {order.shippingAddress.townCity}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}<br />
                            {order.shippingAddress.country}
                        </div>
                    </InfoCard>

                    {/* Payment Details */}
                    <InfoCard icon={<CreditCard className="w-5 h-5" />} title="Payment">
                        <InfoRow label="Method" value={order.payment.method.toUpperCase()} />
                        <InfoRow label="Status" value={order.payment.status} />
                        <InfoRow label="Amount" value={`₹${order.payment.amount}`} />
                    </InfoCard>

                </div>

                {/* Design Preview - Full Width */}
                <div className="mt-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-600/30 rounded-lg">
                            <ImageIcon className="w-5 h-5 text-purple-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Design Preview</h2>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src={order.design.customizedImage}
                            alt="Customized Nameplate"
                            className="rounded-xl max-w-full h-auto border-2 border-white/20 shadow-2xl"
                        />
                    </div>
                </div>

                {/* Pricing Breakdown - Full Width */}
                <div className="mt-6 bg-linear-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-600/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-purple-300" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Pricing Breakdown</h2>
                    </div>
                    <div className="space-y-3">
                        <InfoRow label="Subtotal" value={`₹${order.pricing.subtotal}`} />
                        <InfoRow label="Shipping" value={`₹${order.pricing.shippingCharges}`} />
                        <InfoRow label="Tax" value={`₹${order.pricing.tax}`} />
                        <InfoRow label="Discount" value={`₹${order.pricing.discount}`} />
                        <div className="pt-3 mt-3 border-t border-white/20">
                            <InfoRow
                                label="Total"
                                value={`₹${order.pricing.total}`}
                                labelClass="text-lg font-bold text-white"
                                valueClass="text-lg font-bold text-emerald-400"
                            />
                        </div>
                    </div>
                </div>

            </div>



            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-linear-to-br from-slate-800 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <RefreshCw className="w-6 h-6" />
                            Update Order Status
                        </h3>

                        <div className="space-y-4">
                            {/* Status Selection */}
                            <div>
                                <label className="block text-purple-200 text-sm font-medium mb-2">
                                    Order Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="pending" className="bg-purple-900">Pending</option>
                                    <option value="confirmed" className="bg-purple-900">Confirmed</option>
                                    <option value="processing" className="bg-purple-900">Processing</option>
                                    <option value="shipped" className="bg-purple-900">Shipped</option>
                                    <option value="delivered" className="bg-purple-900">Delivered</option>
                                    <option value="cancelled" className="bg-purple-900">Cancelled</option>
                                </select>
                            </div>

                            {/* Tracking Number (shown when shipped) */}
                            {(selectedStatus === 'shipped' || selectedStatus === 'delivered') && (
                                <div>
                                    <label className="block text-purple-200 text-sm font-medium mb-2 flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        Tracking Number
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter tracking number"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-blue-200 text-sm flex items-start gap-2">
                                    <Send className="w-4 h-4 mt-0.5 shrink-0" />
                                    An email notification will be sent to the customer at <strong>{order.customer.email}</strong>
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updating}
                                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {updating ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update & Send Email'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Add jsPDF script */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        </main>
    );
}

/* ================== COMPONENTS ================== */

function InfoCard({ icon, title, children }) {
    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/30 rounded-lg">
                    {icon}
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function InfoRow({ label, value, labelClass = "text-purple-200", valueClass = "text-white font-medium" }) {
    return (
        <div className="flex justify-between items-start text-sm">
            <span className={labelClass}>{label}</span>
            <span className={`${valueClass} text-right max-w-[60%]`}>{value}</span>
        </div>
    );
}