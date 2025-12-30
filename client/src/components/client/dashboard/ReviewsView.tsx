import React, { useEffect, useState } from "react";
import { Star, Users, TrendingUp } from "lucide-react";
import { fetchReviews, fetchReviewStats } from "../../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { IFrontendPopulatedReview } from "../../../types/review";
import { useDebounce } from "../../../hooks/customhooks/useDebounce";


type ReviewStats = {
  totalReviews: number;
  avgRating: number;
  fiveStarReviews: number;
}


 

const ReviewsView: React.FC = () => {
  const [reviews,setReviews] = useState<IFrontendPopulatedReview[]>([])
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [stats, setStats] = useState<ReviewStats | null>(null);


  const debouncedSearchTerm = useDebounce(search,500)

  // const avgRating =
  //   reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length;

    const userId = useSelector((state:RootState) => state.auth.user._id)

    useEffect(() => {
    const getReviews = async () => {
    const reviews = await fetchReviews(userId,debouncedSearchTerm,filterRating);
    setReviews(reviews)
    };
    getReviews();

    const getStats = async () => {
      const stats = await fetchReviewStats(userId);
      console.log('testing reviewww',stats)
      setStats(stats)
    }
    getStats();
    }, [userId, debouncedSearchTerm, filterRating]);




  return (
    <div className="mt-20 p-4 sm:p-6 max-w-7xl mx-auto md:ml-60">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="text-gray-600">
            Feedback from Freelancers
          </p>
        </div>
        <div className="flex items-center mt-3 md:mt-0">
          {/* {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={`${
                i < Math.round(avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))} */}
          <span className="ml-2 text-lg font-semibold">{stats?.avgRating?.toFixed(1) ?? 0}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <Users className="mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{stats?.totalReviews ?? 0}</p>
          <p className="text-gray-600">Total Reviews</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <Star className="mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold">{stats?.avgRating?.toFixed(1) ?? 0}</p>
          <p className="text-gray-600">Average Rating</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center">
          <TrendingUp className="mx-auto text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">
            {/* {reviewsData.filter((r) => r.rating === 5).length} */}
            {stats?.fiveStarReviews ?? 0}
          </p>
          <p className="text-gray-600">5-Star Reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search reviews by client name or project..."
          className="w-full md:w-1/2 border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option>All</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={review.reviewerDetails.profilePicture}
                alt={review.reviewerDetails.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{review.reviewerDetails.fullName}</h3>
                {/* <p className="text-sm text-gray-500">{r.location}</p> */}
              </div>
              {/* {review?.featured && (
                <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  Featured
                </span>
              )} */}
            </div>

            {/* Rating */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`${
                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 font-medium">{review?.rating.toFixed(1)}</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-sm mb-4">{review?.reviewText}</p>

            {/* Project Info */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="font-medium">{review?.projectDetails.title}</span>•
              <span>{new Date(review?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsView;
