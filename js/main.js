
$(document).ready(()=>{
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });
})

function closeSideBar() {
    let boxWidth = $('.side-box').outerWidth();
    $('#sideBar').animate({ left: `-${boxWidth}px` }, 500)
    $('.colse-open-btn').removeClass('fa-x').addClass('fa-align-justify');
}

closeSideBar()

function showHideSecs(sectionId) {
    closeSideBar()
    $('#showMeals').addClass('d-none')
    $('#searchHeader').addClass('d-none')
    $('#showDetails').addClass('d-none')
    $('#contactUs').addClass('d-none')
    $(sectionId).removeClass('d-none')
}



$('.colse-open-btn').on('click', () => {
    if ($('#sideBar').css('left') == '0px') {
        closeSideBar()
    }
    else {
        $('#sideBar').animate({ left: 0 }, 500)
        $('.colse-open-btn').removeClass('fa-align-justify').addClass('fa-x');
    }
})


async function displayMeals(searchQuote = '', searchmethod = 'word') {
    $('#loading').addClass('d-flex')
    let response;
    try {
        if (searchmethod == 'letter') {
            response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchQuote}`)
        }
        else if (searchmethod == 'category')
            response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchQuote}`)
        else if (searchmethod == 'area') {
            response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchQuote}`)
        }
        else if (searchmethod == 'ingradient') {
            response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuote}`)
        }
        else
            response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuote}`)


        response = await response.json()
        let temp = ''
        for (let i = 0; i < response.meals.length; i++) {
            temp += `
        <div class="col-md-3 mealCard" data-id=${response.meals[i].idMeal}>
            <div class="inner  position-relative overflow-hidden rounded-2" >
                <img src="${response.meals[i].strMealThumb}" alt="" class="w-100">
                <div class="layer p-2">
                    <h3>${response.meals[i].strMeal}</h3>
                </div>
            </div>
        </div>`
        }
        $('#displayMeals').html(temp);
        $('.mealCard').on('click', function (e) {
            displayDetails($(this).attr('data-id'))
            showHideSecs('#showDetails')
            console.log($(this).attr('data-id'))

        })
    } catch (error) {

    }
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });

}
displayMeals()


async function displayDetails(id = 52772) {
    $('#loading').addClass('d-flex')
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    response = await response.json()
    let meal = response.meals[0]
    let { strMealThumb, strMeal, strInstructions, strArea, strCategory, strSource, strYoutube, strTags } = meal
    let count = 1
    let flag = true
    let ingredientTemp = ''
    let ingredientName = ''
    let measureName = ''
    let tagsTemp = ''

    while (flag) {
        ingredientName = 'strIngredient' + count
        measureName = 'strMeasure' + count
        if (meal[ingredientName] != '') {
            ingredientTemp += `<li class="alert alert-info m-2 p-1">${meal[measureName] + ' ' + meal[ingredientName]}</li>`
            count++
        }
        else {
            flag = false
        }
    }

    if (strTags) {
        let tagsList = strTags.split(',')
        for (let i = 0; i < tagsList.length; i++) {
            tagsTemp += `<li class="alert alert-danger m-2 p-1">${tagsList[i]}</li>`
        }
    }

    let temp = `
    <div class="row">
            <div class="col-md-4">
                <img src="${strMealThumb}" class="w-100 rounded-2" alt="">
                <h2>${strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${strInstructions}</p>
                <h3> <span class="fw-bold ">Area :</span> ${strArea}</h3>
                <h3> <span class="fw-bold ">Category :</span> ${strCategory}</h3>
                <h3 class="fw-bold"> Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredientTemp}
                </ul>
                <h3 class="fw-bold"> Tages :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                   ${tagsTemp}
                </ul>
                <a href=${strSource} target="_blank" class="btn btn-success">Source</a>
                <a href=${strYoutube} target="_blank" class="btn btn-danger">Youtube</a>
            </div>
        </div>`
    $('#showDetails').html(temp)
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });
}


$('#searchLink').on('click', () => {
    showHideSecs('#searchHeader')
})

$('#nameSearchInput').on('keyup', () => {
    $('#showMeals').removeClass('d-none')
    displayMeals($('#nameSearchInput').val())
})
$('#letterSearchInput').on('keyup', () => {
    $('#showMeals').removeClass('d-none')
    displayMeals($('#letterSearchInput').val(), 'letter')
})


$('#categotyLink').on('click', () => {
    showHideSecs('#showMeals')
    displayCategories()
})

async function displayCategories() {
    $('#loading').addClass('d-flex')
    let response;
    try {
        console.log('ced')
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        response = await response.json()
        let temp = ''
        for (let i = 0; i < response.categories.length; i++) {
            temp += `
        <div class="col-md-3 categoryCard" data-id=${response.categories[i].strCategory}>
            <div class="inner  position-relative overflow-hidden rounded-2" >
                <img src="${response.categories[i].strCategoryThumb}" alt="" class="w-100">
                <div class="layer flex-column text-center p-2">
                    <h3>${response.categories[i].strCategory}</h3>
                    <p>${response.categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`
        }
        $('#displayMeals').html(temp);
        $('.categoryCard').on('click', function (e) {
            displayMeals($(this).attr('data-id'), 'category')

        })
    } catch (error) {

    }
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });
}

$('#areaLink').on('click', () => {
    showHideSecs('#showMeals')
    displayAreas()
})

async function displayAreas() {
    $('#loading').addClass('d-flex')
    let response;
    try {
        console.log('ced')
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        response = await response.json()
        let temp = ''
        for (let i = 0; i < response.meals.length; i++) {
            temp += `
        <div class="col-md-3 areaCard" data-id=${response.meals[i].strArea}>
            <div class="text-center  " >
                    <i class='fa-solid fa-house-laptop fa-4x'></i>
                    <h3>${response.meals[i].strArea}</h3>
            </div>
        </div>`
        }
        $('#displayMeals').html(temp);
        $('.areaCard').on('click', function (e) {
            displayMeals($(this).attr('data-id'), 'area')

        })
    } catch (error) {

    }
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });
}

$('#ingradientLink').on('click', () => {
    showHideSecs('#showMeals')
    displayIngradients()
})


async function displayIngradients() {
    $('#loading').addClass('d-flex')
    console.log('dsd');
    let response;
    try {
        response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        response = await response.json()
        let temp = ''
        for (let i = 0; i < 20; i++) {
            temp += `
        <div class="col-md-3 ingradientCard" data-id=${response.meals[i].strIngredient}>
            <div class="text-center  " >
                    <i class='fa-solid fa-drumstick-bite fa-4x'></i>
                    <h3>${response.meals[i].strIngredient}</h3>
                    <p>${response.meals[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`
        }
        console.log('second')
        $('#displayMeals').html(temp);
        $('.ingradientCard').on('click', function (e) {
            displayMeals($(this).attr('data-id'), 'ingradient')

        })
    } catch (error) {
        console.log(error)
    }
    $('#loading').fadeOut(2000,()=>{
        $('#loading').removeClass('d-flex')
    });
}

$('#contactLink').on('click', () => {
    showHideSecs('#contactUs')
})


function NameValidation() {
    $('#vaildationName').removeClass('d-none')
    let NameCheck = Array.from(document.querySelectorAll('#vaildationName i'))
    let nameRegex = /^[a-zA-Z]{3,10}[a-zA-Z ]{0,20}$/;
    let nameTest = nameRegex.test($('#nameInput').val());
    singleValidation(nameRegex, NameCheck, $('#nameInput').val())
    if (nameTest)
        $('#vaildationName').addClass('d-none')
    return nameTest;
}

function emailValidation() {
    $('#VaildationEmail').removeClass('d-none')
    let emailRegex = /^[^\s@]+@[^\s@]{2,10}\.[^\s@]{2,10}$/;
    let emailTest = emailRegex.test($('#emailInput').val());
    if (emailTest)
        $('#VaildationEmail').addClass('d-none')
    return emailTest
}

function phoneValidation() {
    $('#VaildationPhone').removeClass('d-none')
    let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneTest = phoneRegex.test($('#phoneInput').val());
    if (phoneTest)
        $('#VaildationPhone').addClass('d-none')
    return phoneTest
}

function ageValidation() {
    $('#Vaildationage').removeClass('d-none')
    if ($('#ageInput').val() < 1 || $('#ageInput').val() > 200) {
        return false
    }
    else {
        $('#Vaildationage').addClass('d-none')
        return true
    }

}


function passValidation() {
    $('#vaildationPassword').removeClass('d-none')
    let charCheck = Array.from(document.querySelectorAll('.char i'))
    let symbolCheck = Array.from(document.querySelectorAll('.symbol i'))
    let numberCheck = Array.from(document.querySelectorAll('.number i'))
    let upCaseCheck = Array.from(document.querySelectorAll('.upCase i'))
    let loCaseCheck = Array.from(document.querySelectorAll('.loCase i'))
    let passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    let passTest = passRegex.test($('#passInput').val());
    let coSymbol = /(?=.*[!@#$%^&*])/;
    let coNum = /(?=.*\d)/;
    let coLow = /(?=.*[a-z])/;
    let coUpp = /(?=.*[A-Z])/
    let con8char = /^.{8,20}$/
    singleValidation(coSymbol, symbolCheck, $('#passInput').val())
    singleValidation(coNum, numberCheck, $('#passInput').val())
    singleValidation(coLow, loCaseCheck, $('#passInput').val())
    singleValidation(coUpp, upCaseCheck, $('#passInput').val())
    singleValidation(con8char, charCheck, $('#passInput').val())
    if (passTest)
        $('#vaildationPassword').addClass('d-none')
    return passTest
}

function rePassValdation() {
    $('#VaildationRePass').removeClass('d-none')
    let password = $('#passInput').val()
    let rePass = $('#repassInput').val()
    if (password == rePass) {
        $('#VaildationRePass').addClass('d-none')
        return true
    }
    else {
        return false
    }

}

function singleValidation(regex, list, input) {
    if (regex.test(input)) {
        list[0].classList.remove('d-none');
        list[1].classList.add('d-none')
        return true
    }
    else {
        list[0].classList.add('d-none');
        list[1].classList.remove('d-none')
        return false
    }
}

function inputsValdation() {
    if (NameValidation() && emailValidation() && phoneValidation()
        && ageValidation() && passValidation() && rePassValdation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}


$('#nameInput').on('keyup', ()=>{
    inputsValdation()
    NameValidation()
} )
$('#emailInput').on('keyup', ()=>{
    inputsValdation() 
    emailValidation()
})
$('#phoneInput').on('keyup', ()=>{
    inputsValdation() 
    phoneValidation()
})
$('#ageInput').on('keyup', ()=>{
    inputsValdation() 
    ageValidation()
})
$('#passInput').on('keyup', ()=>{
    inputsValdation() 
    passValidation()
})
$('#repassInput').on('keyup', ()=>{
    inputsValdation() 
    rePassValdation()
})
// signUserNameInput.addEventListener('keyup', NameValidation)
// signUserEmailInput.addEventListener('keyup', emailValidation)
// signUserPassInput.addEventListener('keyup', passValidation)