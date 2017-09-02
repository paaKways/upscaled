/*

Project Description

# "Hello World's" Devless Hackathon

## Project Description

This is a crowd-funding platform for allowing people to pool together their monies, in order to afford something that none of the individual members could have afforded on their own.

Good credit scores (making payments regularly) mean bigger credit limits.


### Models

  (Models are the things that will get stored in the database)

  #### Group

    - Name
    - Profile
    - Users
    - Payment History


  #### User (NB: The system is a user too)

    - Name
    - Profile


  #### Profile

    - How much to pay
    - When to pay
    - Credit Score
    - Credit Limit (How )
    - Bank Account (ExpressPay, Hubtel, etc.)
    - Balance (Amount saved)
    - Admin (for Groups)
    - Contact Information (e.g. email, phone number, etc.)


  #### Payment History

    - Who paid
    - How much was paid
    - When was this paid



### Controllers

  (The things that send messages/interact with the "views" and the "models". One "system" is fine)

  #### Actions

    - Create, read, update and delete a
      - User
      - Group
      - Profile (no delete)

    - Make a payment
      - User to a group
      - Group to the "HelloWorld" system

    - Make a withdrawal from the group
      - This is the same as transferring money from a group to an individual. Possibly outside the system, though.

    - Tranfer money between
      - a group to a user
      - a group to another group

    - Adjust credit score



### Views

  (This is what you'll look at)

  * The add a group page
  * The add a user page
  * The make a transfer/withdrawal page

*/

if( typeof jQuery !== undefined ){
 //  all our code here/


}else console.warn('This app needs jQuery to run');

