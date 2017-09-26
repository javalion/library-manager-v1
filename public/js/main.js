// Main Javascript file containing logic for Team Treehouse Library Manager project
//

function validateNewBookForm() {
    var valid = true;
    var validField = validateField("title");
    if (!validField) { valid = false; }
    validField = validateField("author");
    if (!validField) { valid = false; }
    validField = validateField("genre");
    if (!validField) { valid = false; }
    return valid;
}

function validateNewLoanForm() {
    var validLoanedOn = validateDateField("loaned_on", true);
    var validReturnBy = validateDateField("return_by", false);
    return (validLoanedOn && validReturnBy);
}

function validatePatronForm() {
    var valid = true;
    var validField = validateField("first_name");
    if (!validField) { valid = false; }
    validField = validateField("last_name");
    if (!validField) { valid = false; }
    validField = validateField("address");
    if (!validField) { valid = false; }
    validField = validateField("email");
    if (!validField) { valid = false; }
    validField = validateField("library_id");
    if (!validField) { valid = false; }
    validField = validateField("zip_code");
    if (!validField) { valid = false; }
    return valid;
}


function validateReturnBookForm() {
    return validateDateField("returned_on", true);
}

function validateDateField(id, required) {
    var valid = true;
    var value = document.getElementById(id).value;
    if (required) {
        valid = validateField(id);
        if (value.length === 10 && !isNaN(Date.parse(value))) {
            valid = true;
        } else {
            valid = false;
        }
    } else {
        if ((value.length === 0) || (value.length === 10 && !isNaN(Date.parse(value)))) {
            valid = true;
        } else {
            valid = false;
        }
    }
    toggleField(id,valid);

  return valid;
}

function validateField(id) {
    var valid = true;
    if (document.getElementById(id).value.trim().length == 0) {
        toggleField(id, false);
        valid = false;
    } else {
        toggleField(id, true);
    }
    return valid;
}

function toggleField(id, valid) {
    var field = document.getElementById(id + "_error");
    if (valid) {
        field.style.display = "none";
    } else {
        field.style.display = "inline-block";
    }
}