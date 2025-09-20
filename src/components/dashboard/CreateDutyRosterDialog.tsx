import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Shift } from "@/types/definitions";
import { getShiftName } from "@/lib/utils";

interface CreateDutyRosterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateDutyRosterDialog: React.FC<CreateDutyRosterDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { state: authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    shift: "" as Shift | "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.user || !formData.date || !formData.shift) return;

    try {
      setIsLoading(true);
      setError(null);

      await APIService.createDutyRoster(
        authState.user.id,
        new Date(formData.date),
        formData.shift as Shift
      );

      // Reset form
      setFormData({ date: "", shift: "" });
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create duty roster:", error);
      setError(error.response?.data?.message || "Failed to create duty roster");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Duty Roster</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift">Shift</Label>
            <Select
              value={formData.shift}
              onValueChange={(value) => handleInputChange("shift", value)}
              required
            >
              <SelectTrigger id="shift">
                <SelectValue placeholder="Select a shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Shift.MORNING}>
                  {getShiftName(Shift.MORNING)} (8AM - 4PM)
                </SelectItem>
                <SelectItem value={Shift.EVENING}>
                  {getShiftName(Shift.EVENING)} (4PM - 12AM)
                </SelectItem>
                <SelectItem value={Shift.NIGHT}>
                  {getShiftName(Shift.NIGHT)} (12AM - 8AM)
                </SelectItem>
              </SelectContent>
            </Select>
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
              disabled={isLoading || !formData.date || !formData.shift}
            >
              {isLoading ? "Creating..." : "Create Roster"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
