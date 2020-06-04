const https = require("https")
const request = require("request")
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser")

app.use('/static',express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/",function(request,response){   
    response.sendFile(path.join(__dirname+"/index.html"));  
})

app.get("/about",function(request,response){
    response.sendFile(path.join(__dirname+"/about.html"))
})

app.get("/profile",function(request,response){
    response.sendFile(__dirname+"/profile.html")
})

app.get("/blog",function(request,response){
    response.sendFile(__dirname+"/blog.html")
})

app.route('/contact')
    .get(function(req,res){
        res.sendFile(__dirname+'/contact.html')
    })
    .post(function(req,res){
        var fname = req.body.fname;
        var email = req.body.email;
        var lname = req.body.lname;
        var pesan = req.body.pesan;
        
        var data = {
            members:[
              {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                  FNAME : fname,
                  LNAME : lname,
                  MESSAGE : pesan
                }
              }
            ]
          }

          var jsonData = JSON.stringify(data);

    var url = "https://us10.api.mailchimp.com/3.0/lists/60d30a58e7"
    var options = {
      method : "POST",
      auth : "louis1:325227253f7f639673c953cfa4065cbc-us10"
    }

    const request = https.request(url,options,function(response){

      if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html")
      }
      else{
        res.sendFile(__dirname+"/failed.html")
      }

      response.on("data",function(data){
        console.log(JSON.parse(data))
      })
    })

    request.write(jsonData);
    request.end();
        
    })

    app.post("/success",function(req,res){
        res.redirect("/");
    })
    app.post("/failed",function(req,res){
        res.redirect("/contact")
    })



app.listen(process.env.PORT || port,function(){
    console.log("app is listening to port "+port)
})


