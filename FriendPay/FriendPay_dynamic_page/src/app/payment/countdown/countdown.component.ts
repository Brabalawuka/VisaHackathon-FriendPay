import { Component, OnInit } from '@angular/core';
import { CommsService } from 'src/app/comms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  countDown: string;

  constructor(private comms: CommsService, private router: Router) { }

  ngOnInit(): void {
    setInterval(() => {
      if (this.comms.getExpireStatus()) {
        this.router.navigate(['']);
      } else {
        let stringSeconds = '';
        let stringMinutes = '';
        let stringHours = '';
        let seconds = Math.floor(this.comms.getRemainingTime() / 1000);
        let minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        if (seconds < 10) {
          stringSeconds = '0' + seconds;
        } else {
          stringSeconds = seconds.toString();
        }
        if (minutes < 10) {
          stringMinutes = '0' + minutes;
        } else {
          stringMinutes = minutes.toString();
        }
        if (hours < 10) {
          stringHours = '0' + hours;
        } else {
          stringHours = hours.toString();
        }
        this.countDown = (stringHours + ':' + stringMinutes + ':' + stringSeconds);
      }

    }, 1000);

  }


}
