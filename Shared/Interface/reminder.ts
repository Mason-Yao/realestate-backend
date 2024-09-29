export interface Reminder {
  PK: string; // Reminder
  id: string;
  /** What to remind, a brief message */
  name?: string;
  /** who created the reminder */
  createdBy?: string;
  /* created date */
  createdDate?: string;
  /** When to remind, have to keep this name for LSI */
  lastModifiedDate?: string;
  /** What is the reference of reminder for  */
  reference?: {
    PK: string;
    id: string;
  };
  description?: string;
}
