// src/app/api/inventory/rm-ledger/route.ts
import { NextResponse } from "next/server";

// This is a temporary mock data - replace with your actual database call
const mockData = [
  {
    material_name: "Raw Material A",
    lot_no: "RM-A-2025-001",
    expiry_date: "2026-03-31",
    available_qty: 120,
    landed_cost: 52.5,
    stock_value: 6300,
    unit: "kg"
  },
  {
    material_name: "Raw Material B",
    lot_no: "RM-B-2025-002",
    expiry_date: null,
    available_qty: 80,
    landed_cost: 75,
    stock_value: 6000,
    unit: "pcs"
  }
];

export async function GET() {
  try {
    // For now, return mock data
    // In production, replace this with your actual database query
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("RM Ledger API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch RM Ledger data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}