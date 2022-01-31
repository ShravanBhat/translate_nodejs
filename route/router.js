const express=require("express");

const router=express.Router();

const cacheCheck=require('.././middleware/cache');
const translateText= require('.././services/translate');
// checking in cache if the translated text already exists or not
router.get('/translate',cacheCheck.cacheFetch,translateText.translate);
module.exports=router;


