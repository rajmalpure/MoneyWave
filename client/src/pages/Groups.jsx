import { useEffect, useState } from "react";
import { Plus, Users, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { GroupCard } from "../components/groups/GroupCard";

export const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitationCount, setInvitationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchInvitations();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data } = await api.get("/groups/invitations");
      setInvitationCount(data.length);
    } catch (error) {
      console.error("Error fetching invitations:", error);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Transactions</h1>
          <p className="text-gray-600 mt-1">
            Share expenses with friends and family
          </p>
        </div>
        <div className="flex gap-3">
          {invitationCount > 0 && (
            <button
              onClick={() => navigate("/groups/invitations")}
              className="relative px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-2"
            >
              <Inbox className="w-5 h-5" />
              Invitations
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {invitationCount}
              </span>
            </button>
          )}
          <button
            onClick={() => navigate("/groups/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No groups yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first group to start sharing expenses
          </p>
          <button
            onClick={() => navigate("/groups/create")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};
