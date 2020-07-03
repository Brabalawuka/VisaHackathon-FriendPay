async function onTransactionSuccess(requestId, transactionStatus, callid) {
    try {
        const transactionUpdateAPIAddr = 'http://35.247.130.171:2333/gateway/transaction';
        const request = { transactionId: requestId, transactionStatus: transactionStatus, visaCallId: callid };
        var responsePromise = await new Promise(resolve => {
            var http = new XMLHttpRequest();
            var serverURL = transactionUpdateAPIAddr;
            http.onreadystatechange = () => {
                if (http.readyState == 4 && http.status == 200) {
                    console.log('data sent: ' + JSON.stringify(request));
                    resolve(http.responseText);
                    console.log(http.responseText);
                    var container = document.getElementById("friendPayPageContainer");
                    container.innerHTML = '';

                    var headerRow = document.createElement("div");
                    headerRow.classList.add("row");
                    headerRow.classList.add("bg-primary");
                    headerRow.style.height = "10%";
                    var headerRowContent = document.createElement("div");
                    headerRowContent.classList.add("col-sm");
                    headerRowContent.classList.add("text-center");
                    headerRowContent.classList.add("align-self-center");
                    headerRowContent.classList.add("text-white");
                    headerRowContent.appendChild(document.createTextNode("FriendPay"));
                    headerRow.appendChild(headerRowContent);

                    var successMessageBoxRow = document.createElement("div");
                    successMessageBoxRow.classList.add("row");
                    successMessageBoxRow.style.height = "60%";
                    var successMessageBox = document.createElement("div");
                    successMessageBox.classList.add("col-sm");
                    successMessageBox.classList.add("text-center");
                    successMessageBox.classList.add("align-self-center");
                    successMessageBox.appendChild(document.createTextNode("Payment success"));
                    successMessageBoxRow.appendChild(successMessageBox);

                    var redirectRow = document.createElement("div");
                    redirectRow.classList.add("row");
                    redirectRow.style.height = "30%";
                    var redirectMessage = document.createElement("div");
                    redirectMessage.classList.add("col-sm");
                    redirectMessage.classList.add("text-center");
                    redirectMessage.classList.add("align-self-center");
                    var message = document.createTextNode("redirecting");
                    redirectMessage.appendChild(message);
                    redirectRow.appendChild(redirectMessage);

                    container.appendChild(headerRow);
                    container.appendChild(successMessageBoxRow);
                    container.appendChild(redirectRow);

                    remainingTime = 5;
                    var intvl = setInterval(() => {
                        if (remainingTime > 0) {
                            message = document.createTextNode("Page will close in " + remainingTime + " sec");
                            redirectMessage.innerHTML = '';
                            redirectMessage.appendChild(message);
                            remainingTime--;
                        } else {
                            closePage();
                            clearInterval(intvl);
                        }

                    }, 1000);

                } else {
                    console.log(http.responseText);
                }
            }
            http.open("PATCH", serverURL, true);
            http.setRequestHeader("Content-Type", "application/json");
            http.send(JSON.stringify(request));
        });

    } catch (err) {
        alert(err.name + ": " + err.message);
    }


}

function closePage(){
    window.location.reload();
}
