import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Package,
  ChevronDown,
  Star,
  CheckCircle,
  Calendar,
  CreditCard,
  Edit2,
  X,
  Loader2,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { useToast, toastResult } from "../../components/Toast";
import { ModelType, OrderStatus } from "../../enums/enums";
import { OrderItem, Review, Order } from "../../interfaces/interfaces";
import CustomerLayout from "../../layouts/CustomerLayout";
import { OrderService } from "../../services/order.service";
import { ReviewService } from "../../services/review.service";
import { useSocketInvalidation } from "../../hooks/socket.hook";

// ─── Helpers ──────────────────────────────────────────────────────
const fmtKES = (n: number) => `KES ${n.toLocaleString("en-KE")}`;
const shortId = (id: string) => (id.length > 8 ? `${id.slice(0, 8)}…` : id);
const isEditable = (createdAt: Date | string) =>
  Date.now() - new Date(createdAt).getTime() < 60 * 60 * 1000; // < 1 hour

const STATUS_STYLE: Record<string, string> = {
  AwaitingPayment: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Paid: "bg-blue-50 text-blue-700 ring-blue-200",
  Processing: "bg-orange-50 text-orange-700 ring-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
};

// ─── Star picker ──────────────────────────────────────────────────
const StarPicker: React.FC<{
  value: number;
  onChange: (n: number) => void;
}> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="transition-transform hover:scale-110"
        aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
      >
        <Star
          className={`w-6 h-6 ${n <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      </button>
    ))}
  </div>
);

// ─── Review modal ─────────────────────────────────────────────────
interface ReviewModalProps {
  item: OrderItem;
  orderId: string;
  existingReview?: Review;
  onClose: () => void;
  onSaved: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  item,
  orderId,
  existingReview,
  onClose,
  onSaved,
}) => {
  const toast = useToast();
  const [rating, setRating] = useState(existingReview?.Rating ?? 5);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<{ Message: string }>({
    defaultValues: { Message: existingReview?.Message ?? "" },
  });

  const isUpdate = !!existingReview;

  const onSubmit = async ({ Message }: { Message: string }) => {
    if (rating === 0) {
      toast.warning("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      const result = isUpdate
        ? await ReviewService.Update(existingReview!.ReviewId, {
            Rating: rating,
            Message,
          })
        : await ReviewService.Create({
            ProductId: item.ProductId,
            OrderId: orderId,
            Rating: rating,
            Message,
          });
      toastResult(result, toast);
      if (result.Success) {
        reset();
        onSaved();
        onClose();
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.Title ?? "Server Error", e?.response?.data?.ErrorMessage ?? "Could not save review.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (e = false) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
      e
        ? "border-red-300 focus:ring-red-100"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "fadeUp .25s ease-out" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-start justify-between gap-4"
          style={{ background: "linear-gradient(135deg,#0d1a42,#1660eb)" }}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-0.5">
              {isUpdate ? "Edit Review" : "Leave a Review"}
            </p>
            <h3 className="font-display font-700 text-white text-base leading-snug truncate">
              {item.Product?.Name ?? "Product"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Your Rating <span className="text-red-400">*</span>
            </label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Review Comment <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register("Message", {
                required: "Please write a review",
                minLength: { value: 10, message: "At least 10 characters" },
              })}
              rows={4}
              placeholder="Share your experience with this product…"
              className={`${inputCls(!!errors.Message)} resize-none`}
            />
            {errors.Message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.Message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />{" "}
                {isUpdate ? "Update Review" : "Submit Review"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Order item row ───────────────────────────────────────────────
const OrderItemRow: React.FC<{
  item: OrderItem;
  orderId: string;
  isDelivered: boolean;
}> = ({ item, orderId, isDelivered }) => {
  const qc = useQueryClient();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const existingReview = item.Product?.Reviews?.[0];
  const hasReview = !!existingReview;
  const canEdit = hasReview && isEditable(existingReview!.CreatedAt);
  const thumb = item.Product?.Images?.[0]?.ImageUrl;

  return (
    <>
      <div className="flex items-start gap-3 py-4 border-b border-slate-50 last:border-0">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {thumb ? (
            <img
              src={thumb}
              alt={item.Product?.Name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-6 h-6 text-slate-300 m-auto mt-4" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 leading-snug">
            {item.Product?.Name ?? "Product"}
          </p>
          {item.Product?.Category && (
            <p className="text-xs text-slate-400">
              {item.Product.Category.Name}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
            <span>
              Qty: <strong className="text-slate-700">{item.Quantity}</strong>
            </span>
            <span>@{fmtKES(Number(item.PriceAtPurchase))} each</span>
          </div>

          {/* Review section — only for delivered orders */}
          {isDelivered && (
            <div className="mt-2">
              {hasReview ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Show stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-3.5 h-3.5 ${n <= (existingReview?.Rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Reviewed
                  </span>
                  {/* Edit — only within 1 hour */}
                  {canEdit && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline font-medium"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 mt-0.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  Leave a review
                </button>
              )}
            </div>
          )}
        </div>

        {/* Line total */}
        <div className="shrink-0 text-right">
          <p className="font-bold text-sm text-slate-900">
            {fmtKES(item.PriceAtPurchase * item.Quantity)}
          </p>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          item={item}
          orderId={orderId}
          existingReview={existingReview}
          onClose={() => setShowReviewModal(false)}
          onSaved={() => qc.invalidateQueries({ queryKey: [ModelType.Order] })}
        />
      )}
    </>
  );
};

// ─── Order card ───────────────────────────────────────────────────
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const isDelivered = order.Status === OrderStatus.Delivered;

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Summary row — clickable to expand */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        {/* Chevron */}
        <div
          className={`shrink-0 w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180 bg-primary-50 border-primary-200" : ""}`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="font-mono text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded"
              title={order.OrderId}
            >
              #{shortId(order.OrderId)}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset ${STATUS_STYLE[order.Status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}
            >
              {order.Status}
            </span>
            {isDelivered && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Delivered
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              {order.Items?.length ?? 0} item
              {(order.Items?.length ?? 0) !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(order.CreatedAt).toLocaleDateString("en-KE", {
                dateStyle: "medium",
              })}
            </span>
            {order.Payments?.[0]?.MpesaReferenceCode && (
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                M-Pesa:{" "}
                <strong className="text-slate-600 font-mono">
                  {order.Payments[0].MpesaReferenceCode}
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="shrink-0 text-right">
          <p className="font-900 text-navy-900 text-base">
            {fmtKES(order.TotalAmount)}
          </p>
          <p className="text-[11px] text-slate-400">Total</p>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-slate-100">
          {/* Items */}
          <div className="px-5">
            {order.Items && order.Items.length > 0 ? (
              order.Items.map((item) => (
                <OrderItemRow
                  key={item.OrderItemId}
                  item={item}
                  orderId={order.OrderId}
                  isDelivered={isDelivered}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 italic py-4">
                No item details available.
              </p>
            )}
          </div>

          {/* Order summary footer */}
          <div className="mx-5 mb-4 mt-1 rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
            <div className="flex justify-between items-center px-4 py-2.5 text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-700">
                {fmtKES(
                  order.Items?.reduce(
                    (s, i) => s + i.PriceAtPurchase * i.Quantity,
                    0,
                  ) ?? order.TotalAmount,
                )}
              </span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="font-semibold text-sm text-slate-700">
                Order Total
              </span>
              <span className="font-bold text-base text-navy-900">
                {fmtKES(order.TotalAmount)}
              </span>
            </div>
          </div>

          {/* Status note for non-delivered orders */}
          {!isDelivered && order.Status !== OrderStatus.Cancelled && (
            <div className="mx-5 mb-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <Clock className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
              Reviews can be left once your order is marked as{" "}
              <strong className="text-slate-700 ml-1">Delivered</strong>.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────
const OrdersPage: React.FC = () => {
  const toast = useToast();
  useSocketInvalidation(ModelType.Order);

  let { data, isLoading, isError } = useQuery({
    queryKey: [`user${ModelType.Order.toLowerCase()}`],
    queryFn: () => OrderService.FetchByUser(),
    staleTime: 60000,
  });

  React.useEffect(() => {
    if (isError)
      toast.error("Could not load orders", "Please refresh the page.");
    // eslint-disable-next-line
  }, [isError]);

  const orders = data?.DataList ?? [];

  return (
    <CustomerLayout
      title="My Orders"
      subtitle="Track your orders and leave product reviews"
    >
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card p-5 space-y-3"
            >
              <div className="skeleton h-4 w-1/3 rounded-lg" />
              <div className="skeleton h-3 w-1/2 rounded-lg" />
              <div className="skeleton h-3 w-1/4 rounded-lg" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <h3 className="font-display text-lg font-700 text-navy-900 mb-2">
            No orders yet
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Browse our products and place your first order.
          </p>
          <a
            href="/explore?tab=products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
          >
            <ShoppingBag className="w-4 h-4" /> Shop Now
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.OrderId} order={order as unknown as Order} />
          ))}
        </div>
      )}
    </CustomerLayout>
  );
};

export default OrdersPage;