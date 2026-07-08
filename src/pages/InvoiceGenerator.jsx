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
