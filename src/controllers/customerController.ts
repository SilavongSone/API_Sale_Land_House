import { Request, Response } from "express";
import Customer from "../models/Customer";
import District from "../models/District";
import Province from "../models/Province";
import Sale from "../models/Sale";
import Maintenance from "../models/Maintenance";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    // Customer filters
    const whereCustomer: any = {};
    if (req.query.customerCode) whereCustomer.customerCode = req.query.customerCode;
    if (req.query.gender) whereCustomer.gender = req.query.gender;
    if (req.query.status) whereCustomer.status = req.query.status;

    // District filters
    const whereDistrict: any = {};
    if (req.query.provinceId) whereDistrict.provinceId = req.query.provinceId;
    if (req.query.districtId) whereDistrict.districtId = req.query.districtId;

    const { rows, count } = await Customer.findAndCountAll({
      where: whereCustomer,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      include: [
        {
          model: District,
          as: "district",
          where: Object.keys(whereDistrict).length ? whereDistrict : undefined,
          required: !!Object.keys(whereDistrict).length,
          include: [
            {
              model: Province,
              as: "province",
              attributes: ["provinceName"],
            },
          ],
        },
        { model: Sale, as: "sales" },
        { model: Maintenance, as: "maintenances" },
      ],
    });

    res.status(200).json({
      data: rows,
      pagination: buildPaginationResponse(count, limit, page),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
};


// Get customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      include: ["district", "sales", "maintenances"],
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
};

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      customerCode,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      idCard,
      phone,
      email,
      village,
      districtId,
      notes,
    } = req.body;

    const customer = await Customer.create({
      customerCode,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      idCard,
      phone,
      email,
      village,
      districtId,
      notes,
    });

    res.status(201).json(customer);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating customer", error: error.message });
  }
};

// Update customer by ID
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update(req.body);
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating customer", error: error.message });
  }
};

// Delete customer by ID
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();
    res.json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting customer", error: error.message });
  }
};
