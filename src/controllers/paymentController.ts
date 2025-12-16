import { Request, Response } from "express";
import Payment from "../models/Payment";
import Sale from "../models/Sale";
import Currency from "../models/Currency";
import Users from "../models/User";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

interface QueryParams {
  orderBy?: string;
  order?: string;
  saleId?: string;
  billNumber?: string;
  type?: string;
  status?: string;
  currencyId?: string;
}

// ==========================
// GET /payments
// ==========================
export const getAllPayments = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<void> => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    const wherePayment: any = {};
    if (req.query.saleId) wherePayment.saleId = parseInt(req.query.saleId);
    if (req.query.billNumber) wherePayment.billNumber = req.query.billNumber;
    if (req.query.type) wherePayment.type = parseInt(req.query.type);
    if (req.query.status) wherePayment.status = parseInt(req.query.status);
    if (req.query.currencyId) wherePayment.currencyId = parseInt(req.query.currencyId);

    const { rows, count } = await Payment.findAndCountAll({
      where: wherePayment,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      include: [
        { 
          model: Sale, 
          as: "landsale",
          required: false,
        },
        { 
          model: Currency, 
          as: "currency",
          required: false,
        },
        { 
          model: Users, 
          as: "creator",
          required: false,
        },
      ],
    });

    const pagination = buildPaginationResponse(count, limit, page);

    res.status(200).json({
      data: rows,
      ...pagination,
      orderBy,
      order,
    });
  } catch (error: any) {
    console.error("Error in getAllPayments:", error);
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// ==========================
// GET /payment/:id
// ==========================
export const getPaymentById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const paymentId = parseInt(atob(req.params.id), 10);

    if (isNaN(paymentId)) {
      res.status(400).json({ message: "Invalid payment ID" });
      return;
    }

    const payment = await Payment.findByPk(paymentId, {
      include: [
        { 
          model: Sale, 
          as: "landsale",
          required: false,
        },
        { 
          model: Currency, 
          as: "currency",
          required: false,
        },
        { 
          model: Users, 
          as: "creator",
          required: false,
        },
      ],
    });

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.status(200).json({ data: payment });
  } catch (error: any) {
    console.error("Error in getPaymentById:", error);
    res.status(500).json({
      message: "Error fetching payment",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// ==========================
// POST /payment
// ==========================
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  // ✅ เพิ่ม Transaction
  const transaction = await Payment.sequelize!.transaction();
  
  try {
    const data = req.body;

    console.log('💳 Backend: Received payment data:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.saleId || !data.billNumber || !data.amount || !data.currencyId || !data.type || !data.createdById) {
      await transaction.rollback();
      res.status(400).json({ 
        message: "Missing required fields",
        required: ["saleId", "billNumber", "amount", "currencyId", "type", "createdById"]
      });
      return;
    }

    // ✅ ตรวจสอบว่า Sale มีจริง
    console.log('💳 Backend: Checking if Sale exists:', data.saleId);
    const sale = await Sale.findByPk(data.saleId);
    
    if (!sale) {
      await transaction.rollback();
      console.error('❌ Backend: Sale not found:', data.saleId);
      res.status(404).json({ 
        message: `Sale not found with ID: ${data.saleId}. Please make sure the sale was created successfully.` 
      });
      return;
    }

    console.log('✅ Backend: Sale found:', sale.id);

    // Set default status if not provided
    if (!data.status) {
      data.status = 1;
    }

    console.log('💳 Backend: Creating payment with transaction...');
    
    // ✅ สร้าง Payment พร้อม transaction
    const payment = await Payment.create(data, { transaction });
    
    console.log('💳 Backend: Payment created with ID:', payment.id);

    // ✅ Commit transaction
    await transaction.commit();
    console.log('✅✅✅ Backend: Payment transaction COMMITTED successfully! ✅✅✅');

    res.status(201).json({ 
      message: "Payment created successfully", 
      payment: payment.toJSON()
    });
    
  } catch (error: any) {
    // ✅ Rollback on error
    await transaction.rollback();
    console.error("❌ Backend: Error in createPayment:", error);
    console.error("❌ Backend: Error message:", error.message);
    console.error("❌ Backend: Error stack:", error.stack);
    console.error("❌ Backend: Transaction ROLLED BACK");
    
    res.status(500).json({
      message: "Error creating payment",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// ==========================
// PUT /payment/:id
// ==========================
export const updatePayment = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const transaction = await Payment.sequelize!.transaction();
  
  try {
    const paymentId = parseInt(atob(req.params.id), 10);

    if (isNaN(paymentId)) {
      await transaction.rollback();
      res.status(400).json({ message: "Invalid payment ID" });
      return;
    }

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      await transaction.rollback();
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    await payment.update(req.body, { transaction });
    await transaction.commit();
    
    res.status(200).json({ 
      message: "Payment updated successfully", 
      payment 
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error("Error in updatePayment:", error);
    res.status(500).json({
      message: "Error updating payment",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// ==========================
// DELETE /payment/:id
// ==========================
export const deletePayment = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const transaction = await Payment.sequelize!.transaction();
  
  try {
    const paymentId = parseInt(atob(req.params.id), 10);

    if (isNaN(paymentId)) {
      await transaction.rollback();
      res.status(400).json({ message: "Invalid payment ID" });
      return;
    }

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      await transaction.rollback();
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    await payment.destroy({ transaction });
    await transaction.commit();
    
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error: any) {
    await transaction.rollback();
    console.error("Error in deletePayment:", error);
    res.status(500).json({
      message: "Error deleting payment",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// ==========================
// GET /payment/options
// ==========================
export const getPaymentOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments = await Payment.findAll({
      where: { status: 1 },
      attributes: ["id", "billNumber", "amount", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json(payments);
  } catch (error: any) {
    console.error("Error in getPaymentOptions:", error);
    res.status(500).json({
      message: "Error getting payment options",
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};