import Post from './post';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { db } from './../firebase';
import { ref, get } from 'firebase/database';
import { useState, useEffect } from 'react';


function Posts() {

    const [posts, setposts] = useState([]);

    useEffect(() => {
        const postRef = ref(db, 'posts');
        get(postRef).then(snapshots => {
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
                        posts.reverse().map((post, index) =>
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