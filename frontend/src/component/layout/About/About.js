import { Avatar, Button, Typography } from '@material-ui/core'
import React from 'react'
import LinkedIn from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import GithubIcon from "@material-ui/icons/GitHub";

import "./About.css"
const About = () => {
    const visitInstagram = () => {
        window.location = "https://instagram.com";
      };
  return (
    <div className='aboutSection'>
        <div></div>
        <div className='aboutSectionGradient'></div>
        <div className='aboutSectionContainer'>
            <Typography component="h1">About Us</Typography>
        <div>
        <div>
            <Avatar
            style={{width:"10vmax" , height:"10vmax",margin:"2vmax 0"}}
            src=""
            alt="Founder"
            />
            <Typography>sunsil </Typography>
            <Button onClick={visitInstagram} color="primary">
                Visit Instagram
            </Button>
            <span>
                It is a E-commerce Website made by sunsil . 
            </span>
        </div>
        <div className='aboutSectionContainer2'>
            <Typography component="h2">Our Socials</Typography>
            <a
             href='https://www.linkedin.com'
             target="blank"
            >
                <LinkedIn className='linkedinIcon'/>
            </a>
            <a href="https://twitter.com" target="blank">
              <TwitterIcon className="twitterIcon" />
            </a>
            <a href="https://github.com" target="blank">
              <GithubIcon className="githubIcon" />
            </a>
            </div>
        </div>
    </div>
    </div>

  )
}

export default About