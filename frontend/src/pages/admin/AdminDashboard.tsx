import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Star,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { StatCard, StatusBadge } from "./components/AdminUI";
import { useAuth } from "../../context/AuthContext";
import { ModelType, PaymentStatus, ReviewStatus, ServiceRequestStatus, OrderStatus } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import AdminLayout from "./layouts/AdminLayout";
import { UserService } from "../../services/user.service";
import { OrderService } from "../../services/order.service";
import { PaymentService } from "../../services/payment.service";
import { ReviewService } from "../../services/review.service";
import { ServiceRequestService } from "../../services/service.request.service";

const AdminDashboard: React.FC = () => {
  useSocketInvalidation(
    ModelType.User,
    ModelType.Order,
    ModelType.Payment,
    ModelType.Review,
  );
  const { user } = useAuth();

  const { data: users } = useQuery({
    queryKey: [ModelType.User.toLowerCase()],
    queryFn: () => UserService.FetchAll(),
    staleTime: 60000,
  });
  const { data: orders } = useQuery({
    queryKey: [ModelType.Order.toLowerCase()],
    queryFn: () => OrderService.FetchAll(),
    staleTime: 60000,
  });
  const { data: payments } = useQuery({
    queryKey: [ModelType.Payment.toLowerCase()],
    queryFn: () => PaymentService.GetAllPayments(),
    staleTime: 60000,
  });
  const { data: reviews } = useQuery({
    queryKey: [ModelType.Review.toLowerCase()],
    queryFn: () => ReviewService.FetchAll(),
    staleTime: 60000,
  });
  const { data: requests } = useQuery({
    queryKey: [ModelType.ServiceRequest.toLowerCase()],
    queryFn: () => ServiceRequestService.FetchAll(),
    staleTime: 60000,
  });

  const userList = users?.DataList ?? [];
  const orderList = orders?.DataList ?? [];
  const paymentList = payments?.DataList ?? [];
  const reviewList = reviews?.DataList ?? [];
  const requestList = requests?.DataList ?? [];

  const totalRevenue = paymentList
    .filter((p) => p.Status === PaymentStatus.Completed)
    .reduce((a, p) => a + p.Amount, 0);
  const pendingReviews = reviewList.filter(
    (r) => r.Status === ReviewStatus.Pending,
  ).length;
  const pendingReqs = requestList.filter(
    (r) => r.Status === ServiceRequestStatus.Pending,
  ).length;
  const activeUsers = userList.filter((u) => u.IsActive).length;

  const recentOrders = [...orderList]
    .sort(
      (a, b) =>
        new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime(),
    )
    .slice(0, 5);
  const recentPayments = [...paymentList]
    .sort(
      (a, b) =>
        new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime(),
    )
    .slice(0, 5);

  const formatKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-7 text-white"
        style={{
          background: "linear-gradient(135deg, #0d1a42 0%, #1660eb 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-1">Welcome back,</p>
          <h1 className="font-display text-2xl font-700 mb-1">
            {user ? `${user.FirstName} ${user.SecondName}` : "Admin"} 👋
          </h1>
          <p className="text-white/60 text-sm">
            Here's what's happening with Raz Technologies today.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 text-white/20 text-6xl font-900 font-display select-none">
          RAZ
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Users"
          value={userList.length}
          icon={Users}
          color="bg-primary-50"
          iconColor="text-primary-600"
          trend={{ value: 12, label: "this month" }}
        />
        <StatCard
          label="Total Orders"
          value={orderList.length}
          icon={ShoppingCart}
          color="bg-amber-50"
          iconColor="text-amber-600"
          trend={{ value: 8, label: "this week" }}
        />
        <StatCard
          label="Total Revenue"
          value={formatKES(totalRevenue)}
          icon={CreditCard}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: 15, label: "this month" }}
        />
        <StatCard
          label="Active Users"
          value={activeUsers}
          icon={TrendingUp}
          color="bg-sky-50"
          iconColor="text-sky-600"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Pending Reviews"
          value={pendingReviews}
          icon={Star}
          color="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <StatCard
          label="Pending Requests"
          value={pendingReqs}
          icon={ClipboardList}
          color="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Service Requests"
          value={requestList.length}
          icon={AlertCircle}
          color="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Completed Orders"
          value={
            orderList.filter((o) => o.Status === OrderStatus.Delivered).length
          }
          icon={CheckCircle}
          color="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Tables row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-display font-700 text-slate-900 text-sm">
              Recent Orders
            </h3>
            <a
              href="/admin/orders"
              className="text-xs text-primary-600 font-semibold hover:underline"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {["Order", "Customer", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-700 text-slate-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.OrderId}
                    className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                      {order.OrderId}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {order.User
                        ? `${order.User.FirstName} ${order.User.SecondName}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                      {formatKES(order.TotalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.Status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-display font-700 text-slate-900 text-sm">
              Recent Payments
            </h3>
            <a
              href="/admin/payments"
              className="text-xs text-primary-600 font-semibold hover:underline"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {["Ref", "Customer", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-700 text-slate-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((pay) => (
                  <tr
                    key={pay.PaymentId}
                    className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                      {pay.MpesaReferenceCode ?? "Pending"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {pay.User ? `${pay.User.FirstName}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                      {formatKES(pay.Amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={pay.Status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick alerts */}
      {(pendingReviews > 0 || pendingReqs > 0) && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {pendingReviews > 0 && (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock
                  className="w-4.5 h-4.5 text-yellow-600"
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {pendingReviews} Review{pendingReviews > 1 ? "s" : ""}{" "}
                  Awaiting Approval
                </p>
                <a
                  href="/admin/reviews"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Manage reviews →
                </a>
              </div>
            </div>
          )}
          {pendingReqs > 0 && (
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                <ClipboardList
                  className="w-4.5 h-4.5 text-purple-600"
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {pendingReqs} Service Request{pendingReqs > 1 ? "s" : ""}{" "}
                  Pending
                </p>
                <a
                  href="/admin/service-requests"
                  className="text-xs text-primary-600 hover:underline"
                >
                  View requests →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;