// controllers/expenseController.ts
import { Request, Response } from "express";
import Expense from "../models/Expense";

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.findAll({ include: ["project"] });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id, { include: ["project"] });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      expenseCode,
      category,
      description,
      amount,
      expenseDate,
      vendor,
      receiptUrl,
      notes,
    } = req.body;

    const newExpense = await Expense.create({
      projectId,
      expenseCode,
      category,
      description,
      amount,
      expenseDate,
      vendor,
      receiptUrl,
      notes,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      projectId,
      expenseCode,
      category,
      description,
      amount,
      expenseDate,
      vendor,
      receiptUrl,
      notes,
    } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.update({
      projectId,
      expenseCode,
      category,
      description,
      amount,
      expenseDate,
      vendor,
      receiptUrl,
      notes,
    });

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
