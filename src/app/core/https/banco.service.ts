import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {FinancialProducts} from "../../shared/models/productos-financieros";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class BancoService {

  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getAllProducts(search: string): Observable<FinancialProducts[]> {
    return this.httpClient.get<FinancialProducts[]>(`${this.baseUrl}`, {
      params: search ? {search} : {}, responseType: 'json'
    });
  }

  public createProduct(payload: FinancialProducts): Observable<FinancialProducts> {
    return this.httpClient.post<FinancialProducts>(`${this.baseUrl}`, payload, {responseType: 'json'});
  }

  public updateProduct(payload: FinancialProducts): Observable<FinancialProducts> {
    return this.httpClient.put<FinancialProducts>(`${this.baseUrl}`, payload, {responseType: 'json'});
  }

  public deleteProduct(id: string): Observable<FinancialProducts> {
    return this.httpClient.delete<FinancialProducts>(`${this.baseUrl}`, {
      params: {id}, responseType: 'json'
    });
  }

  public verifyProduct(id: string): Observable<FinancialProducts> {
    return this.httpClient.get<FinancialProducts>(`${this.baseUrl}/verification`, {
      params: {id}, responseType: 'json'
    });
  }
}
