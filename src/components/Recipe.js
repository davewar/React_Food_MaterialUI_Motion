import React,{useState} from 'react';
import { motion } from 'framer-motion';

import {Card, CardHeader, CardActions, CardMedia,List, CardContent,ListItem,  Button, Typography, makeStyles, ListItemText,} from '@material-ui/core'

var uniqid = require('uniqid');

//css
const useStyles = makeStyles({
    card:{
        background: '#fffafa',
        
    },
    imageItem:{
        objectFit: 'cover',
        height:300,
    }
    

})

//framer-motion
const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
  
    }
  }
}




const Recipe = ({title, image, calories,ingredients}) => {
        
     const [readMore, setReadMore] = useState(false);

     const classes = useStyles()

    return (
        <Card elevation={5} className={classes.card}>
            <CardHeader 
            title={title}
            
            />

            <CardContent>

                <motion.div
                    variants={imageVariants}
                    whileHover="hover"
                >
                        <CardMedia
                            className={classes.imageItem}
                            component="img"
                            alt={title}
                            // height="400"
                            image={image}
                            title={title}
                            />
                </motion.div>

            </CardContent>

            <CardActions>
                    <Button variant="contained" color="primary" onClick={()=>setReadMore(!readMore)}>
                        {!readMore ? "View Ingredients" : "Close Ingredients"}
                    </Button>
            </CardActions>

            {readMore && 
               <List>
                    {  
                    ingredients.map(item=>{
                        
                            return <ListItem button key={uniqid.time()}>
                                        <ListItemText secondary={item.text} />
                                    </ListItem>
                    })
                    }
                </List> 

            }           
             <CardContent>  
                <Typography variant="body1" align="left" color="primary">Calories - {calories}</Typography>
            </CardContent>   

        </Card>
    )
}

export default Recipe
