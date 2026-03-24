import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useQuery } from "@tanstack/react-query";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { ModelType } from "../../enums/enums";
import { CartService } from "../../services/cart.service";
import { CartItemService } from "../../services/cart.item.service";
import { toastResult, useToast } from "../../components/Toast";
import { queryClient } from "../..";
import { PaymentService } from "../../services/payment.service";

const CartPage: React.FC = () => {
  const toast = useToast();

  let {data} = useQuery({
    queryKey: [`user${ModelType.Cart.toLowerCase}`],
    queryFn: () => CartService.FetchByUserId()
  });

  let items = data?.Data?.Items ?? [];

  const updateQty = async (id: string, delta: number) => {
    try {
      let result = await CartItemService.Update(id, {Quantity: delta});
      toastResult(result, toast);
      if(result.Success) queryClient.invalidateQueries({
        queryKey: [`user${ModelType.Cart.toLowerCase}`],
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to update cart.");
    }
  };

  const remove = async (id: string) => {
    try {
      let result = await CartItemService.Delete(id);
      toastResult(result, toast);
      if(result.Success) queryClient.invalidateQueries({
        queryKey: [`user${ModelType.Cart.toLowerCase}`],
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.ErrorMessage ?? "Unable to remove item from cart.");
    }
  }

  const subtotal = items.reduce((acc, i) => acc + i.Price * i.Quantity, 0);

  async function handleCreateOrder(): Promise<void> {
    let result = await PaymentService.InitiatePayment();
    toastResult(result, toast);
    if(result.Success) queryClient.invalidateQueries({queryKey: [`user${ModelType.Order.toLowerCase()}`]})
  }

  return (
    <CustomerLayout
      title="My Cart"
      subtitle="Review your items before checkout"
    >
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <h3 className="font-display text-lg font-700 text-navy-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Browse our products and add items to get started.
          </p>
          <Link
            to="/explore?tab=products"
            className="btn-primary mx-auto w-fit"
          >
            Shop Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.CartItemId}
                className="bg-white rounded-2xl shadow-card p-4 flex gap-4 items-center"
              >
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
                    {item.Category}
                  </span>
                  <h4 className="font-display font-700 text-navy-900 text-sm leading-snug truncate">
                    {item.Name}
                  </h4>
                  <p className="font-900 text-navy-900 mt-1">
                    KES {item.Price.toLocaleString("en-KE")}
                  </p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.CartItemId, (item.Quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">
                    {item.Quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.CartItemId, (item.Quantity + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => remove(item.CartItemId)}
                  className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-24">
            <h3 className="font-display font-700 text-navy-900 text-lg mb-5">
              Order Summary
            </h3>
            <div className="space-y-3 mb-5">
              {items.map((i) => (
                <div
                  key={i.CartItemId}
                  className="flex justify-between text-sm text-slate-600"
                >
                  <span className="truncate pr-4">
                    {i.Name} × {i.Quantity}
                  </span>
                  <span className="shrink-0 font-semibold">
                    KES {(i.Price * i.Quantity).toLocaleString("en-KE")}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between font-900 text-navy-900 text-lg">
                <span>Total</span>
                <span>KES {subtotal.toLocaleString("en-KE")}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                VAT inclusive · Delivery quoted separately
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleCreateOrder()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                }}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+254700000000"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all"
              >
                <Phone className="w-4 h-4" />
                Order via Call
              </a>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default CartPage;