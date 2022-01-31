const express=require("express");

let PORT=process.env.PORT || 3000;
const app=express();
app.use(express.urlencoded({ extended: false }));
app.use('/',require("./route/router")); // use express router

app.listen(PORT, function(err){
    if (err){
        console.log('Error in running the server:'+err);
    }

    console.log('Server running on port:'+PORT);
});
module.exports = app;