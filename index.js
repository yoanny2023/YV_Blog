import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express(); 
const port = 2000;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database: "blog_database",
  password:"Yvasco@2024",
  port:5432

});
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let lastId = 0;
const posts = []; 
//get all posts
app.get("/all_posts",async (req,res)=>{
/*   res.json(posts);
  console.log("fetch all posts:",posts); */

  /* with databse */
  let blogers =  await db.query("select * from blog_table order by id asc");
  blogers = blogers.rows;
  res.json(blogers);
  console.log("fetch all posts:",blogers); 
});
// create new post 
app.post("/post", async (req,res)=>{  
  //console.log("data recived:",req.body);  
  /* const newID = lastId +1;
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
  res.status(200).json(new_element); */

/* with database */

try {
  await db.query("insert into blog_table (name,title,descr,message) values($1,$2,$3,$4)",
  [req.body.name,req.body.title,req.body.desc,req.body.message]);
 let find_user =  await db.query("select * from blog_table order by id asc");
   res.status(200).json(find_user.rows);
  
} catch (error) {
  console.error(error.message);
}
});

//edit a post
app.get("/edit/:id",async(req,res)=>{
 /*  const my_id = parseInt(req.params.id);
  console.log("id to edit:",my_id);
  const find_element = posts.find((element)=>{
  return element.id === my_id;
});
console.log("element found:",find_element);
 res.json(find_element);  */

 /* with database */
 try {
const my_id = parseInt(req.params.id);
 let find_user = await db.query("select * from blog_table where id = $1",[my_id]);
 find_user = find_user.rows;
 console.log("element found:",find_user);
 res.json(find_user);
 } catch (error) {
  console.log("User couldn't be found");
 }
  
});

// update a post
app.patch("/update/:id",async (req,res)=>{
/* const my_id = parseInt(req.params.id);
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
} */

/*  with database */

try {
  const my_id = parseInt(req.params.id);
  console.log("id to update in backend:",my_id);
  await db.query("update blog_table set name = $1, title = $2, descr = $3, message = $4 where id = $5",[req.body.name,
                     req.body.title,
                     req.body.desc,
                     req.body.message,
                     my_id]);
  let find_user = await db.query("select * from blog_table where id = $1",[my_id]);
  find_user = find_user.rows; 
  console.log("Updated user",find_user);
  res.json(find_user);

} catch (error) {
  return res.status(404).json({ message: "Post coudn't be updated" });
}

});

//delete a post from a server
app.delete("/delete_post/:id", async(req,res)=>{
/* const my_id = parseInt( req.params.id);
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
} */

try {
  const my_id = parseInt( req.params.id);
  console.log("id to be deleted",my_id);
  await db.query("delete from blog_table where id = $1",[my_id]);
  res.json({ message: "Post deleted" });
} catch (error) {
 
  res.status(404).json({ message: "Post couldn't be deleted" });
}
});

app.listen(port,()=>{
  console.log(`Listening on server:${port}`);
  }); 
