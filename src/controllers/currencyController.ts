import { Request, Response } from "express";
import Currency from "../models/Currency";

// Get all currencies
export const getAllCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await Currency.findAll({
      // include: ["sales", "payments"],
    });
    res.json(currencies);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching currencies", error: error.message });
  }
};

// Get currency by ID
export const getCurrencyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByPk(id, {
      include: ["sales", "payments"],
    });
    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    res.json(currency);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching currency", error: error.message });
  }
};

// Create a new currency
export const createCurrency = async (req: Request, res: Response) => {
  try {
    const { currencyName, symbol, exchangeRate, isDefault, status } = req.body;
    const currency = await Currency.create({
      currencyName,
      symbol,
      exchangeRate,
      isDefault,
      status,
    });
    res.status(201).json(currency);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating currency", error: error.message });
  }
};

// Update currency by ID
export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByPk(id);
    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    await currency.update(req.body);
    res.json(currency);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating currency", error: error.message });
  }
};

// Delete currency by ID
export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByPk(id);
    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }
    await currency.destroy();
    res.json({ message: "Currency deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting currency", error: error.message });
  }
};
