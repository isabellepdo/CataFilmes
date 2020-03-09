import { environment } from "./../../environments/environment";
import { Component, OnInit, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-catalogo",
  templateUrl: "./catalogo.component.html",
  styleUrls: ["./catalogo.component.css"]
})
export class CatalogoComponent implements OnInit {
  protected headers: HttpHeaders;

  resMovies: Array<any> = [];


  constructor(protected injector: Injector, protected http: HttpClient, public datepipe: DatePipe) {
    this.http = injector.get(HttpClient);
  }


  ngOnInit(): void {
    this.getMovies();

  }

  getMovies() {
    this.http
      .get(environment.apiBaseURL + "top_rated" + environment.apiKey)
      .subscribe(
        res => {
          this.resMovies = res as any;
          console.log(this.resMovies);
        },
        error => {
          console.log(error);
        }
      );
  }
}
