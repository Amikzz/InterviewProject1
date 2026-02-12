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

    let members = getServiceRequest("/member/alldata");

    //datatypes
    //string -> strting / date / number
    //function -> object / array / boolean
    let columns = [
        { property: "reg_no", dataType: "string" },
        { property: "custname", dataType: "string" },
        { property: "contact_no", dataType: "string" },
        { property: "address", dataType: "string" },
        { property: "email", dataType: "string" },
        { property: getCustStatus, dataType: "function" }
    ];

    //call fill data into table
    fillTableFour(tBodyMember, members, columns, memberFormRefill, true);
    $('#tableMember').DataTable();
}

//define function for submit button
const buttonMemberRegister = () => {

    ob = member;
    //check if there are any errors
    let errors = checkFormError();

    //check errors
    if (errors == "") {
        Swal.fire({
            title: "Are you sure to Submit Customer " + ob.title + " " + ob.firstname + " " + ob.lastname + " .?",
            text: "Phone Number : " + customer.contact_no
                + "\n Email : " + customer.email
                + "\n Status : " + customer.customerstatus_id.status,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                //call post
                let submitResponse = getHTTPServiceRequest('/customer/insert', "POST", customer);
                if (submitResponse == "OK") {
                    Swal.fire({
                        title: "Saved Successfully.!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    refreshForm();
                    refreshCustomerTable();
                    window.location.reload();
                    $('#modalCustomer').modal('hide');
                } else {
                    Swal.fire({
                        title: "Save not Completed..! Has following errors :",
                        text: submitResponse,
                        icon: "info"
                    });
                    //window.alert("Save not Completed..! \n Has following errors : \n" + submitResponse);
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
        employee.nic = nicValue;
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
            employee.gender = "Female";
            // get birthdate
            birthdate = parseInt(birthdate) - 500;

        } else {
            radioMale.checked = true;
            employee.gender = "Male";
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
        employee.dob = dateDOB.value;
        dateDOB.style.border = "solid green 2px";

        // get age
        /* let currentYear = new Date().getFullYear();
            age = currentYear - birthyear; 
        */
    } else {
        //invalid value
        employee.nic = null;
        employee.dob = null;
        employee.gender = null;
        txtNic.style.border = "solid red 2px";
    }
});