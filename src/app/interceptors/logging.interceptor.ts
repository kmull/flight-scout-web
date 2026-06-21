import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

let loggingEnabled = false;

(window as any).enableHttpLogging = () => {
  loggingEnabled = true;
  console.log('%c[HTTP Logging] Włączone', 'color: green; font-weight: bold');
};

(window as any).disableHttpLogging = () => {
  loggingEnabled = false;
  console.log('%c[HTTP Logging] Wyłączone', 'color: red; font-weight: bold');
};

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!loggingEnabled) {
    return next(req);
  }

  const startTime = Date.now();

  console.log(
    `%c➡ ${req.method} ${req.url}`,
    'color: #2196F3; font-weight: bold'
  );

  return next(req).pipe(
    tap({
      next: (event) => {
        const duration = Date.now() - startTime;
        console.log(
          `%c✓ ${req.method} ${req.url} (${duration}ms)`,
          'color: #4CAF50; font-weight: bold',
          event
        );
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.log(
          `%c✗ ${req.method} ${req.url} (${duration}ms)`,
          'color: #F44336; font-weight: bold',
          error
        );
      }
    })
  );
};
