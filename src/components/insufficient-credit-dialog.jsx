import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InsufficientCreditDialog({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Insufficient Credits</DialogTitle>
          <DialogDescription>
            Today you have used up all your credits. Please wait until tomorrow
            to transcribe more meetings.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
