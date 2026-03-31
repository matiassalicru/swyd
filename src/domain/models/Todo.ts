export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number; // Unix timestamp in milliseconds
  sectionId: number;
  position: number;
}
