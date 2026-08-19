export type ScheduledNoteDisplayContent = {
  id: string;
  date: Date;
  title: string;
  text: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
    email: string;
  } | null;
};
