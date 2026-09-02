"use client";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Search,
  XCircle,
} from "lucide-react";

import type { Order, OrderId, OrderStatus } from "@/types/order";

type ReviewStatus = Exclude<OrderStatus, "Pending">;

interface OrdersTableProps {
  orders: Order[];
  allOrders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function OrdersTable({
  orders,
  allOrders,
  setOrders,
  search,
  onSearchChange,
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pendingOrdersCount = allOrders.filter(
    (order) => order.status === "Pending",
  ).length;

  const approvedOrdersCount = allOrders.filter(
    (order) => order.status === "Approved",
  ).length;

  const updateStatus = (orderId: OrderId, newStatus: ReviewStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order,
      ),
    );

    setSelectedOrder((previousSelectedOrder) => {
      if (!previousSelectedOrder || previousSelectedOrder.id !== orderId) {
        return previousSelectedOrder;
      }

      return {
        ...previousSelectedOrder,
        status: newStatus,
      };
    });
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="w-full space-y-6 p-1">
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Pending Approvals
              </p>

              <h2 className="text-3xl font-extrabold text-amber-500">
                {pendingOrdersCount}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-500 dark:bg-amber-500/10">
              <Clock aria-hidden="true" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Total Enrolled
              </p>

              <h2 className="text-3xl font-extrabold text-emerald-500">
                {approvedOrdersCount}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-500/10">
              <CheckCircle aria-hidden="true" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Total Orders
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {allOrders.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10">
              <CreditCard aria-hidden="true" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-slate-100 p-5 dark:border-zinc-800">
          <div className="relative max-w-md">
            <Search
              aria-hidden="true"
              className="absolute top-3.5 left-4 text-slate-400 dark:text-zinc-500"
              size={18}
            />

            <input
              type="search"
              placeholder="Search by student, TrxID or course..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <th className="p-4 pl-6">Order ID & Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-zinc-800 dark:text-zinc-300">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30"
                >
                  <td className="p-4 pl-6">
                    <span className="mb-0.5 block text-xs font-bold text-blue-600 dark:text-blue-400">
                      {order.id}
                    </span>

                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.studentName}
                    </div>

                    <div className="text-xs text-slate-400 dark:text-zinc-500">
                      {order.studentEmail}
                    </div>
                  </td>

                  <td className="p-4 font-medium text-slate-800 dark:text-zinc-200">
                    {order.courseName}
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.amount}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-zinc-400">
                      {order.paymentMethod}
                    </div>
                  </td>

                  <td className="p-4 font-mono text-xs tracking-wider text-slate-600 dark:text-zinc-400">
                    {order.trxId}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : order.status === "Pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 pr-6 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      aria-label={`View order ${order.id}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      <Eye aria-hidden="true" size={14} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="py-12 text-center text-slate-400 dark:text-zinc-500">
              No orders found.
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-details-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3
              id="order-details-title"
              className="mb-4 text-xl font-bold text-slate-900 dark:text-white"
            >
              Order Details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="border-b pb-3 dark:border-zinc-800">
                <span className="block text-xs text-slate-400">
                  Student Info
                </span>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedOrder.studentName}
                </p>

                <p className="text-xs text-slate-500">
                  {selectedOrder.studentEmail}
                </p>
              </div>

              <div className="border-b pb-3 dark:border-zinc-800">
                <span className="block text-xs text-slate-400">
                  Requested Course
                </span>

                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedOrder.courseName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b pb-3 dark:border-zinc-800">
                <div>
                  <span className="block text-xs text-slate-400">
                    Payment Method & Amount
                  </span>

                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedOrder.paymentMethod} ({selectedOrder.amount})
                  </p>
                </div>

                <div>
                  <span className="block text-xs text-slate-400">
                    Transaction ID
                  </span>

                  <p className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {selectedOrder.trxId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar aria-hidden="true" size={14} />
                Ordered on: {selectedOrder.date}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {selectedOrder.status === "Pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedOrder.id, "Approved")}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
                  >
                    <CheckCircle aria-hidden="true" size={14} />
                    Approve Order
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(selectedOrder.id, "Cancelled")}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white transition hover:bg-rose-500"
                  >
                    <XCircle aria-hidden="true" size={14} />
                    Cancel Order
                  </button>
                </>
              ) : (
                <div className="w-full rounded-xl bg-slate-50 py-2 text-center text-xs font-semibold dark:bg-zinc-800">
                  This order is already{" "}
                  <span className="underline">{selectedOrder.status}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-3 w-full cursor-pointer rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
