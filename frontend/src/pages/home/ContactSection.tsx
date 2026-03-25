import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { type ContactFormData } from "../../interfaces/interfaces";
import { ContactService } from "../../services/contact.service";

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+254 746 430 693",
    href: "tel:+254746430693",
    color: "bg-primary-50 text-primary-600",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "info@raztechnologies.co.ke",
    href: "mailto:info@raztechnologies.co.ke",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Eldoret, Kenya (Serving All Counties)",
    href: "#",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon–Sat 8am–6pm | 24/7 Emergency",
    href: "#",
    color: "bg-navy-50 text-navy-600",
  },
];

const ContactSection: React.FC = () => {
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<ContactFormData>({ mode: "onTouched" });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("loading");
    try {
      const result = await ContactService.SendContactMail(data);
      if (result.Success) {
        setSubmitState("success");
        reset();
      } else {
        setErrorMsg(
          result.ErrorMessage ?? "Something went wrong. Please try again.",
        );
        setSubmitState("error");
      }
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.ErrorMessage ?? "Network error. Please check your connection and try again.");
      setSubmitState("error");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

  return (
    <section id="contact" className="section-padding bg-surface-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <div>
            <div className="reveal badge badge-primary mb-4">
              <MessageSquare className="w-3 h-3" /> Contact Us
            </div>
            <h2 className="reveal section-title mb-4">
              Let's Talk About{" "}
              <span className="text-gradient">Your Project</span>
            </h2>
            <p className="reveal stagger-2 text-slate-500 leading-relaxed mb-10">
              Whether you need a site assessment, a product quote, or just want
              to understand which solution fits your needs — our team is ready
              to help. We respond within 2 hours on business days.
            </p>

            {/* Contact cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map(
                ({ icon: Icon, label, value, href, color }, i) => (
                  <a
                    key={label}
                    href={href}
                    className={`reveal flex items-center gap-4 bg-white p-4 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group`}
                    style={{ transitionDelay: `${i * 0.08}s` }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="font-semibold text-navy-900 text-sm mt-0.5">
                        {value}
                      </p>
                    </div>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Right — Form */}
          <div className="reveal stagger-3">
            <div className="bg-white rounded-3xl shadow-card p-8">
              <h3 className="font-display font-700 text-xl text-navy-900 mb-6">
                Send Us a Message
              </h3>

              {/* Success state */}
              {submitState === "success" && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">
                      Message Sent!
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {submitState === "error" && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errorMsg}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("Name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name is too short" },
                      })}
                      placeholder="John Kamau"
                      className={inputClass(!!errors.Name)}
                    />
                    {errors.Name && touchedFields.Name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.Name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("Phone", {
                        required: "Phone is required",
                        pattern: {
                          value:
                            /^(\+254|0)(7\d{2}|1\d{2})[\s-]?\d{3}[\s-]?\d{3}$/,
                          message:
                            "Enter a valid Kenyan phone number (e.g. 0712345678, 0112345678, +254712345678, or +254112345678)",
                        },
                      })}
                      placeholder="0712 345 678"
                      type="tel"
                      className={inputClass(!!errors.Phone)}
                    />
                    {errors.Phone && touchedFields.Phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.Phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("Email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    placeholder="john@email.com"
                    type="email"
                    className={inputClass(!!errors.Email)}
                  />
                  {errors.Email && touchedFields.Email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register("Subject", {
                      required: "Please select a subject",
                    })}
                    className={`${inputClass(!!errors.Subject)} cursor-pointer`}
                  >
                    <option value="">Select a subject...</option>
                    <option value="Solar Installation">
                      Solar Installation
                    </option>
                    <option value="CCTV Installation">CCTV Installation</option>
                    <option value="Electrical Works">Electrical Works</option>
                    <option value="Internet & WiFi">Internet & WiFi</option>
                    <option value="Electric Fence">Electric Fence</option>
                    <option value="Plumbing Services">Plumbing Services</option>
                    <option value="Intercom & Access Control">
                      Intercom & Access Control
                    </option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                  {errors.Subject && touchedFields.Subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    {...register("Message", {
                      required: "Message is required",
                      minLength: {
                        value: 20,
                        message:
                          "Please provide more detail (at least 20 characters)",
                      },
                    })}
                    rows={4}
                    placeholder="Tell us about your project, location, and any specific requirements..."
                    className={`${inputClass(!!errors.Message)} resize-none`}
                  />
                  {errors.Message && touchedFields.Message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                  }}
                >
                  {submitState === "loading" ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Or call us directly:{" "}
                  <a
                    href="tel:+254746430693"
                    className="text-primary-500 font-semibold hover:underline"
                  >
                    +254 746 430 693
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;