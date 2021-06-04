import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { TheosLoaderService } from 'src/components/theos-loader/theos-loader.service';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({ providedIn: 'root' })
export class HttpRequestService {
  constructor(
    private _http: HttpClient,
    private _loader: TheosLoaderService,
    private _errorHandler: ErrorHandlerService
  ) {}

  private _endpoint = 'invalidEndpoint';

  private _requestHandlerPipe = () =>
    pipe(
      catchError((err) => {
        if (err) {
          this._errorHandler.handle(err);
          return throwError(err);
        }
      }),
      map((res) => {
        return res;
      }),
      finalize(() => {
        this._loader.close();
      })
    );

  delete(id: number, options?: any): Observable<any> {
    options = this._createOptions(options);
    return this._http
      .delete<any>(`${this._endpoint}/${id}`, options)
      .pipe(this._requestHandlerPipe());
  }

  get(id?: number, options?: any): Observable<any> {
    options = this._createOptions(options);
    return this._http
      .get<any>(id ? `${this._endpoint}/${id}` : `${this._endpoint}`, options)
      .pipe(this._requestHandlerPipe());
  }

  patch(body: any, id?: number, options?: any): Observable<any> {
    options = this._createOptions(options);
    return this._http
      .patch<any>(
        id ? `${this._endpoint}/${id}` : `${this._endpoint}`,
        body,
        options
      )
      .pipe(this._requestHandlerPipe());
  }

  post(body: any, options?: any): Observable<any> {
    options = this._createOptions(options);
    return this._http
      .post<any>(this._endpoint, body, options)
      .pipe(this._requestHandlerPipe());
  }

  put(id: number, body: any, options?: any): Observable<any> {
    options = this._createOptions(options);
    return this._http
      .put<any>(`${this._endpoint}${id ? '/' + id : ''}`, body, options)
      .pipe(this._requestHandlerPipe());
  }

  injectEndpoint(endpoint: string) {
    this._endpoint = endpoint;
  }

  private _createOptions(options?: any) {
    if (!options) {
      options = {};
    }

    options['headers'] = this._createHeaders(options.headers);
    return options;
  }

  private _createHeaders(headers?: HttpHeaders) {
    const TOKEN = JSON.parse(localStorage.getItem('loginToken'));
    if (!headers) {
      headers = new HttpHeaders();
    }

    headers = headers.append('Authorization', `bearer ${TOKEN.access_token}`);
    return headers;
  }
}
