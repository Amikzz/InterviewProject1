//browser load event handler
window.addEventListener("load", () => {

    //call refresh form function
    refreshForm();
    //call refresh table function
    refreshMemberTable();
});

//define function for refresh form
const refreshForm = () => {
    formMember.reset();

    //define new object
    member = new Object();

    setDefault([txtMemberName, txtNic, txtNumber, txtEmail]);
}

//create refresh table function
const refreshMemberTable = () => {

    let members = getServiceRequest("/members/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "membercode", dataType: "string" },
        { property: "name", dataType: "string" },
        { property: "nic", dataType: "string" },
        { property: "contact_no", dataType: "string" },
        { property: "email", dataType: "string" }
    ];

    //call fill data into table
    fillDataintoTable(tBodyMember, members, columns, true);
    $('#tableMember').DataTable();

}

//define function for check form errors
const checkFormError = () => {
    let errors = "";
    if (member.name == null) {
        txtMemberName.style.border = "2px solid red";
        errors = errors + "Please Enter Member Name.! \n";
    }
    if (member.nic == null) {
        txtNic.style.border = "2px solid red";
        errors = errors + "Please Enter NIC.! \n";
    }
    if (member.contact_no == null) {
        txtNumber.style.border = "2px solid red";
        errors = errors + "Please Enter Contact Number.! \n";
    }
    if (member.email == null) {
        txtEmail.style.border = "2px solid red";
        errors = errors + "Please Enter Email.! \n";
    }
    return errors;
}


//define function for submit button
const buttonMemberRegister = () => {
    //check if there are any errors
    let errors = checkFormError();

    //check errors
    if (errors == "") {
        Swal.fire({
            title: "Are you sure to Register Member " + member.name + " .?",
            text: "NIC : " + member.nic
                + "Phone Number : " + member.contact_no
                + "\n Email : " + member.email,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post
                let submitResponse = getHTTPServiceRequest('/members/add', "POST", member);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Failed to Submit.! Has following errors :",
            text: errors,
            icon: "error"
        });
    }

}

//define function for validate NIC
txtNic.addEventListener("keyup", () => {
    const nicValue = txtNic.value;
    const regPattern = new RegExp("^(((([6][4-9])|([7-9][0-9]))[0-9]{7}[VvXx])|((([1][9][6-9][0-9])|([2][0][0][1-6]))[0-9]{8}))$");

    if (regPattern.test(nicValue)) {
        //valid nic
        member.nic = nicValue;
        txtNic.style.border = "2px solid green";

        //generate gender and DOB
        let birthyear, birthdate;

        //646299500V
        if (nicValue.length == 10) {
            birthyear = "19" + nicValue.substring(0, 2);// index (0 & 1) ==> 6 & 4
            //2 ha 5 athara value tika gnnewa (2, 3, 4)
            birthdate = nicValue.substring(2, 5);
            //200152103499
        } else {
            birthyear = nicValue.substring(0, 4)
            //4 ha 7 athara value tika (4, 5, 6)
            birthdate = nicValue.substring(4, 7);
        }
        console.log("Birthday" + birthyear, birthdate);

        //nic string value ekak substring ekak kalama return kranneth stringmai, greater than check kranna substring walin bari nisa int value welata maru kregnnawa ParseInt use krela
        if (parseInt(birthdate) > 500) {
            radioFemale.checked = true;
            member.gender = "Female";
            // get birthdate
            birthdate = parseInt(birthdate) - 500;

        } else {
            radioMale.checked = true;
            member.gender = "Male";
        }

        let birthdateOb = new Date(birthyear + "-01-01"); //jan 1 wenidain ptn gnne new date ekk hdagnnewa
        birthdateOb.setDate(parseInt(birthdate));
        // adika auruddakda kyl check krenewa
        /* adika auruddaknm year/4 != 0 saha (Jan+Feb) days == 61 nisa */
        if (parseFloat(birthyear) % 4 != 0 && parseInt(birthdate) > 60) {
            birthdateOb.setDate(birthdateOb.getDate() - 1);
        }

        // month enne array ekakin month[0-11] nisa 1k ekathu krenewa
        let month = birthdateOb.getMonth() + 1;
        let date = birthdateOb.getDate();
        /* 1-9 */
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }

        // get birthday
        dateDOB.value = birthyear + "-" + month + "-" + date;
        member.dob = dateDOB.value;
        dateDOB.style.border = "solid green 2px";

        // get age
        /* let currentYear = new Date().getFullYear();
            age = currentYear - birthyear; 
        */
    } else {
        //invalid value
        member.nic = null;
        member.dob = null;
        member.gender = null;
        txtNic.style.border = "solid red 2px";
    }
});

const txtValidator = (elementId, pattern, object, property) => {
    const elementValue = elementId.value;
    const regPattern = new RegExp(pattern);
    ob = window[object];

    if (elementValue != "") {
        //value not empty
        if (regPattern.test(elementValue)) {
            // valid value
            //employee[email] = abc@gmail.com
            ob[property] = elementValue;
            elementId.style.border = "green 2px solid";
        } else {
            // invalid value
            ob[property] = null;
            elementId.style.border = "red 2px solid";
        }

    } else {
        ob[property] = null;
        // value is empty
        if (elementId.required) {
            elementId.style.border = "2px solid red";
        } else {
            elementId.style.border = "1px solid #ced4da";
        }
    }
}