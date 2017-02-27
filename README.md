# wordsmith-sheets-express

This is a sample repository to show how to setup a website to integrate with Google Sheets and the Wordsmith API.

It's build with node.js, using [Express](http://expressjs.com/) and assumes some familiarity with JavaScript.

## Pre-requisites:

* You should have a [Wordsmith](https://wordsmith.automatedinsights.com/) account.
* You should have a [Pusher](https://pusher.com/) account.
* You should have a [Google Drive](https://www.google.com/drive/) account that you can use to create a new Google Sheets file.
* You'll need [node.js](https://nodejs.org/en/) installed on your local machine.
* You'll want to host the site somewhere so that the Google Apps script can access it via HTTP. For the purposes of this example, we'll use [Heroku](https://www.heroku.com/) as an example. It's free, so if you don't have somewhere to host the site, you might want to create an account. If you're hosting your site elsewhere, feel free to ignore this part, and handle your own deployments.

## Setup instructions:

First, generate a random string to use as an `APP_SECRET`. There's lots of tools out there for this, such as [this one](https://www.guidgenerator.com/online-guid-generator.aspx).


### Pusher:

* Create a new app.
* Note the `app_id`, `key` and `secret` which you'll need in your app.

### Wordsmith:

* Create a new project.
* Upload a CSV to your project. Use the `resources/wordsmith_data.csv` file in this repo.
* Create a new template. Feel free to just enter a single sentence to start with. Add a data variable.

### Google Drive:

* Create a new Google Sheets file.
* Import the `resources/wordsmith_data.csv` file. (Under File > Import...)
* Add a new script. (Tools > Script editor...)
* Copy and paste the contents of `resources/google_app_script.js` into the `Code.gs` file.
* Replace the value of `WEBSITE_AUTHORIZATION_HEADER` with your `APP_SECRET`.
* Replace the hostname in the `WEBSITE_POST_URL` with your hostname.
* In the Google Apps Script editor, open Triggers. (Resources > Current project's triggers)
* Click 'Add a new trigger'. Select 'onEdit' for Run, 'fromSpreadsheet' for Events, and 'On edit' for the trigger type. Save and close.

### Local development:

* `cp .env.example .env`
* Open up your .env file. You should add values as follows:
  * APP_SECRET => your newly generated APP_SECRET
  * WORDSMITH_API_KEY => grab this from the Wordsmith application [here](https://wordsmith.automatedinsights.com/api_access).
  * WORDSMITH_PROJECT_NAME => the name of your Wordsmith project.
  * WORDSMITH_TEMPLATE_NAME => the name of your Wordmsith template.
  * PUSHER_APP_ID => get this from the Pusher application.
  * PUSHER_APP_KEY => get this from the Pusher application.
  * PUSHER_APP_SECRET => get this from the Pusher application.
  * PUSHER_CHANNEL => make up a name, it doesn't matter what it is. Ie, 'test-channel'.
  * PUSHER_EVENT => make up a name, it doesn't matter what it is. Ie, 'test-event'.
* `npm i` - install all dependencies
* `npm start` - this will start the application. Open up `http://localhost:3000/` and you should something that looks [like this](https://wordsmith-sheets-express.herokuapp.com/).

### First Time Deployment Setup

You'll need to deploy the application one time in order to have an endpoint that exists for the Google Apps script.

If you have a server that you're using, feel free to ignore this. Otherwise, we'll use Heroku.

* Create a new Heroku app. Select node.js as your development environment.
* Install the Heroku CLI if you haven't already.
* `heroku git:remote -a your-app-name` - set your Heroku remote.
* Open your app in the Heroku dashboard. Go to Settings.
* Add the nodejs buildpack to your Heroku app.
* Add all of your ENV vars from `.env` to 'Config Variables' in your Heroku dashboard.

### Deployment

* `git push heroku master` - this will deploy your app to Heroku.

### Troubleshooting

* `heroku logs --tail` - tail heroku logs to troubleshoot production issues.
