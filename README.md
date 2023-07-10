# send-email.js

This is a small server that listens for a post from a Contact Us form and emails the message.

## How to use

Simply plug your email information into the config.json file and place both files in the same directory such as, `/opt/send-email/`.
Afterwards install the Node.js dependencies, and run the script. That's it. Any post to the script from your custom Contact Us form will
be sent to your email of choice!

## Dependencies

If not already installed, install Node.js. Then go to the directory containing `send-email.js` and run the following.

```
npm init -y
npm install express
npm install nodemailer
npm install sanitize-html
```
## Config File
The config file is in json format and contains information about your email provider and also information about the location of your `message_sent.html` file and `404.html` file.

## Using Gmail
In addition to being able to set the host, port, and whether it is secure or not, if you are using Gmail, you can simply add `gmail` under the `service` key.
It would look something like this.
```
{
  "email": {
    "service": "gmail",
    "host": "",
    "port": "",
    "secure": "",
    "recipient": "your-email@example.com",
    "auth": {
      "user": "your-email@example.com",
      "pass": "your-password"
    }
  },
  "path": {
    "notFound": "/path/to/404.html",
    "messageSent": "/path/to/message_sent.html"
  }
}
```
If you have 2fa active on your gmail account, you'll need to add an App Password.
1. Visit the [Google Account Security](https://myaccount.google.com/security) page.
2. Under the "Signing in to Google" section, click on "App Passwords."
4. Scroll down to the "Select App" section, and in the dropdown, choose "Mail" and then "Other" and give your app a name.
5. Click "Generate" and add the password to your config.json file.
