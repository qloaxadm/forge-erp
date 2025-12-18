import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const dataFilePath = path.join(process.cwd(), 'data', 'suppliers.json');

// Helper function to read suppliers data
async function readSuppliers() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
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

type Params = {
  params: {
    id: string;
  };
};

// GET /api/suppliers/[id]
export async function GET(request: Request, { params }: Params) {
  try {
    const suppliers = await readSuppliers();
    const supplier = suppliers.find((s: any) => s.id === params.id);

    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 }
    );
  }
}

// PUT /api/suppliers/[id]
export async function PUT(request: Request, { params }: Params) {
  try {
    const updatedSupplier = await request.json();
    const suppliers = await readSuppliers();
    
    const index = suppliers.findIndex((s: any) => s.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    suppliers[index] = {
      ...suppliers[index],
      ...updatedSupplier,
      updatedAt: new Date().toISOString(),
    };

    await writeSuppliers(suppliers);
    
    return NextResponse.json(suppliers[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    );
  }
}

// DELETE /api/suppliers/[id]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const suppliers = await readSuppliers();
    const filteredSuppliers = suppliers.filter((s: any) => s.id !== params.id);

    if (suppliers.length === filteredSuppliers.length) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    await writeSuppliers(filteredSuppliers);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}
