import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'protractor';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommsService {
  private isValidRequest: boolean;
  private requestId: string;
  private paymentInfo;
  private remainingTime: number;
  private isLinkExpired = false;

  constructor(private http: HttpClient, private err: ErrorService, private router: Router) { }

  getRequestId() {
    return this.requestId;
  }

  assignRequestId(id) {
    this.requestId = id;
  }

  getPaymentInfo() {
    return { ...this.paymentInfo };
  }

  assignPaymentInfo(paymentInfo) {
    this.paymentInfo = paymentInfo;
  }

  validateRequest() {
    try {
      const validateAPIAddr = `http://35.247.130.171:2333/gateway/transaction?transactionId=${this.requestId}`;
      return this.http.get(validateAPIAddr, { observe: 'body', responseType: 'json' });
    } catch (err) {
      alert(err.name + ': ' + err.message);
    }
  }

  updateRemainingTime(remaining) {
    try {
      this.remainingTime = remaining;
      const countDownInterval = setInterval(() => {
        this.remainingTime -= 100;
        if (this.remainingTime <= 0) {
          this.isLinkExpired = true;
          clearInterval(countDownInterval);
          this.err.setError(new Error('Page has expired.'));
          this.router.navigate(['']);
        }
      }, 100);

    } catch (err) {
      alert(err.name + ': ' + err.message);
    }
  }

  onRequestRejectedByFriend() {
    try {
      const requestStatusUpdateAPIAddr = 'http://35.247.130.171:2333/gateway/transaction';
      const request = { transactionId: this.requestId, transactionStatus: 'Rejected', visaCallId: null };
      const responseObservable = this.http.patch(requestStatusUpdateAPIAddr, request, { observe: 'body', responseType: 'json' });
      responseObservable.subscribe(jsonResponse => {
        console.log(jsonResponse);
        const container = document.getElementById('friendPayPageContainer');
        container.innerHTML = '';

        const headerRow = document.createElement('div');
        headerRow.classList.add('row');
        headerRow.classList.add('bg-primary');
        headerRow.style.height = '10%';
        const headerRowContent = document.createElement('div');
        headerRowContent.classList.add('col-sm');
        headerRowContent.classList.add('text-center');
        headerRowContent.classList.add('align-self-center');
        headerRowContent.classList.add('text-white');
        headerRowContent.appendChild(document.createTextNode('FriendPay'));
        headerRow.appendChild(headerRowContent);

        const successMessageBoxRow = document.createElement('div');
        successMessageBoxRow.classList.add('row');
        successMessageBoxRow.style.height = '60%';
        const successMessageBox = document.createElement('div');
        successMessageBox.classList.add('col-sm');
        successMessageBox.classList.add('text-center');
        successMessageBox.classList.add('align-self-center');
        successMessageBox.appendChild(document.createTextNode('Payment rejected'));
        successMessageBoxRow.appendChild(successMessageBox);

        const redirectRow = document.createElement('div');
        redirectRow.classList.add('row');
        redirectRow.style.height = '30%';
        const redirectMessage = document.createElement('div');
        redirectMessage.classList.add('col-sm');
        redirectMessage.classList.add('text-center');
        redirectMessage.classList.add('align-self-center');
        let message = document.createTextNode('redirecting');
        redirectMessage.appendChild(message);
        redirectRow.appendChild(redirectMessage);

        container.appendChild(headerRow);
        container.appendChild(successMessageBoxRow);
        container.appendChild(redirectRow);

        let remainingTime = 5;
        const intvl = setInterval(() => {
          if (remainingTime > 0) {
            message = document.createTextNode('Page will close in ' + remainingTime + ' sec');
            redirectMessage.innerHTML = '';
            redirectMessage.appendChild(message);
            remainingTime--;
          } else {
            this.closePage();
            clearInterval(intvl);
          }

        }, 1000);
      }, error => {
        console.log(error);
        this.err.setError(new Error('Error occured when user rejects the payment.'));
        this.router.navigate(['']);
      });

    } catch (err) {
      alert(err.name + ': ' + err.message);
    }
  }

  getRemainingTime() {
    return this.remainingTime;
  }

  getExpireStatus() {
    return this.isLinkExpired;
  }

  closePage() {
    window.location.reload();
  }
}
