import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';
import { closeoutService } from '@/server/services/closeout-service';

export async function GET(_request: NextRequest) {
  const pack = closeoutService.getCloseoutPack();
  return toJsonResponse(success(pack, { source: 'closeout-service' }));
}

