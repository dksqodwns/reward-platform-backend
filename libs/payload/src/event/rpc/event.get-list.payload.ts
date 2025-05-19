export interface EventGetListPayload {
  sort?: { key: string; order: 'asc' | 'desc' };
  filter?: { key: string; value: string | number | boolean };
  page?: number;
  limit?: number;
}
