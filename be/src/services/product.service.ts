import { ProductRepo } from "../repositories/product.repo";
import { CreateProductInput, UpdateProductInput } from "../validators/products.schema";

export const ProductService = {
  async createProduct(data: CreateProductInput) {
    // Check if product with same code already exists
    const existingProduct = await ProductRepo.findByCode(data.code);
    if (existingProduct) {
      throw new Error('Product with this code already exists');
    }

    return ProductRepo.create(data);
  },

  async getProduct(id: number) {
    const product = await ProductRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async listProducts() {
    return ProductRepo.findAll();
  },

  async updateProduct(id: number, data: UpdateProductInput) {
    // Check if product exists
    const product = await ProductRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // If code is being updated, check for duplicates
    if (data.code && data.code !== product.code) {
      const existingProduct = await ProductRepo.findByCode(data.code);
      if (existingProduct) {
        throw new Error('Another product with this code already exists');
      }
    }

    return ProductRepo.update(id, data);
  },

  async deleteProduct(id: number) {
    // Check if product exists
    const product = await ProductRepo.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // TODO: Add checks for existing references (e.g., in orders, inventory, etc.)
    
    return ProductRepo.delete(id);
  },

  async getProductByCode(code: string) {
    const product = await ProductRepo.findByCode(code);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },
};
