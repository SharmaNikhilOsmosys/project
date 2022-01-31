const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const inputEL= document.getElementById("input");
const wordEL = document.getElementById("word")
const describeEL= document.getElementById("definition");
const exampleEL= document.getElementById("example");
const saveEL= document.getElementById("save-btn");
const recentEL= document.getElementById("recent");
const resetEL= document.getElementById("reset");
const tbodyEL = document.querySelector(".table tbody");
let wordObj={};


let recent =localStorage.getItem('mydata')===null?[]:JSON.parse(localStorage.getItem('mydata'));


async function  fetchData(){
    
    return fetch(url+inputEL.value)
    .then(response =>  {
        // console.log(response.status)
        return response.json();
    })
    .then(function(jsonData){
        if(jsonData.title === 'No Definitions Found'){
            alert('Invalid Entry');
            saveEL.removeEventListener('click',save);
            reset();
            return;
        }
        // console.log(jsonData);
        return jsonData[0].meanings[0].definitions;
    });
}


function reset (){
    describeEL.innerHTML='';
    exampleEL.innerHTML='';
    wordEL.innerHTML="word";

    // console.log(recent);
}

function save(){

    recent.push(wordObj);
    
    showRecent();
    
    saveEL.removeEventListener('click',save);
    // console.log(recent);
    

    localStorage.setItem('mydata',JSON.stringify(recent));

}

function showRecent(){
    tbodyEL.innerHTML='';
    for(let i=0;i<recent.length;i++){
        if(i>9){
            break;
        }
        const templateEL = document.getElementById("template");
        const newNode=document.importNode(templateEL.content,true);
        // newNode.id=recent.length-i;
        newNode.querySelector("th").innerText=i+1;
        for(key in recent[recent.length-i-1]){
            let trEL=document.createElement('td');
            trEL.innerText=recent[recent.length-i-1][key];
            newNode.querySelector("tr").append(trEL);
        }
        tbodyEL.append(newNode);
    }
}
        
        
        
    function printOutput(event){

        if(inputEL.value===''){            
            alert('Invalid Entry');
            saveEL.removeEventListener('click',save);
            reset();
            return;
        }

        for(obj of recent){
            if(obj.word===inputEL.value  && obj.times>=1){
                obj.times++;
                obj.time= Date(event.timeStamp).slice(17,25);
                localStorage.setItem('mydata',JSON.stringify(recent));
                saveEL.removeEventListener('click',save);

                alert('repeatative entry');
            }
        }
                
        
        
        timestamp=event.timeStamp;
        // let dateAndTime= new Date();
        let dateAndTime= Date(timestamp);
        // console.log(dateAndTime);
        wordObj=
        {
            word:inputEL.value,
            time: dateAndTime.slice(16,25),
            date: dateAndTime.slice(0,16),
            times:1,
        }

    reset();

    saveEL.addEventListener('click',save)
    wordEL.innerHTML=inputEL.value;

    // console.log(wordObj);

    fetchData().then(function(data){    
        // console.log(data);
        for(let element of data) {
            newLi= document.createElement('li');
            newLi.innerText=element.definition;
            describeEL.append(newLi);
        };
        for(let element of data) {
            if(element.example){
                newLi= document.createElement('li');
                newLi.innerText=element.example;
                exampleEL.append(newLi);
            }
        };
    })
    
    // showRecent();
    
}


document.getElementById("reset-btn").addEventListener("click",()=>{
    inputEL.value='';
    wordObj={};
    reset();
});

document.getElementById("input-btn").addEventListener("click",printOutput);

showRecent();
