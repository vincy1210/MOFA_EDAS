import { Injectable, Injector, Inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, interval, Subscription, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/service/auth.service';
import { ApiService } from 'src/service/api.service';
import { ConstantsService } from 'src/service/constants.service';

@Injectable()
export class TimingInterceptor implements HttpInterceptor {
  authtoken: string = 'not yet set';
  browsername:string=''
selectedlang:string='';
json: any[] = []; // JSON to store values
  intervalSubscription: Subscription | undefined;
  constructor(private injector: Injector, @Inject(Router) private router: Router, private auth: AuthService, private api:ApiService, private consts:ConstantsService) {
    this.browsername = this.detectBrowserName();
    this.intervalSubscription = interval(60000).subscribe(() => {
      this.checkAndSendJSON();
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.token$.pipe(
      switchMap((token) => {
        if (!token) {
          token = sessionStorage.getItem('token') || '';
        }

        this.authtoken = token || '';

        const startTime = Date.now();

        try {
          // Using Injector to dynamically get the current component information
          // const componentName = this.router.routerState.snapshot.url.split('?')[0];
          const componentName = this.router.routerState.snapshot.url.split('?')[0];


          // Add the Authorization header with the token
          const modifiedReq = req.clone({
            setHeaders: {
              'X-Component': componentName,
              Authorization: `Bearer ${this.authtoken}`,
            },
          });
          if (req.url.includes('saveSiteAnalytics')) {
            // If the endpoint is saveSiteAnalytics, continue with the original request
            return next.handle(modifiedReq).pipe(

              catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                  // Handle 400 and 500 series errors
                  if (error.status >= 400 && error.status < 600) {
                    console.error('HTTP Error:', error);
                    // this.router.navigate(['/pagenotfound']); // Redirect to 'pagenotfound' page
                    this.router.navigateByUrl('/unauthorized')
                  }
                }
                return throwError(error);
              }));
          } else {
          // Continue with the modified request
          return next.handle(modifiedReq).pipe(

            catchError((error) => {
              if (error instanceof HttpErrorResponse) {
                // Handle 400 and 500 series errors
                if (error.status >= 400 && error.status < 600) {
                  console.error('HTTP Error:', error);
                  this.router.navigate(['/unauthorized']); // Redirect to 'pagenotfound' page
                }
              }
              return throwError(error);
            }),


            finalize(() => {
              const endTime = Date.now();
              const timeSpent = endTime - startTime;
              const apiUrl = req.url.split('/').slice(-2).join('/');
              this.selectedlang = sessionStorage.getItem('language') || 'en';
              this.json.push({
                pagename: componentName,
                action: `API call - ${apiUrl}`,
                browser: this.browsername,
                language: this.selectedlang,
                timespend: timeSpent,
              });

              // Log or send the timeSpent and component information wherever needed
              console.log(
                `API Call "${req.method} ${req.url}" from pagename "${componentName}" timespent ${timeSpent}ms action-load ; browsername ${this.browsername}`
              );
            })
          );
          }


        } catch (error) {
          console.error('Error getting component name:', error);
          // Continue with the original request if an error occurs
          return next.handle(req);
        }
      })
    );
  }

  checkAndSendJSON() {
    if (this.json.length > 0) {
      // Perform API call with JSON data
      // Replace 'your_api_endpoint' with the actual API endpoint
    
      let data={
        uuid: '1222', companyuno: 1, json: this.json
      }
        this.api.post(this.consts.saveSiteAnalytics,data).subscribe({next:(success:any)=>{
       {
          console.log('API call successful');
          // Clear the JSON array after successful API call
          this.json = [];
        }}
      })
      setTimeout(() => {
        
      }, 100);
    
     
    }
  }


  detectBrowserName() { 
    const userAgent = window.navigator.userAgent;
    
    if (userAgent.includes('Firefox')) {
      return 'Mozilla Firefox';
    } else if (userAgent.includes('Chrome')) {
      return 'Google Chrome';
    } else if (userAgent.includes('Safari')) {
      return 'Apple Safari';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      return 'Opera';
    } else if (userAgent.includes('Edge')) {
      return 'Microsoft Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      return 'Internet Explorer';
    } else {
      return 'Unknown';
    }
  }
}
