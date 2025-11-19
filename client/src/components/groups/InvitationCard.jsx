import { Check, X, Clock } from "lucide-react";
import { useState } from "react";

export const InvitationCard = ({ invitation, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    await onAccept(invitation._id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject(invitation._id);
    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {invitation.groupId?.name}
          </h3>
          {invitation.groupId?.description && (
            <p className="text-sm text-gray-600 mt-1">
              {invitation.groupId.description}
            </p>
          )}
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            {invitation.senderId?.name}
          </span>{" "}
          (@{invitation.senderId?.username}) invited you to join this group
        </p>
        <p className="text-xs text-gray-500">
          Received on {formatDate(invitation.createdAt)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleReject}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={handleAccept}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Accept
        </button>
      </div>
    </div>
  );
};
