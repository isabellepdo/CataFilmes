import { Catalogo } from './catalogo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 

var httpOptions = {headers: new HttpHeaders({"Content-Type": "application/json"})};

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  url = "https://api.themoviedb.org/3/movie/550?api_key=9a2246676bcd0fe0809597c4124f7990";

  constructor(private http: HttpClient) { }

  getAllFilmes(): Observable<Catalogo[]> {  
    return this.http.get<Catalogo[]>(this.url);  
  }  

  getFilmeByTitulo(titulo: string): Observable<Catalogo> {  
    const apiurl = `${this.url}/${titulo}`;
    return this.http.get<Catalogo>(apiurl);  
  } 

  getFilmeByAno(ano: number): Observable<Catalogo> {  
    const apiurl = `${this.url}/${ano}`;
    return this.http.get<Catalogo>(apiurl);  
  } 

  getFilmeByGenero(genero: string): Observable<Catalogo> {  
    const apiurl = `${this.url}/${genero}`;
    return this.http.get<Catalogo>(apiurl);  
  } 
  

 
}
