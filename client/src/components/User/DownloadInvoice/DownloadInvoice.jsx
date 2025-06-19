import React from 'react';

const DownloadInvoice = ({ id, order }) => {
  const generateInvoiceHTML = (orderData) => {
    const invoiceDate = new Date().toLocaleDateString();
    const orderDate = new Date(orderData.createdAt).toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - Order ${orderData._id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
          }
          .invoice-container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 0 10px rgba(0,0,0,0.1); 
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #007bff; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #007bff; 
            margin-bottom: 5px; 
          }
          .invoice-title { 
            font-size: 24px; 
            color: #333; 
            margin-bottom: 10px; 
          }
          .invoice-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px; 
          }
          .info-section { 
            flex: 1; 
          }
          .info-section h3 { 
            color: #007bff; 
            margin-bottom: 10px; 
            font-size: 16px; 
          }
          .info-section p { 
            margin: 5px 0; 
            color: #666; 
          }
          .item-details { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
          }
          .item-header { 
            color: #007bff; 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px; 
          }
          .item-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 5px 0; 
          }
          .item-row:not(:last-child) { 
            border-bottom: 1px solid #e9ecef; 
          }
          .total-section { 
            background: #007bff; 
            color: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: right; 
          }
          .total-amount { 
            font-size: 24px; 
            font-weight: bold; 
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e9ecef; 
            color: #666; 
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-success { background: #28a745; color: white; }
          .status-warning { background: #ffc107; color: #212529; }
          .status-info { background: #17a2b8; color: white; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">Auction House</div>
            <div class="invoice-title">INVOICE</div>
            <p>Invoice #: AH-${orderData._id.slice(-8).toUpperCase()}</p>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>Bill To:</h3>
              <p><strong>${orderData.name}</strong></p>
              <p>${orderData.address}</p>
              <p>Phone: ${orderData.phoneNo}</p>
            </div>
            <div class="info-section" style="text-align: right;">
              <h3>Invoice Details:</h3>
              <p>Invoice Date: ${invoiceDate}</p>
              <p>Order Date: ${orderDate}</p>
              <p>Order ID: ${orderData._id}</p>
              <p>Status: <span class="status-badge status-success">${orderData.status}</span></p>
            </div>
          </div>

          <div class="item-details">
            <div class="item-header">Auction Item Details</div>
            <div class="item-row">
              <span><strong>Item Title:</strong></span>
              <span>${orderData.title}</span>
            </div>
            <div class="item-row">
              <span><strong>Starting Bid:</strong></span>
              <span>₹${orderData.biddingStartPrice}</span>
            </div>
            <div class="item-row">
              <span><strong>Winning Bid:</strong></span>
              <span>₹${orderData.highestBid}</span>
            </div>
            <div class="item-row">
              <span><strong>Bid Status:</strong></span>
              <span><strong style="color: #28a745;">Won</strong></span>
            </div>
          </div>

          <div class="total-section">
            <div style="margin-bottom: 10px;">Total Amount</div>
            <div class="total-amount">₹${orderData.highestBid}</div>
          </div>

          <div class="footer">
            <p>Thank you for participating in our auction!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p style="margin-top: 20px; font-size: 12px;">
              Generated on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadInvoice = () => {
    if (!order) {
      alert('Order data not available for invoice generation');
      return;
    }

    try {
      const invoiceHTML = generateInvoiceHTML(order);
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order._id.slice(-8).toUpperCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <button
      onClick={downloadInvoice}
      className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
      disabled={!order}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      Download Invoice
    </button>
  );
};

export default DownloadInvoice;