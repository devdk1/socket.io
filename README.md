*Problem Statement:*

    1. Verify you can use git from your computer.
    
    2. Take the clone of this project.
    
    3. Create pages for Login and Signup.
    
    4. User should be able to Sign Up using full name, username, email and password.
    
    5. User should be able to log in using (username OR email) and password.
    
    6. Commit and push code to git.
    
    7. Create a dashboard page and redirect user to dashbaord after successful login.
    
    8. create chat functionality using socket.io.
    
    9. user can chat with all loggedin users.
    
    10. Push code to gitlab


*How to use:*

    1. Execute : resources/db/db.sql
    
                 resources/db/user.sql
                 
    2. If not => Install Redis
    
    3. Update configuration : config/index.js
    
    4. run npm install
    
    5. run npm start.
    
    6. Open http://localhost:9876 in browser
    
    7. Signup with username, full name, email and password
    
    8. Select any user from user list and send message
    

*Features:*

    1. Username & email is unique.
    
    2. Hash is used for encrypt and decrypt passwords for security.
    
    3. User can login by userid or email.
    
    4. Userlist will be automatically update when new user connects or disconnects (On disconnect username will get red colored).
    
    5. Click on username for start chatting.
    
    6. Bell icons pops-up with username when new message received.
    
    7. Redis-session is used to maintain user sessions after server restart.
    
    8. onreload at chatboard all messages will lost, since I am not storing messages in any data store.