import React, { useEffect } from "react";
import { Package, Eye } from "lucide-react";
import { ModelType, OrderStatus } from "../../enums/enums";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { useToast } from "../../components/Toast";
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "../../services/order.service";

const STATUS_STYLE: Record<OrderStatus, string> = {
  [OrderStatus.AwaitingPayment]: "bg-yellow-50 text-yellow-700",
  [OrderStatus.Paid]: "bg-blue-50 text-blue-700",
  [OrderStatus.Processing]: "bg-orange-50 text-orange-700",
  [OrderStatus.Delivered]: "bg-green-50 text-green-700",
  [OrderStatus.Cancelled]: "bg-red-50 text-red-700",
};

const OrdersPage: React.FC = () => {
  useSocketInvalidation(ModelType.Order);
  const toast = useToast();

  let {data: orders, isLoading} = useQuery({
    queryKey: [`user${ModelType.Order.toLowerCase()}`],
    queryFn: () => OrderService.FetchByUser(),
    staleTime: 60000
  });

  let userOrders = orders?.DataList ?? [];
  
  return(
  <CustomerLayout
    title="My Orders"
    subtitle="Track and manage your product orders"
  >
    {userOrders.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-slate-200" />
        <h3 className="font-display text-lg font-700 text-navy-900 mb-2">
          No orders yet
        </h3>
        <p className="text-slate-400 text-sm">
          Browse our products and place your first order.
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {userOrders.map((order) => (
          <div
            key={order.OrderId}
            className="bg-white rounded-2xl shadow-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-navy-900 text-sm">
                  {order.OrderId.slice(0, 6)}{" ..."}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[order.Status as OrderStatus]}`}
                >
                  {order.Status}
                </span>
              </div>
              <p className="text-sm text-slate-500">{order.Items.map((i) => i.Name).join(", ")}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(order.CreatedAt).toLocaleDateString("en-KE", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-900 text-navy-900 text-lg">
                KES {order.TotalAmount.toLocaleString("en-KE")}
              </span>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-200">
                <Eye className="w-4 h-4" />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CustomerLayout>
)};

export default OrdersPage;