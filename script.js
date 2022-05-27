let addbtn = document.querySelector(".add-btn");
let removebtn = document.querySelector(".remove-btn");
let modalcont = document.querySelector(".modal-cont")
let maincont = document.querySelector(".main-cont")

let textarea = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let colors = ['lightpink', 'lightblue', 'lightgreen', 'black']
let modalPrioritycolor = colors[colors.length - 1];
let ticketTask;

let addflag = false;
let removeflag = false;
let allTickets = [];
let ticketId;

if(localStorage.getItem("jira_tickets")){

    allTickets = JSON.parse(localStorage.getItem("jira_tickets"));
    allTickets.forEach((ticket)=>
    createTicket(ticket.ticketColor,ticket.ticketId,ticket.ticketTask)
    )

}

//event listerner for priority coloring
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((prColorElement, idx) => {
            prColorElement.classList.remove("border");
        })
        colorElem.classList.add("border");

        modalPrioritycolor = colorElem.classList[0];
    })
}
)
addbtn.addEventListener("click", (e) => {
    //display modal
    //generate ticket

    //addflag - true-> modal display
    //addflag - flag-> modal none
    addflag = !addflag;

    if (addflag) {
        modalcont.style.display = "flex"
    }
    else {
        modalcont.style.display = "none"
    }

})

removebtn.addEventListener("click", (e) => {
    removeflag = !removeflag;
    
})

modalcont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {

        createTicket(modalPrioritycolor, ticketId, textarea.value);
        setModaltodefault()
        addflag = true;

    }
})

function createTicket(ticketColor, ticketId, ticketTask) {
    
    let id = ticketId || shortid();

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");


    ticketCont.innerHTML = `
        <div class="ticket-cont">
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id"> #${id}</div>
            <div class="task-area">${ticketTask}</div>
            <div class ="ticket-lock">
               <i class="fa-solid fa-lock"></i>
            </div>
        
        </div>`
        ;

    maincont.appendChild(ticketCont);

    
    
    if (!ticketId) {
        ticketId = id;
        allTickets.push({ ticketColor, ticketId, ticketTask })
        localStorage.setItem("jira_tickets",JSON.stringify(allTickets))
    }
    setModaltodefault();
    handleRemoval(ticketCont,id);

    handleLock(ticketCont,id);

    handlePriorityBarClr(ticketCont,id);
    

}

function handleRemoval(ticket,id) {
    ticket.addEventListener("click",(e)=>{
    if (!removeflag) {
       return;
    }
    

    let ticketIdx = getIndexTicket(id);
    allTickets.splice(ticketIdx,1);
    localStorage.setItem("jira_tickets",JSON.stringify(allTickets));
    ticket.remove();
})
}

//handle lock
let lockOpen = "fa-lock-open"
let lock = "fa-lock"
function handleLock(ticketCont,id) {
    let ticketLockElems = ticketCont.querySelector(".ticket-lock")

    let ticketLock = ticketLockElems.children[0];
    let ticketTaskArea = ticketCont.querySelector(".task-area")
    ticketLock.addEventListener("click", (e) => {
        if (ticketLock.classList.contains(lock)) {
            ticketLock.classList.remove(lock);
            ticketLock.classList.add(lockOpen);
            ticketTaskArea.setAttribute("contenteditable", "true")
            
        }
        else {
            ticketLock.classList.remove(lockOpen);
            ticketLock.classList.add(lock);
            ticketTaskArea.setAttribute("contenteditable", "false")
        }

        let ticketidx = getIndexTicket(id);
    
    allTickets[ticketidx].ticketTask = ticketTaskArea.innerText;
    localStorage.setItem("jira_ticket",JSON.stringify(allTickets));
    })
}
function getIndexTicket(id){
    let ticketIdx = allTickets.findIndex((ticket)=>{
       return ticket.ticketId===id;
       
    })
    return ticketIdx;
    
}

function handlePriorityBarClr(ticketCont,id) {

    
    let ticketClr = ticketCont.querySelector(".ticket-color");
    ticketClr.addEventListener("click", (e) => {
        console.log("color changed");
        let curclr = ticketClr.classList[1];
        let indexofclr = colors.findIndex((color) => {
            return curclr === color;
        });
        indexofclr++;
        indexofclr %= colors.length;
        let newclr = colors[indexofclr];

        ticketClr.classList.remove(curclr);
        ticketClr.classList.add(newclr);

        
        let ticketIdx = getIndexTicket(id);
        console.log(ticketIdx);
        console.log(allTickets);
        allTickets[ticketIdx].ticketColor = newclr;
        localStorage.setItem("jira_tickets",JSON.stringify(allTickets));
    })




}


//filering on the basis of colors

let toolBoxColors = document.querySelectorAll(".color");

console.log(allTickets);
toolBoxColors.forEach((color) => {
    color.addEventListener("click", (e) => {
        let currentColor = color.classList[0];
        let filteredTickets = allTickets.filter((ticket) => {
            return ticket.ticketColor === currentColor
        })

        let allTicketsArr = document.querySelectorAll(".ticket-cont");


        for (let i = 0; i < allTicketsArr.length; i++) {
            allTicketsArr[i].remove();
        }

        filteredTickets.forEach((ticket) => {
            createTicket(ticket.ticketColor, ticket.ticketId, ticket.ticketTask);
        })



    })

})

toolBoxColors.forEach((color) => {
    color.addEventListener("dblclick", (e) => {
        

        let allTicketsArr = document.querySelectorAll(".ticket-cont");


        for (let i = 0; i < allTicketsArr.length; i++) {
            allTicketsArr[i].remove();
        }

        allTickets.forEach((ticket) => {
            createTicket(ticket.ticketColor, ticket.ticketId, ticket.ticketTask);
        })



    })

})

function setModaltodefault(){
    modalcont.style.display = "none"

        textarea.value = "";
    allPriorityColors.forEach((colorElem, idx) => {
        colorElem.classList.remove("border");

        modalPrioritycolor = colorElem.classList[0];
        
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
    
}



