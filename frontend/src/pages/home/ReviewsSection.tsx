import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Quote, Loader2, MapPin } from "lucide-react";
import { ModelType } from "../../enums/enums";
import { useSocketInvalidation } from "../../hooks/socket.hook";
import { Review } from "../../interfaces/interfaces";
import { ReviewService } from "../../services/review.service";

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "star-filled fill-current" : "star-empty"}`}
      />
    ))}
  </div>
);

const ReviewCard: React.FC<{ review: Review; index: number }> = ({
  review,
  index,
}) => {
  const user = review.User;
  const initials = user ? `${user.FirstName[0]}${user.SecondName[0]}` : "RZ";
  const bgColors = [
    "from-primary-500 to-primary-700",
    "from-amber-500 to-orange-500",
    "from-teal-500 to-electric-600",
    "from-navy-600 to-navy-800",
    "from-purple-500 to-indigo-600",
  ];

  return (
    <div
      className="reveal product-card p-6 flex flex-col gap-4"
      style={{ transitionDelay: `${(index % 3) * 0.12}s` }}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary-100 fill-primary-50" />

      {/* Stars */}
      <StarRating rating={review.Rating} />

      {/* Message */}
      <p className="text-slate-600 text-sm leading-relaxed italic flex-1">
        "{review.Message ?? "Great service and excellent work!"}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgColors[index % bgColors.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold text-navy-900 text-sm">
            {user ? `${user.FirstName} ${user.SecondName}` : "Valued Customer"}
          </p>
          {user?.County && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              {user.County}
            </div>
          )}
        </div>
        {/* Verified badge */}
        <div className="ml-auto bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Verified
        </div>
      </div>
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  useSocketInvalidation(ModelType.Review);

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.Review.toLowerCase()],
    queryFn: () => ReviewService.FetchApproved(),
    staleTime: 1000 * 60 * 5,
  });

  const reviews = data?.DataList ?? [];

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  // Compute aggregate
  const avgRating =
    reviews.reduce((acc, r) => acc + r.Rating, 0) / reviews.length;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="reveal badge badge-primary mb-4 mx-auto w-fit">
            <Star className="w-3 h-3 fill-current" /> Client Reviews
          </div>
          <h2 className="reveal section-title">
            Trusted by Hundreds{" "}
            <span className="text-gradient">Across Kenya</span>
          </h2>
          <div className="reveal stagger-2 flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(avgRating) ? "star-filled fill-current" : "star-empty"}`}
                />
              ))}
            </div>
            <span className="font-700 text-navy-900 text-lg">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm">
              from {reviews.length} verified reviews
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={review.ReviewId} review={review as Review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;