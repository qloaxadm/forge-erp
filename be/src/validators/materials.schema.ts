import { z } from "zod";

const baseMaterialSchema = {
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  category_id: z.number().int({ message: "Category ID must be an integer" }),
  uom_id: z.number().int({ message: "UOM ID must be an integer" }),
  min_stock: z.number().min(0, { message: "Minimum stock cannot be negative" }).optional()
};

export const createMaterialSchema = z.object({
  ...baseMaterialSchema
});

export const updateMaterialSchema = z.object({
  name: baseMaterialSchema.name.optional(),
  code: baseMaterialSchema.code.optional(),
  category_id: baseMaterialSchema.category_id.optional(),
  uom_id: baseMaterialSchema.uom_id.optional(),
  min_stock: baseMaterialSchema.min_stock,
  is_active: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});
