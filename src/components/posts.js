import Post from './post';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { db } from './../firebase';
import { ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';


function Posts() {

    const [posts, setposts] = useState([]);

    useEffect(() => {
        const postRef = ref(db, 'posts');
        return onValue(postRef, snapshots => {
           snapshots.forEach(snapshot => {
               const data = snapshot.val();
                setposts(prevPosts => [...prevPosts, data]);
           })
        })
    }, [])

    return  (
        <div>
            <Container>
                <Grid
                    container
                    spacing={1}
                >
                    {
                        posts.map((post, index) => 
                            <Grid item key={`post${index}`} xs={12} md={6}>
                                <Post post={post} />
                            </Grid>
                        )
                    }
                </Grid>
                
            </Container>
        </div>
    )
}

export default Posts;