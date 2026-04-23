export interface Command {
  id: number;
  title: string;
  command: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CommandInput {
  title: string;
  command: string;
  description?: string;
  tags?: string[];
}
