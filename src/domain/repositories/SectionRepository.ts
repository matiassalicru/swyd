import { Section } from '../models/Section';

export interface SectionRepository {
  getAll(): Promise<Section[]>; // ordered by position ASC
  create(title: string): Promise<Section>;
  rename(id: number, title: string): Promise<void>;
  remove(id: number): Promise<void>; // reassigns orphaned todos to default section
  reorder(orderedIds: number[]): Promise<void>;
}
