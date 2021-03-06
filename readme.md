# TRANSLATION API WITH CACHING
A web server with a RESTful API to translate a text from one language to another. There is implementation of cache using Redis in order to avoid repeated hits to the translation API.<br/>

### Tech stack used
  >Nodejs<br/>
  >Express framework<br/>
  >Redis (For caching & smart caching)<br/>
  >Heroku-cli for deploying it to Heroku

### Key modules used
- vitalets/google-translate-api (for translating text)<br/>
- ISO-639-1 (for detecting language code)<br/>   
- Mocha for testing

### Run the API
>Clone the repo<br/>
>Replace existing credentials with your redis credentials in config.js<br/>
>Type npm start in terminal to start the server<br/>
>To get the translation, we can use Postman or any web browser and hit this API as follows:
```
{URL}/translate?sourceText=&targetLanguage=&sourceLanguage=

# URL: (http://localhost:3000) or https://immense-anchorage-24441.herokuapp.com
```
### Test using Mocha
>Type npm test in terminal to test the API


### Functions of the API
- Translates the text from source language to target language <br/>
- Implements caching for repeated api hits<br/>
- Implements pre-caching for similar language.For eg.If a person looks for translation in Kannada,he may likely to look for translation in Hindi,Tamil,Telugu.So when he searches for tanslation in kannada,system smartly caches the text in Hindi,Tamil,Telugu,etc<br/>
- Expiration time of each data is set in cache<br/>

### Explanation of Design Decisions
- Used Express framework <br/>
- User enters text,source language and target language he wants to translate it to<br/>
- Middleware folder contains the middleware of cache that act as a check before moving to the controller, if key is present in Redis then it would return the value and not move to the translation else if not found it will be feeded to translation API for translation<br>
- vitalets/google-translate-api module is used to translate the text. Text,source and target language code are passed as parameters to translate function provided by this module and in response we get the translated text<br/>
- ISO-639-1 is used to convert language name to language code which would be feeded to translation APi<br/>
- This translated text is cached to reduce response time of repeated api hits<br/>
- For similar languages a list of related languages is stored in smartcache<br/>
- Smart pre-cache function is being called in the translate text function in which related languages of the entered language are checked, translated and stored in cache<br/>
- Evaluation of the results is done by comparing the response time of the api(refer screensots)<br/> 
- Deployed it on Heroku to make it accessible to everyone on the interet<br/>
- Mocha is used for testing.Three test scenarios have been taken into consideration.<br/>
1)Correct Input<br/> 
2)Wrong Language name entered<br/>
3)Not text entered for translation<br/>

### Screenshots
**First time API call for a particular word and language**
![First API Call](/screenshots/Firstcall.png?raw=true)<br/>

**Fetch from cache**
![Cache call](/screenshots/Secondcall.png?raw=true)<br/>

**Smart Pre-Caching**

![Pre cache fetch](/screenshots/smartcache.png?raw=true)<br/>

**Incorrect Language Name**

![Incorrect Input](/screenshots/incorrectinputlanguage.png?raw=true)<br/>
