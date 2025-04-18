export type TaskWithAssignee = {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    dueDate: string; // always treat as ISO string on frontend
    assigneeId: string;
    assigneeName: string; // flattened from relation
  };


  export type Task = {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate: string;
    assigneeId: string;
    assigneeName: string;
  };