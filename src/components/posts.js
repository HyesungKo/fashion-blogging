import Post from './post';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { db } from './../firebase';
import { ref, get } from 'firebase/database';
import { useState, useEffect } from 'react';


function Posts({searchTerm}) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const postRef = ref(db, 'posts');
        get(postRef).then(snapshots => {
            setPosts([]);
            snapshots.forEach(snapshot => {
                const data = snapshot.val();
                if(data.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    setPosts(prevPosts => [...prevPosts, data]);
                }
           })
        })
    }, [searchTerm])

    return  (
        <div>
            <Container>
                <Grid
                    container
                    spacing={1}
                >
                    {
                        posts.length > 0 &&
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