const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
// will update the value of isError if the user provides an invalid input
let isError = false;
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, "");
}
function isInvalidInput(str) {
    // Number inputs only allow the e to occur between two digits
    const regex = /\d+e\d+/i;
    return str.match(regex);
    // which is an array of matches or null if no matches are found
}
// allow users to add entries to the calorie counter
function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    // number the entries a user adds
    // To get a count of the number of entries, you can query by text inputs.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    // dynamic HTML string to add to the webpage. 
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories" />`;
    // The method's job is to insert the HTML into the given position, so this is not a direct assignment.
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}
// This function will be another event listener, so the first argument passed will be the browser event – e is a common name for this parameter
function calculateCalories(e) {
    // The default action of the submit event is to reload the page. You need to prevent this default action using the preventDefault() method of your e parameter.
    e.preventDefault();
    isError = false;
    // Your function needs to get the values from the entries the user has added.
    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");
    // Now that you have your lists of elements, you can pass them to your getCaloriesFromInputs function to extract the calorie total.
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    // used getElementById, which returns an Element, not a NodeList
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    if (isError) {
        return;
    }
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
    // using interpolation to replace remainingCalories and surplusOrDeficit with the appropriate variables.
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;
    //visible so the user can see your text
    output.classList.remove('hide');
}
// to write a function that will get the calorie counts from the user's entries.
function getCaloriesFromInputs(list) {
    let calories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        // In this case, if the user enters an invalid input, you want to alert them and then return null to indicate that the function has failed
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    for (const container of inputContainers) {
        container.innerHTML = '';
    }
    budgetNumberInput.value = '';
    output.innerText = '';

    output.classList.add('hide');
}
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);