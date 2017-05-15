var defaultMsg = "Invalid Request!";

module.exports = {
    valid_param: function (params, validation) {
        var paramKeys = Object.keys(params);
        var validationKeys = Object.keys(validation);

        var errMess = "";
        var retRes = revertCheck(paramKeys, validationKeys);
        if(retRes){
            var checkParam = validation_obj(params, validation);
            retRes = checkParam.status;
            errMess = checkParam.message;
        }else{
            errMess = defaultMsg;
        }

        return {status: retRes, message: errMess};
    }
};

function revertCheck(array1, array2) {
    if(array1.length !== array2.length)
        return false;
    return arrayEquals(array1, array2);
}

function arrayEquals(arr1, arr2){
    var checkArr1 = arrLoop(arr1, arr2);
    return (checkArr1) ? arrLoop(arr2, arr1) : checkArr1;
}

function arrLoop(arr1, arr2){
    var check = true;
    for(var arr1I=0; arr1I<arr1.length; arr1I++){
        if(arr2.indexOf(arr1[arr1I]) === -1){
            check = false;
            break;
        }
    }
    return check;
}

function validation_obj(params, validation){
    var check = {status: true, message: ""};
    for(var key in validation){
        if(validation.hasOwnProperty(key) && params.hasOwnProperty(key)){
            var req_val = params[key];
            var req_valid_arr = validation[key];
            check = valid_fields(req_val, req_valid_arr, key);
            if(!check.status)
                break;
        }else{
            check.status = false;
            check.message = defaultMsg;
            break;
        }
    }
    return check;
}

function valid_fields(value, valid_arr, key) {
    var check = {status: true, message: ""};

    var arrValCheck = find_arr_val("trim", valid_arr, false);
    if(arrValCheck){
        value = value.trim();
        valid_arr = arrValCheck;
    }

    arrValCheck = find_arr_val("required", valid_arr, false);
    if(arrValCheck){
        if(value === "") {
            check.status = false;
            check.message = key+" is required!";
        }
        valid_arr = arrValCheck;
    }

    arrValCheck = find_arr_val("number", valid_arr, false);
    if(check.status && arrValCheck){
        if(!isNaN(value)){
            if(value % 1 !== 0){
                check.status = false;
                check.message = key+" is invalid!";
            }
        }else{
            check.status = false;
            check.message = key+" is invalid!";
        }
        valid_arr = arrValCheck;
    }

    arrValCheck = find_arr_val("length", valid_arr, true);
    if(check.status && arrValCheck){
        var length = parseInt(arrValCheck.arrVal.split('=')[1]);
        if(length !== value.length){
            check.status = false;
            check.message = key+" is invalid length. (Only 10 Digits)";
        }
        valid_arr = arrValCheck.array;
    }

    return check;
}

function find_arr_val(find_val, arr, strict){
    if(strict){
        var retData = false;
        arr.forEach(function (val, ind) {
            if(val.indexOf(find_val) !== -1){
                arr.splice(ind, 1);
                retData = {array: arr, arrVal: val};
                return false;
            }
        });
        return retData;
    }else{
        var findInd = arr.indexOf(find_val);
        if(findInd !== -1){
            arr.splice(findInd, 1);
            return arr;
        }
    }
    return false;
}