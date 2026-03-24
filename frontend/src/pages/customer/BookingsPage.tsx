import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModelType, ServiceRequestStatus } from "../../enums/enums";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useQuery } from "@tanstack/react-query";
import { ServiceRequestService } from "../../services/service.request.service";
import { useToast } from "../../components/Toast";
import { useSocketInvalidation } from "../../hooks/socket.hook";

const STATUS_STYLE: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.Pending]: "bg-yellow-50 text-yellow-700",
  [ServiceRequestStatus.Contacted]: "bg-blue-50 text-blue-700",
  [ServiceRequestStatus.Scheduled]: "bg-purple-50 text-purple-700",
  [ServiceRequestStatus.Completed]: "bg-green-50 text-green-700",
  [ServiceRequestStatus.Cancelled]: "bg-red-50 text-red-700",
};

const BookingsPage: React.FC = () => {
  useSocketInvalidation(ModelType.ServiceRequest);
  const toast = useToast(); 

  const {data: bookings, isLoading} = useQuery({
    queryKey: [`user${ModelType.ServiceRequest.toLowerCase()}`],
    queryFn: () => ServiceRequestService.FetchByUserId(),
    staleTime: 60000
  });

  let userBookings = bookings?.DataList ?? [];
  
  return (
  <CustomerLayout
    title="My Bookings"
    subtitle="Track your service booking requests"
  >
    {userBookings.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-card p-16 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-200" />
        <h3 className="font-display text-lg font-700 text-navy-900 mb-2">
          No bookings yet
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Book one of our services to get started.
        </p>
        <Link to="/explore?tab=services" className="btn-primary mx-auto w-fit">
          Browse Services
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {userBookings.map((booking) => (
          <div
            key={booking.RequestId}
            className="bg-white rounded-2xl shadow-card p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-navy-900">
                    {booking.Service.Title}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[booking.Status as ServiceRequestStatus]}`}
                  >
                    {booking.Status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Ref: {booking.RequestId}
                </span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4 text-slate-300" />
                Preferred:{" "}
                {(booking.PreferredDate ?? new Date()).toLocaleDateString("en-KE", {
                  dateStyle: "long",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-slate-300" />
                {booking.LocationDescription}
              </div>
            </div>
            {booking.Status === ServiceRequestStatus.Scheduled && (
              <div className="mt-4 flex gap-2">
                <a
                  href="tel:+254700000000"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Confirm with Team
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </CustomerLayout>
) };

export default BookingsPage;