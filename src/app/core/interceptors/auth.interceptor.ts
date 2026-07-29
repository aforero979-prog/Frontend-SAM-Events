import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor funcional: agrega el token X-Token a todas las peticiones HTTP
// El backend espera el header X-Token con el JWT para rutas protegidas
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leer el token guardado en localStorage tras el login
  const token = localStorage.getItem('token');

  if (token) {
    // Clonar la petición y agregar el header X-Token
    const reqWithToken = req.clone({
      headers: req.headers.set('X-Token', token)
    });
    return next(reqWithToken);
  }

  // Si no hay token, dejar pasar la petición sin modificar
  return next(req);
};
