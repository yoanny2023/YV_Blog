import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
/* const Api_url = "http://localhost:2000"; */
const Api_url = "https://yv-blog-backend.onrender.com";

const app = express(); 
const port = 1000;  
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

const d = new Date();
const year = d.getFullYear();
const month = String((d.getMonth()+1)).padStart(2,"0");
const day = String(d.getDate()).padStart(2,"0");
const f_date = `${day}/${month}/${year}`;

 // main page
app.get("/",(req,res)=>{

  res.render("main.ejs"); 
  console.log("main page working");
});
// get all posts
app.get("/posts", async (req,res)=>{
  const result = await axios.get(`${Api_url}/all_posts`);
    res.render("all_posts.ejs",{Posts:result.data,
                                date: f_date
                                }
              ); 

  console.log("fetched posts",result.data);
});
app.get("/new_post",(req,res)=>{
res.render("create.ejs");
});    
 
//create new post
app.post("/create", async (req,res)=>{ 

  console.log("new blog post is woking");
  console.log("data to send:",req.body);
  const result = await axios.post(`${Api_url}/post`,req.body);
  console.log("new elements: ",result.data); 
  res.redirect("/posts");
 
}); 

// Edit post
app.get("/edit/:id", async (req,res)=>{
  console.log("Edit page working");
  try {
    const result = await axios.get(`${Api_url}/edit/${req.params.id}`);
    console.log(result.data);
    res.render("create.ejs", {post: result.data[0]} ); 
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
  
});

// update post
app.post("/api_update/:id", async (req,res)=>{
  console.log("id to update:",req.params.id);
  try {
    const result = await axios.patch(`${Api_url}/update/${req.params.id}`,req.body);
    console.log("Data updated:",result.data);
    res.redirect("/posts");
  
  } catch (error) {
    res.status(500).json({message:"error updating apost"});
  }
 
});
 
// About the page
app.get("/about/:id",async (req,res)=>{
console.log("About page is working");
try {
  const result = await axios.get(`${Api_url}/edit/${req.params.id}`);
  console.log("data to send",result.data);
  res.render("more.ejs", {article: result.data[0],
                          id:req.params.id} 
            ); 
} catch (error) {
  res.status(500).json({ message: "Error to view this post" });
}

});
//delete a post
app.get("/delete/:id", async(req,res)=>{
  const id = req.params.id;
  console.log("id to delete:",id);   
  try {
    await axios.delete(`${Api_url}/delete_post/${id}`);
    res.redirect("/posts");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
   
});
  
app.listen(port,()=>{
console.log(`Api runnig on port:${port}`);
});