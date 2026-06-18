import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Users, ArrowLeft, Menu, X } from "lucide-react";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Produk", path: "/admin/produk", icon: Package },
  { label: "Pesanan", path: "/admin/pesanan", icon: ShoppingBag },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-foreground text-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-foreground border-r border-background/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-background/10">
          <span className="font-display text-2xl font-semibold tracking-wider text-background">
            RECLO
          </span>
          <p className="font-body text-xs text-background/40 mt-1 tracking-wider uppercase">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors rounded ${
                location.pathname === link.path
                  ? "bg-background/10 text-background"
                  : "text-background/50 hover:text-background hover:bg-background/5"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-background/10">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 font-body text-xs text-background/40 hover:text-background transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <header className="border-b border-background/10 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-background">
            <Menu size={24} />
          </button>
          <span className="font-display text-lg font-semibold tracking-wider text-background">
            RECLO Admin
          </span>
        </header>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}