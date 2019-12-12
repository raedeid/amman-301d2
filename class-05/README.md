# Class 5: Deployment Workshop 

## Overview

Today we will cover code deployments.

Following lecture, we will deploy our portfolio app, workshop style. Each student will follow along, deploying the personal portfolio built in lab 4 to a cloud web hosting platform called Heroku.

## Daily Plan

- Warm-up exercise
- Introduction of today's code challenge topic
- Build City Explorer (HTML, CSS, JS, jQuery, Handlebars)
- Deployment Overview and Demo
- Deployment Workshop
- Lab Preview

## Learning Objectives

As a result of completing lecture 5 of Code 301, students will:
- Understand the difference between deploying static and dynamic web applications
- Understand deployment processes over multiple environments
- Be able to deploy dynamic web applications to Heroku

### Deployment Workshop

Today, we will be deploying your portfolio to a real web server. This will require a carefully stepped process:

- [ ] Create a new repository for your server at github
- [ ] Develop and test your server from your machine
  - /data route that sends JSON data
  - Static files served from `/public`
  - Simple 'hello world' `index.html` in public
  - `use('*')` for 404 errors
- [ ] Check in your server code to github (master branch)
- [ ] Create an account at Heroku.com
- [ ] Create a new "app" from your Heroku Dashboard
  - Heroku GUI: Add App
- [ ] Deploy your app from your github repository
  - Heroku GUI: Deploy Tab
- [ ] Confirm app is live!
- [ ] Connect your app to master
  - Heroku GUI: Deployment Tab
- [ ] Move city-explorer-lite demo files to the `public` folder
- [ ] Check in your server code to github (master branch)
- [ ] View Heroku logs
  - Heroku GUI: Activity Tab 
- [ ] Confirm app with city-explorer content is live
- [ ] Win.
