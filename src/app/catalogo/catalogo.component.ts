import { environment } from "./../../environments/environment";
import { Component, OnInit, Injector, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: "app-catalogo",
  templateUrl: "./catalogo.component.html",
  styleUrls: ["./catalogo.component.css"]

})
export class CatalogoComponent implements OnInit {
  protected headers: HttpHeaders;

  resMovies: Array<any> = [];
  resGeneros: Array<any> = [];
  resDetalhes: Array<any> = [];


  constructor(protected injector: Injector, protected http: HttpClient, public datepipe: DatePipe) {
    this.http = injector.get(HttpClient);
  }

  filterForm = new FormGroup({
    descricao: new FormControl(),
    idGenero: new FormControl(),
    ano: new FormControl()
  })

  ngOnInit(): void {
    this.getMovies();
    this.getGeneros();
  }

  getGeneros() {
    this.http
      .get(environment.apiBaseURL + "genre/movie/list" + environment.apiKey)
      .subscribe(
        res => {
          const generos = res as any;
          this.resGeneros = generos.genres;

          console.log(this.resGeneros);
        },
        error => {
          console.log(error);
        }
      );
  }


  getMovies() {
    this.http
      .get(environment.apiBaseURL + "movie/top_rated" + environment.apiKey)
      .subscribe(
        res => {
          this.resMovies = res as any;
          let dataFilme = this.resMovies['results'][0]['release_date'];
          dataFilme = new Date(dataFilme);
          console.log(dataFilme.getFullYear());
          console.log(this.resMovies);
        },
        error => {
          console.log(error);
        }
      );
  }

  buscarFilmes() {
    const form = Object.assign({}, this.filterForm.value);
    const filtrado = this.multiFilter(this.resMovies['results'], form);
    this.resMovies['results'] = filtrado
    console.log(filtrado)
  }

  multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter((item) => {
      return filterKeys.every(key => {
        if (filters[key] == null) {
          return true;
        }
        //se for number, verifica igualdade
        if (key === 'descricao') {
          return filters[key] === item['title'];
        }
        if (key === 'idGenero') {
          item['genre_ids'].find(item => {
            if (item) {
              return true
            } else {
              return false
            }
          })
        }
        if (key === 'ano') {
          let dataFilme = item['release_date'];
          dataFilme = new Date(dataFilme)
          return filters[key] === dataFilme.getFullYear();
        }
      });
    });
  }

  getMovieDetails(id_movie){
    this.http
    .get(environment.apiBaseURL + "movie/" + id_movie + environment.apiKey)
    .subscribe(
      res => {
        this.resDetalhes = res as any;

      },
      error => {
        console.log(error);
      }
    );
  }
}





