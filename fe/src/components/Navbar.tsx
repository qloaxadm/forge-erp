"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  FileText,
  Factory,
  IndianRupee,
  Truck,
  Users,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";

/* ================= INVENTORY ICON ================= */
function InventoryIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-220 -220 440 440" fill="none">
      <path
        d="M200,-90
           C200,-142.43 157.43,-185 105,-185
           H-105
           C-157.43,-185 -200,-142.43 -200,-90
           V90
           C-200,142.43 -157.43,185 -105,185
           H105
           C157.43,185 200,142.43 200,90
           Z"
        stroke="currentColor"
        strokeWidth="34"
        fill="none"
      />
    </svg>
  );
}

/* ================= NAVBAR ================= */

  export default function Navbar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {


  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen
      ${collapsed ? "w-20" : "w-72"}
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-700
      transition-all duration-300 flex flex-col`}
    >
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <span className="text-lg font-semibold">
              Inventory<span className="text-red-600">ERP</span>
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>

      {/* SCROLLABLE NAV (SCROLLBAR HIDDEN) */}
      <nav
        className="
        flex-1 overflow-y-auto px-2 py-4 space-y-6
        no-scrollbar
        "
      >
        {/* DASHBOARD */}
        {/* <NavSection title="Dashboard" collapsed={collapsed}>
          <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Main Dashboard" collapsed={collapsed} />
          <NavItem href="/dashboard/inventory" icon={<InventoryIcon />} label="Inventory Dashboard" collapsed={collapsed} />
          <NavItem href="/dashboard/sales" icon={<BarChart3 />} label="Sales Dashboard" collapsed={collapsed} />
          <NavItem href="/dashboard/margin" icon={<BarChart3 />} label="Margin Dashboard" collapsed={collapsed} />
        </NavSection> */}

        {/* INVENTORY */}
        <NavSection title="Inventory" collapsed={collapsed}>
          <NavItem href="/inventory/materials" icon={<InventoryIcon />} label="Raw Materials" collapsed={collapsed} />
          <NavItem href="/inventory/grn" icon={<Package />} label="GRN" collapsed={collapsed} />
          <NavItem href="/inventory/stock" icon={<Package />} label="Stock Ledger" collapsed={collapsed} />
          <NavItem href="/inventory/production" icon={<Factory />} label="Production" collapsed={collapsed} />
        </NavSection>

        {/* INDENTS */}
        {/* <NavSection title="Indents" collapsed={collapsed}>
          <NavItem href="/indents/create" icon={<FileText />} label="Create Indent" collapsed={collapsed} />
          <NavItem href="/indents" icon={<FileText />} label="Indent List" collapsed={collapsed} />
          <NavItem href="/indents/approval" icon={<FileText />} label="Indent Approval" collapsed={collapsed} />
          <NavItem href="/indents/route-plan" icon={<Truck />} label="Route Plan" collapsed={collapsed} />
        </NavSection> */}

        {/* PRICING */}
        <NavSection title="Pricing" collapsed={collapsed}>
          <NavItem href="/pricing/price-lists" icon={<IndianRupee />} label="Price Lists" collapsed={collapsed} />
          <NavItem href="/pricing/schemes" icon={<IndianRupee />} label="Schemes" collapsed={collapsed} />
        </NavSection>

        {/* SALES */}
        {/* <NavSection title="Sales" collapsed={collapsed}>
          <NavItem href="/sales/sales-orders" icon={<FileText />} label="Sales Orders" collapsed={collapsed} />
          <NavItem href="/sales/invoices" icon={<FileText />} label="Invoices" collapsed={collapsed} />
          <NavItem href="/sales/outstanding" icon={<IndianRupee />} label="Outstanding" collapsed={collapsed} />
        </NavSection> */}

        {/* PAYMENTS */}
        {/* <NavSection title="Payments" collapsed={collapsed}>
          <NavItem href="/payments" icon={<IndianRupee />} label="Payments" collapsed={collapsed} />
        </NavSection> */}

        {/* DISPATCH */}
        {/* <NavSection title="Dispatch" collapsed={collapsed}>
          <NavItem href="/dispatch/create" icon={<Truck />} label="Create Dispatch" collapsed={collapsed} />
          <NavItem href="/dispatch/pending" icon={<Truck />} label="Pending Dispatch" collapsed={collapsed} />
          <NavItem href="/dispatch/logs" icon={<Truck />} label="Dispatch Logs" collapsed={collapsed} />
          <NavItem href="/dispatch/route-plan" icon={<Truck />} label="Route Plan" collapsed={collapsed} />
        </NavSection> */}

        {/* ANALYTICS */}
        {/* <NavSection title="Analytics" collapsed={collapsed}>
          <NavItem href="/analytics/sales" icon={<BarChart3 />} label="Sales Analytics" collapsed={collapsed} />
          <NavItem href="/analytics/margin" icon={<BarChart3 />} label="Margin Analytics" collapsed={collapsed} />
        </NavSection> */}

        {/* ADMIN */}
        <NavSection title="Admin" collapsed={collapsed}>
          {/* <NavItem href="/admin/customers" icon={<Users />} label="Customers" collapsed={collapsed} />
          
          <NavItem href="/admin/materials" icon={<Users />} label="Materials" collapsed={collapsed} />
          <NavItem href="/admin/products" icon={<Users />} label="Products" collapsed={collapsed} />
          <NavItem href="/admin/routes" icon={<Users />} label="Routes" collapsed={collapsed} />
          <NavItem href="/admin/vehicles" icon={<Users />} label="Vehicles" collapsed={collapsed} />
          <NavItem href="/admin/drivers" icon={<Users />} label="Drivers" collapsed={collapsed} />
          <NavItem href="/admin/users" icon={<Users />} label="Users" collapsed={collapsed} /> */}
          <NavItem href="/admin/suppliers" icon={<Users />} label="Suppliers" collapsed={collapsed} />
        </NavSection>
      </nav>
    </aside>
  );
}

/* ================= HELPERS ================= */

function NavSection({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="px-3 mb-2 text-xs font-semibold uppercase text-gray-400">
          {title}
        </p>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <span className="w-6 h-6">{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}
