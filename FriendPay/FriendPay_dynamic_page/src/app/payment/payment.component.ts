import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommsService } from '../comms.service';
import { ErrorService } from '../error.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentInfo;
  paymentInfoDisplay = {
    timeCreated: undefined,
    customerEmail: undefined,
    customerMessage: undefined,
    currencyCode: undefined,
    amount: undefined
  };
  paymentInfoView = [];
  visaCheckoutRelatedInfo = { checkoutKey: undefined, encryptionKey: undefined };
  isPaymentSuccess = false;
  isPaymentCancel = false;
  isPaymentError = false;

  constructor(private router: Router, private route: ActivatedRoute, private comms: CommsService, private errService: ErrorService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      try {
        if (params.id === undefined || Object.keys(params).length > 1) {
          throw new Error('invalid query');
        } else {
          this.comms.assignRequestId(params.id);
          const response = this.comms.validateRequest();
          response.subscribe((jsonResponse: any) => {
            console.log(jsonResponse.timeCreated);
            const jsonResponseObject = jsonResponse;
            this.comms.assignPaymentInfo(jsonResponseObject);
            this.paymentInfo = jsonResponseObject;
            console.log(this.paymentInfo);

            if (this.paymentInfo.timeCreated === undefined ||
              this.paymentInfo.timeCreated === '' ||
              this.paymentInfo.timeCreated === null) {
              console.log('1');
              this.errService.setError(new Error('Property missing in payment request info JSON returned by server.'));
              this.router.navigate(['']);
              return;
            } else if (this.paymentInfo.transactionStatus !== 'Pending') {
              this.errService.setError(new Error('Payment has either been done, rejected or expired.'));
              this.router.navigate(['']);
              return;
            } else {
              this.comms.updateRemainingTime((Date.parse(this.paymentInfo.timeCreated) + 1 * 60 * 60 * 1000 - new Date().getTime()));
              if (this.comms.getRemainingTime() <= 0 || this.paymentInfo.transactionStatus === 'Expired') {
                this.errService.setError(new Error('Page has expired.'));
                this.router.navigate(['']);
              } else {
                for (const paymentInfoProperty of Object.keys(this.paymentInfo)) {
                  if (paymentInfoProperty === 'timeCreated') {
                    this.paymentInfoDisplay.timeCreated = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'currencyCode') {
                    this.paymentInfoDisplay.currencyCode = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'amount') {
                    this.paymentInfoDisplay.amount = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'customerEmail') {
                    this.paymentInfoDisplay.customerEmail = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'customerMessage') {
                    this.paymentInfoDisplay.customerMessage = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'checkoutKey') {
                    this.visaCheckoutRelatedInfo.checkoutKey = this.paymentInfo[paymentInfoProperty];
                  } else if (paymentInfoProperty === 'encryptionKey') {
                    this.visaCheckoutRelatedInfo.encryptionKey = this.paymentInfo[paymentInfoProperty];
                  }
                }

                for (const currentProperty in this.paymentInfoDisplay) {
                  if (this.paymentInfoDisplay[currentProperty] === undefined) {
                    this.paymentInfoView = [];
                    console.log('2');
                    this.errService.setError(new Error('Property missing in payment request info JSON returned by server.'));
                    this.router.navigate(['']);
                    return;
                  } else {
                    if (currentProperty === 'timeCreated') {
                      this.paymentInfoView.push('Request time: ' + new Date(this.paymentInfoDisplay[currentProperty]).toString());
                    } else if (currentProperty === 'currencyCode') {
                      this.paymentInfoView.push('Currency: ' + this.paymentInfoDisplay[currentProperty]);
                    } else if (currentProperty === 'amount') {
                      this.paymentInfoView.push('Requested amount: ' + this.paymentInfoDisplay[currentProperty]);
                    } else if (currentProperty === 'customerEmail') {
                      this.paymentInfoView.push('Requesting person contact: ' + this.paymentInfoDisplay[currentProperty]);
                    } else if (currentProperty === 'customerMessage') {
                      this.paymentInfoView.push('Message from your friend: ' + this.paymentInfoDisplay[currentProperty]);
                    } else if (currentProperty === 'customerName') {
                      this.paymentInfoView.push('Requesting person: ' + this.paymentInfoDisplay[currentProperty]);
                    }
                  }
                }
                for (const currentProperty in this.visaCheckoutRelatedInfo) {
                  if (this.visaCheckoutRelatedInfo[currentProperty] === undefined) {
                    console.log('3');
                    this.errService.setError(new Error('Property missing in payment request info JSON returned by server.'));
                    this.router.navigate(['']);
                    return;
                  }
                }

                const vinitContent = {
                  apikey: this.visaCheckoutRelatedInfo.checkoutKey,
                  encryptionKey: this.visaCheckoutRelatedInfo.encryptionKey,
                  paymentRequest: {
                    currencyCode: this.paymentInfo.currencyCode,
                    subtotal: this.paymentInfo.amount
                  }
                };
                const visaCheckoutHeadScript = document.createElement('script');
                const visaCheckoutHeadScriptFunction =
                  `function onVisaCheckoutReady(){
                         V.init({
                           apikey: "${this.visaCheckoutRelatedInfo.checkoutKey}",
                           encryptionKey: "${this.visaCheckoutRelatedInfo.encryptionKey}",
                           paymentRequest: {
                             currencyCode: "${this.paymentInfo.currencyCode}",
                             subtotal: "${this.paymentInfo.amount}"
                           }
                         });

                         V.on("payment.success", function(payment){ onTransactionSuccess( "${this.comms.getRequestId()}", "Success", payment.callid); });
                         V.on("payment.cancel", function(payment){ });
                         V.on("payment.error", function(payment, error){ alert(error); });
                       }`;
                visaCheckoutHeadScript.type = 'text/javascript';
                visaCheckoutHeadScript.appendChild(document.createTextNode(visaCheckoutHeadScriptFunction));

                const visaCheckoutBodyScript = document.createElement('script');
                visaCheckoutBodyScript.type = 'text/javascript';
                visaCheckoutBodyScript.src = 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';

                document.getElementsByTagName('head')[0].appendChild(visaCheckoutHeadScript);
                document.getElementsByTagName('body')[0].appendChild(visaCheckoutBodyScript);
              }
            }





          }, error => {
            this.errService.setError(new Error('Server unavailable.'));
            this.router.navigate(['']);
            console.log(error);
          });

        }
      } catch (err) {
        if (err.message === 'invalid query') {
          this.errService.setError(new Error('Invalid query.'));
          this.router.navigate(['']);
        }
      }
    });
  }

  onRejectRequest() {
    this.comms.onRequestRejectedByFriend();
  }

}
