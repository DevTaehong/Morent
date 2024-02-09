# Morent
<img width="1377" alt="Screenshot 2024-02-09 at 6 01 50 PM" src="https://github.com/DevTaehong/Morent/assets/71358207/d9b19cc0-c29e-45ec-a80a-91e10b90cca3">

![PRs](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=shields)
[![website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://github.com/DevTaehong/Hipnode)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Demo
Here is a working live demo: https://morent-zeta.vercel.app/


## 📝 Description
Morent is a cutting-edge car rental application developed using Next.js, and MongoDB. The app boasts a dynamic homepage that showcases featured vehicles, along with convenient pickup & drop-off location options & a comprehensive list of available cars.


## 🛠️ Setup Project
To get this project up and running in your development environment, follow these step-by-step instructions.

### 🍴 Prerequisites

We need to install or make sure that these tools are pre-installed on your machine:

- [NodeJS](https://nodejs.org/en/download/): It is a JavaScript runtime build. 
- [Git](https://git-scm.com/downloads): It is an open-source version control system. 

## ✨ Features
1. Homepage - Consisting of a banner of highlighted cars to rent, pickup and dropoff pickers, list of vehicles available for rent.
2. All Cars Page - List of vehicles, search, a sidebar with filtering functionality
3. Car Details Page - Consisting of additional car details, such as images, title, brand, price, and a list of other recommended cars available for rent.
4. Add a Car Page - Add car details (images, title, brand, price) through a form. After submission, the car should appear on the home page
5. Car Rent Page - Clicking on “Rent Now” utilizes Stripe’s payment functionalities and redirects to a Stripe-powered checkout page.
6. User page - Displays a list of cars rented by the user and cars put for rent by the user.
7. Payments - Stripe to handle payments
8. Add Cars to Favorite

## 🔍 Usage

### How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/DevTaehong/Morent.git

# Go into the repository
$ cd Morent

# Install dependencies
$ npm install 

# Run the app
$ npm start
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

### ⚒️ How to Contribute
Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request 

### 📩 Bug / Feature Request

If you find a bug (the website couldn't handle the query and / or gave undesired results), kindly open an issue [here](https://github.com/devtaehong/hipnode/issues/new) by including your search query and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/devtaehong/hipnode/issues/new). Please include sample queries and their corresponding results.

## 🔒 ENV file
 ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk_publishable_key>
   CLERK_SECRET_KEY=<clerk_secret_key>
   WEBHOOK_SECRET=<webhook_secret>
   
   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   # Direct URL and Database URL
   DIRECT_URL=<direct_url>
   DATABASE_URL=<database_url>
   
   # MongoDB Configuration
   MONGODB_UR=<mongodb_url>
   
   # Uploadthing
   UPLOADTHING_SECRET=<uploadthing_secret>
   UPLOADTHING_APP_ID=<uploadthing_app_id>
  
   # Stripe API Keys
   STRIPE_SECRET_KEY=<stripe_secret_key>
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<next_public_stripe_publishable_key>
   ```

## 📜 Credits

👦 Tye Stanley <br>
Email: jamesdrysdale84@gmail.com <br>
GitHub: @JamesDrysdale

👦 Glen McCallum <br>
Email: glen.mccallum@live.co.uk <br>
GitHub: @glenmac90

👦 Alexander Mc Lachlan <br>
Email: alexmonk17@gmail.com <br>
GitHub: @AlexDjangoX


## 📞 Contact Me

[![Follow us on LinkedIn](https://img.shields.io/badge/LinkedIn-taehong-blue?style=flat&logo=linkedin&logoColor=b0c0c0&labelColor=363D44)](https://www.linkedin.com/in/taehong/)
