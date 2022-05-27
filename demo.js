let ticket = [{
    c:"blue",
    id:"2",
    task:"r"
},
{
    c:"red",
    id:"1",
    task:"w"
},
{
    c:"black",
    id:"5",
    task:"w"
}]

let arr = ticket[0];

if(arr.id==2){
    ticket.splice(0,1);
}
console.log(ticket);