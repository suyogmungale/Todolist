const express = require('express');
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser:true});

const itemsSchema = {
  name:String
};

const Item  = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name:'Workout'
});

const item2 = new Item ({                                 
  name:'read newspaper'
});

const item3 = new Item ({
  name: 'Write a blog'
});

const defaultItems = [item1, item2, item3];




app.get("/", function(req, res) {

const day = date.getDate();
  
  Item.find({}, function(err, foundItems){
    
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
        console.log(err);
      }else{
          console.log('Sucssesfully inserted');
        }
      });
      res.redirect('/');
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
    }

    
  });
 

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  });

  item.save();

  res.redirect('/');

 /* if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }*/
});

app.post('/delete', function(req,res){
console.log(req.body);
const checkedItemId = req.body.checkbox;

Item.findByIdAndRemove(checkedItemId, function(err){
  if(!err){
    console.log("delete");
    res.redirect('/');
  }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: item});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
