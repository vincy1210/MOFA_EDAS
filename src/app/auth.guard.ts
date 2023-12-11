import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    //   const userLoggedIn = this.authService.isAuthenticatedd();

    //   const userType = this.authService.getUserType();
  
    //   if (userLoggedIn) {
    //     // Check if the user has the right type to access the route
    //     if (route.data && route.data.allowedUserTypes && route.data.allowedUserTypes.includes(userType)) {
    //       return true;
    //     } else {
    //       // Redirect to a forbidden page or handle it as needed
    //       return this.router.createUrlTree(['/forbidden']);
    //     }
    //   } else {
    //     // Redirect to the login page if not authenticated
    //     return this.router.createUrlTree(['/login']);
    //   }
    // }

    return true;
    }

    // return true;
  
}
