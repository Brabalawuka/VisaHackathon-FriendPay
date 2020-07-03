# VisaHackathon-FriendPay
FriendPay is an Hackathon project that builds an alternative payment solution that u can request help during online payment


It acts as an SDK for future merchants that can be included into the website so that users can pay through the VisaFriendPayButton

## Demo:
1. You can try the demo on this link [DEMO PAGE](http://35.247.130.171:5000/)   
2. This repository contains all source code but doesnt contain the pushnotification API   .keys form the Twillo and Sendgrid so u need to fill in those fields in  
   `\FriendPay\BackendNodejs\config\config.json`  
   meanwhile, a sendgrid template is required in ur sendgrid account 


3. To try out our demo, u need to fill in your friend's email information where u wanna him to receive ur payment request.

4. Unpon receiveing the email, you could either reject the request or using a VisaCheckout Account and a SandboxCard to carryout payment. Your original merchant webpage will have information displayed