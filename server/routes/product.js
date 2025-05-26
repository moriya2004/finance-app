import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/products/:id", async (req, res) => {
  try {
    const product  = await Product.findById(
      req.params.id,
      req.body,
    );
    if (!product ) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.body.price !== undefined) product.price = req.body.price;
    if (req.body.expense !== undefined) product.expense = req.body.expense;
    const updatedProduct = await product.save();
    console.log("Updated product:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


export default router;