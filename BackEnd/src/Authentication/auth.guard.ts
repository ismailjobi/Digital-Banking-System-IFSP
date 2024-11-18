import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private reflector: Reflector,) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        //console.log(token);
        if (!token) {
            throw new UnauthorizedException("Please Login To The Website");
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            console.log("Payload:",payload);
            request['user'] = payload;
            console.log(request['user']);
            // Check if user has one of the required roles
            const requiredRoles = this.reflector.get<string[]>('role', context.getHandler()); // Fetch roles metadata
            console.log('Required Roles:', requiredRoles);
            if (!requiredRoles || requiredRoles.length === 0) {
                // No roles required, access granted
                return true;
            }
            
            // Assuming roles are stored in the JWT payload
            const userRoles: string[] = payload.role;
            console.log('User Roles:', userRoles);
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            console.log('Has Required Role:', hasRequiredRole);
            if (hasRequiredRole==false) {
                throw new UnauthorizedException("You do not have permission to access this data");
            }
        } catch {
            throw new UnauthorizedException("You do not have permission to access this data");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}