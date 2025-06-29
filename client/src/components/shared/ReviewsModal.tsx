
import { useState } from "react";
import { Star, X } from "lucide-react";
import { IFrontendPopulatedReview } from "../../types/review";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews?: IFrontendPopulatedReview[];
}

export default function ReviewsModal({ isOpen, onClose, reviews = [] }: ReviewsModalProps) {
  const [sortOption, setSortOption] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

  const filteredReviews = reviews
    .filter((review) => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      if (sortOption === "newest") {
        return (new Date(b.createdAt || "")?.getTime() || 0) - (new Date(a.createdAt || "")?.getTime() || 0);
      } else if (sortOption === "highest") {
        return b.rating - a.rating;
      } else if (sortOption === "lowest") {
        return a.rating - b.rating;
      } else if (sortOption === "most_helpful") {
        return (b.helpful || 0) - (a.helpful || 0);
      }
      return 0;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto flex flex-col shadow-xl">
        {/* Header with #0A142F background */}
        <div
          className="flex justify-between items-center p-5"
          style={{ backgroundColor: "#0A142F" }}
        >
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Close modal"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <button
                onClick={() => setFilterRating(0)}
                className={`px-3 py-1 rounded-full text-sm mr-2 ${
                  filterRating === 0 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All Ratings
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1 rounded-full text-sm mr-2 ${
                    filterRating === rating ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {rating} <Star size={14} className={filterRating === rating ? "text-white" : "text-yellow-400"} />
                </button>
              ))}
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <p>No reviews match your current filter.</p>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 py-4">
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={review.reviewerId.profilePicture || "/default-avatar.png"}
                    alt={review.reviewerId.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review.reviewerId.fullName}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-1">{review.reviewText}</p>
                {review.createdAt && (
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
