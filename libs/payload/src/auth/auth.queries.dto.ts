type DefaultQueryPayload = {
  page?: number;
  limit?: number;
  sort?: { key: string; order: 'asc' | 'desc' };
  filter?: { key: string; value: string };
};

export type UserListQueryPayload = DefaultQueryPayload & {
  omit?: { key: string; value: string };
};
