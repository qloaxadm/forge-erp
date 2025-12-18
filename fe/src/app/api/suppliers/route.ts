import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const dataFilePath = path.join(process.cwd(), 'data', 'suppliers.json');

// Helper function to read suppliers data
async function readSuppliers() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write suppliers data
async function writeSuppliers(data: any) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// GET /api/suppliers
export async function GET() {
  try {
    const suppliers = await readSuppliers();
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

// POST /api/suppliers
export async function POST(request: Request) {
  try {
    const newSupplier = await request.json();
    const suppliers = await readSuppliers();
    
    // Generate a simple ID (in a real app, use a proper ID generator)
    newSupplier.id = Date.now().toString();
    newSupplier.createdAt = new Date().toISOString();
    newSupplier.updatedAt = new Date().toISOString();
    
    suppliers.push(newSupplier);
    await writeSuppliers(suppliers);
    
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
