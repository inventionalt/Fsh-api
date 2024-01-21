const fs = require("fs")

let slurtxt = fs.readFileSync("text/slur.txt", 'utf8').split(',');
let sweartxt = fs.readFileSync("text/swear.txt", 'utf8').split(',');
let adulttxt = fs.readFileSync("text/adult.txt", 'utf8').split(',');

function bad(text, words, sie) {
  let copy = text
  for (let w in words) {
    /*let t = []
    for (let i in words[w].split("")) {
      t.push(sie)
    }
    t = t.join("")*/
    // oh sh! no longer counted as bad
    let t = new Array(words[w].length + 1).join(sie);
    let reg = new RegExp(words[w], "ig")
    copy = copy.replaceAll(reg, t)
  }
  return [text != copy, text == copy ? text : copy];
}

module.exports = {
  path: '/filter',
  info: 'Tells if sentence has bad words and censors them',
  type: 'get',
  params: ["text", true, "char", false, "category", false],
  category: "text",
  execute(req, res){
    let response;
    if (req.method == "POST") {
      response = req.body.text
    } else {
      response = req.query["text"]
    }
    if (!response) {
      res.send('{"bad": false, "swear": false, "slur": false, "adult": false, "censor": ""}')
      return;
    }
    const sie = req.query["char"] || "#";
    const cat = req.query["category"] || "adult,swear,slur";

    let hh;
    let tt = []

    hh = bad(response, sweartxt, sie)
    if (cat.includes("swear")) {
      response = hh[1]
    }
    tt.push(hh[0])

    hh = bad(response, slurtxt, sie)
    if (cat.includes("slur")) {
      response = hh[1]
    }
    tt.push(hh[0])

    hh = bad(response, adulttxt, sie)
    if (cat.includes("adult")) {
      response = hh[1]
    }
    tt.push(hh[0])

    res.json({
      bad: tt[0] || tt[1] || tt[2] ? "true" : "false",
      swear: tt[0] ? "true" : "false",
      slur: tt[1] ? "true" : "false",
      adult: tt[2] ? "true" : "false",
      censor: response
    })
  }
}