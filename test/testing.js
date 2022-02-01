let chai = require('chai');
let chaiHttp = require('chai-http')
let server = require('../index');

//Assertion Style
chai.should();
chai.use(chaiHttp);


describe('GET /translate?sourceText=&targetLanguage=&sourceLanguage=',()=>{
    it("It should GET the translated word of the target language",(done)=>{
        chai.request(server)
        .get('/translate?sourceText=hello&targetLanguage=hindi&sourceLanguage=english') //  word : Hello ; totranslate : hindi(hi)
        .end((err,response)=>{
                response.should.have.status(200);
                response.body.should.be.eql({
                "success": true,
                "data": {
                    "inputLanguage": "english",
                    "inputText": "hello",
                    "targetLanguage": "hindi",
                    "translatedText": "नमस्ते"
                }});
               
                done();
        })
    })
    it('It should ask the user to recheck the source language name',(done)=>{
        chai.request(server)
        .get('/translate?sourceText=hello&targetLanguage=hondi&sourceLanguage=english') //  word : Hello ; totranslate : Hindi : wrong language name(hondi) given
        .end((err,response)=>{
                response.body.should.be.eql({
                    "success": false,
                    "message": "Kindly check the source Language"
                });           
                done();
        })
    })
    it('It should ask user to provide text for translation',(done)=>{
        chai.request(server)
        .get('/translate?sourceText=&targetLanguage=hndi&sourceLanguage=english') //  No Text input
        .end((err,response)=>{
                response.body.should.be.eql({
                    success: false,
                    message: "Please enter the text"
                });           
                done();
        })
    })
});