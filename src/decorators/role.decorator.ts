import { SetMetadata } from '@nestjs/common';
import { UserTypeEcom } from '@prisma/client';

export const Roles = (...roles: UserTypeEcom[]) => SetMetadata('roles', roles);
