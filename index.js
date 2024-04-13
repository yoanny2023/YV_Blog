import express from "express";
import bodyParser from "body-parser";

const app = express(); 
const port = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let lastId = 0;
const posts = []; 
//get all posts
app.get("/all_posts",(req,res)=>{
  res.json(posts);
  console.log("fetch all posts:",posts);
});
// create new post 
app.post("/post",(req,res)=>{  
  //console.log("data recived:",req.body);  
  const newID = lastId +1;
  const new_element = {
    id:newID,
    name: req.body.name,
    title:req.body.title, 
    desc:req.body.desc,
    message:req.body.message
  } 
  lastId = newID;
  posts.push(new_element);
  console.log("add element:",new_element);
  res.status(200).json(new_element);
});

app.listen(port,()=>{
console.log(`Listening on server:${port}`);
}); 

//edit a post
app.get("/edit/:id",(req,res)=>{
  const my_id = parseInt(req.params.id);
  console.log("id to edit:",my_id);
  const find_element = posts.find((element)=>{
  return element.id === my_id;
});
console.log("element found:",find_element);
 res.json(find_element); 

});

// update a post
app.patch("/update/:id",(req,res)=>{
const my_id = parseInt(req.params.id);
console.log("id to update:",my_id);
const find_element = posts.find((element)=>{
return element.id === my_id;
});
console.log("element to update:",find_element);

const new_data = {
  id:my_id                 || find_element.id,
  name:req.body.name       || find_element.name,
  title:req.body.title     || find_element.title,
  desc:req.body.desc       || find_element.desc,
  message:req.body.message || find_element.message
}
const searchIndex = posts.findIndex((element)=>{ 
  return element.id === my_id;  
});
console.log("index found is:",searchIndex);
if (searchIndex === -1) {
  return res.status(404).json({ message: "Post coud not be updated" });
}else{
 
  posts[searchIndex] = new_data;
  console.log("Updated array",posts);
  res.json(new_data);
}
});

//delete a post from a server
app.delete("/delete_post/:id",(req,res)=>{
const my_id = parseInt( req.params.id);
//console.log("id to be deleted",my_id);
//console.log("current array",posts);
const searchIndex = posts.findIndex((element)=>{ 
  return element.id === my_id;  
});
console.log("index found is:",searchIndex);
if (searchIndex === -1) {
  return res.status(404).json({ message: "Post not found" });
}else{
  posts.splice(searchIndex,1);
  res.json({ message: "Post deleted" });
}
});
