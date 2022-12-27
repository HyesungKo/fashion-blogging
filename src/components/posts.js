import Post from './post';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { db } from './../firebase';
import { ref, get } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';


function Posts({searchTerm}) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const postRef = ref(db, 'posts');
        get(postRef).then(snapshots => {
            setPosts([]);
            snapshots.forEach(snapshot => {
                const post = snapshot.val();
                post['id'] = snapshot.key;
                if(post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    setPosts(prevPosts => [...prevPosts, post]);
                }
           })
        })
    }, [searchTerm])

    return  (
        <Container sx={{padding: 0}}>
            <Grid
                container
                spacing={1}
            >
                {
                    posts.length > 0 ?
                    posts.reverse().map((post, index) =>
                        <Grid item key={`post${index}`} xs={12} md={6}>
                            <Post post={post} />
                        </Grid>
                    )
                    :

                    searchTerm !== "" &&
                    <Box
                        sx={{width: "100%", padding: 20}}    
                    >
                        <Typography variant="h4">
                            Sorry, No result for the search!
                        </Typography>
                        <Typography variant="h4">
                            Try something else!
                        </Typography>
                    </Box>
                }
            </Grid>
        </Container>
    )
}

export default Posts;