'use strict';
// script.js
/*

To do:
1.  right click on image Area:
1.1 clipboard context should be copyable to image Area--DONE
1.2 url should be possible to update--DONE

2.Highlight the most recent clicked button only--DONE

3.Save file with name of root node directly without asking name--DONE

3.Add possibility to store in IndexedDB,and deleting,and listing --DONE

4.Draggable dividers

*/

/*
{    
"name": NAME OF THE NODE,  
"textDescription":DESCRIPTION FOR NODE BY USER,
"modelType":General/OrgChart/MindMap/Wireframe/Gantt/JSON/YAML
"imageZoomScale":1,
"plantUmlCode":"",
"svgLink": "",   
"subElements": []	
*/


//const plantUmlServer = "http://www.plantuml.com";//avoid this for sensitive data


const plantUmlServer = "http://127.0.0.1:8000";
//this needs steps to be followed https://plantuml.com/picoweb
//1. run 
//java -jar "c:\tools\plantuml\plantuml.jar" -picoweb:8000:127.0.0.1
//from cmd


//to setup local server for main page, run 
//python -m http.server and navigate to http://localhost:8000/


var parentstr="";
var jsonButtonTargetString="";
var jsonButtonTargetParentString="";
var modelSource="";
var modelDescriptionSource="";
var nodeExpression="";
var latestnodeexpression=`window.jsonData["name"]`;
var view="sublist"
var str;

const tablePrefix ="@startuml \n <style> \n class { \n    BackgroundColor transparent \n     linecolor transparent \n } \n </style> \n hide empty members \n hide circle \n class \"";
		
const tablePostfix ="\" as Organization {\n } \n @enduml";		
var clipBoardJsonCutPaste=""


const jsonString=`{    "name": "RootModel",  "textDescription":"","modelType":"","plantUmlCode":"","svgLink": "","imageZoomScale":1,   "subElements": [	{	  "name": "Level_1_Model",	  "textDescription":"","modelType":"","plantUmlCode":"","imageZoomScale":1,"svgLink":"",	  "subElements": [		 		]	},	{	  "name": "Level_1B_Model",	  "textDescription":"","modelType":"","plantUmlCode":"","imageZoomScale":1,"svgLink": "",   "subElements": []	},	{	  "name": "Level_1C_model",	  "textDescription":"","modelType":"","plantUmlCode":"","imageZoomScale":1,"svgLink": "",   "subElements": []	}	]}`;


const plantUmlSampleModel_Sequence=`Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
`;

const plantUmlSampleModel_Usecase=`left to right direction
actor Guest as g
package Professional {
  actor Chef as c
  actor "Food Critic" as fc
}
package Restaurant {
  usecase "Eat Food" as UC1
  usecase "Pay for Food" as UC2
  usecase "Drink" as UC3
  usecase "Review" as UC4
}
fc --> UC4
g --> UC1
g --> UC2
g --> UC3
`;
const plantUmlSampleModel_Class=`Object <|-- ArrayList

Object : equals()
ArrayList : Object[] elementData
ArrayList : size()
`;
const plantUmlSampleModel_Activity=`
start
repeat
  :Test something;
    if (Something went wrong?) then (no)
      #palegreen:OK;
      break
    endif
    ->NOK;
    :Alert "Error with long text";
repeat while (Something went wrong with long text?) is (yes) not (no)
->//merged step//;
:Alert "Success";
stop
`;
const plantUmlSampleModel_Component=`package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}

node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
}

cloud {
  [Example 1]
}


database "MySql" {
  folder "This is my folder" {
    [Folder 3]
  }
  frame "Foo" {
    [Frame 4]
  }
}


[Another Component] --> [Example 1]
[Example 1] --> [Folder 3]
[Folder 3] --> [Frame 4]


`;
const plantUmlSampleModel_State=`scale 350 width
[*] --> NotShooting

state NotShooting {
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  [*] --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved

  state NewValuePreview {
     State1 -> State2
  }

}
`;
const plantUmlSampleModel_Object=`object Object01
object Object02
object Object03
object Object04
object Object05
object Object06
object Object07
object Object08

Object01 <|-- Object02
Object03 *-- Object04
Object05 o-- "4" Object06
Object07 .. Object08 : some labels
`;
const plantUmlSampleModel_Deployment=`actor foo1
actor foo2
foo1 <-0-> foo2
foo1 <-(0)-> foo2
 
(ac1) -le(0)-> left1
ac1 -ri(0)-> right1
ac1 .up(0).> up1
ac1 ~up(0)~> up2
ac1 -do(0)-> down1
ac1 -do(0)-> down2
 
actor1 -0)- actor2
 
component comp1
component comp2
comp1 *-0)-+ comp2
[comp3] <-->> [comp4]

boundary b1
control c1
b1 -(0)- c1

component comp1
interface interf1
comp1 #~~( interf1

:mode1actor: -0)- fooa1
:mode1actorl: -ri0)- foo1l

[component1] 0)-(0-(0 [componentC]
() component3 )-0-(0 "foo" [componentC]

[aze1] #-->> [aze2]
`;
const plantUmlSampleModel_Timing=`robust "Web Browser" as WB
concise "Web User" as WU

@0
WU is Idle
WB is Idle

@100
WU -> WB : URL
WU is Waiting #LightCyan;line:Aqua

@200
WB is Proc.

@300
WU -> WB@350 : URL2
WB is Waiting

@+200
WU is ok

@+200
WB is Idle

highlight 200 to 450 #Gold;line:DimGrey : This is my caption
highlight 600 to 700 : This is another highlight
`;
const plantUmlSampleModel_Network=`nwdiag {
  group nightly {
    color = "#FFAAAA";
    description = "<&clock> Restarted nightly <&clock>";
    web02;
    db01;
  }
  network dmz {
      address = "210.x.x.x/24"

      user [description = "<&person*4.5>\\n user1"];
      // set multiple addresses (using comma)
      web01 [address = "210.x.x.1, 210.x.x.20",  description = "<&cog*4>\\nweb01"]
      web02 [address = "210.x.x.2",  description = "<&cog*4>\\nweb02"];

  }
  network internal {
      address = "172.x.x.x/24";

      web01 [address = "172.x.x.1"];
      web02 [address = "172.x.x.2"];
      db01 [address = "172.x.x.100",  description = "<&spreadsheet*4>\\n db01"];
      db02 [address = "172.x.x.101",  description = "<&spreadsheet*4>\\n db02"];
      ptr  [address = "172.x.x.110",  description = "<&print*4>\\n ptr01"];
  }
}
`;
const plantUmlSampleModel_Wireframe=`{+
{/ <b>General | Fullscreen | Behavior | Saving }
{
{ Open image in: | ^Smart Mode^ }
[X] Smooth images when zoomed
[X] Confirm image deletion
[ ] Show hidden images
}
[Close]
}
`;
const plantUmlSampleModel_Archimate=`!define Junction_Or circle #black
!define Junction_And circle #whitesmoke

Junction_And JunctionAnd
Junction_Or JunctionOr

archimate #Technology "VPN Server" as vpnServerA <<technology-device>>

rectangle GO #lightgreen
rectangle STOP #red
rectangle WAIT #orange
GO -up-> JunctionOr
STOP -up-> JunctionOr
STOP -down-> JunctionAnd
WAIT -down-> JunctionAnd
`;
const plantUmlSampleModel_Gantt=`
[Task1] lasts 4 days
then [Task1.1] lasts 4 days
[Task1.2] starts at [Task1]'s end and lasts 7 days

[Task2] lasts 5 days
then [Task2.1] lasts 4 days

[MaxTaskEnd] happens at [Task1.1]'s end
[MaxTaskEnd] happens at [Task1.2]'s end
[MaxTaskEnd] happens at [Task2.1]'s end

`;
const plantUmlSampleModel_MindMap=`
+ OS
++ Ubuntu
+++ Linux Mint
+++ Kubuntu
+++ Lubuntu
+++ KDE Neon
++ LMDE
++ SolydXK
++ SteamOS
++ Raspbian
-- Windows 95
-- Windows 98
-- Windows NT
--- Windows 8
--- Windows 10
`;
const plantUmlSampleModel_WBS=`
* Business Process Modelling WBS
** Launch the project
*** Complete Stakeholder Research
*** Initial Implementation Plan
** Design phase
*** Model of AsIs Processes Completed
**** Model of AsIs Processes Completed1
**** Model of AsIs Processes Completed2
*** Measure AsIs performance metrics
*** Identify Quick Wins
** Complete innovate phase
`;
const plantUmlSampleModel_JSON=`{
  "firstName": "John",
  "lastName": "Smith",
  "isAlive": true,
  "age": 27,
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021-3100"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [],
  "spouse": null
}
`;
const plantUmlSampleModel_YAML=`
doe: "a deer, a female deer"
ray: "a drop of golden sun"
pi: 3.14159
xmas: true
french-hens: 3
calling-birds: 
	- huey
	- dewey
	- louie
	- fred
xmas-fifth-day: 
	calling-birds: four
	french-hens: 3
	golden-rings: 5
	partridges: 
		count: 1
		location: "a pear tree"
	turtle-doves: two
`;
const plantUmlSampleModel_Table=`|=  organizationNo  |=  name  |=  address  |\\n\\
|  OS07  |  Sphereways  | 22 Rabbit Rd, London |\\n\\
|  OO7  |  Orco  | 16 Adam St, Nuremberg |\\n\\
|  OC11  |  Cruxolutions  | 163 Olga St, Budapest |`;
				
				
const modelTypes=[
					{"PlantUmlType":"Sequence",  "Prefix":"@startuml \n", "Postfix":"\n@enduml","SampleCode":plantUmlSampleModel_Sequence},
					{"PlantUmlType":"Usecase",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Usecase},
					{"PlantUmlType":"Class",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Class},
					{"PlantUmlType":"Activity",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Activity},
					{"PlantUmlType":"Component",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Component},
					{"PlantUmlType":"State",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_State},
					{"PlantUmlType":"Object",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Object},
					{"PlantUmlType":"Deployment",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Deployment},
					{"PlantUmlType":"Timing",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Timing},
					{"PlantUmlType":"Network",  "Prefix":"@startuml \n", "Postfix":"\n @enduml","SampleCode":plantUmlSampleModel_Network},
					{"PlantUmlType":"WireFrame","Prefix":"@startsalt  \n","Postfix":"\n @endsalt","SampleCode":plantUmlSampleModel_Wireframe},
					{"PlantUmlType":"Gantt","Prefix":"@startgantt \n","Postfix":"\n @endgantt","SampleCode":plantUmlSampleModel_Gantt},
					{"PlantUmlType":"MindMap","Prefix":"@startmindmap \n","Postfix":"\n @endmindmap","SampleCode":plantUmlSampleModel_MindMap},
					{"PlantUmlType":"WBS","Prefix":"@startwbs \n","Postfix":"\n @endwbs","SampleCode":plantUmlSampleModel_WBS},
					{"PlantUmlType":"JSON","Prefix":"@startjson \n","Postfix":"\n @endjson","SampleCode":plantUmlSampleModel_JSON},
					{"PlantUmlType":"YAML","Prefix":"@startyaml \n","Postfix":"\n @endyaml","SampleCode":plantUmlSampleModel_YAML},
					{"PlantUmlType":"Table","Prefix":tablePrefix,"Postfix":tablePostfix,"SampleCode":plantUmlSampleModel_Table}					
				];
				
const loadJsonDataBtnElement = document.getElementById('loadJsonDataBtn');
const jsonContainerElement = document.getElementById('json-container');
const modelRenameFormElement         = document.getElementById('modelRename');
const saveConfigBtnElement  = document.getElementById('saveConfigBtn');
const cancelConfigBtnElement = document.getElementById('cancelConfigBtn');
const userInputDescriptionElement = document.getElementById('userInputDescription');
const saveJsonDataFormElement = document.getElementById('saveJsonDataForm');
const closeJsonDataFormBtnElement = document.querySelector('.close');
const saveJsonDataButtonElement = document.getElementById('saveJsonDataButton');
const jsonDataUserInputTextElement = document.getElementById('jsonDataUserInputText');
const plantUmlCodeElement = document.getElementById('plantUmlCode');
const jsonButtonContextMenuElement = document.getElementById('jsonButtonContextMenu');
const imgcontextMenuElement = document.getElementById('imgContextMenu');
const imgElement = document.getElementById('ModelSource');
const imgElementSVG = document.getElementById('ModelSourceSVG');
const rightClickImagePasteFromClipBoard = document.getElementById('rightClickImagePasteFromClipBoard');
const rightClickImagePasteURL = document.getElementById('rightClickImagePasteURL');
const TopRightPane = document.getElementById('TopRightPane');
const TopRightPaneImageContainer = document.getElementById('TopRightPaneImageContainer');
const imageInput = document.getElementById("imageInput");
const retrieveKeysButtonElement = document.getElementById('retrieveKeysButton');

const viewDescriptionWithFormat = document.getElementById('viewDescriptionWithFormat');
const editDescriptionWithFormat = document.getElementById('editDescriptionWithFormat');
const userDescriptionFormatted = document.getElementById('userDescriptionFormatted');

viewDescriptionWithFormat.addEventListener('click', function () {
	
	userDescriptionFormatted.style.display='block';
	userInputDescriptionElement.style.display='none';
	userDescriptionFormatted.innerHTML=userInputDescriptionElement.value;
})

editDescriptionWithFormat.addEventListener('click', function () {
	userDescriptionFormatted.style.display='none';
	userInputDescriptionElement.style.display='block';
	
})


const dbName = 'myDB';
const objectStoreName = 'myStore';
const stringToStore = 'This is a modified string.';
let htmlReport="";
let delimiterArray=['\t']

jsonContainerElement.classList.add('containerListSideBySideView');


function saveHtml(){
	
	alert("Generating report for node "+eval(window.str))
	
	const fileName = eval(window.nodeExpression) + `.html`;
	refreshJsonPane()
	htmlReport="";delimiterArray=['\t'];
	//traverseHierarchy(window.jsonData)
	var traverseRoot=window.nodeExpression.replace(/\["name"\]$/, '')
	alert("Traverse Root is"+traverseRoot)
	traverseHierarchy(eval(traverseRoot))
	let htmlString=`<!DOCTYPE html>
	<html>
	<head>
		<title>`+eval(window.str)+`</title>
	</head>
	<body>`+htmlReport+`</body>
	</html>`

	if (fileName !== null && fileName.trim() !== '')
	{
		const blob = new Blob([htmlString], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		// Create an anchor element for downloading
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName; // Specify the file name
		a.click();
		URL.revokeObjectURL(url);
	}
}

alert("Remember, Technology is a great slave but a poor master");
window.jsonData = JSON.parse(jsonString);
//traverseHierarchy(window.jsonData)
renderJSON(window.jsonData, jsonContainerElement,"window.jsonData");
plantUmlCodeElement.value="Click on a node for details"
userInputDescriptionElement.value="Click on a node for details"
const select = document.createElement("select");
select.id="mySelect";

modelTypes.forEach(item => {
            const option = document.createElement("option");
            option.value = item.PlantUmlType;
            option.text = item.PlantUmlType;
            select.appendChild(option);
});
document.getElementById("dropdown-container").appendChild(select);
closePopup();

`fetch('model.json')
   .then(response => {
       if (!response.ok) {
           throw new Error("HTTP error " + response.status);
       }
       return response.json();
   })
   .then(json => {
       this.users = json;
   })
   .catch(function () {
       this.dataError = true;
   })`

function viewAsMindMap(){
	view="mindmap"
	jsonContainerElement.classList.remove('containerListSideBySideView');
	jsonContainerElement.classList.add('containerMindMapSideBySideView');
	refreshJsonPane();
}
function viewAsSubList(){
	view="sublist"
	jsonContainerElement.classList.remove('containerMindMapSideBySideView');
	jsonContainerElement.classList.add('containerListSideBySideView');
	refreshJsonPane();
}

function traverseHierarchy(node,pathArray2=[]) {
    //console.log(node.name);
	//alert(pathArray2)
	//alert(node.name)
	pathArray2.push(node.name);
	if(delimiterArray.length<=6)
		htmlReport+=delimiterArray.join('')+'<h'+delimiterArray.length+'>'+node.name+'</h'+delimiterArray.length+'>'+'\n'
	else
		htmlReport+=delimiterArray.join('')+'<h6>'+node.name+'</h6>'+'\n'
		
	if(node.svgLink!="")
		htmlReport+=delimiterArray.join('')+'<img src='+ node.svgLink+'  style="max-width: 100%;">'+'\n'
	if(node.textDescription!="")
		htmlReport+=delimiterArray.join('')+'<p>'+node.textDescription+'</p>'+'\n'
  if (node.subElements && node.subElements.length > 0) {
    node.subElements.forEach((subElement,index) => {
	delimiterArray.push('\t')
	pathArray2.push(index);
	traverseHierarchy(subElement,pathArray2); // Recursive call
	pathArray2.pop();
	delimiterArray.pop()
    });
  }
  //alert(htmlReport)
}
const buttonData = [
	{ text: 'Rename' },
	{ text: 'ChangeModel' },
	{ text: 'InsertChild' },
	{ text: 'InsertAbove' },
	{ text: 'InsertBelow' },
	{ text: 'Delete' },
];
buttonData.forEach((data, index) => {
const dynamicButton = document.createElement('button');
dynamicButton.textContent = data.text;
document.body.appendChild(dynamicButton);


const rightClickOptionId = `rightClickOption${index + 1}`;
dynamicButton.dataset.rightClickOptionId = rightClickOptionId;


})



document.addEventListener('click', hidejsonButtonContextMenu);									  

function renameButtonCallback(){
	openPopup("rename")
	hidejsonButtonContextMenu();
};

function insertChildElement(){
	openPopup("addChild");
	hidejsonButtonContextMenu();
};

function insertJsonAsChild() {
	openPopup("addJsonAsChild")
	hidejsonButtonContextMenu();
};
document.getElementById("rightClickOptionInsertChild").addEventListener('click', insertChildElement) 
document.getElementById("rightClickOptionInsertJsonAsChild").addEventListener('click', insertJsonAsChild);
document.getElementById("rightClickOptionMoveUp").addEventListener('click',  moveUpCallBack);
document.getElementById("rightClickOptionMoveDown").addEventListener('click', moveDownCallBack);
document.getElementById("rightClickOptionCut").addEventListener('click', cutButtonCallback)
document.getElementById("rightClickOptionPasteAsChild").addEventListener('click',pasteAsChildButtonCallback);
document.getElementById("rightClickOptionDelete").addEventListener('click',deleteButtonCallback) 
document.getElementById("rightClickOptionRename").addEventListener('click', renameButtonCallback);

jsonContainerElement.addEventListener('keydown', (event) => {
  event.preventDefault();
	window.jsonButtonTargetParentString=str;            // Show the custom context menu at the mouse position

  // Check if the Ctrl key and the Arrow Up key are both pressed
  if (event.ctrlKey && event.key === 'ArrowUp') {
    moveUpCallBack();
  }
  if (event.ctrlKey && event.key === 'ArrowDown') {
    moveDownCallBack();
  }
  if (event.ctrlKey && event.key === 'Delete') {
    deleteButtonCallback();
  }
  if (event.ctrlKey && event.key === 'r') {
    renameButtonCallback();
  }
  if (event.ctrlKey && event.key === 'c') {
    copyButtonCallback();
  }
  if (event.ctrlKey && event.key === 'x') {
    cutButtonCallback();
  }
  if (event.ctrlKey && event.key === 'v') {
    pasteAsChildButtonCallback();
  }
  if (event.ctrlKey && event.key === 'i') {
    insertChildElement();
  }
  if (event.ctrlKey && event.key === 'j') {
    insertJsonAsChild();
  }
  if (!event.ctrlKey && event.key === 'ArrowUp') {
	var sizeOfParentElement = eval(latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"].length`));
	var indexOfCurrentElement = eval(latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"].length`));
	const regex = /\["subElements"\]\[(\d+)\]\["name"\]$/;
	const match = regex.exec(latestnodeexpression);

	if (match) {
	  const indexOfCurrentElement = parseInt(match[1], 10);
	  if(indexOfCurrentElement>0)
		var newElementIndex  = indexOfCurrentElement-1
	  var newNodeexpression=latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"\][`+newElementIndex+`]["name"]`)
	  const buttonsel = document.querySelector(`.jsonButton[nodeExpression='` + newNodeexpression + `']`);
		if(buttonsel){
		buttonsel.click();
		buttonsel.focus();				
		}
	}
  }
  if (!event.ctrlKey && event.key === 'ArrowDown') {
	var sizeOfParentElement = eval(latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"].length`));
	var indexOfCurrentElement = eval(latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"].length`));
	const regex = /\["subElements"\]\[(\d+)\]\["name"\]$/;
	const match = regex.exec(latestnodeexpression);

	if (match) {
	  const indexOfCurrentElement = parseInt(match[1], 10);
	  if(indexOfCurrentElement<(sizeOfParentElement-1))
		var newElementIndex  = indexOfCurrentElement+1
	  var newNodeexpression=latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["subElements"\][`+newElementIndex+`]["name"]`)
	 const buttonsel = document.querySelector(`.jsonButton[nodeExpression='` + newNodeexpression + `']`);
	if(buttonsel)
	{		buttonsel.click();
		buttonsel.focus();				
	}
	}
  }
  if (!event.ctrlKey && event.key === 'ArrowRight') {
		var subelementexpression = latestnodeexpression
		var subelementsSizeexpression = latestnodeexpression.replace(/\["name"\]$/,`["subElements"]`)+`.length>0`
		var expandedStatusexpression = latestnodeexpression.replace(/\["name"\]$/,`["expandedButtonStatus"]`)+`>0`
		var newNodeexpression = latestnodeexpression.replace(/\["name"\]$/,`["subElements"][0]["name"]`)
		if(eval(subelementsSizeexpression))
		{
			if(eval(expandedStatusexpression))
			{
				const buttonsel = document.querySelector(`.jsonButton[nodeExpression='` + newNodeexpression + `']`);
				if(buttonsel)
				{
				buttonsel.click();
				buttonsel.focus();				
				}
			}
		}
  }
  if (!event.ctrlKey && event.key === 'ArrowLeft') {
	  
		var newNodeexpression=latestnodeexpression.replace(/\["subElements"\](\[\d+\])\["name"\]$/, `["name"]`);
		const buttonsel = document.querySelector(`.jsonButton[nodeExpression='` + newNodeexpression + `']`);
		if(buttonsel)
		{
			buttonsel.click();
			buttonsel.focus();				
		}
  }
  if (!event.ctrlKey && event.key === ' ') {

		var subelementexpression = latestnodeexpression
		var subelementsSizeexpression = latestnodeexpression.replace(/\["name"\]$/,`["subElements"]`)+`.length>0`
		var expandedStatusexpression = latestnodeexpression.replace(/\["name"\]$/,`["expandedButtonStatus"]`)+`>0`
		var newNodeexpression = latestnodeexpression.replace(/\["name"\]$/,`["subElements"][0]["name"]`)
		if(eval(subelementsSizeexpression))
		{
			if(eval(expandedStatusexpression))
			{
				const buttonsel = document.querySelector(`.collapse-btn[nodeExpression='` + latestnodeexpression + `']`);

				if(buttonsel)
				{
					buttonsel.click();
				}
			}
			else
			{
					  const buttonsel = document.querySelector(`.expand-btn[nodeExpression='` + latestnodeexpression + `']`);
			  if(buttonsel)
			  {
				  buttonsel.click();
			  }

			}
		}


  }
  
  
  
  if (event.ctrlKey && event.key === ' ') {
	  const buttonsel = document.querySelector('.collapse-btn[nodeExpression="' + latestnodeexpression + '"]');
	  if(buttonsel)
	  {
		  buttonsel.click();
	  }
  
  
	
}
})
function moveUpCallBack()
{
	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/(\[\d+\])*\["name"\]$/, ""));
	const idxToMoveBefore = jsonArray.findIndex(item => item.name === eval(str));


	 if (idxToMoveBefore > 0 && idxToMoveBefore < jsonArray.length) {
    const elementToMove = jsonArray.splice(idxToMoveBefore, 1)[0];
    jsonArray.splice(idxToMoveBefore - 1, 0, elementToMove);
  }
	hidejsonButtonContextMenu();
	refreshJsonPane();
	
}

function moveDownCallBack()
{

	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/(\[\d+\])*\["name"\]$/, ""));
	const idxToMoveAfter = jsonArray.findIndex(item => item.name === eval(str));

  if (idxToMoveAfter >= 0 && idxToMoveAfter < jsonArray.length - 1) {
    const elementToMove = jsonArray.splice(idxToMoveAfter, 1)[0];
    jsonArray.splice(idxToMoveAfter + 1, 0, elementToMove);
  }
  hidejsonButtonContextMenu();
  	refreshJsonPane();

};

function  copyButtonCallback(){
	//alert(jsonButtonTargetParentString)
	//alert(eval(jsonButtonTargetParentString))
	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/(\[\d+\])*\["name"\]$/, ""));
	const indexToDelete = jsonArray.findIndex(item => item.name === eval(str));
	clipBoardJsonCutPaste=JSON.stringify(jsonArray[indexToDelete]);
	//jsonArray.splice(indexToDelete, 1);
	hidejsonButtonContextMenu();
	refreshJsonPane();
};
function  cutButtonCallback(){
	//alert(jsonButtonTargetParentString)
	//alert(eval(jsonButtonTargetParentString))
	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/(\[\d+\])*\["name"\]$/, ""));
	const indexToDelete = jsonArray.findIndex(item => item.name === eval(str));
	clipBoardJsonCutPaste=JSON.stringify(jsonArray[indexToDelete]);
	jsonArray.splice(indexToDelete, 1);
	hidejsonButtonContextMenu();
	refreshJsonPane();
};

function pasteAsChildButtonCallback(){
//	alert(window.jsonButtonTargetParentString.replace(/\["name"\]$/, "")+`["subElements"]`);
	//	alert(window.jsonButtonTargetParentString.replace(/\["name"\]$/, ""))
	if (!("subElements" in eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/, ""))))
	{
		eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/,"")+`["subElements"]= []`)
	}
	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/, "")+`["subElements"]`);
	const indexToDelete = jsonArray.findIndex(item => item.name === eval(str));
	jsonArray.push(JSON.parse(clipBoardJsonCutPaste));
	//clipBoardJsonCutPaste="";
	hidejsonButtonContextMenu();
	refreshJsonPane();
};

function deleteButtonCallback(){
	let jsonArray=eval(window.jsonButtonTargetParentString.replace(/(\[\d+\])*\["name"\]$/, ""));
	const indexToDelete = jsonArray.findIndex(item => item.name === eval(str));
	jsonArray.splice(indexToDelete, 1);
	hidejsonButtonContextMenu();
	refreshJsonPane();
};
saveConfigBtnElement.addEventListener('click', function () {
	const modelName = document.getElementById('modelName').value;
	const newElementString = `{"name":"` +modelName+ `","textDescription":"","modelType":"","plantUmlCode":"","svgLink":"","imageZoomScale":1,"subElements":[]}`;
	if(modelRenameFormElement.getAttribute("context")=="addJsonAsChild")
	{

try {
	var recievedData=JSON.parse(document.getElementById('modelName').value);
	alert("valid");
	let jsonObject=eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/, ""));
			if(jsonObject.hasOwnProperty("subElements")&& Array.isArray(jsonObject["subElements"]))
		{
			jsonObject["subElements"].push(JSON.parse(document.getElementById('modelName').value));
		}
		else
		{
			jsonObject["subElements"] = [JSON.parse(document.getElementById('modelName').value)];					
		}
} 
catch (error) 
{
	alert("INVALID");
}
};



		
	
	if(modelRenameFormElement.getAttribute("context")=="addChild")
	{
		let jsonArray=eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/, "['subElements']"));
		let jsonObject=eval(window.jsonButtonTargetParentString.replace(/\["name"\]$/, ""));
			if(jsonObject.hasOwnProperty("subElements")&& Array.isArray(jsonObject["subElements"]))
		{
			jsonObject["subElements"].push(JSON.parse(newElementString));
		}
		else
		{
			jsonObject["subElements"] = [JSON.parse(newElementString)];					
		}
	}
	if(modelRenameFormElement.getAttribute("context")=="rename")
	{
		eval(window.jsonButtonTargetParentString+"="+"'"+modelName+"'");
	}

	closePopup();
	refreshJsonPane();
});
cancelConfigBtnElement.addEventListener('click', function () {
	closePopup();
});
rightClickImagePasteURL.addEventListener('click', function () {
	imageUrl=prompt('Enter image link');
	displaySVGorPNG(imageUrl);
	eval(str.replace(/\["name"\]$/, '')+"['svgLink']"+" = imageUrl");
	closePopup();
});


// Add an event listener to the input to handle image paste
imageInput.addEventListener("change", function(event) {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			pastedImage.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
});

TopRightPane.addEventListener('keydown', (event) => {
	alert("hi")
	 if (event.key === 'c' && event.ctrlKey)
	 {
		    const textToCopy = document.getElementById('textToCopy');
textToCopy.value = imgElement.src;
textToCopy.select();
document.execCommand('copy');
alert("cop")
	 }
})
TopRightPane.addEventListener("paste", function(event)  {
		const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        let clipboard = e.target.result;
						str=window.nodeExpression
						window.modelSource=clipboard;
						displaySVGorPNG(clipboard)

						//let modelUrl=plantUmlCode2Image(plantUmlCodeElement.value);
						eval(str.replace(/\["name"\]$/, '')+"['svgLink']"+" = clipboard");
						eval(str.replace(/\["name"\]$/, '')+"['plantUmlCode']"+" = ''");

                    };
                    reader.readAsDataURL(file);
                }
            }
});
userInputDescriptionElement.addEventListener('input', function() {
	//alert("user description");
	//alert(window.modelDescriptionSource +" = '"+userInputDescriptionElement.value+"'");
eval(window.modelDescriptionSource +" = `"+userInputDescriptionElement.value+"`");
});	

plantUmlCodeElement.addEventListener('input', function() {
viewCodeAsImage();
saveUrlToModel()
});	

saveJsonDataButtonElement.addEventListener('click', () => {
  
  
try {
	window.jsonData=JSON.parse(jsonDataUserInputTextElement.value);
	alert("valid");
	
	closeJsonDataForm();
	refreshJsonPane();
} 
catch (error) 
{
	alert("INVALID");
}
});
loadJsonDataBtnElement.addEventListener('click', loadJsonDataBtn);
closeJsonDataFormBtnElement.addEventListener('click', closeJsonDataForm);

function moveElementOnePositionEarlier(arr, idxToMoveBefore) {
  if (idxToMoveBefore > 0 && idxToMoveBefore < arr.length) {
    const elementToMove = arr.splice(idxToMoveBefore, 1)[0];
    arr.splice(idxToMoveBefore - 1, 0, elementToMove);
  }
}

function moveElementOnePositionLater(arr, idxToMoveAfter) {
  if (idxToMoveAfter >= 0 && idxToMoveAfter < arr.length - 1) {
    const elementToMove = arr.splice(idxToMoveAfter, 1)[0];
    arr.splice(idxToMoveAfter + 1, 0, elementToMove);
  }
}

function ChangeBackgroundColor(){
	if(TopRightPaneImageContainer.style.backgroundColor =="white")
	{
		TopRightPaneImageContainer.style.backgroundColor ="black";
		TopRightPane.style.backgroundColor ="black";
	}
	else
	{
		TopRightPaneImageContainer.style.backgroundColor ="white"
		TopRightPane.style.backgroundColor ="white"
	}
}
function ToggleModelCodeBox(){
	if(bottomLeftPane.style.display == 'none')
	bottomLeftPane.style.display = 'block';
	else
	bottomLeftPane.style.display = 'none';
		
}
function hidejsonButtonContextMenu() {
	jsonButtonContextMenuElement.style.display = 'none';
	hideImageContextMenu();
}
function showContextMenu(event,str,parentString) {
	event.preventDefault(); // Prevent the default context menu
	window.jsonButtonTargetString=str;            // Show the custom context menu at the mouse position
	window.jsonButtonTargetParentString=parentString;            // Show the custom context menu at the mouse position
	jsonButtonContextMenuElement.style.display = 'block';
	jsonButtonContextMenuElement.style.left = `${event.clientX}px`;
	jsonButtonContextMenuElement.style.top = `${event.clientY}px`;
}
function renderJSON(data, container,parentArray) {
	if (typeof data === 'object') {
		const name = data.name;
		const subElements = data.subElements;
		let pathArray=parentArray+"___"+name;
		if (name) {
			const nameElement = document.createElement('button');
			nameElement.textContent = `${name} `;
			nameElement.style.backgroundColor = 'LightGray';
			nameElement.classList.add('jsonButton');
			container.appendChild(nameElement);
			nameElement.setAttribute("parentExpression",parentArray);
			window.str=parentArray+`["name"]`;
			nameElement.setAttribute("nodeExpression",str);
			nameElement.addEventListener('contextmenu', function(event) {
			str=nameElement.getAttribute("nodeExpression");
			latestnodeexpression=nameElement.getAttribute("nodeExpression");
		    parentstr=nameElement.getAttribute("nodeExpression");
			showContextMenu(event,str,parentstr);

});
			nameElement.addEventListener('click', function (event) {
			str=nameElement.getAttribute("nodeExpression")
			latestnodeexpression=nameElement.getAttribute("nodeExpression");

			window.modelSource=str.replace(/\["name"\]$/, '')+"['svgLink']";
			window.nodeExpression=str;
			displaySVGorPNG(eval(window.modelSource));
			
			window.modelDescriptionSource=str.replace(/\["name"\]$/, '')+"['textDescription']";
			if(eval(window.modelDescriptionSource)==undefined)
			{
				userInputDescriptionElement.placeholder="Enter description here";
			}
			else
			{
				userInputDescriptionElement.value = eval(window.modelDescriptionSource);
				userDescriptionFormatted.innerHTML=userInputDescriptionElement.value;
			}
			//modelTypeValue=eval(str.replace(/\["name"\]$/, '')+"['modelType']");
			//svgLinkValue=eval(str.replace(/\["name"\]$/, '')+"['svgLink']");
			let plantUmlCode=eval(str.replace(/\["name"\]$/, '')+"['plantUmlCode']");
			plantUmlCodeElement.value=plantUmlCode;
			let plantUmlModelTypeOfButton=eval(str.replace(/\["name"\]$/, '')+"['modelType']");
			//nodeNameValue=eval(str);
			if(plantUmlModelTypeOfButton=="")
			{
				document.getElementById("mySelect").value="General";
			}
			else
			{
				document.getElementById("mySelect").value=plantUmlModelTypeOfButton
			}

			const buttonsWithMmAttribute = document.querySelectorAll('button[nodeExpression]');

			// Loop through the NodeList and add the "clicked" class to each button
			buttonsWithMmAttribute.forEach(function(button) {
				if(button.classList.contains('jsonButton'))
				{
				if((button.getAttribute("nodeExpression")==str))
				{
					button.style.backgroundColor = 'SlateGray';
				}
				else
				{
					button.style.backgroundColor = 'LightGray';
				}
				}	
			});


});
		}

		if (Array.isArray(subElements) && subElements.length > 0) {
			const expandBtn = document.createElement('button');
			expandBtn.classList.add('expand-btn');
			expandBtn.setAttribute("nodeExpression",parentArray+`["name"]`);
			expandBtn.textContent = '+';
			const nestedContainer = document.createElement('div');
			if(view=="mindmap")
			{
				nestedContainer.classList.add('nestedContainerMindMapTopToBottomView');
			}
			else
			{
				nestedContainer.classList.add('nestedContainerListTopToBottomView');
			}
			expandBtn.addEventListener('click', () => {
			//	if(!data["expandedButtonStatus"])
				{
				latestnodeexpression=expandBtn.getAttribute("nodeExpression");
			
				const buttonsWithMmAttribute = document.querySelectorAll('button[nodeExpression]');
				buttonsWithMmAttribute.forEach(function(button) {
				if(button.classList.contains('jsonButton'))
				{
				if((button.getAttribute("nodeExpression")==latestnodeexpression))
				{
					button.style.backgroundColor = 'SlateGray';
					button.click();
					button.focus();
				}
				else
				{
					button.style.backgroundColor = 'LightGray';
				}
				}	
			});



			data["expandedButtonStatus"]=1;
				subElements.forEach((subElement,idx) => {
					let newpatharray=parentArray+"[\"subElements\"]"+"["+idx+"]";
				const subElementContainer = document.createElement('div');
				 if(view=="mindmap")
				 {
				 subElementContainer.classList.add('containerMindMapSideBySideView');
				 }
				 else
				 {
					 subElementContainer.classList.add('containerListSideBySideView');
				 }
					renderJSON(subElement, subElementContainer,newpatharray);
					nestedContainer.appendChild(subElementContainer);
				});
				expandBtn.style.display = 'none';
				collapseBtn.style.display = 'inline-block';
			}});
			const collapseBtn = document.createElement('button');
			collapseBtn.classList.add('collapse-btn');
			collapseBtn.setAttribute("nodeExpression",parentArray+`["name"]`);
			collapseBtn.textContent = '--';
			collapseBtn.style.display = 'none';
			collapseBtn.addEventListener('click', () => {
			//	if(data["expandedButtonStatus"])
				{
			latestnodeexpression=collapseBtn.getAttribute("nodeExpression");

			const buttonsWithMmAttribute = document.querySelectorAll('button[nodeExpression]');

			// Loop through the NodeList and add the "clicked" class to each button
			buttonsWithMmAttribute.forEach(function(button) {
				if(button.classList.contains('jsonButton'))
				{
				if((button.getAttribute("nodeExpression")==latestnodeexpression))
				{
					button.style.backgroundColor = 'SlateGray';
					button.click();
					button.focus();
				}
				else
				{
					button.style.backgroundColor = 'LightGray';
				}
				}	
			});


			data["expandedButtonStatus"]=0;
				nestedContainer.innerHTML = '';
				expandBtn.style.display = 'inline-block';
				collapseBtn.style.display = 'none';
			}});
			container.appendChild(expandBtn);
			container.appendChild(collapseBtn);
			container.appendChild(nestedContainer);
			if("expandedButtonStatus" in data)
			{
				if(data["expandedButtonStatus"]==1)
				{
					expandBtn.click();
				}
				else
				{
					collapseBtn.click();
				}
			}
			else
			{
				data["expandedButtonStatus"]=0;
				collapseBtn.click();
			}
		}
	}
}
function openJson(){
const fileName = prompt('Enter a filename WITH extension');
if (fileName !== null && fileName.trim() !== '')
{
{
// http://localhost:8080
fetch('/'+fileName)
.then(response => {
if (!response.ok) {
   alert("HTTP error " + response.status);
}
return response.json();
})
.then(json => {
window.jsonData = json;
refreshJsonPane();
alert("Successfully loaded the project")
})
.catch(function () {
alert("data error")
})
}
}
}
function saveJson(){
const fileName = window.jsonData["name"];
if (fileName !== null && fileName.trim() !== '')
{
	const jsonString1= JSON.stringify(window.jsonData);
	const blob = new Blob([jsonString1], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	// Create an anchor element for downloading
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName+'.json'; // Specify the file name
	a.click();
	URL.revokeObjectURL(url);
}
}
function refreshJsonPane(){
	const jsonContainerElement = document.getElementById('json-container');
	jsonContainerElement.innerHTML = "";
	renderJSON(window.jsonData, jsonContainerElement,"window.jsonData");
}
function openPopup(context) {
	document.getElementById('modelName').value=eval(window.jsonButtonTargetParentString);
	modelRenameFormElement.style.display = 'block';
	modelRenameFormElement.setAttribute("context",context);
}
function closePopup() {
	modelRenameFormElement.style.display = 'none';
}
function loadJsonDataBtn() {
  saveJsonDataForm.style.display = 'block';
}
function closeJsonDataForm() {
  saveJsonDataForm.style.display = 'none';
}
function viewCodeAsImage() {
	//newstr=window.nodeExpression
	displaySVGorPNG(plantUmlCode2Image(plantUmlCodeElement.value));
};
function loadPlantUmlSampleCode() {
const selectElement = document.getElementById("mySelect");
const selectedIndex = selectElement.selectedIndex;
const selectedPlantUmlType = selectElement.options[selectedIndex].value;	
//{"PlantUmlType":"General",  "Prefix":"@startuml", "Postfix":"@enduml"},
// Use the find method to find the object with matching key1
const matchingObject = modelTypes.find(obj => obj.PlantUmlType === selectedPlantUmlType);

	plantUmlCodeElement.value=matchingObject.SampleCode
	viewCodeAsImage();
	
};

function saveUrlToModel() {

const selectElement = document.getElementById("mySelect");
const selectedIndex = selectElement.selectedIndex;
const selectedPlantUmlType = selectElement.options[selectedIndex].value;



	let newstr=window.nodeExpression
	let modelUrl=plantUmlCode2Image(plantUmlCodeElement.value);
	eval(newstr.replace(/\["name"\]$/, '')+"['svgLink']"+" = modelUrl");
	eval(newstr.replace(/\["name"\]$/, '')+"['plantUmlCode']"+" = plantUmlCodeElement.value");
	eval(newstr.replace(/\["name"\]$/, '')+"['modelType']"+" = selectedPlantUmlType");

};
function encode64(data) {
let r = "";
let i = 0;
for (i=0; i<data.length; i+=3) {
 if (i+2==data.length) {
r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
} else if (i+1==data.length) {
r += append3bytes(data.charCodeAt(i), 0, 0);
} else {
r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1),
data.charCodeAt(i+2));
}
}
return r;
}
function append3bytes(b1, b2, b3) {
let c1 = b1 >> 2;
let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
let c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
let c4 = b3 & 0x3F;
let r = "";
r += encode6bit(c1 & 0x3F);
r += encode6bit(c2 & 0x3F);
r += encode6bit(c3 & 0x3F);
r += encode6bit(c4 & 0x3F);
return r;
}
function encode6bit(b) {
if (b < 10) {
 return String.fromCharCode(48 + b);
}
b -= 10;
if (b < 26) {
 return String.fromCharCode(65 + b);
}
b -= 26;
if (b < 26) {
 return String.fromCharCode(97 + b);
}
b -= 26;
if (b == 0) {
 return '-';
}
if (b == 1) {
 return '_';
}
return '?';
}
function plantUmlCode2Image(s) {
const selectElement = document.getElementById("mySelect");
const selectedIndex = selectElement.selectedIndex;
const selectedPlantUmlType = selectElement.options[selectedIndex].value;	
//{"PlantUmlType":"General",  "Prefix":"@startuml", "Postfix":"@enduml"},
// Use the find method to find the object with matching key1
const matchingObject = modelTypes.find(obj => obj.PlantUmlType === selectedPlantUmlType);

const plantUmlPrefix = matchingObject.Prefix;
const plantUmlPostfix = matchingObject.Postfix;

		
	
let plantumlsettings='\n skinparam componentStyle rectangle \n !define Model component \n ';
if(selectedPlantUmlType=="Component")
{
let plantumlsettings='\n skinparam componentStyle rectangle \n !define Model component \n ';
}
else
{
plantumlsettings="";	
}
if(s!="")
{
s=plantUmlPrefix+plantumlsettings+s+plantUmlPostfix+' \n ';

//alert(s);
s = unescape(encodeURIComponent(s));
//return "http://www.plantuml.com/plantuml/svg/"+encode64(deflate(s, 9));
//return "http://127.0.0.1:8000/plantuml/svg/"+encode64(deflate(s, 9));
return plantUmlServer+"/plantuml/svg/"+encode64(deflate(s, 9));
}
else
	return ""

}

function displaySVGorPNG(src){
if((src.toLowerCase().endsWith('.svg')) || (src.includes("/plantuml/svg/")) ) {
    // It's an SVG image
    console.log('It is an SVG image.');
    //alert('It is an SVG image.');
	imgElement.style.display='none'
	imgElementSVG.style.display='block'
	imgElement.src = src;
	imgElementSVG.data = src;
	let scalingFactor = 1
	if(!('imageZoomScale' in eval(window.nodeExpression.replace(/\["name"\]$/, ''))))
	{	
		eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']=1")
	}
	scalingFactor=eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']")
	
	imgElement.style.transform='scale(' + scalingFactor + ')';
	console.log("scaled SVG at "+scalingFactor)
	imgElementSVG.style.transform= 'scale(' + scalingFactor + ')';
	document.getElementById('developerZone').textContent ="SVG:"+scalingFactor;

	return "SVG"

} else if ((src.toLowerCase().endsWith('.png')) || (src.includes("data:image/png"))) {
    // It's a PNG image
    console.log('It is a PNG image.');
	imgElement.style.display='block'
	imgElementSVG.style.display='none'
	imgElement.src = src;
	imgElementSVG.data = src;
	let scalingFactor = 1
	if(!('imageZoomScale' in eval(window.nodeExpression.replace(/\["name"\]$/, ''))))
	{	
		eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']=1")
	}
	let scalingFactorString=window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']"
	scalingFactor=eval(scalingFactorString)
	imgElement.style.transform='scale(' + scalingFactor + ')';
	imgElementSVG.style.transform= 'scale(' + scalingFactor + ')';
    console.log("scaled PNG at "+scalingFactor)
	document.getElementById('developerZone').textContent ="PNG:"+scalingFactor;
	return "PNG"
} else {
    if(src!="")
	{
	alert('The image format is not recognized as SVG or PNG.');
	alert(src)
		
	}
	imgElement.style.display='none'
	imgElementSVG.style.display='none'
	return "NONE"
}
}
function showImageContextMenu(event) {
            event.preventDefault();
            const imageContainer = event.currentTarget;
            imgcontextMenuElement.style.left = event.clientX + "px";
            imgcontextMenuElement.style.top = event.clientY + "px";
			imgcontextMenuElement.style.display = 'block';
            imageContainer.classList.add("context-menu-active");
            document.addEventListener("click", hideImageContextMenu);
        }
function hideImageContextMenu() {
			imgcontextMenuElement.style.display = 'none';
	document.removeEventListener("click", hideImageContextMenu);
}

// Open the database
function storeDataInDatabase() {
const request = indexedDB.open(dbName);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Create an object store
    const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });

    alert('Object store created.');
};


request.onsuccess = function(event) {
    const db = event.target.result;

    // Start a transaction and access the object store
    const transaction = db.transaction(objectStoreName, 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    // Define the ID/key for the data you want to update
    const idToUpdate = window.jsonData["name"];

    // Use the put method to add or update the data
    const putRequest = objectStore.put({ id: idToUpdate, value: window.jsonData });

    putRequest.onsuccess = function(event) {
        alert('Data updated successfully.');
    };

    putRequest.onerror = function(event) {
        alert('Error updating data:', event.target.error);
    };

    // Complete the transaction
    transaction.oncomplete = function(event) {
    };

    // Close the database
    db.close();
};

request.onerror = function(event) {
    alert('Error opening database:', event.target.error);
};
}


function retrieveKeysFromDatabase() {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Start a transaction and access the object store in read-only mode
        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);

        const keys = [];

        // Open a cursor to iterate through all entries in the object store
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                // Collect the key (ID) of the current entry
                keys.push(cursor.key);

                // Move to the next entry
                cursor.continue();
            } else {
                // All entries have been processed
                alert('All keys:'+ keys);

                // Display the keys (you can customize this part)
                const keysList = document.getElementById('keysList');
                keysList.textContent = 'Keys: ' + keys.join(', ');
            }
        };

        cursorRequest.onerror = function (event) {
            alert('Error iterating through object store:', event.target.error);
        };

        // Close the transaction and the database
        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function (event) {
        alert('Error opening database:', event.target.error);
    };
}



// Function to open the modal
function openModal(keys) {

    // Add radio buttons for each key
    keys.forEach((key) => {
		const radioLabel = document.createElement('label');
        radioLabel.classList.add('radio-label'); // Add a class for styling

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'selectedKey';
        radio.value = key;

        const span = document.createElement('span');
        span.textContent = key;

        radioLabel.appendChild(radio);
        radioLabel.appendChild(span);
        
        keySelectionForm.appendChild(radioLabel);
    });
 const okButton = document.createElement('input');
    okButton.type = 'submit';
    okButton.value = 'OK';
	
	 keySelectionForm.appendChild(okButton);
    // Display the modal
    const modal = document.getElementById('keySelectionModal');
    modal.style.display = 'block';
    // Handle form submission
    
}
keySelectionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedKey = document.querySelector('input[name="selectedKey"]:checked');
        if (selectedKey) {
            // Retrieve the data corresponding to the selected key
            retrieveDataByKey(selectedKey.value);
        } else {
            alert('Please select a key.');
        }
        closeModal();
    });
// Function to close the modal
function closeModal() {
    // Clear the modal content
    keySelectionForm.innerHTML = '';

    // Hide the modal
    const modal = document.getElementById('keySelectionModal');
    modal.style.display = 'none';
}

// Function to retrieve data by key and store it in jsonDataNewlyLoaded
function retrieveDataByKey(key) {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Start a transaction and access the object store in read-only mode
        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);

        // Retrieve data by key
        const getRequest = objectStore.get(key);

        getRequest.onsuccess = function (event) {
            const result = event.target.result;
            if (result) {
                window.jsonData = result.value;
				//htmlReport="";
				//traverseHierarchy(window.jsonData)
				refreshJsonPane();
				plantUmlCodeElement.value="Click on a node for details"
				userInputDescriptionElement.value="Click on a node for details"

            } else {
                alert('No data found for the selected key:', key);
            }
        };

        getRequest.onerror = function (event) {
            alert('Error retrieving data:', event.target.error);
        };

        // Complete the transaction
        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function (event) {
        alert('Error opening database:', event.target.error);
    };
}

// Add a click event listener to the "Retrieve Keys" button
retrieveKeysButtonElement.addEventListener('click', function () {
    const request = indexedDB.open(dbName);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Start a transaction and access the object store in read-only mode
        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);

        const keys = [];

        // Open a cursor to iterate through all entries in the object store
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                // Collect the key (ID) of the current entry
                keys.push(cursor.key);

                // Move to the next entry
                cursor.continue();
            } else {
                // All entries have been processed
                console.log('All keys:', keys);
                // Open the modal for key selection
                openModal(keys);
            }
        };

        cursorRequest.onerror = function (event) {
            alert('Error iterating through object store:', event.target.error);
        };

        // Close the transaction and the database
        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onerror = function (event) {
        alert('Error opening database:', event.target.error);
    };
});


const buttonPane = document.getElementById('buttonPane');
const leftDivider = document.getElementById('leftDivider');
const verticalDivider = document.getElementById('verticalDivider');
const rightDivider = document.getElementById('rightDivider');

const topLeftPane = document.getElementById('json-container');
const topRightPane = document.getElementById('TopRightPane');
const bottomLeftPane = document.getElementById('BottomLeftPane');
const bottomRightPane = document.getElementById('BottomRightPane');

const leftPane = document.getElementById('LeftPane');
const rightPane = document.getElementById('RightPane');

let isDraggingLeft = false;
let isDraggingRight = false;
let isDraggingVertical = false;
let lastX;
let lastY;

leftDivider.addEventListener('mousedown', (e) => {
	isDraggingLeft = true;
	lastY = e.clientY;
	e.preventDefault();
});
verticalDivider.addEventListener('mousedown', (e) => {
	isDraggingVertical = true;
	lastX = e.clientX;
	e.preventDefault();
});
rightDivider.addEventListener('mousedown', (e) => {
	isDraggingRight = true;
	lastX = e.clientY;
	e.preventDefault();
});

        document.addEventListener('mousemove', (e) => {
			  const container = document.getElementById('4Panes');
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientWidth;
			const containerRect = container.getBoundingClientRect();
			if (!isDraggingRight && !isDraggingLeft && !isDraggingVertical ) return;
          
            if(isDraggingVertical)
			{
				const newLeftWidth = e.clientX 
				const newRightWidth = containerWidth - e.clientX-5;
			
				if (newLeftWidth >= 1 && newRightWidth >= 1) {
					leftPane.style.width = newLeftWidth + 'px';
					topLeftPane.style.width = newLeftWidth + 'px';
					bottomLeftPane.style.width = newLeftWidth + 'px';
					rightPane.style.width = newRightWidth + 'px';
					topRightPane.style.width = newRightWidth + 'px';
					bottomRightPane.style.width = newRightWidth + 'px';
				
				
				
				
				
				
				
				}
			}
            if(isDraggingRight)
			{
				const newTopRightHeight = e.clientY 
				const newBottomRightHeight =  containerHeight - e.clientY;
			
				if (newTopRightHeight >= 1 && newBottomRightHeight >= 1) {
				let dividerPosition=((e.clientY - containerRect.top)/containerRect.height)*100
				topRightPane.style.height = dividerPosition + '%';
				bottomRightPane.style.height = (100-dividerPosition) + '%';
				
				}
			}
            if(isDraggingLeft)
			{
				const newTopLeftHeight = e.clientY+100
				const newBottomLeftHeight = containerHeight - newTopLeftHeight
			
				if (newTopLeftHeight >= 1 && newBottomLeftHeight >= 1) {
				let dividerPosition=((e.clientY - containerRect.top)/containerRect.height)*100
				topLeftPane.style.height = dividerPosition + '%';
				bottomLeftPane.style.height = (100-dividerPosition) + '%';
				}
			}
		
			

        });

        document.addEventListener('mouseup', () => {
            isDraggingRight = false;
            isDraggingLeft = false;
            isDraggingVertical = false;
		//	console.log("mouseup")
        });
	
	 let currentScale = 1;
        let zoomInterval;

function startZoom(direction) {
            zoomInterval = setInterval(function () {
                if(!('imageZoomScale' in  eval(window.nodeExpression.replace(/\["name"\]$/, '')))){
						eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']=1")
				}
				if (direction === 'in') {
                    currentScale = eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']")
                    currentScale *= 1.05; // Increase the scale factor for zooming in
                    eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']=currentScale")
                } else if (direction === 'out') {
                    currentScale = eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']")
                    currentScale /= 1.05; // Decrease the scale factor for zooming out
                    eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']=currentScale")
                }
					document.getElementById('developerZone').textContent ="Zoom:"+currentScale;

                applyTransform();
            }, 100); // Adjust the interval as needed
        }

        function stopZoom() {
            clearInterval(zoomInterval);
        }

        function applyTransform() {
            document.getElementById('ModelSource').style.transform='scale(' + currentScale + ')';
			document.getElementById('ModelSourceSVG').style.transform= 'scale(' + currentScale + ')';
		//alert(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']"+'=currentScale')
		eval(window.nodeExpression.replace(/\["name"\]$/, '')+"['imageZoomScale']"+'=currentScale');
				console.log(currentScale)
        }
