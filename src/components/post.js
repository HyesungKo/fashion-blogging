import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link'

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
        <Card sx={{ margin: 1}}>
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
                titleTypographyProps={{
                    fontSize: 16,
                    fontWeight: 500
                }}
                sx={{paddingBottom: 0}}
            >
            </CardHeader>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons={true}
                    >

                    {
                        postInfo.map((info, index) => 
                            <Tab 
                                // sx={{border: "1px #ddd solid"}}
                                key={`${post.title}tab${index}`}
                                label={info.category} {...a11yProps(index)} />
                        )
                    }
                </Tabs>
            </Box>
            
            {
                postInfo.map((info, index) => 
                    <TabPanel key={`${post.title}detailinfo${index}`} value={value} index={index}>
                        <img
                            src={info.url}
                            alt={info.caption + "1"}
                            style={{objectFit: "contain", width: "100%", height: 400}}
                        />
                        <CardContent>
                            {
                                info.caption !== undefined &&
                                <Typography variant="body1" color="text.secondary">
                                    {info.caption}
                                </Typography>
                            }
                            { info.category !== undefined &&
                                <Link href={info.link} underline="hover">
                                Where to buy
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