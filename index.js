const express=require("express");

const PORT=process.env.port || 3000;
const app=express();
app.use(express.urlencoded({ extended: false }));
app.use('/',require("./route/router"));

app.listen(PORT, function(err){
    if (err){
        console.log('Error in running the server:'+err);
    }

    console.log('Server running on port:'+PORT);
});
module.exports = app;