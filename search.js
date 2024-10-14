// Modify the following line with the correct path to your food.xlsx
const filePath = 'food.xlsx'; // Assuming it's in the same directory
let jsonData = []; // Array to store the data

// Load the file when the page loads
window.onload = function() {
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = 'ModifiedMacros'; // Specify the sheet name
            const sheet = workbook.Sheets[sheetName];

            if (sheet) {
                jsonData = XLSX.utils.sheet_to_json(sheet); // Store data from the "Nutrients" sheet
                alert("File loaded. You can now search.");
            } else {
                alert(`Sheet "${sheetName}" not found.`);
            }
        })
        .catch(error => {
            console.error("Error loading the file:", error);
            alert("Failed to load the file.");
        });
};





// Function to display data in the table
// Function to display data in the table
function displayFoodData(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    const foodTable = document.getElementById('foodTable');

    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length === 0) {
        foodTable.style.display = 'none'; // Hide table if no results
        alert("No results found.");
        return;
    }

    // Show the table
    foodTable.style.display = 'table';

    // Create header row
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Populate table with data and make rows clickable
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer'; // Change cursor to pointer on hover

        // Add a click event listener to each row
        tr.addEventListener('click', function() {
            const servings = prompt(`How many servings of ${item.foodname} did you have?`); 
            if(isNaN(servings) || servings.trim() === '' || Number(servings) <= 0){
                alert("Please Enter a Number");
                servings = 0;
            }
            else{
                alert(`You have entered ${servings} servings of ${item.foodname}`);
            }
        });

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}


// Add event listener to the search button
document.getElementById('searchButton').addEventListener('click', function() {
    const foodnames = jsonData.map(item => item.foodname);
    const query = document.getElementById('searchInput').value.toLowerCase().replace(/[(),]/g, '').split(" ");

    const getMatchCount = (str, words) => {
        const keywords = new Set(str.toLowerCase().replace(/[(),]/g, '').split(' '));
        return words.filter(word => keywords.has(word)).length;
    }

    const matchedStrings = foodnames.filter(str => str !== undefined).map(str => ({
            string: str,
            matchCount: getMatchCount(str, query)
    }));

    const sortedStrings = matchedStrings.filter(str => str.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(item => item.string);

    const sortedJSON = jsonData.filter(item => sortedStrings.includes(item.foodname))
        .sort((a, b) => sortedStrings.indexOf(a.foodname) - sortedStrings.indexOf(b.foodname));

    displayFoodData(sortedJSON);
});
