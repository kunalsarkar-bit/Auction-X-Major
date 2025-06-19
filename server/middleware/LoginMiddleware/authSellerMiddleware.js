const jwt = require('jsonwebtoken');
const Seller = require('../../models/LoginSchema/seller');

exports.protectSellerRoute = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies or Authorization header
    if (req.cookies.sellerToken) {
      token = req.cookies.sellerToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if seller exists
    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Add seller to request object
    req.seller = {
      id: seller._id,
      role: seller.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};