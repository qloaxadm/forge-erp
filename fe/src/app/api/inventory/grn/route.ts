import { NextResponse } from 'next/server';

let GRNS: any[] = []; // mock in-memory store

// GET → list GRNs
export async function GET() {
  return NextResponse.json(GRNS);
}

// POST → create GRN
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      supplier_id,
      supplier_invoice_no,
      supplier_invoice_date,
      transport_cost,
      loading_cost,
      misc_cost,
      items,
    } = body;

    if (!supplier_id || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'Supplier and items are required' },
        { status: 400 }
      );
    }

    const materialTotal = items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.unit_rate,
      0
    );

    const totalCost =
      materialTotal + transport_cost + loading_cost + misc_cost;

    const newGRN = {
      grn: {
        id: GRNS.length + 1,
        supplier_id,
        supplier_invoice_no,
        supplier_invoice_date,
        transport_cost,
        loading_cost,
        misc_cost,
        total_material_cost: materialTotal.toFixed(2),
        total_cost: totalCost.toFixed(2),
        status: 'DRAFT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      grn_items: items.map((item: any, idx: number) => ({
        id: idx + 1,
        grn_id: GRNS.length + 1,
        material_id: item.material_id,
        quantity: item.quantity,
        unit_rate: item.unit_rate,
        line_cost: (item.quantity * item.unit_rate).toFixed(2),
        batch_no: item.batch_no,
        expiry_date: item.expiry_date || null,
      })),
    };

    GRNS.push(newGRN);

    return NextResponse.json(newGRN, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Invalid JSON body' },
      { status: 500 }
    );
  }
}
