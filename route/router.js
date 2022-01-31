const express=require("express");

const router=express.Router();

const cacheCheck=require('.././middleware/cache');
const translateText= require('.././services/translate');

//if data exists in cache then it is fetched directly from cache else it is fetched from translation api
router.get('/translate',cacheCheck.cacheFetch,translateText.translate);
module.exports=router;


