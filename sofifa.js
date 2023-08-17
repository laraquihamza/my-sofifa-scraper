import { JSDOM } from 'jsdom';
import fs from 'fs'
async function   getPlayers(){
    let players=[];
        players=Promise.all(await [0,1,2,3,4].map(
            i=> JSDOM.fromURL(`https://sofifa.com/?col=oa&sort=desc&offset=${i*20}`,{
                runScripts: 'dangerously'
              })
        ))
        .then(doms => {
            let tmp=[]
          // Readability relies on a global Node object to work properly
          // https://github.com/mozilla/readability/issues/346
          doms.forEach(dom=>{
            global.Node = dom.window.Node;
      
            // TODO: Extract all of the links before calling Readability
        
            var document = dom.window.document;
            document.querySelectorAll('table  tbody tr').forEach(tr=>{
              tmp.push({
                    name:tr.querySelector('td.col-name a[role="tooltip"]').getAttribute('aria-label'),
                    country:tr.querySelector('td.col-name img').getAttribute('title'),
                    pos:Array.prototype.slice.call(tr.querySelectorAll('td.col-name .pos')).map(pos=>pos.innerHTML),
                    age:tr.querySelector('td.col-ae').innerHTML,
                    overall:tr.querySelector('td.col-oa span').innerHTML,
                    potential:tr.querySelector('td.col-pt span').innerHTML,
                    club:tr.querySelector('td.col-name a[href^="/team"]').innerHTML,
                    img:tr.querySelector('td.col-avatar img').src,
                }
        
                    )
          })

          });
          return tmp;
      });
      return players;

}
let list= await getPlayers();
var jsonContent = JSON.stringify(list);
console.log(jsonContent);
 
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});