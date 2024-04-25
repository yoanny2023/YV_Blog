import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express(); 
const port = process.env.PORT || 2000;

const db = new pg.Client({

  host    : process.env.DB_HOST,
  user    : process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port    : process.env.DB_PORT,
  ssl     : true

});
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let lastId = 0;
const posts = []; 
//get all posts
app.get("/all_posts",async (req,res)=>{
  /* with databse */
  let blogers =  await db.query("select * from blog_table order by id asc");
  blogers = blogers.rows;
  res.json(blogers);
  console.log("fetch all posts:",blogers); 
});
// create new post 
app.post("/post", async (req,res)=>{  
  
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
/* with Database */
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
