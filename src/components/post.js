import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import exImg from './../assets/main3.JPG';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link'
import { InfoRounded } from '@mui/icons-material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

        return (
            <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <div>
                    {children}
                </div>   
            )}
            </div>
        );
    }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Post({post}) {
    const [value, setValue] = React.useState(0);

    const postInfo = Object.values(post.info);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Card sx={{ margin: 2}}>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label="fashion"
                        sx={{ width: 30, height: 30}}
                    >
                        BO
                    </Avatar>
                }
                title={post.title}
            >
            </CardHeader>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example" 
                    >

                    {
                        postInfo.map((info, index) => 
                            <Tab key={`${post.title}tab${index}`} label={info.category} {...a11yProps(index)} />
                        )
                    }
                </Tabs>
            </Box>
            
            {
                postInfo.map((info, index) => 
                    <TabPanel key={`${post.title}detailinfo${index}`} value={value} index={index}>
                        <img
                            src={info.url}
                            style={{objectFit: "contain", width: "100%", height: 400}}
                        />
                        <CardContent>
                            {
                                info.caption != undefined &&
                                <Typography variant="body1" color="text.secondary">
                                    {info.caption}
                                </Typography>
                            }
                            { info.category != undefined &&
                                <Link href={info.link} underline="hover">
                                Where to buy {info.category}
                                </Link>
                            }
                        </CardContent> 
                    </TabPanel>
                )
            }

        </Card>
    )
}

export default Post;