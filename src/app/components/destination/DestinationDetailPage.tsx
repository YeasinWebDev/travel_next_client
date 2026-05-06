"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ReactLeafletMap from "@/src/app/components/MapComponent";
import { IDestination } from "@/src/app/types/destination.types";
import { TripForm } from "../trip/trip-form";
import { TripFormValues } from "@/src/app/schema/trip.schema";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createTrip } from "../../services/trips/trips";
import { getUser } from "../../services/auth/getme";
import DestinationReviews from "./DestinationReviews";
import { getAllReview } from "../../services/review/review";
import { IUser } from "../../types/trips.types";

export default function DestinationDetailPage({ destination }: { destination: IDestination }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialog, setDialog] = useState(false);
  const router = useRouter();
  const [me, setMe] = useState<IUser>();
  const [reviewList, setReviewList] = useState([]);
  const [reload, setReload] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % destination?.image.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + destination?.image.length) % destination?.image.length);
  };

  const handleTripSubmit = async (data: TripFormValues, resetForm: () => void) => {
    const tripPayload = {
      ...data,
      startDate: format(new Date(data.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(data.endDate), "yyyy-MM-dd"),
      destination: destination._id,
    };

    try {
      const res = await createTrip(tripPayload);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        resetForm();
        setDialog(false);
        if (res?.data) {
          router.push(`/trips/${res.data._id}`);
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getMe = async () => {
      const data = await getUser();
      setMe(data);
    };
    getMe();
  }, []);

  useEffect(() => {
    const getReview = async () => {
      if (destination?._id) {
        const data = await getAllReview(destination._id as string);
        setReviewList(data?.data);
      }
    };
    getReview();
  }, [destination?._id, reload]);

  const averageRating = reviewList.length > 0 ? (reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length).toFixed(1) : "0.0";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Image Section */}
            <div className="relative">
              <div className="relative h-64 md:h-80 lg:h-[500px]">
                <Image
                  src={destination?.image[currentImageIndex]}
                  alt={`${destination?.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full font-semibold text-sm ${destination?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {destination?.status.toUpperCase()}
                  </span>
                </div>

                {/* Image Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {destination?.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"}`}
                    />
                  ))}
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{destination?.name}</h1>
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg font-medium">{destination?.location}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="bg-gray-50 px-4 py-3 overflow-x-auto">
                <div className="flex space-x-3">
                  {destination?.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"}`}
                    >
                      <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Rating & Description */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          <div className="flex text-yellow-400 mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`w-6 h-6 ${star <= Number(averageRating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                        </div>
                        <span className="text-gray-600">
                          ({reviewList.length} {reviewList.length === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {destination?.price} <span className="text-sm font-normal text-gray-600">bdt / person</span>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">{destination?.description}</p>
                    </div>
                  </div>

                  {/* Activities Section */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Things to Do
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {destination?.activities.map((activity, index) => (
                        <div key={index} className="group flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:shadow transition-shadow">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-800 font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Location
                    </h2>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-1">Coordinates</p>
                      <p className="font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">
                        {destination?.coordinates?.lat.toFixed(4)}, {destination?.coordinates?.lng.toFixed(4)}
                      </p>
                    </div>
                    <div className="h-96 rounded-xl overflow-hidden border border-gray-200">
                      <ReactLeafletMap lat={destination?.coordinates?.lat || 0} lng={destination?.coordinates?.lng || 0} name={destination?.name} height="100%" />
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking & Details */}
                <div className="space-y-6">
                  {/* Booking Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-lg">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Your Trip</h3>
                      <p className="text-gray-600 text-sm">Book your adventure to {destination?.name}</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        disabled={me === undefined}
                        onClick={() => setDialog(true)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          me === undefined
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        }`}
                      >
                        Create A Tour
                      </button>

                      {me === undefined && <p className="text-sm text-red-500 text-center">Please login to create a tour</p>}

                      <button className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Add to Wishlist
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Destination Details</h3>

                    <div className="space-y-5">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Best Time to Visit</p>
                          <p className="font-semibold text-gray-900">{destination?.bestTimeToVisit}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recommended Duration</p>
                          <p className="font-semibold text-gray-900">2-3 days</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Group Size</p>
                          <p className="font-semibold text-gray-900">2-10 people</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interests Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Travel Interests</h3>
                    <div className="flex flex-wrap gap-3">
                      {destination?.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium rounded-full border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <DestinationReviews reviewList={reviewList} currentUser={me?._id || ""} destinationId={destination._id || ""} reload={reload} setReload={setReload} />
          </div>
        </div>
      </div>

      {/* Trip Form Modal */}
      <TripForm destination={destination} visible={dialog} onClose={() => setDialog(false)} onSubmit={handleTripSubmit} />
    </>
  );
}
