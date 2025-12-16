// controllers/saleController.ts
import { Request, Response } from "express";
import Sale from "../models/Sale";
import Zone from "../models/Zone";
import LandPlot from "../models/LandPlot";
import House from "../models/House";
import Customer from "../models/Customer";
import Staff from "../models/Staff";
import Currency from "../models/Currency";
import Payment from "../models/Payment";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

interface QueryParams {
  limit?: string;
  page?: string;
  skip?: string;
  orderBy?: string;
  order?: string;
}

// Function to generate saleCode
const generateSaleCode = async (): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const prefix = `SALE${year}${month}`;
  
  const lastSale = await Sale.findOne({
    where: {
      saleCode: {
        [require('sequelize').Op.like]: `${prefix}%`
      }
    },
    order: [['saleCode', 'DESC']]
  });
  
  let nextNumber = 1;
  if (lastSale && lastSale.saleCode) {
    const lastNumber = parseInt(lastSale.saleCode.slice(-4));
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};

export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  // ✅ add Transaction
  const transaction = await Sale.sequelize!.transaction();
  
  try {
    console.log('🔵 Backend: Received sale data:', JSON.stringify(req.body, null, 2));
    
    // Generate saleCode if not provided
    if (!req.body.saleCode) {
      req.body.saleCode = await generateSaleCode();
      console.log('🔵 Backend: Generated saleCode:', req.body.saleCode);
    }
    
    // Set saleStatus to DRAFT by default if not provided
    if (!req.body.saleStatus) {
      req.body.saleStatus = "DRAFT";
    }
    
    // Set paymentStatus to PENDING by default if not provided
    if (!req.body.paymentStatus) {
      req.body.paymentStatus = "PENDING";
    }

    console.log('🔵 Backend: Creating sale with transaction...');
    
    // ✅ create Sale with transaction
    const sale = await Sale.create(req.body, { transaction });
    
    console.log('🔵 Backend: Sale created with ID:', sale.id);
    console.log('🔵 Backend: Sale data:', JSON.stringify(sale.toJSON(), null, 2));

    // ✅ update Property status
    if (req.body.propertyType === 'LAND' && req.body.landPlotId) {
      console.log('🔵 Backend: Updating LandPlot status for ID:', req.body.landPlotId);
      
      await LandPlot.update(
        { 
          status: 'SOLD',
          saleId: sale.id 
        },
        { 
          where: { landPlotId: req.body.landPlotId },
          transaction 
        }
      );
      console.log('✅ Backend: LandPlot updated successfully');
      
    } else if (req.body.propertyType === 'HOUSE' && req.body.houseId) {
      console.log('🔵 Backend: Updating House status for ID:', req.body.houseId);
      
      await House.update(
        { 
          status: 'SOLD',
          saleId: sale.id 
        },
        { 
          where: { id: req.body.houseId },
          transaction 
        }
      );
      console.log('✅ Backend: House updated successfully');
    }

    // ✅ CRITICAL: Commit transaction
    await transaction.commit();
    console.log('✅✅✅ Backend: Transaction COMMITTED successfully! ✅✅✅');
    console.log('✅ Backend: Sale ID', sale.id, 'is now PERMANENTLY in database');

    res.status(201).json({ 
      message: "Sale created successfully", 
      sale: sale.toJSON()
    });
    
  } catch (error: any) {
    // ✅ Rollback on error
    await transaction.rollback();
    console.error("❌ Backend: Error in createSale:", error);
    console.error("❌ Backend: Error message:", error.message);
    console.error("❌ Backend: Error stack:", error.stack);
    console.error("❌ Backend: Transaction ROLLED BACK");
    
    res.status(500).json({ 
      message: "Error creating sale", 
      error: error.message || error 
    });
  }
};

export const updateSale = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const transaction = await Sale.sequelize!.transaction();
  
  try {
    const saleId = parseInt(atob(req.params.id), 10);
    
    if (isNaN(saleId)) {
      await transaction.rollback();
      res.status(400).json({ message: "Invalid sale ID" });
      return;
    }

    const sale = await Sale.findByPk(saleId);
    
    if (!sale) {
      await transaction.rollback();
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    await sale.update(req.body, { transaction });
    await transaction.commit();
    
    res.status(200).json({ message: "Sale updated successfully", sale });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in updateSale:", error);
    res.status(500).json({ message: "Error updating sale", error });
  }
};

export const deleteSale = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const transaction = await Sale.sequelize!.transaction();
  
  try {
    const saleId = parseInt(atob(req.params.id), 10);
    
    if (isNaN(saleId)) {
      await transaction.rollback();
      res.status(400).json({ message: "Invalid sale ID" });
      return;
    }

    const sale = await Sale.findByPk(saleId);
    
    if (!sale) {
      await transaction.rollback();
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    await sale.destroy({ transaction });
    await transaction.commit();
    
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in deleteSale:", error);
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

export const getAllSales = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<void> => {
  try {
    const { 
      zoneId, 
      landPlotId, 
      houseId, 
      customerId, 
      sellerId, 
      currencyId,
      propertyType,
      saleStatus,
      paymentStatus
    } = req.query as any;

    const { limit, page, skip, orderBy, order } = parsePagination(req.query);

    const whereConditions: any = {};

    if (zoneId) whereConditions.zoneId = parseInt(zoneId);
    if (landPlotId) whereConditions.landPlotId = parseInt(landPlotId);
    if (houseId) whereConditions.houseId = parseInt(houseId);
    if (customerId) whereConditions.customerId = parseInt(customerId);
    if (sellerId) whereConditions.sellerId = parseInt(sellerId);
    if (currencyId) whereConditions.currencyId = parseInt(currencyId);
    if (propertyType) whereConditions.propertyType = propertyType;
    if (saleStatus) whereConditions.saleStatus = saleStatus;
    if (paymentStatus) whereConditions.paymentStatus = paymentStatus;

    const { rows, count } = await Sale.findAndCountAll({
      where: whereConditions,
      limit,
      offset: skip,
      order: [[orderBy, order]],
    });

    const pagination = buildPaginationResponse(count, limit, page);

    res.json({
      data: rows,
      ...pagination,
      orderBy,
      order,
    });
  } catch (error: any) {
    console.error("Error in getAllSales:", error);
    res.status(500).json({ 
      message: "Error getting sales", 
      error: error.message || error,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getSaleById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const saleId = parseInt(atob(req.params.id), 10);
    
    if (isNaN(saleId)) {
      res.status(400).json({ message: "Invalid sale ID" });
      return;
    }

    const sale = await Sale.findByPk(saleId, {
      include: [
        {
          model: Zone,
          as: "zone",
          required: false,
          attributes: ["id", "name", "code"]
        },
        {
          model: LandPlot,
          as: "landPlot",
          required: false,
          attributes: ["id", "plotNumber", "area", "status"]
        },
        {
          model: House,
          as: "house",
          required: false,
          attributes: ["id", "houseNumber", "type", "status"]
        },
        {
          model: Customer,
          as: "customer",
          required: false,
          attributes: ["id", "firstName", "lastName", "phone", "email"]
        },
        {
          model: Staff,
          as: "seller",
          required: false,
          attributes: ["id", "firstName", "lastName", "position"]
        },
        {
          model: Currency,
          as: "currency",
          required: false,
          attributes: ["id", "code", "symbol"]
        },
        {
          model: Payment,
          as: "payments",
          required: false,
          attributes: ["id", "paymentDate", "amount", "paymentMethod", "status"]
        },
      ],
    });

    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    res.json({ data: sale });
  } catch (error) {
    console.error("Error in getSaleById:", error);
    res.status(500).json({ message: "Error getting sale", error });
  }
};

export const getOption = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<void> => {
  try {
    const sales = await Sale.findAll({
      attributes: ["id", "saleCode", "saleDate"],
      order: [["saleDate", "DESC"]],
    });

    res.json(sales);
  } catch (error) {
    console.error("Error in getOption:", error);
    res.status(500).json({ message: "Error getting options", error });
  }
};