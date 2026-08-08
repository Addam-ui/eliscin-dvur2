import type { ReservationStatus } from "@/lib/reservations";

/** Rezervace tak, jak ji vrací `/api/admin/reservations`. */
export interface AdminReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  message: string | null;
  note: string | null;
  /** "YYYY-MM-DD" */
  arrival: string;
  /** "YYYY-MM-DD" */
  departure: string;
  status: ReservationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}
