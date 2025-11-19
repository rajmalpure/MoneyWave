import { useEffect, useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { InvitationCard } from "../components/groups/InvitationCard";

export const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data } = await api.get("/groups/invitations");
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await api.post(`/groups/invitations/${invitationId}/accept`);
      fetchInvitations();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation");
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await api.post(`/groups/invitations/${invitationId}/reject`);
      fetchInvitations();
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert("Failed to reject invitation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/groups")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Groups
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Group Invitations</h1>
        <p className="text-gray-600 mt-1">
          Invitations you've received to join groups
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No pending invitations
          </h3>
          <p className="text-gray-600">
            You'll see group invitations here when someone invites you
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation._id}
              invitation={invitation}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};
