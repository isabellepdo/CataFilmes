import { environment } from "./../../environments/environment";
import { Component, OnInit, Injector, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-catalogo",
  templateUrl: "./catalogo.component.html",
  styleUrls: ["./catalogo.component.css"]
})
export class CatalogoComponent implements OnInit {
  protected headers: HttpHeaders;

  resMovies: any = [];
  copiaMovies: any = [];
  resPopularMovies: Array<any> = [];
  resGeneros: Array<any> = [];
  resDetalhes: Array<any> = [];

  constructor(
    protected injector: Injector,
    protected http: HttpClient,
    public datepipe: DatePipe
  ) {
    this.http = injector.get(HttpClient);
  }

  filterForm = new FormGroup({
    descricao: new FormControl(),
    idGenero: new FormControl(),
    ano: new FormControl()
  });

  ngOnInit(): void {
    this.getLastestMovies();
    this.getPopularMovies();
    this.getGeneros();
  }

  setGenero(id: any) {
    this.filterForm.patchValue({
      idGenero: id.target.value
    });
  }

  getGeneros() {
    this.http
      .get(environment.apiBaseURL + "genre/movie/list" + environment.apiKey)
      .subscribe(
        res => {
          const generos = res as any;
          this.resGeneros = generos.genres;
          setTimeout(() => {
            let auxArray:Array<any> = []
            auxArray = this.copiaMovies
            this.copiaMovies.forEach(function(item,index) {
              item["genre_ids"].forEach(function(itemGenero,indexGenero) {
                let genero = generos.genres.find(genero => genero.id == itemGenero);
                auxArray[index]["genre_ids"][indexGenero]=genero
              });

            });

          }, 500);
        },
        error => {
          console.log(error);
        }
      );
  }

  getLastestMovies() {
    this.http
      .get(environment.apiBaseURL + "movie/now_playing" + environment.apiKey)
      .subscribe(
        res => {
          this.resMovies = res;
          this.copiaMovies = this.resMovies["results"];
        },
        error => {
          console.log(error);
        }
      );
  }

  getPopularMovies() {
    this.http
      .get(environment.apiBaseURL + "movie/popular" + environment.apiKey)
      .subscribe(
        res => {
          this.resPopularMovies = res as any;
        },
        error => {
          console.log(error);
        }
      );
  }

  buscarFilmes() {
    this.copiaMovies = this.resMovies;
    let form = Object.assign({}, this.filterForm.value);
    if (form["descricao"] == "") {
      form["descricao"] = null;
    }
    this.copiaMovies = this.multiFilter(this.resMovies["results"], form);
  }

  multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      return filterKeys.every(key => {
        if (filters[key] == null) {
          return true;
        }
        //se for number, verifica igualdade
        if (key === "descricao") {
          let filtro = filters[key].toLowerCase();
          let titulo = item["title"].toLowerCase();

          if (titulo.match(filtro) != null) {
            return true;
          }
        }
        if (key === "idGenero") {
          let find = item["genre_ids"].find(item => item == filters[key]);
          if (typeof find != "undefined") {
            return true;
          }
          return false;
        }
        if (key === "ano") {
          let dataFilme = item["release_date"];
          dataFilme = new Date(dataFilme);
          return filters[key] === dataFilme.getFullYear();
        }
        return item[key]
          .toString()
          .toLowerCase()
          .includes(filters[key].toString().toLowerCase());
      });
    });
  }

  getMovieDetails(id_movie) {
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
    this.http
      .get(
        environment.apiBaseURL +
          "movie/" +
          id_movie +
          "/credits" +
          environment.apiKey
      )
      .subscribe(
        res => {
          const cast = res as any;
          this.resDetalhes["elenco"] = cast["cast"];
          this.resDetalhes["equipeTecnica"] = cast["crew"];
        },
        error => {
          console.log(error);
        }
      );
  }
}
