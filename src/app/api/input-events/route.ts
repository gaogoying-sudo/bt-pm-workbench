import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(_request: NextRequest) {
  return toJsonResponse(
    success(
      {
        endpoints: [
          { method: 'POST', path: '/api/input-events/raw', description: 'Capture raw input -> create draft' },
          { method: 'GET', path: '/api/input-events/raw', description: 'List raw inputs' },
          { method: 'GET', path: '/api/input-events/drafts?status=', description: 'List drafts' },
          { method: 'PATCH', path: '/api/input-events/drafts', description: 'Patch draft' },
          { method: 'GET', path: '/api/input-events/confirm', description: 'List confirmation queue + recent confirmed + writebacks' },
          { method: 'POST', path: '/api/input-events/confirm', description: 'Confirm/reject a draft (+ optional writeback)' }
        ]
      },
      { source: 'input-events' }
    )
  );
}

