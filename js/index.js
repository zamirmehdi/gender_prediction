const url = "https://api.genderize.io/";

/**
 * returns selected radio element (male or female)
 * if there is no selected radio; returns null
 * @returns {*}
 */
function getSelectedRadio() {
    let radioElements = document.getElementsByName('gender')

    for (let element of radioElements) {
        if (element.checked) return element.value
    }
    return null
}


/**
 * clears results of gender prediction
 * and removes(hides) saved-answer-box from window
 */
function clearResults() {
    printMessage(null)

    let radioElements = document.getElementsByName('gender')
    for (let element of radioElements) {
        if (element.checked) {
            tempGender = element.value
        }
    }

    document.getElementById('gender-result').innerHTML = null;
    document.getElementById('probability-result').innerHTML = null;
    document.getElementById('saved-answer-paragraph').innerHTML = null;
    document.getElementById('saved-answer-box').style.display = "none";
}


/**
 * unselects radio selectors
 * and saves the last selected radio in tempGender global variable
 */
function clearRadios() {
    let radioElements = document.getElementsByName('gender')
    for (let element of radioElements) {

        if (element.checked) {
            tempGender = element.value
        }
        element.checked = false;
    }
}


/**
 * gets a name
 * and if there is a saved answer for it in the local storage
 * then reveals saved-answer-box and prints answer in the box
 * else removes the box
 * @param name
 */
function showSavedAnswer(name) {
    tempName = name;
    if (localStorage.getItem(name) != null) {
        document.getElementById('saved-answer-box').style.display = "block";
        let savedAnswer = document.getElementById('saved-answer-paragraph')
        savedAnswer.innerHTML = localStorage.getItem(name);
    } else {
        document.getElementById('saved-answer-box').style.display = "none";
    }
}


/**
 * gets a name
 * send a request to the url with the name as a parameter
 * fetches the response and extracts the json
 * if there is any prediction; prints predicted gender and its percentage
 * otherwise prints a reasonable message
 * and if the connection fails; prints Error
 * finally setups saved-answer-box if possible
 * @param name
 */
function sendRequest(name) {
    let requestString = (url + "?name=" + name).toString()

    fetch(requestString)
        .then(res => res.json())
        .then((out) => {
            console.log('Checkout this JSON! ', out)

            if (out.gender == null) {
                printMessage("Sorry... No predictions from internet!");
            } else {
                document.getElementById('gender-result').innerHTML = out.gender;
                document.getElementById('probability-result').innerHTML = out.probability;
            }
        })
        .catch(err => printMessage("Error"));

    showSavedAnswer(name)

}


/**
 * gets a string message
 * if message is null; closes message box
 * otherwise makes it visible and prints the message
 * @param msg
 */
function printMessage(msg) {
    const msg_box = document.getElementById("message-part");

    if (msg == null) {
        msg_box.style.display = "none";
    } else {
        msg_box.style.display = "block";
        msg_box.innerHTML = msg;
    }
}


/**
 * gets the input string as name
 * controls the regex and its length
 * if name is not valid; prints a reasonable message
 * @param name
 * @returns {boolean}
 */
function formatCheck(name) {
    if (!/^[a-zA-Z\s]*$/.test(name) === true) {
        printMessage("Not valid characters for name!")
        return false
    }
    if (name.length > 255 || name.length < 1) {
        printMessage("Name should have 1 to 255 characters.")
        return false
    }
    return true
}


/**
 * reacts to click action on submit button
 * prevents default action of button
 * extracts name from input and if it's in a valid format then sends the request
 * @param event
 */
function onSubmit(event) {
    // Preventing submit button from default action.
    event.preventDefault();
    clearResults();

    const name = document.getElementById('Name').value;
    const validName = formatCheck(name)
    if (validName) {
        sendRequest(name)
    }
}


/**
 * reacts to click action on save button
 * prevents default action of button
 * closes the message box
 * adds name and gender to local storage
 * shows saved answer in saved answer box
 * prints a message
 * clears selected radios
 * @param event
 */
function onSave(event) {
    // Preventing submit button from default action.
    event.preventDefault();
    printMessage(null)

    const name = document.getElementById('Name').value;
    const validName = formatCheck(name)
    let selectedGender = getSelectedRadio()

    if (selectedGender != null && validName) {
        localStorage.setItem(name, selectedGender);
        console.log(localStorage)
        showSavedAnswer(name)
        printMessage(name + " saved as a " + selectedGender);
        clearRadios()
    }
}


/**
 * reacts to click action on clear button
 * prevents default action of button
 * removes name and gender from local storage
 * prints a message
 * @param event
 */
function onClear(event) {
    // Preventing submit button from default action.
    event.preventDefault();

    localStorage.removeItem(tempName);
    console.log(localStorage)
    showSavedAnswer(tempName)
    printMessage("Gender of " + tempName + " Cleared!");
}