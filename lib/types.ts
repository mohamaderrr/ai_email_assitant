export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    preview?: string; // Optional for flexibility
    folder?: string;  // Optional for flexibility
  }
  