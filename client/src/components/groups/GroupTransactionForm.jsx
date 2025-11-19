import { useState } from "react";
import { X, Loader2, Plus, Minus } from "lucide-react";
import api from "../../lib/api";

export const GroupTransactionForm = ({ groupId, members, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitType: "equal",
    participants: [],
    date: new Date().toISOString().split("T")[0],
    notes: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customSplits, setCustomSplits] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        participants: formData.participants.length > 0 
          ? formData.participants 
          : members.map(m => m._id),
      };

      // Add custom split details if needed
      if (formData.splitType === "custom") {
        payload.splitDetails = Object.entries(customSplits).map(([userId, amount]) => ({
          userId,
          amount: parseFloat(amount),
        }));
      }

      await api.post(`/groups/${groupId}/transactions`, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleParticipant = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.includes(memberId)
        ? prev.participants.filter((id) => id !== memberId)
        : [...prev.participants, memberId],
    }));
  };

  const handleCustomSplitChange = (userId, value) => {
    setCustomSplits(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  const totalCustomSplit = Object.values(customSplits).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Add Group Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Dinner at restaurant"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid By *
              </label>
              <select
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} (@{member.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Food, Travel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Split Type *
            </label>
            <select
              name="splitType"
              value={formData.splitType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="equal">Split Equally</option>
              <option value="custom">Custom Split</option>
            </select>
          </div>

          {formData.splitType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Custom Split Amounts
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <span className="flex-1 text-sm text-gray-700">
                      {member.name} (@{member.username})
                    </span>
                    <input
                      type="number"
                      value={customSplits[member._id] || ""}
                      onChange={(e) => handleCustomSplitChange(member._id, e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              {formData.amount && (
                <p className="mt-2 text-sm text-gray-600">
                  Total: ${totalCustomSplit.toFixed(2)} of ${parseFloat(formData.amount).toFixed(2)}
                  {totalCustomSplit !== parseFloat(formData.amount) && (
                    <span className="text-red-600 ml-2">
                      ⚠️ Split amounts must equal total
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants (leave empty for all members)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {members.map((member) => (
                <label key={member._id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      formData.participants.length === 0 ||
                      formData.participants.includes(member._id)
                    }
                    onChange={() => toggleParticipant(member._id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {member.name} (@{member.username})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (formData.splitType === "custom" && totalCustomSplit !== parseFloat(formData.amount))}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
