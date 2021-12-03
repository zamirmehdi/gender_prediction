const url = "https://api.genderize.io/";

function getSelectedRadio() {
    let radioElements = document.getElementsByName('gender')

    for (let element of radioElements) {
        if (element.checked) return element.value
    }
    return tempGender
}

// async function sendRequest(name) {
//     let requestString = (url + "?name=" + name).toString();
//     try {
//         let response = await fetch(requestString);
//         console.log(response)
//         return response
//     } catch (err) {
//         printMessage("Error in connection!")
//     }
// }
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
}

function clearRadios() {
    let radioElements = document.getElementsByName('gender')
    for (let element of radioElements) {

        if (element.checked) {
            tempGender = element.value
        }
        element.checked = false;
    }
}

function showSavedAnswer(name) {
    let savedAnswer = document.getElementById('saved-answer-paragraph')
    savedAnswer.innerHTML = localStorage.getItem(name);
    tempName = name;
}

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


function printMessage(msg) {
    const msg_box = document.getElementById("message-part");

    if (msg == null) {
        msg_box.style.display = "none";
    } else {
        msg_box.style.display = "block";
        msg_box.innerHTML = msg;
    }
}

function formatCheck(name) {
    if (!/^[a-zA-Z\s]*$/.test(name) === true) {
        printMessage("Not valid characters for name!")
        return false
    }
    if (name.length > 255 || name.length < 1) {
        printMessage("Name can have 1 to 255 characters.")
        return false
    }
    return true
}

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

function onClear(event) {
    // Preventing submit button from default action.
    event.preventDefault();

    localStorage.removeItem(tempName);
    console.log(localStorage)
    showSavedAnswer(tempName)
    printMessage("Gender of " + tempName + " Cleared!");
}