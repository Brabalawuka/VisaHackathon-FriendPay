/* 
*** This is a pure JavaScript library for integrating FriendPay to merchant website.
*
*
*
*** Dependencies: bootstrap
*
*
*
*** Instructions:
* ---- For plain JavsScript projects:
*        1. Add this library (.js file) into your HTML body element.
*        2. Create and place a button element with id = "friendPayButton" in the body element. This button will toggle the FriendPay UI automatically.
*        3. Call the function passPaymentInfo(currencyCode, amount, checkoutKey, encryptionKey) to pass the four required data to FriendPay API. Do make 
*           sure it gets called before user clicks the button with id = "friendPayButton" or even before the button or the page containing the button
*           gets rendered.
*
* ---- For Angular projects:
*        1. Add this library (.js file) into angular.json (build->scripts)
*        2. Create and place a button element with id = "friendPayButton" in your Angular components. This button will toggle the FriendPay UI automatically.
*        3. Add a line of code 'declare const passPaymentInfo: any;' before your @Component decorator of the component.ts. This component should be the one 
*           containing the FriendPay button.
*        4. Call the function passPaymentInfo(currencyCode, amount, checkoutKey, encryptionKey) to pass the four required data to FriendPay API. Do make 
*           sure it gets called before user clicks the button with id = "friendPayButton" or even before the button or the page containing the button
*           gets rendered. In Angular, you may do so by putting it in the ngOnInit() of your component which contains the FriendPay button.
*
*
*
*** APIs provided:
*   1. Fetching payment status from FriendPay backend:
*      Format       :  getPaymentStatus(requestid, callback); 
*      Return type  :  null;
*      Notes        :  Callback must take one parameter which is the response from server.
*      eg. getPaymentStatus('validrequestid', response=>{
*            console.log(response);
*          });
*
*   2. Receiving payload from FriendPay frontend regarding whether the payment request has been submitted successfully:
*      Format       :  onPaymentRequestSuccess(callback); 
*      Return type  :  null; 
*      Notes        :  Callback must take one parameter which is the payload from FriendPay frontend regarding request submission status.
*      eg. onPaymentRequestSuccess(success => {
*            console.log(success);
*          });
*
*      Format       :  onPaymentRequestError(callback); 
*      Return type  :  null; 
*      Notes        :  Callback must take one parameter which is the payload from FriendPay frontend regarding request submission status.
*      eg. onPaymentRequestError(err => {
*            console.log(err);
*          });
*
*
*
*** JSON format specification:
*   1. FriendPay request body content: (frontend -> backend)
*        {
*          customerName: "",
*          customerEmail: "",
*          customerMessage: "",
*          friendName: "",
*          friendEmail: "",
*          friendPhone: "",
*          currencyCode: "",
*          amount: "",
*          checkoutKey: "",
*          encryptionKey: "",
         }
*   2. FriendPay frontend payload: (frontend -> merchant site)
*        Success payload:
*        {
*          requestId: "1a2b3c4d5e"
*          payload: 
*            {
*              customerName: "",
*              customerEmail: "",
*              customerMessage: "",
*              friendName: "",
*              friendEmail: "",
*              friendPhone: "",
*              currencyCode: "",
*              amount: "",
*              checkoutKey: "",
*              encryptionKey: "",
*            }
*        }
*
*        Error payload:
*        {
*          payload: "error"
*        }
*
*/


/* 
* Request info
*/
var inputCustomerName;
var inputCustomerEmail;
var inputCustomerMessage;
var inputFriendName;
var inputFriendEmail;
var inputFriendPhone;
var inputCurrencyCode;
var inputAmount;
var inputCheckoutKey;
var inputEncryptionKey;

/*
* Request status and response
*/
var isRequestSuccess = false;
var isRequestError = false;
var successPayload = { requestId: undefined, payload: undefined };
var errorPayload = { payload: 'error' };



var myCss = document.createElement("style");
myCss.innerHTML = `
.mymodal {
    display: none;
    position: fixed;
    z-index: 100000;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.mymodal-content {
    background-color: #fefefe;
    margin: auto;
    border: 1px solid #888;
    width: 50%;
    min-width: 360px;
    min-height: 580px;
    height: 40%
}

.closeSpan {
    font-size: 12px;
}

.closeSpan:hover{
    text-decoration: underline;
    cursor: pointer;
}
`;

var myLink = document.createElement("link");
myLink.rel = "stylesheet";
myLink.type = "text/css";
myLink.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css";
myLink.integrity = "sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk";
myLink.crossOrigin = "anonymous"

var myHead = document.getElementsByTagName("head")[0];
myHead.appendChild(myLink);
myHead.appendChild(myCss);


/* 
* Defining dialog components
*/
var friendPayDialog = document.createElement("div");
var friendPayDialogContent = document.createElement("div");
var friendPayDialogContentContainer = document.createElement("div");
var containerHeading = document.createElement("div");
var containerContent = document.createElement("div");
var containerFooter = document.createElement("div");
var friendPayIcon = document.createElement("div");
var closeButton = document.createElement("div");

friendPayDialog.setAttribute("id", "friendPayDialog");
friendPayDialogContent.setAttribute("id", "friendPayDialogContent");
friendPayDialogContentContainer.setAttribute("id", "friendPayDialogContentContainer");
containerHeading.setAttribute("id", "containerHeading");
containerContent.setAttribute("id", "containerContent");
containerFooter.setAttribute("id", "containerFooter");
friendPayIcon.setAttribute("id", "friendPayIcon");
closeButton.setAttribute("id", "closeButton");

friendPayDialog.classList.add("mymodal");
friendPayDialogContent.classList.add("mymodal-content");
friendPayDialogContentContainer.classList.add("container-fluid");
// friendPayDialogContentContainer.classList.add("border");
// friendPayDialogContentContainer.classList.add("border-warning");
friendPayDialogContentContainer.style.height = "100%";
containerHeading.classList.add("row");
containerHeading.classList.add("bg-primary");
containerHeading.classList.add("align-items-center");
containerHeading.classList.add("text-white");
containerHeading.style.height = "15%";
// containerHeading.classList.add("border");
// containerHeading.classList.add("border-success");
containerContent.classList.add("row");
containerContent.classList.add("p-3");
containerContent.style.height = "75%";
// containerContent.classList.add("border");
// containerContent.classList.add("border-danger");
containerFooter.classList.add("row");
containerFooter.style.height = "10%";
// containerFooter.classList.add("border");
// containerFooter.classList.add("border-success");
containerFooter.classList.add("pt-2");
friendPayIcon.classList.add("col-md-6");
closeButton.classList.add("col-md");
closeButton.classList.add("text-center");
closeButton.classList.add("align-self-center");
closeButton.classList.add("pt-2");

document.body.appendChild(friendPayDialog);
friendPayDialog.appendChild(friendPayDialogContent);
friendPayDialogContent.appendChild(friendPayDialogContentContainer);
friendPayDialogContentContainer.appendChild(containerHeading);
friendPayDialogContentContainer.appendChild(containerContent);
friendPayDialogContentContainer.appendChild(containerFooter);
containerHeading.appendChild(friendPayIcon);
containerFooter.appendChild(closeButton);


/*
* Container heading component
*/
var textnode = document.createTextNode("FriendPay");
var strongElement = document.createElement("strong");
strongElement.setAttribute("id", "strongElement");
strongElement.appendChild(textnode);
friendPayIcon.appendChild(strongElement);


/*
* Container footer component
*/
var spanElement = document.createElement("span");
spanElement.setAttribute("id", "spanElement");
spanElement.classList.add("font-weight-light");
spanElement.classList.add("closeSpan");
spanElement.classList.add("text-primary");
spanElement.classList.add("col-md");
spanElement.classList.add("align-self-center");
spanElement.appendChild(document.createTextNode("back to shopping"));
closeButton.appendChild(spanElement);


/*
* Container content rendering - first page (form for customer email and friend's email)
*/
var formElement = document.createElement("form");
formElement.setAttribute("id", "formElement");
formElement.classList.add("col-md");
formElement.classList.add("container-fluid")

var yourEmailInputRow = document.createElement("div");
yourEmailInputRow.setAttribute("id", "yourEmailInputRow");
yourEmailInputRow.classList.add("form-group");
yourEmailInputRow.classList.add("row");
yourEmailInputRow.classList.add("pl-3");
yourEmailInputRow.classList.add("pr-3");
yourEmailInputRow.classList.add("pt-1");
yourEmailInputRow.classList.add("pb-1");
yourEmailInputRow.style.height = "20%";
var friendEmailInputRow = document.createElement("div");
friendEmailInputRow.setAttribute("id", "friendEmailInputRow");
friendEmailInputRow.classList.add("form-group");
friendEmailInputRow.classList.add("row");
friendEmailInputRow.classList.add("pl-3");
friendEmailInputRow.classList.add("pr-3");
friendEmailInputRow.classList.add("pt-1");
friendEmailInputRow.classList.add("pb-1");
friendEmailInputRow.style.height = "20%";
var friendPhoneInputRow = document.createElement("div");
friendPhoneInputRow.setAttribute("id", "friendPhoneInputRow");
friendPhoneInputRow.classList.add("form-group");
friendPhoneInputRow.classList.add("row");
friendPhoneInputRow.classList.add("pl-3");
friendPhoneInputRow.classList.add("pr-3");
friendPhoneInputRow.classList.add("pt-1");
friendPhoneInputRow.classList.add("pb-1");
friendPhoneInputRow.style.height = "20%";
var buttonRow = document.createElement("div");
buttonRow.setAttribute("id", "buttonRow");
buttonRow.classList.add("form-group");
buttonRow.classList.add("row");
buttonRow.classList.add("pl-3");
buttonRow.classList.add("pr-3");
buttonRow.classList.add("pt-3");
buttonRow.classList.add("pb-3");
buttonRow.style.height = "10%";

// Customer input
var yourNameInputElement = document.createElement("input");
yourNameInputElement.setAttribute("type", "text");
yourNameInputElement.setAttribute("id", "yourNameInputElement");
yourNameInputElement.setAttribute("placeholder", "Your name");
yourNameInputElement.required = true;
yourNameInputElement.classList.add("col-md-3");
yourNameInputElement.classList.add("form-control");
yourNameInputElement.classList.add("form-control-sm");
yourNameInputElement.classList.add("p-1");
yourEmailInputRow.appendChild(yourNameInputElement);

var yourEmailInputElement = document.createElement("input");
yourEmailInputElement.setAttribute("type", "email");
yourEmailInputElement.setAttribute("id", "yourEmailInputElement");
yourEmailInputElement.setAttribute("placeholder", "Your email");
yourEmailInputElement.required = true;
yourEmailInputElement.classList.add("col-md-8");
yourEmailInputElement.classList.add("offset-md-1");
yourEmailInputElement.classList.add("form-control");
yourEmailInputElement.classList.add("form-control-sm");
yourEmailInputElement.classList.add("p-1");
var yourEmailInputLabelElement = document.createElement("label");
yourEmailInputLabelElement.setAttribute("for", "yourEmailInputElement");
yourEmailInputLabelElement.classList.add("col-md-3");
var textnode = document.createTextNode("Your email");
yourEmailInputLabelElement.appendChild(textnode);
yourEmailInputRow.appendChild(yourEmailInputElement);

// Friend email input
var friendNameInputElement = document.createElement("input");
friendNameInputElement.setAttribute("type", "text");
friendNameInputElement.setAttribute("id", "friendNameInputElement");
friendNameInputElement.setAttribute("placeholder", "Friend's name");
friendNameInputElement.required = true;
friendNameInputElement.classList.add("col-md-3");
friendNameInputElement.classList.add("form-control");
friendNameInputElement.classList.add("form-control-sm");
friendNameInputElement.classList.add("p-1");
friendEmailInputRow.appendChild(friendNameInputElement);

var friendEmailInputElement = document.createElement("input");
friendEmailInputElement.setAttribute("type", "email");
friendEmailInputElement.setAttribute("id", "friendEmailInputElement");
friendEmailInputElement.setAttribute("placeholder", "Friend's email");
friendEmailInputElement.classList.add("col-md-8");
friendEmailInputElement.classList.add("offset-md-1");
friendEmailInputElement.classList.add("form-control");
friendEmailInputElement.classList.add("form-control-sm");
friendEmailInputElement.classList.add("p-1");
var friendEmailInputLabelElement = document.createElement("label");
friendEmailInputLabelElement.setAttribute("for", "friendEmailInputElement");
friendEmailInputLabelElement.classList.add("col-md-3");
var textnode = document.createTextNode("Friend's email");
friendEmailInputLabelElement.appendChild(textnode);
friendEmailInputRow.appendChild(friendEmailInputElement);

// Friend phone input

var friendPhoneCountryCode = document.createElement("input");
friendPhoneCountryCode.setAttribute("type", "text");
friendPhoneCountryCode.setAttribute("id", "friendPhoneCountryCode");
friendPhoneCountryCode.setAttribute("placeholder", "+");
friendPhoneCountryCode.required = true;
friendPhoneCountryCode.classList.add("col-md-2");
friendPhoneCountryCode.classList.add("offset-md-4");
friendPhoneCountryCode.classList.add("align-self-center");
friendPhoneCountryCode.classList.add("form-control");
friendPhoneCountryCode.classList.add("form-control-sm");
friendPhoneCountryCode.classList.add("p-1");
friendPhoneInputRow.appendChild(friendPhoneCountryCode);

var friendPhoneNumber = document.createElement("input");
friendPhoneNumber.setAttribute("type", "text");
friendPhoneNumber.setAttribute("id", "friendPhoneNumber");
friendPhoneNumber.setAttribute("placeholder", "Friend's phone");
friendPhoneNumber.classList.add("col-md-5");
friendPhoneNumber.classList.add("offset-md-1");
friendPhoneNumber.classList.add("align-self-center");
friendPhoneNumber.classList.add("form-control");
friendPhoneNumber.classList.add("form-control-sm");
friendPhoneNumber.classList.add("p-1");
friendPhoneInputRow.appendChild(friendPhoneNumber);

// Reset button
var formResetButtonElement = document.createElement("button");
formResetButtonElement.setAttribute("id", "formResetButtonElement");
formResetButtonElement.setAttribute("type", "reset");
formResetButtonElement.classList.add("btn");
formResetButtonElement.classList.add("btn-info");
formResetButtonElement.classList.add("btn-sm");
formResetButtonElement.classList.add("col-md-3");
var textnode = document.createTextNode("Reset");
formResetButtonElement.appendChild(textnode);
buttonRow.appendChild(formResetButtonElement);

// Next button
var formSubmitButtonElement = document.createElement("button");
formSubmitButtonElement.setAttribute("id", "formSubmitButtonElement");
formSubmitButtonElement.setAttribute("type", "button");
formSubmitButtonElement.classList.add("btn");
formSubmitButtonElement.classList.add("btn-primary");
formSubmitButtonElement.classList.add("btn-sm");
formSubmitButtonElement.classList.add("col-md-8");
formSubmitButtonElement.classList.add("offset-md-1");
var textnode = document.createTextNode("Next");
formSubmitButtonElement.appendChild(textnode);
buttonRow.appendChild(formSubmitButtonElement);

// Create invalid alert section
var alertRow = document.createElement("div");
alertRow.id = "alertRow";
alertRow.classList.add("row");
alertRow.classList.add("pl-3");
alertRow.classList.add("pr-3");
alertRow.classList.add("pb-3");
alertRow.classList.add("text-info");
alertRow.classList.add("font-italic");
alertRow.classList.add("font-weight-bold");
alertRow.style.fontSize = "10px";
var alertList = document.createElement("ul");
alertList.id = "alertList";
alertRow.appendChild(alertList);

var instructions = document.createElement("div");
instructions.classList.add("col-md");
instructions.appendChild(document.createTextNode(
    `FriendPay makes your payment request much easier! 
    Simply provide you and your friend's contact info and your request will be immediately directed to your friends!`));
alertRow.appendChild(instructions);


formElement.appendChild(yourEmailInputRow);
formElement.appendChild(friendEmailInputRow);
formElement.appendChild(friendPhoneInputRow);
formElement.appendChild(buttonRow);
containerContent.appendChild(formElement);


/*
* Container content rendering - second page (request info, drop a message, confirm button)
*/
var confirmRequest = document.createElement("div");
confirmRequest.id = "confirmRequest";
confirmRequest.classList.add("col-md");
confirmRequest.classList.add("container-fluid");

// Request info
var confirmRequestMessageRow = document.createElement("div");
confirmRequestMessageRow.id = "confirmRequestMessageRow";
confirmRequestMessageRow.classList.add("row");
confirmRequestMessageRow.style.height = "40%";
var confirmMessage = document.createElement("div");
confirmMessage.classList.add("col-md");
confirmMessage.classList.add("container-fluid");

// Drop a message
var confirmRequestDropMessageRow = document.createElement("div");
confirmRequestDropMessageRow.id = "confirmRequestDropMessageRow";
confirmRequestDropMessageRow.classList.add("row");
confirmRequestDropMessageRow.classList.add("pb-3");
confirmRequestDropMessageRow.style.height = "40%";
var dropMessageInputBox = document.createElement("textarea");
dropMessageInputBox.id = "dropMessageInputBox";
dropMessageInputBox.rows = "3";
dropMessageInputBox.cols = "20";
dropMessageInputBox.placeholder = "Drop a message to your friend!";
dropMessageInputBox.classList.add("form-control");
dropMessageInputBox.classList.add("col-md");
dropMessageInputBox.style.height = "100%";
confirmRequestDropMessageRow.appendChild(dropMessageInputBox);

// Confirm button
var confirmRequestButtonRow = document.createElement("div");
confirmRequestButtonRow.id = "confirmRequestButtonRow";
confirmRequestButtonRow.classList.add("row");
confirmRequestButtonRow.style.height = "20%";
var confirmButton = document.createElement("button");
confirmButton.type = "button";
confirmButton.id = "confirmButton";
confirmButton.appendChild(document.createTextNode("Confirm"));
confirmButton.classList.add("btn");
confirmButton.classList.add("btn-primary");
confirmButton.classList.add("col-md");
confirmRequestButtonRow.appendChild(confirmButton);

// Uncaught error
var uncaughtErrorBox = document.createElement("div");
uncaughtErrorBox.id = "uncaughtErrorBox";
uncaughtErrorBox.classList.add("col-md");
uncaughtErrorBox.classList.add("container-fluid");
var uncaughtErrorMessageRow = document.createElement("div");
uncaughtErrorMessageRow.id = "uncaughtErrorMessageRow";
uncaughtErrorMessageRow.classList.add("row");
uncaughtErrorMessageRow.style.height = "100%";
var uncaughtErrorMessage = document.createElement("div");
uncaughtErrorMessage.classList.add("col-md");
uncaughtErrorMessage.classList.add("text-center");
uncaughtErrorMessage.classList.add("align-self-center");
uncaughtErrorBox.appendChild(uncaughtErrorMessageRow);
uncaughtErrorMessageRow.appendChild(uncaughtErrorMessage);



/* 
* Events triggered by html elements within the friendpay dialog
*/
document.addEventListener("DOMContentLoaded", () => {
    friendPayButton = document.getElementById("friendPayButton");
    friendPayButton.addEventListener("click", () => {
        try {
            containerContent.innerHTML = '';
            containerFooter.innerHTML = '';
            formElement.innerHTML = '';
            yourEmailInputRow.style.height = "20%";
            friendEmailInputRow.style.height = "20%";
            friendPhoneInputRow.style.height = "20%";
            buttonRow.style.height = "10%";
            yourNameInputElement.value = '';
            friendNameInputElement.value = '';
            yourEmailInputElement.value = '';
            friendEmailInputElement.value = '';
            friendPhoneCountryCode.value = '';
            friendPhoneNumber.value = '';
            yourEmailInputRow.classList.add("pt-1");
            formElement.appendChild(yourEmailInputRow);
            formElement.appendChild(friendEmailInputRow);
            formElement.appendChild(friendPhoneInputRow);
            formElement.appendChild(buttonRow);
            containerContent.appendChild(formElement);
            containerFooter.appendChild(closeButton);
            yourEmailInputRow.insertAdjacentElement("beforebegin", alertRow);
            alertRow.innerHTML = '';
            alertRow.appendChild(instructions);
            alertRow.classList.remove("text-danger");
            alertRow.classList.add("text-info");
            friendPayDialog.style.display = "block";
            // console.log("FriendPay dialog toggled");
        } catch (err) {
            alert(err.name + ": " + err.message);
        }
    });

    spanElement.addEventListener("click", () => {
        try {
            friendPayDialog.style.display = "none";
            containerContent.innerHTML = '';
        } catch (err) {
            containerContentShowErrorBox(err);
            containerFooterRedirect('error');
            isRequestError = true;
        }
    });

    formSubmitButtonElement.addEventListener("click", () => {
        try {
            // Validating input
            inputCustomerName = yourNameInputElement.value;
            inputFriendName = friendNameInputElement.value;
            var cEmailField = yourEmailInputElement.value;
            var fEmailField = friendEmailInputElement.value;
            var fPhoneField = friendPhoneNumber.value;
            var countryCodeField = friendPhoneCountryCode.value;
            var isCEmailValid = checkValidEmail(cEmailField);
            var isFEmailValid = checkValidEmail(fEmailField);
            var isFPhoneValid = checkValidPhoneNumber(fPhoneField);
            var isCCValid = checkValidCC(countryCodeField);
            var isPhoneValid = (isFPhoneValid && isCCValid) ? true : false;
            var isCustomerNameFilled = inputCustomerName == "" ? false : true;
            var isFriendNameFilled = inputFriendName == "" ? false : true;
            if (isCEmailValid && isCustomerNameFilled && isFriendNameFilled && (isFEmailValid || isPhoneValid)) {
                // Defining second page details
                inputCustomerEmail = yourEmailInputElement.value;
                if (isFEmailValid) {
                    inputFriendEmail = friendEmailInputElement.value;
                } else {
                    inputFriendEmail = null;
                }

                if (isFPhoneValid) {
                    inputFriendPhone = "+" + friendPhoneCountryCode.value + " " + friendPhoneNumber.value;
                } else {
                    inputFriendPhone = null;
                }

                confirmMessage.innerHTML = '';
                dropMessageInputBox.value = '';
                var messageDetails = [];
                messageDetails.push('Amount: ' + inputAmount + ' ' + inputCurrencyCode);
                var requestingPerson = (inputFriendEmail == null ? "" : inputFriendEmail);
                if (requestingPerson == "") {
                    requestingPerson += (inputFriendPhone == null ? "" : inputFriendPhone);
                } else {
                    requestingPerson += ", " + (inputFriendPhone == null ? "" : inputFriendPhone);
                }
                messageDetails.push('Requesting person contact: ' + requestingPerson);
                messageDetails.forEach((item, index) => {
                    var temp = document.createElement("div");
                    temp.classList.add("row");
                    var temptemp = document.createElement("div");
                    temptemp.classList.add("col-md");
                    temptemp.appendChild(document.createTextNode(item));
                    temp.appendChild(temptemp);
                    confirmMessage.appendChild(temp);
                })
                confirmRequestMessageRow.appendChild(confirmMessage);
                confirmRequest.appendChild(confirmRequestMessageRow);
                confirmRequest.appendChild(confirmRequestDropMessageRow);
                confirmRequest.appendChild(confirmRequestButtonRow);

                // Rendering second page
                containerContent.innerHTML = '';
                containerContent.appendChild(confirmRequest);
            } else { // invalid email/phone format
                yourEmailInputRow.classList.remove("pt-1");
                yourEmailInputRow.style.height = "15%";
                friendEmailInputRow.style.height = "15%";
                friendPhoneInputRow.style.height = "15%";
                // buttonRow.style.height = "1%";
                alertRow.innerHTML = '';
                alertRow.classList.remove("text-info");
                alertRow.classList.add("text-danger");
                alertRow.append(alertList);
                alertList.innerHTML = '';
                yourEmailInputRow.insertAdjacentElement("beforebegin", alertRow);

                if (!isCustomerNameFilled) {
                    var newli = document.createElement("li");
                    newli.appendChild(document.createTextNode("Please enter your name."))
                    alertList.appendChild(newli);
                }

                if (!isFriendNameFilled) {
                    var newli = document.createElement("li");
                    newli.appendChild(document.createTextNode("Please enter your friend's name."))
                    alertList.appendChild(newli);
                }

                if (!isCEmailValid) {
                    var newli = document.createElement("li");
                    newli.appendChild(document.createTextNode("Your email format is invalid."));
                    alertList.appendChild(newli);
                }

                if (!isFEmailValid && !isPhoneValid) {
                    var newli = document.createElement("li");
                    newli.appendChild(document.createTextNode("Please complete at least one contact info of your friend. Make sure the format is valid. eg. email: test@test.com, phone: +65 xxxxxxxx"))
                    alertList.appendChild(newli);
                }
            }
        } catch (err) {
            containerContentShowErrorBox(err);
            containerFooterRedirect('error');
            isRequestError = true;
        }

    });

    confirmButton.addEventListener("click", () => {
        try {
            var dropMessage = document.getElementById("dropMessageInputBox");
            inputCustomerMessage = dropMessage.value;

            if (typeof inputCustomerName !== 'undefined' &&
                typeof inputCustomerEmail !== 'undefined' &&
                typeof inputCustomerMessage !== 'undefined' &&
                typeof inputFriendName !== 'undefined' &&
                typeof inputFriendEmail !== 'undefined' &&
                typeof inputFriendPhone !== 'undefined' &&
                typeof inputCurrencyCode !== 'undefined' &&
                typeof inputAmount !== 'undefined' &&
                typeof inputCheckoutKey !== 'undefined' &&
                typeof inputEncryptionKey !== 'undefined') {

                // Formatting request body (to be sent to server)
                var currentTimeStamp = new Date();
                var toSend = {
                    customerName: inputCustomerName,
                    customerEmail: inputCustomerEmail,
                    customerMessage: inputCustomerMessage,
                    friendName: inputFriendName,
                    friendEmail: inputFriendEmail,
                    friendPhone: inputFriendPhone,
                    currencyCode: inputCurrencyCode,
                    amount: inputAmount,
                    checkoutKey: inputCheckoutKey,
                    encryptionKey: inputEncryptionKey,
                };

                // http post request to server
                var http = new XMLHttpRequest();
                var serverURL = "http://35.247.130.171:2333/gateway/transaction";
                http.onreadystatechange = () => {
                    if (http.readyState == 4 && http.status == 200) {
                        // response handling, container content rendering - third page (request submitted, redirecting back to merchant site)
                        if (http.responseText == "Could not send notification.") {
                            containerContentShowErrorBox(new Error("Server failed to send email / SMS notification."));
                            containerFooterRedirect('error');

                        } else if (http.responseText == "Could not insert transaction.") {
                            containerContentShowErrorBox(new Error("Server failed to insert the transaction info."));
                            containerFooterRedirect('error');
                        } else {
                            containerContent.innerHTML = '';
                            var temp = document.createElement("div");
                            temp.classList.add("col-md");
                            temp.classList.add("text-center");
                            temp.classList.add("text-success");
                            temp.classList.add("align-self-center");
                            temp.appendChild(document.createTextNode("Request has been sent!"));
                            containerContent.appendChild(temp);
                            successPayload.requestId = http.responseText;
                            successPayload.payload = toSend;
                            containerFooterRedirect('success');
                        }

                    } else {
                        containerContentShowErrorBox(new Error("Error occurs while connecting to server. Please try again."));
                        containerFooterRedirect('error');

                    }
                }
                http.open("POST", serverURL, true);
                http.setRequestHeader("Content-Type", "application/json");
                http.send(JSON.stringify(toSend));

            } else {
                throw new Error("Payment info from merchants required.")
            }
        } catch (err) {
            containerContentShowErrorBox(err);
            containerFooterRedirect('error');
        }
    });
})

function checkValidEmail(toCheck) {
    var dotComExist = false;
    var atExist = false;
    lastFourChars = toCheck.slice(toCheck.length - 4);
    if (lastFourChars === ".com") {
        dotComExist = true;
    }
    if (toCheck.includes("@")) {
        atExist = true;
    }
    if (dotComExist && atExist) {
        return true;
    }
    return false;
}

function checkValidPhoneNumber(toCheck) {
    var isOnlyDigits = false;
    isOnlyDigits = /^[0-9]+$/.test(toCheck);
    return isOnlyDigits;
}

function checkValidCC(toCheck) {
    var isOnlyDigits = false;
    isOnlyDigits = /^[0-9]+$/.test(toCheck);
    return isOnlyDigits;
}

function containerContentShowErrorBox(err) {
    containerContent.innerHTML = '';
    uncaughtErrorMessage.innerHTML = '';
    var tempText = document.createTextNode(err.name + ": " + err.message);
    uncaughtErrorMessage.appendChild(tempText);
    containerContent.appendChild(uncaughtErrorBox);
}

async function containerFooterRedirect(status) {
    containerFooter.innerHTML = '';
    var redirectingAlert = document.createElement("div");
    redirectingAlert.classList.add("col-md");
    redirectingAlert.classList.add("text-center");
    redirectingAlert.style.fontSize = "10px";
    containerFooter.appendChild(redirectingAlert);
    var myTempCount = 5;
    await new Promise(resolve => {
        var myInterval = setInterval(() => {
            if (myTempCount <= 0) {
                friendPayDialog.style.display = "none";
                clearInterval(myInterval);
                resolve();
            } else {
                redirectingAlert.innerHTML = '';
                redirectingAlert.appendChild(document.createTextNode("Page will close in " + myTempCount + " sec"));
                myTempCount--;
            }
        }, 1000);
    });

    if (status === 'success') {
        isRequestSuccess = true;
        isRequestError = false;
    } else if (status === 'error') {
        isRequestError = true;
        isRequestSuccess = false;
    }
}

function passPaymentInfo(icc, ia, ick, iek) {
    inputCurrencyCode = icc;
    inputAmount = ia;
    inputCheckoutKey = ick;
    inputEncryptionKey = iek;
}

function errorPayloadGenerate() {
    return { requestStatus: 'Error' };
}

/*
* APIs
*/
async function onPaymentRequestSuccess(callback) {
    await new Promise(resolve => {
        var requestSuccessCheck = setInterval(() => {
            if (isRequestSuccess) {
                callback(JSON.stringify(successPayload));
                isRequestSuccess = false;
                clearInterval(requestSuccessCheck);
                resolve();
            }
        }, 100);
    });
}

async function onPaymentRequestError(callback) {
    await new Promise(resolve => {
        var requestErrorCheck = setInterval(() => {
            if (isRequestError) {
                callback(JSON.stringify(errorPayload));
                isRequestError = false;
                clearInterval(requestErrorCheck);
                resolve();
            }
        }, 100);
    });
}

function getPaymentStatus(friendPayRequestId, callback) {
    console.log(friendPayRequestId);
    var getPaymentStatusHttp = new XMLHttpRequest();
    var queryServerURL = `http://35.247.130.171:2333/gateway/transaction?transactionId=${friendPayRequestId}`;
    getPaymentStatusHttp.onreadystatechange = () => {
        if (getPaymentStatusHttp.readyState == 4 && getPaymentStatusHttp.status == 200) {
            callback(getPaymentStatusHttp.responseText)
        }
        else {
            console.log(getPaymentStatusHttp.responseText);
        }
    }
    getPaymentStatusHttp.open("GET", queryServerURL, true);
    getPaymentStatusHttp.send();
}
