export interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
  meta?: {
    total?: number;
    snapshotDate?: string;
    source?: string;
  };
}

export function success<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return { ok: true, data, error: null, meta };
}

export function failure<T = never>(error: string): ApiResponse<T> {
  return { ok: false, data: null, error };
}

export function toJsonResponse<T>(result: ApiResponse<T>, status = 200) {
  return Response.json(result, { status: result.ok ? status : (status >= 400 ? status : 400) });
}
