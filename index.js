const colourPicker = document.getElementById("colourpicker")
const footerEl = document.getElementById("footer")
const colourDisplaySection = document.getElementById("colour-display-section")
let currentSelectedTheme = "monochrome"
let lastSelectedTheme = ["Monochrome"]
let isStructureLoaded = false
 
//listens for page clicks
document.addEventListener("click", (e)=>{
    generateSchemeOption(e.target.id)
    themeUpdater(e.target.id)
    keyboardCopier(e.target.id)
})

//listens for toggle switches between light and dark mode
document.getElementById("checkbox").addEventListener("change", () => {
    document.getElementById("container").classList.toggle("dark")
    document.getElementById("colourpicker-label").classList.toggle("dark")
    footerEl.classList.toggle("dark")
    colourDisplaySection.style.borderTop="1px solid white"
    colourDisplaySection.style.borderBottom="1px solid white"
})

//generates new colour scheme based on current theme and base colour
async function generateSchemeOption(id) {
    if(id === document.getElementById("generate-scheme-btn").id)
    {
        try {
            const resp = 
            await fetch(`https://www.thecolorapi.com/scheme?hex=${colourPicker.value.slice(1)}&mode=${currentSelectedTheme}&count=5`)  
            const data = await resp.json()
        
            if(isStructureLoaded!= true)
            {
                formatDisplay(data.colors)
                isStructureLoaded = true
            }
            updateSchemeDisplay(data.colors)
        }
        catch {
            document.getElementById("container").innerHTML= `<h2> Oops! Refresh the page</h2>`
        }
    }
}

//formats DOM structure for colour display and footer section prior to API call
function formatDisplay(data)
{   
    data.map((current, index)=> {
        current =`<div id= "colour-option-${index+1}" class="colour-option"></div>`
        colourDisplaySection.innerHTML+= current
    })
    data.map((current,index)=> {
        current = `<p id="hex-option-${index+1}" class="hex-option">Hex Value</p>`
        footerEl.innerHTML+= current
    })
}

//displays fetched hex colours from API into colour columns with hex values underneath
function updateSchemeDisplay(data) {
    data.forEach((color, index) => {
        document.getElementById(`colour-option-${index+1}`).style.background = color.hex.value
        document.getElementById(`hex-option-${index+1}`).textContent = color.hex.value
    })
}

//updates theme button with new selection
function themeUpdater(id)
{
    document.getElementById("dropdown-menu").childNodes.forEach(current=>{
        if(id === current.id)
        {   //updates currently selected colour theme
            currentSelectedTheme = (current.id).toLowerCase()
            //removes checkmark from deselected colour theme
            document.getElementById(lastSelectedTheme[0]).innerHTML =
                `${lastSelectedTheme[0]}`
            //removes previous colour theme and replaces it with newly selected theme
            lastSelectedTheme.pop()
            lastSelectedTheme.push(current.id)  
            //updates current theme with dropdown and checkmark icons
            document.getElementById("dropdown-btn").innerHTML = 
                `${current.id} <i class="fa fa-regular fa-caret-down"></i>`
            document.getElementById(current.id).innerHTML =
                `${current.id} <i class="fa fa-solid fa-check"></i>` 
        }
    })
}

//copies selected hex value to keyboard
function keyboardCopier(id) 
{   //checks if text content (hex value) is selected
    footerEl.childNodes.forEach(current=> {
        if(id === current.id)
        { keyboardCopierHelper(current.id)}
    })
    //checks if colour area is selected
    colourDisplaySection.childNodes.forEach((current, index)=> {
        if(id === current.id)
        { //this index is adjusted to match index of corresponding text hex value
          const matchingID = document.getElementById(`hex-option-${index-2}`)
          keyboardCopierHelper(matchingID.id)
        }
    })
}

//formats copied hex value to page
function keyboardCopierHelper(selectedID)
{
    let currentHexValue = document.getElementById(selectedID).textContent
    navigator['clipboard'].writeText(currentHexValue)
    //checks if alert message structure exists, then displays alert and removes it
    if(!document.getElementById("alert")) { 
        footerEl.innerHTML += 
            ` <div class ="alert" id ="alert"> <i class="fa fa-regular fa-bell"></i> &nbsp; 
                COPIED HEX VALUE: <span id ="alert-password">${currentHexValue} </span> 
              </div> 
            `
        setTimeout(()=>{ document.getElementById("alert").classList.toggle("none")}, 2400)
    }
    //if alert message structure exists, its conversion is replaced with new selection
    else {
        document.getElementById("alert").classList.toggle("none")
        document.getElementById("alert-password").textContent=""
        document.getElementById("alert-password").textContent = currentHexValue       
        setTimeout(()=>{ document.getElementById("alert").classList.toggle("none")}, 2400)
    }
}