
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Component, OnInit, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  protected http: HttpClient;
  protected headers: HttpHeaders;

  resMovies:any;

  constructor(
    protected injector: Injector
  ) {
    this.http = injector.get(HttpClient);
  }

  ngOnInit(): void {
    this.resMovies = this.getMovies();
    console.log(this.resMovies);
  }

  getMovies(): Observable<any> {
    return this.http.get(environment.apiURL).pipe(
    )
  }

  handleError(handleError: any): any {
    throw new Error("Method not implemented.");
  }

}
