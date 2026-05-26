// import React from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable"; // ✅ direct import

// const InvoiceGenerator = ({ order, items, shippingAddress, paymentMethod }) => {
//   const generatePDF = () => {
//     if (!order || !items?.length) {
//       alert("Invoice data missing.");
//       return;
//     }

//     try {
//       const doc = new jsPDF();
//       const formatCurrency = (value) =>
//         `Rs. ${new Intl.NumberFormat("en-IN").format(value || 0)}`;

//       doc.setFontSize(18);
//       doc.text("Invoice", 14, 20);

//       const tableColumn = ["Product", "Variant", "Qty", "Price", "Total"];
//       const tableRows = items.map((item) => [
//         item.productId?.name || "N/A",
//         item.productId?.variant || "-",
//         item.quantity.toString(),
//         formatCurrency(item.price),
//         formatCurrency((item.price || 0) * (item.quantity || 1)),
//       ]);

//       // ✅ Correct for v4.x
//       autoTable(doc, {
//         startY: 64,
//         head: [tableColumn],
//         body: tableRows,
//       });

//       doc.save("Invoice.pdf");
//     } catch (error) {
//       console.error("Invoice generation failed:", error);
//     }
//   };

//   return (
//     <button className="btn btn-success" onClick={generatePDF}>
//       📄 Download Invoice
//     </button>
//   );
// };

// export default InvoiceGenerator;

















// import React from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const InvoiceGenerator = ({ order, items, shippingAddress, paymentMethod }) => {
//   const generatePDF = () => {
//     if (!order || !items?.length) {
//       alert("Invoice data missing.");
//       return;
//     }

//     try {
//       const doc = new jsPDF({ unit: "pt", format: "a4" });
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const marginX = 40;

//       // ✅ Fixed: use INR instead of ₹ to avoid encoding issue
//       const formatCurrency = (value) =>
//         `INR ${new Intl.NumberFormat("en-IN").format(value || 0)}`;

//       // 🏬 HEADER
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(18);
//       doc.text("Joyory E-Commerce", marginX, 40);
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "normal");
//       doc.text("Invoice", pageWidth - 100, 40);
//       doc.line(marginX, 50, pageWidth - marginX, 50);

//       // 📋 ORDER DETAILS
//       let y = 70;
//       doc.setFontSize(11);
//       doc.text(`Order ID: ${order._id || "N/A"}`, marginX, y);
//       y += 15;
//       doc.text(
//         `Invoice Date: ${new Date(order.createdAt || new Date()).toLocaleDateString()}`,
//         marginX,
//         y
//       );
//       y += 15;
//       doc.text(`Payment Method: ${paymentMethod || "N/A"}`, marginX, y);
//       y += 15;
//       doc.text(`Transaction ID: ${order?.paymentId || "N/A"}`, marginX, y);
//       y += 25;

//       // 📦 SHIPPING DETAILS
//       doc.setFont("helvetica", "bold");
//       doc.text("Shipping Address:", marginX, y);
//       doc.setFont("helvetica", "normal");

//       const addr = shippingAddress || {};
//       const addressLines = [
//         addr.name,
//         addr.addressLine1,
//         addr.addressLine2,
//         `${addr.city}, ${addr.state} - ${addr.pincode}`,
//         addr.country,
//         `Phone: ${addr.phone}`,
//         addr.email ? `Email: ${addr.email}` : "",
//       ].filter(Boolean);
//       y += 15;
//       doc.text(addressLines, marginX, y);

//       // 🛍️ ORDER TABLE
//       const tableStartY = y + addressLines.length * 14 + 20;
//       const tableColumn = ["Product", "Variant", "Qty", "Price", "Total"];
//       const tableRows = items.map((item) => [
//         item.productId?.name || "N/A",
//         item.productId?.variant || "-",
//         item.quantity.toString(),
//         formatCurrency(item.price),
//         formatCurrency(item.price * item.quantity),
//       ]);

//       autoTable(doc, {
//         startY: tableStartY,
//         head: [tableColumn],
//         body: tableRows,
//         theme: "grid",
//         headStyles: { fillColor: [60, 60, 60], textColor: 255, halign: "center" },
//         styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
//         columnStyles: {
//           0: { cellWidth: 160 },
//           1: { cellWidth: 80, halign: "center" },
//           2: { cellWidth: 60, halign: "center" },
//           3: { cellWidth: 80, halign: "right" },
//           4: { cellWidth: 80, halign: "right" },
//         },
//       });

//       // 💰 PRICE SUMMARY
//       const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
//       const discount = order?.discount || 0;
//       const couponCode = order?.couponCode || "-";
//       const couponDiscount = order?.couponDiscount || 0;
//       const shippingCharge = order?.shippingCharge ?? 0;
//       const grandTotal = subtotal - discount - couponDiscount + shippingCharge;

//       const summaryStartY = doc.lastAutoTable.finalY + 20;
//       const summaryX = pageWidth - 220;

//       doc.setFont("helvetica", "bold");
//       doc.text("Order Summary", summaryX, summaryStartY);
//       doc.setFont("helvetica", "normal");

//       const lines = [
//         `Subtotal: ${formatCurrency(subtotal)}`,
//         `Discount: -${formatCurrency(discount)}`,
//         couponCode !== "-" ? `Coupon (${couponCode}): -${formatCurrency(couponDiscount)}` : null,
//         `Shipping: ${shippingCharge === 0 ? "Free" : formatCurrency(shippingCharge)}`,
//         `Grand Total: ${formatCurrency(grandTotal)}`,
//       ].filter(Boolean);

//       let yPos = summaryStartY + 15;
//       lines.forEach((line, i) => {
//         if (i === lines.length - 1) doc.setFont("helvetica", "bold");
//         doc.text(line, summaryX, yPos);
//         yPos += 15;
//       });

//       // 🖋️ FOOTER
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.text("Thank you for shopping with Joyory E-Commerce!", marginX, yPos + 40);
//       doc.text("For support, contact: support@joyory.com", marginX, yPos + 55);

//       doc.save(`Invoice_${order._id || "order"}.pdf`);
//     } catch (error) {
//       console.error("Invoice generation failed:", error);
//       alert("Error generating invoice. Check console for details.");
//     }
//   };

//   return (
//     <button className="btn btn-success" onClick={generatePDF}>
//       📄 Download Invoice
//     </button>
//   );
// };

// export default InvoiceGenerator;






















import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceGenerator = ({
  order,
  items,
  shippingAddress,
  paymentMethod,
  gstRate = "0%",
  gstAmount = 0,
}) => {
  const generatePDF = () => {
    if (!order || !items?.length) {
      alert("Invoice data missing.");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;

      // ✅ Fixed: use INR instead of ₹ to avoid encoding issue
      const formatCurrency = (value) =>
        `INR ${new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value || 0)}`;

      // 🏬 HEADER
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Joyory E-Commerce", marginX, 40);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Invoice", pageWidth - 100, 40);
      doc.line(marginX, 50, pageWidth - marginX, 50);

      // 📋 ORDER DETAILS
      let y = 70;
      doc.setFontSize(11);
      doc.text(`Order ID: ${order._id || "N/A"}`, marginX, y);
      y += 15;
      doc.text(
        `Invoice Date: ${new Date(order.createdAt || new Date()).toLocaleDateString()}`,
        marginX,
        y
      );
      y += 15;
      doc.text(`Payment Method: ${paymentMethod || "N/A"}`, marginX, y);
      y += 15;
      doc.text(`Transaction ID: ${order?.paymentId || "N/A"}`, marginX, y);
      y += 25;

      // 📦 SHIPPING DETAILS
      doc.setFont("helvetica", "bold");
      doc.text("Shipping Address:", marginX, y);
      doc.setFont("helvetica", "normal");

      const addr = shippingAddress || {};
      const addressLines = [
        addr.name,
        addr.addressLine1,
        addr.addressLine2,
        `${addr.city}, ${addr.state} - ${addr.pincode}`,
        addr.country,
        `Phone: ${addr.phone}`,
        addr.email ? `Email: ${addr.email}` : "",
      ].filter(Boolean);
      y += 15;
      doc.text(addressLines, marginX, y);

      // 🛍️ ORDER TABLE
      const tableStartY = y + addressLines.length * 14 + 20;
      const tableColumn = ["Product", "Variant", "Qty", "Price", "Total"];
      const tableRows = items.map((item) => [
        item.productId?.name || "N/A",
        item.productId?.variant || "-",
        item.quantity.toString(),
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity),
      ]);

      autoTable(doc, {
        startY: tableStartY,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60], textColor: 255, halign: "center" },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
        columnStyles: {
          0: { cellWidth: 160 },
          1: { cellWidth: 80, halign: "center" },
          2: { cellWidth: 60, halign: "center" },
          3: { cellWidth: 80, halign: "right" },
          4: { cellWidth: 80, halign: "right" },
        },
      });

      // 💰 PRICE SUMMARY
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const discount = order?.discount || 0;
      const couponCode = order?.couponCode || "-";
      const couponDiscount = order?.couponDiscount || 0;
      const shippingCharge = order?.shippingCharge ?? 0;
      const gstRateLine = gstRate;
      const gstAmountLine = gstAmount;
      const grandTotal = subtotal - discount - couponDiscount + shippingCharge + gstAmountLine;

      const summaryStartY = doc.lastAutoTable.finalY + 20;
      const summaryX = pageWidth - 220;

      doc.setFont("helvetica", "bold");
      doc.text("Order Summary", summaryX, summaryStartY);
      doc.setFont("helvetica", "normal");

      const lines = [
        `Subtotal: ${formatCurrency(subtotal)}`,
        discount > 0 ? `Discount: -${formatCurrency(discount)}` : null,
        couponCode !== "-" ? `Coupon (${couponCode}): -${formatCurrency(couponDiscount)}` : null,
        shippingCharge === 0 ? "Shipping: Free" : `Shipping: ${formatCurrency(shippingCharge)}`,
        gstAmountLine > 0 ? `GST (${gstRateLine}): ${formatCurrency(gstAmountLine)}` : null,
        `Grand Total: ${formatCurrency(grandTotal)}`,
      ].filter(Boolean);

      let yPos = summaryStartY + 15;
      lines.forEach((line, i) => {
        if (i === lines.length - 1) doc.setFont("helvetica", "bold");
        doc.text(line, summaryX, yPos);
        yPos += 15;
      });

      // 🖋️ FOOTER
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Thank you for shopping with Joyory E-Commerce!", marginX, yPos + 40);
      doc.text("For support, contact: support@joyory.com", marginX, yPos + 55);

      doc.save(`Invoice_${order._id || "order"}.pdf`);
    } catch (error) {
      console.error("Invoice generation failed:", error);
      alert("Error generating invoice. Check console for details.");
    }
  };

  return (
    <button className="btn btn-success" onClick={generatePDF}>
      📄 Download Invoice
    </button>
  );
};

export default InvoiceGenerator;











// import React from 'react';
// import { FaFileInvoice, FaRupeeSign, FaPercentage } from 'react-icons/fa';

// const InvoiceGenerator = ({ 
//   order, 
//   items, 
//   shippingAddress, 
//   paymentMethod,
//   gstDetails,
//   totalPaid,
//   mrpTotal,
//   sellingPriceTotal,
//   additionalDiscountTotal,
//   shippingDiscount,
//   shippingDiscountMessage
// }) => {
  
//   const generateInvoice = () => {
//     // Create a new window for the invoice
//     const invoiceWindow = window.open('', '_blank');
    
//     // Calculate totals
//     const calculatedMrpTotal = mrpTotal || items?.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
//     const calculatedSellingPriceTotal = sellingPriceTotal || items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const productDiscount = calculatedMrpTotal - calculatedSellingPriceTotal;
    
//     const invoiceContent = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Invoice - ${order._id}</title>
//         <style>
//           body { 
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//             margin: 0; 
//             padding: 20px; 
//             background: #f8f9fa;
//             color: #333;
//           }
//           .invoice-container { 
//             max-width: 800px; 
//             margin: 0 auto; 
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 0 20px rgba(0,0,0,0.1);
//             padding: 30px;
//           }
//           .header { 
//             display: flex; 
//             justify-content: space-between; 
//             align-items: flex-start;
//             margin-bottom: 40px; 
//             padding-bottom: 20px;
//             border-bottom: 2px solid #e9ecef;
//           }
//           .company-info h1 { 
//             color: #0d6efd; 
//             margin: 0 0 5px 0; 
//             font-size: 28px;
//           }
//           .company-info p { 
//             margin: 3px 0; 
//             color: #6c757d;
//             font-size: 14px;
//           }
//           .invoice-title { 
//             text-align: center; 
//             margin: 30px 0; 
//             padding: 15px;
//             background: linear-gradient(135deg, #0d6efd, #6610f2);
//             color: white;
//             border-radius: 8px;
//           }
//           .invoice-title h2 { 
//             margin: 0; 
//             font-size: 24px;
//           }
//           .invoice-details { 
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 30px;
//             margin-bottom: 40px;
//           }
//           .section { 
//             margin-bottom: 30px; 
//           }
//           .section h4 {
//             color: #0d6efd;
//             margin-bottom: 15px;
//             padding-bottom: 8px;
//             border-bottom: 2px solid #0d6efd;
//             font-size: 18px;
//           }
//           table { 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin: 25px 0; 
//             box-shadow: 0 0 5px rgba(0,0,0,0.05);
//           }
//           th, td { 
//             border: 1px solid #dee2e6; 
//             padding: 12px 15px; 
//             text-align: left; 
//           }
//           th { 
//             background-color: #0d6efd;
//             color: white;
//             font-weight: 600;
//             text-transform: uppercase;
//             font-size: 13px;
//             letter-spacing: 0.5px;
//           }
//           tr:nth-child(even) { background-color: #f8f9fa; }
//           tr:hover { background-color: #e9ecef; }
//           .totals { 
//             float: right; 
//             width: 350px; 
//             margin-top: 30px;
//             background: #f8f9fa;
//             padding: 25px;
//             border-radius: 8px;
//             border: 1px solid #dee2e6;
//           }
//           .total-row { 
//             display: flex; 
//             justify-content: space-between; 
//             padding: 10px 0;
//             border-bottom: 1px dashed #dee2e6;
//           }
//           .gst-section { 
//             background-color: #e7f5ff; 
//             padding: 20px; 
//             border-radius: 8px; 
//             margin: 20px 0;
//             border-left: 4px solid #0d6efd;
//           }
//           .footer { 
//             text-align: center; 
//             margin-top: 60px; 
//             padding-top: 20px;
//             border-top: 2px solid #e9ecef;
//             color: #6c757d; 
//             font-size: 13px;
//             line-height: 1.6;
//           }
//           .badge {
//             display: inline-block;
//             padding: 4px 10px;
//             background: #198754;
//             color: white;
//             border-radius: 4px;
//             font-size: 12px;
//             margin-left: 8px;
//           }
//           .text-success { color: #198754; }
//           .text-info { color: #0dcaf0; }
//           .text-danger { color: #dc3545; }
//           .fw-bold { font-weight: 600; }
//           .text-muted { color: #6c757d; }
//           .border-top { border-top: 2px solid #dee2e6; }
//           .pt-2 { padding-top: 10px; }
//           .mt-2 { margin-top: 10px; }
//           .mb-0 { margin-bottom: 0; }
//         </style>
//       </head>
//       <body>
//         <div class="invoice-container">
//           <!-- Header -->
//           <div class="header">
//             <div class="company-info">
//               <h1>Joyory</h1>
//               <p>E-Commerce Fashion Store</p>
//               <p>Email: support@joyory.com</p>
//               <p>Phone: +91-9876543210</p>
//               <p>GSTIN: 27ABCDE1234F1Z5</p>
//             </div>
//             <div class="invoice-info">
//               <h3 style="color: #0d6efd; margin-bottom: 15px;">TAX INVOICE</h3>
//               <p><strong>Invoice No:</strong> ${order._id}</p>
//               <p><strong>Date:</strong> ${new Date(order.orderDate || new Date()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
//               <p><strong>Time:</strong> ${new Date(order.orderDate || new Date()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
//               ${order.shipmentId ? `<p><strong>Shipment ID:</strong> ${order.shipmentId}</p>` : ''}
//             </div>
//           </div>
          
//           <div class="invoice-title">
//             <h2>INVOICE</h2>
//             <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for your purchase!</p>
//           </div>
          
//           <!-- Order Details -->
//           <div class="invoice-details">
//             <div class="billing-address section">
//               <h4>Billing & Shipping Address</h4>
//               <p><strong>${shippingAddress?.name || 'Customer'}</strong></p>
//               <p>${shippingAddress?.addressLine1 || ''}</p>
//               ${shippingAddress?.addressLine2 ? `<p>${shippingAddress.addressLine2}</p>` : ''}
//               <p>${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} - ${shippingAddress?.pincode || ''}</p>
//               <p>${shippingAddress?.country || 'India'}</p>
//               <p><strong>Phone:</strong> ${shippingAddress?.phone || ''}</p>
//               <p><strong>Email:</strong> ${shippingAddress?.email || ''}</p>
//             </div>
//             <div class="order-info section">
//               <h4>Order Information</h4>
//               <p><strong>Order Date:</strong> ${new Date(order.orderDate || new Date()).toLocaleDateString('en-IN')}</p>
//               ${order.expectedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(order.expectedDelivery).toLocaleDateString('en-IN')}</p>` : ''}
//               <p><strong>Payment Method:</strong> ${paymentMethod}</p>
//               <p><strong>Status:</strong> <span class="badge">${order.shipmentStatus || 'Processing'}</span></p>
//               ${order.courier?.awb ? `<p><strong>AWB Number:</strong> ${order.courier.awb}</p>` : ''}
//               ${order.courier?.name ? `<p><strong>Courier:</strong> ${order.courier.name}</p>` : ''}
//             </div>
//           </div>
          
//           <!-- Products Table -->
//           <div class="section">
//             <h4>Products Details</h4>
//             <table>
//               <thead>
//                 <tr>
//                   <th width="5%">#</th>
//                   <th width="35%">Product</th>
//                   <th width="15%">Variant</th>
//                   <th width="10%">Qty</th>
//                   <th width="15%">MRP</th>
//                   <th width="20%">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${items?.map((item, index) => `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td>${item.productId.name}</td>
//                     <td>${item.productId.variant}</td>
//                     <td>${item.quantity}</td>
//                     <td>₹${item.mrp || item.price}</td>
//                     <td>₹${item.price}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//           </div>
          
//           <!-- Price Breakdown -->
//           <div class="totals">
//             <h4 style="color: #0d6efd; margin-top: 0; margin-bottom: 20px;">Price Summary</h4>
            
//             <!-- MRP -->
//             <div class="total-row">
//               <span>Total MRP:</span>
//               <span>₹${calculatedMrpTotal.toFixed(2)}</span>
//             </div>
            
//             <!-- Product Discount -->
//             ${productDiscount > 0 ? `
//               <div class="total-row">
//                 <span>Product Discount:</span>
//                 <span class="text-success">-₹${productDiscount.toFixed(2)}</span>
//               </div>
//             ` : ''}
            
//             <!-- Additional Discount -->
//             ${additionalDiscountTotal > 0 ? `
//               <div class="total-row">
//                 <span>Additional Discount:</span>
//                 <span class="text-success">-₹${additionalDiscountTotal.toFixed(2)}</span>
//               </div>
//             ` : ''}
            
//             <!-- Shipping Discount -->
//             ${shippingDiscount > 0 ? `
//               <div class="total-row">
//                 <span>Shipping Discount:</span>
//                 <span class="text-success">-₹${shippingDiscount.toFixed(2)}</span>
//               </div>
//             ` : ''}
            
//             <!-- Subtotal -->
//             <div class="total-row" style="border-top: 1px solid #ced4da; padding-top: 15px;">
//               <span><strong>Subtotal:</strong></span>
//               <span><strong>₹${calculatedSellingPriceTotal.toFixed(2)}</strong></span>
//             </div>
            
//             <!-- GST Section -->
//             ${gstDetails ? `
//               <div class="gst-section">
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span><strong>Taxable Amount:</strong></span>
//                   <span>₹${gstDetails.taxableAmount.toFixed(2)}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                   <span>GST (${gstDetails.rate}%):</span>
//                   <span class="text-info">+₹${gstDetails.gstAmount.toFixed(2)}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #0d6efd;">
//                   <span><strong>Total with GST:</strong></span>
//                   <span><strong>₹${gstDetails.totalWithGST.toFixed(2)}</strong></span>
//                 </div>
//               </div>
//             ` : ''}
            
//             <!-- Final Total -->
//             <div class="total-row" style="font-size: 18px; font-weight: bold; border-top: 2px solid #0d6efd; padding-top: 15px; margin-top: 15px;">
//               <span>Amount Paid:</span>
//               <span style="color: #198754;">₹${totalPaid.toFixed(2)}</span>
//             </div>
            
//             <!-- Savings -->
//             ${(productDiscount + additionalDiscountTotal + shippingDiscount) > 0 ? `
//               <div class="total-row" style="color: #198754; font-style: italic; font-size: 14px; padding-top: 15px;">
//                 <span>Total Savings:</span>
//                 <span>₹${(productDiscount + additionalDiscountTotal + shippingDiscount).toFixed(2)}</span>
//               </div>
//             ` : ''}
//           </div>
          
//           <!-- Footer -->
//           <div class="footer">
//             <p style="margin-bottom: 10px;"><strong>Terms & Conditions:</strong></p>
//             <p style="margin-bottom: 20px; font-size: 12px;">
//               1. This is a computer generated invoice and does not require signature.<br>
//               2. Goods once sold will not be taken back or exchanged unless there is a manufacturing defect.<br>
//               3. For any queries regarding this invoice, please contact our customer support.
//             </p>
//             <p>Thank you for shopping with Joyory!</p>
//             <p>For any queries, contact: support@joyory.com | +91-9876543210</p>
//             <p>© ${new Date().getFullYear()} Joyory. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
    
//     invoiceWindow.document.write(invoiceContent);
//     invoiceWindow.document.close();
    
//     // Wait for content to load, then print
//     invoiceWindow.onload = () => {
//       invoiceWindow.focus();
//       setTimeout(() => {
//         invoiceWindow.print();
//       }, 500);
//     };
//   };

//   return (
//     <button 
//       className="btn btn-outline-light d-flex align-items-center gap-2"
//       onClick={generateInvoice}
//       title={gstDetails ? `Generate Invoice (GST ${gstDetails.rate}% included)` : "Generate Invoice"}
//       style={{ minWidth: '100px' }}
//     >
//       <FaFileInvoice />
//       <span className="d-none d-md-inline">Invoice</span>
//       {gstDetails && (
//         <FaPercentage 
//           className="ms-1 text-info" 
//           size={12} 
//           title={`GST ${gstDetails.rate}% included`}
//         />
//       )}
//     </button>
//   );
// };

// export default InvoiceGenerator;