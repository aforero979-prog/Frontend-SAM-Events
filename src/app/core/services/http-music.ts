import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HttpMusic {

  private http = inject(HttpClient);

  BASE_URL: string = environment.apiUrl;

  getMusic() {
    return this.http.get<any>(this.BASE_URL + '/music').pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getMusicById(id: string) {
    return this.http.get<any>(this.BASE_URL + '/music/' + id);
  }

  createMusic(newMusic: any) {
    return this.http.post<any>(this.BASE_URL + '/music', newMusic);
  }

  updateMusic(id: string, music: any) {
    return this.http.patch<any>(this.BASE_URL + '/music/' + id, music);
  }

  deleteMusic(id: string) {
    return this.http.delete(this.BASE_URL + '/music/' + id);
  }
}
