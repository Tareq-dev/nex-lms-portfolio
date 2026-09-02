"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Pagination from "@/components/common/Pagination";
import OrdersTable from "@/components/orders/OrdersTable";

import type { Order } from "@/types/order";

const ITEMS_PER_PAGE = 5;

const initialOrders: Order[] = [
  {
    id: "ORD-9832",
    studentName: "Rakibul Hasan",
    studentEmail: "rakib@gmail.com",
    courseName: "MERN Stack Web Development",
    amount: "৳4500",
    paymentMethod: "Bkash",
    trxId: "BKX7H29D81",
    date: "12 June, 2026",
    status: "Pending",
  },
  {
    id: "ORD-9831",
    studentName: "Sumaiya Akter",
    studentEmail: "sumaiya@yahoo.com",
    courseName: "Next.js Premium Course",
    amount: "৳5000",
    paymentMethod: "Nagad",
    trxId: "NGD3M91L05",
    date: "11 June, 2026",
    status: "Approved",
  },
  {
    id: "ORD-9830",
    studentName: "Shakib Ahmed",
    studentEmail: "shakib@gmail.com",
    courseName: "UI/UX Advanced Design",
    amount: "৳3200",
    paymentMethod: "Rocket",
    trxId: "RKT8D21A90",
    date: "10 June, 2026",
    status: "Pending",
  },
  {
    id: "ORD-9829",
    studentName: "Nusrat Jahan",
    studentEmail: "nusrat@gmail.com",
    courseName: "Digital Marketing Strategy",
    amount: "৳2800",
    paymentMethod: "Bkash",
    trxId: "BKX6F73T22",
    date: "9 June, 2026",
    status: "Approved",
  },
  {
    id: "ORD-9828",
    studentName: "Mahmudul Hasan",
    studentEmail: "mahmud@gmail.com",
    courseName: "Python Programming Fundamentals",
    amount: "৳3500",
    paymentMethod: "Nagad",
    trxId: "NGD4P82K10",
    date: "8 June, 2026",
    status: "Cancelled",
  },
  {
    id: "ORD-9827",
    studentName: "Tasnim Akter",
    studentEmail: "tasnim@gmail.com",
    courseName: "Full Stack Web Mastery",
    amount: "৳6500",
    paymentMethod: "Card",
    trxId: "CRD7M91B23",
    date: "7 June, 2026",
    status: "Approved",
  },
  {
    id: "ORD-9826",
    studentName: "Mehedi Hasan",
    studentEmail: "mehedi@gmail.com",
    courseName: "React and Redux Masterclass",
    amount: "৳4200",
    paymentMethod: "Bkash",
    trxId: "BKX3N82C41",
    date: "6 June, 2026",
    status: "Pending",
  },
  {
    id: "ORD-9825",
    studentName: "Farzana Islam",
    studentEmail: "farzana@gmail.com",
    courseName: "Professional Graphic Design",
    amount: "৳3800",
    paymentMethod: "Nagad",
    trxId: "NGD5L72D19",
    date: "5 June, 2026",
    status: "Approved",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [search, setSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredOrders = useMemo<Order[]>(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return orders;
    }

    return orders.filter((order) =>
      `${order.id} ${order.studentName} ${order.studentEmail} ${order.trxId} ${order.courseName} ${order.paymentMethod} ${order.status}`
        .toLowerCase()
        .includes(searchText),
    );
  }, [orders, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo<Order[]>(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    // নতুন search শুরু হলে প্রথম page দেখাবে
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-100 p-6 dark:bg-zinc-950">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Course Orders
          </h1>

          <p className="mt-1 text-slate-500 dark:text-zinc-400">
            Review course purchases, verify transaction IDs, and approve access.
          </p>
        </div>

        <div className="space-y-4">
          <OrdersTable
            orders={paginatedOrders}
            allOrders={orders}
            setOrders={setOrders}
            search={search}
            onSearchChange={handleSearchChange}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={filteredOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
