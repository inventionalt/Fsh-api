const https = require("https")

function pretty(text) {
  let u = String(text) || ""
  if (!u.includes("\n")) {
    return String(u).replaceAll("><", ">\n<").replaceAll("{","{\n").replaceAll("}","\n}").replaceAll("\n\n","");
  } else {
    return u;
  }
}

module.exports = {
  path: '/html',
  info: 'Gets the html of a url (use www. for better results)',
  type: 'get',
  params: ["url", true],
  category: "text",
  async execute(req, res){
    if (req.query["url"] == null) {
      res.status(400)
      res.json({
        err: true,
        msg: 'Url not provided'
      })
      return;
    }; // thx for doing it, im too stupid; no me; you are the one who did it, you smart;
		try{
			let request = await fetch(req.query["url"], {
			  follow: 20,
        redirect: "follow",
		  	headers: {
		  		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Fsh (Api - user: '+req.clientIp+')',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en;q=1.0',
          'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'sec-gpc': '1',
			  }// did request to twitter and putting random headers google sent
		  });
				res.status(200)
        if (request.headers.get("Content-Type").includes("text/html")) {
          res.header("Content-Type", "text/plain")
        } else {
          res.header("Content-Type", request.headers.get("Content-Type"))
        }
        res.send(await request.text())
		} catch(err) {
			res.status(500)
      res.json({
        err: true,
        msg: 'Could not get'
      })
		}
  }
}