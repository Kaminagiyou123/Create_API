const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model('Article',articleSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.route('/articles')
.get( (req,res)=>{
    Article.find((err,foundArticles)=>{
    if (!err){
        res.send (foundArticles)
    } else {
        res.send(err);
    }
 })    
})

.post((req,res)=>{
    const title=req.body.title
    const content=req.body.content
    const newArticle= new Article({
        title:title,
        content:content
    })
    newArticle.save()
    res.redirect('/articles')

})

.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if (err){
            res.send(err)
        } else {
            res.send('successfully deleted')
        }
    })
});

app.route('/articles/:articleTitle')
.get((req,res)=>{
Article.findOne({title:req.params.articleTitle}, (err,foundArticle)=>{
if (!err){
    res.send(foundArticle)
} else {
    res.send('no article found')
}
})})

.put((req,res)=>{
   
  Article.update({title:req.params.articleTitle}
    ,{title: req.body.title, content:req.body.content}
    ,{overwrite:true}
    ,(err,results)=>{
    if(!err){
        res.redirect('/articles/:articleTitle')
    } else {
        res.send(err)
    }
  })  
})
.patch((req,res)=>{
    Article.update({title:req.params.articleTitle}
        ,{$set: req.body}
        ,(err)=>{
        if(!err){
            res.redirect('/articles/:articleTitle')
        } else {
            res.send(err)
        }
      })  
})
.delete((req,res)=>{
    Article.findOneAndDelete({title:req.params.articleTitle},
        (err)=>{
            if (!err){
            res.redirect('/articles/:articleTitle')
        }
        })

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});