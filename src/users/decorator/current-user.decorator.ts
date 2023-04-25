import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.currentUser?.[data] : request.currentUser;
  },
);
