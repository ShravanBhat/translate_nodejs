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
                response.body.should.be.eql({"success": true,
                "data": {
                    "inputLanguage": "english",
                    "inputText": "hello",
                    "targetLanguage": "hindi",
                    "translatedText": "नमस्ते"
                }});
               
                done();
        })
    })
    it('It should not  GET the translated word of the target language',(done)=>{
        chai.request(server)
        .get('/translate?sourceText=hello&targetLanguage=hondi&sourceLanguage=english') //  word : Hello ; totranslate : Hindi (hn) : wrong language code given
        .end((err,response)=>{
                response.body.should.be.eql({
                    "success": false,
                    "message": "Kindly check the source Language"
                });           
                done();
        })
    })
});