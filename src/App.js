import React, {useState,useEffect} from 'react'
import Recipe from './components/Recipe'
import SearchIcon from '@material-ui/icons/Search';
import {Grid, AppBar, Toolbar, Button, Container,Typography, TextField, makeStyles, FormControl, FormLabel,RadioGroup, FormControlLabel,Radio} from '@material-ui/core'
import {format} from 'date-fns'
import Loading from './components/Loading'
import { motion } from 'framer-motion';
require('dotenv').config()

const useStyles = makeStyles({

    field:{
      marginTop:20,
      marginBottom: 20,
      display: 'block'
    },
    searchInput:{
        display: 'flex',
        flex: 1,
    },
    searchButton: {
          marginTop: '20px',
         marginBottom: '20px',
    },
    loading: {
        display: 'flex',
        color: 'black',
        padding: '10px',
      justifyContent: 'center',
    },
    error: {
      display: 'flex',
      padding: '10px',
      justifyContent: 'center',
      width: '50%',
      margin: '0 auto',
    },
    App:{
      minHeight:'100vh'
    },
      toolbar: {
        flex: 1,
    },
    titleHeader:{
      marginTop: '70px'
    }


})

const containerVariants = {
  hidden: { 
    opacity: 0, 
  },
  visible: { 
    opacity: 1, 
    transition: { delay: 0.5, duration: 1, ease: "easeIn" }
  }

};


function App() {

        const [recipes, setRecipes] = useState([])
        const [search,setSearch]= useState("")   // input box
        const [query, setQuery] = useState('chicken')  // items to fetch
        const [category, setCategory] = useState("chicken")
        const [showCategory, setShowCategory] = useState(false)  // show food Categorys -default items hidden
        const [isLoading,setLoading] = useState(true)
        const [error, setError] = useState({ show: false, msg: '' })

        const classes = useStyles()  // css

const getRecipes = async () =>{
        
    try{

      // "https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free"
      
     
      const resData  = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`)
                
     
        if(!resData.ok){
            console.log("here");
          throw Error ("Issue with getting item. Please try again")

        }
        
        const data  = await resData.json()
        

        if(data.hits.length === 0){
          throw Error ("No items found")
            
        }

        // console.log(data.hits);
        setRecipes(data.hits)
        setLoading(false) // no longer awaiting data


    }
    catch (err) {

      
       setError({show: true, msg: err.message + " , please try again"}); // show error message
       setLoading(false) // no data fetched
       setRecipes(null)  /// show no items
    }


}  //end of getRecipes


useEffect(() => {      
      getRecipes()
}, [query,category])


//update search value
const update = (e) => {  

    setSearch(e.target.value)    
    setError({ show: false, msg: '' }) // clear any prev error if there was one

}

//search for recipes
const handleSubmit = (e) => {

      e.preventDefault()
      setQuery(search)
      setSearch('')

}


  return (
   
   <>
        <AppBar
          elevation={0}
          className={classes.appbar}
          >
          <Toolbar>
              <Typography className={classes.toolbar}>{format(new Date(),'do MMMM Y')}</Typography>
              <Typography variant="h4">Welcome</Typography>
              
          </Toolbar>
      </AppBar>

      <Container className={classes.App} onSubmit={handleSubmit}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      
      >
            <Typography variant="h2"
            className={classes.titleHeader}
            component="h2"     
            color="primary"
            align="center"
            gutterBottom
            >
            Search for your favourite foods
            </Typography>
      </motion.div>
          <form className="search-form" autoComplete="off">

             {!showCategory &&  <TextField className={classes.searchInput} type="text" value={search}
              onChange={update}              
              color="primary"
              label="Ingredients" 
              variant="outlined" 
              />
            }
             <Button 
             endIcon={<SearchIcon />} color="secondary" variant="contained" className={classes.searchButton}
             onClick={()=>{
                setError({ show: false, msg: '' }) // clear any prev error if there was one
                setShowCategory(!showCategory);
                if(query === ""){
                  setQuery("chicken")
                }
              }} 
             >{!showCategory ? "Food Catagorys" : "Back to Search"}</Button> 

          {
            showCategory &&
           
          <FormControl className={classes.field} > 
            <FormLabel>Food Categorys</FormLabel>
                <RadioGroup value={category} onChange={(e)=>{
                  setCategory(e.target.value); setQuery(e.target.value)}}> 

                    <FormControlLabel  value="chicken" control={<Radio/>} label="Chicken Dishes"/>
                      <FormControlLabel  value="beef" control={<Radio/>} label="Beef Dishes"/>
                          <FormControlLabel  value="lamb" control={<Radio/>} label="Lamb Dishes"/>
                            <FormControlLabel  value="gammon" control={<Radio/>} label="Gammon Dishes"/>
                      
                  
                </RadioGroup> 
          </FormControl>
          }

              {!showCategory ? 
              <Button endIcon={<SearchIcon />} color="primary" variant="contained" className={classes.searchButton} type="submit">Search</Button> : null}

          </form>

            {
              // isLoading && <div className={classes.loading}>Loading.......</div>
              isLoading && <Loading />
            }

            {
              error.show && <div className={classes.error}>{error.msg}</div>
            }

            {
              recipes && 
                          <Grid  container 
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                                className="recipes"
                                spacing={3}
                                >
                              {
                                
                                  recipes.map(item =>{
                                      return <Grid item key={item.recipe.label} xs={12} md={6}  lg={4}>                                      
                                                  <Recipe 
                                                  key={item.recipe.label} 
                                                  title={item.recipe.label}
                                                  calories={item.recipe.calories.toFixed(2)}
                                                  image={item.recipe.image}
                                                  ingredients={item.recipe.ingredients}
                                                  />
                                            </Grid>
                                  })

                              }
                        </Grid>

            }

          
      </Container>
    </>
  );
}



export default App;
