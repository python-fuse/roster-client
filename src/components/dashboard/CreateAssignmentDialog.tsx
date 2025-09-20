import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { APIService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { User, DutyRoster } from "@/types/definitions";
import { getShiftName } from "@/lib/utils";

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateAssignmentDialog: React.FC<CreateAssignmentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { state: authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [dutyRosters, setDutyRosters] = useState<DutyRoster[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    dutyRosterId: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch users and duty rosters when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsersAndRosters();
    }
  }, [open]);

  const fetchUsersAndRosters = async () => {
    try {
      const [usersResponse, rostersResponse] = await Promise.all([
        APIService.getUsers(),
        APIService.getDutyRosters(),
      ]);

      setUsers((usersResponse.data as any).users);
      setDutyRosters((rostersResponse.data as any).data);
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load users or duty rosters");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user || !formData.userId || !formData.dutyRosterId) return;

    try {
      setIsLoading(true);
      setError(null);

      await APIService.createAssignment({
        userId: formData.userId,
        dutyRosterId: formData.dutyRosterId,
        assignedById: authState.user.id,
      });

      // Reset form
      setFormData({ userId: "", dutyRosterId: "" });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create assignment:", error);
      setError(error.response?.data?.message || "Failed to create assignment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter out rosters that are in the past
  const availableRosters = dutyRosters.filter(
    (roster) => new Date(roster.date) >= new Date()
  );

  // Filter staff and supervisors (not admins for assignments)
  const assignableUsers = users.filter(
    (user) => user.role === "STAFF" || user.role === "SUPERVISOR"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="user">Assign to User</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => handleInputChange("userId", value)}
              required
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {assignableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dutyRoster">Duty Roster</Label>
            <Select
              value={formData.dutyRosterId}
              onValueChange={(value) =>
                handleInputChange("dutyRosterId", value)
              }
              required
            >
              <SelectTrigger id="dutyRoster">
                <SelectValue placeholder="Select a duty roster" />
              </SelectTrigger>
              <SelectContent>
                {availableRosters.map((roster) => (
                  <SelectItem key={roster.id} value={roster.id}>
                    {new Date(roster.date).toLocaleDateString()} -{" "}
                    {getShiftName(roster.shift)} Shift
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableRosters.length === 0 && (
              <p className="text-sm text-gray-500">
                No available duty rosters. Create a duty roster first.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.userId ||
                !formData.dutyRosterId ||
                availableRosters.length === 0
              }
            >
              {isLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
