import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {activeSubs, DestroySubscriptionService, LoggerService, ResultsComponent} from 'monitor-subscription';
import { interval, map, switchMap, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ResultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'test-library';
  httpClient = inject(HttpClient)
  loggerService = inject(LoggerService);
  destroyService = inject(DestroySubscriptionService);
  name = this.constructor.name.toLowerCase();

  ngOnInit(): void {
      setTimeout(() => {
        for (let index = 0; index < 5; index++) {
          this.getInterval(index);        
        }

        this.getData('users');
        this.getData('photos');
        this.getData('albums');
        this.getData('comments');
        this.getData('posts');
        this.getData('todos');
      })

      }

      getInterval(count: number): void {
        interval(1000).pipe(
          takeUntil(this.destroyService.getDestroy$(`$${this.name}_interval_${count}`)),
          map(item => item * 2),
          activeSubs(`${this.name}_interval_${count}`, this.loggerService)
        ).subscribe();
      }
    
      getData(title: string): void {
        const id = `${this.constructor.name.toLowerCase()}_get_${title}`
        const url = 'https://jsonplaceholder.typicode.com/' + title;
        interval(2000).pipe(
          switchMap(() => this.httpClient.get(url)),
        ).pipe(
          takeUntil(this.destroyService.getDestroy$(id)),
          activeSubs(id, this.loggerService),
        ).subscribe();
      }
}
