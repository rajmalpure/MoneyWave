import { Users, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={() => navigate(`/groups/${group._id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {group.name}
          </h3>
          {group.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {group.description}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{group.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(group.createdAt)}</span>
        </div>
      </div>

      {group.createdBy && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Created by{" "}
            <span className="font-medium text-gray-700">
              {group.createdBy.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
