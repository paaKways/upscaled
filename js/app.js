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




if ( typeof jQuery !== undefined ){

  //  (all our code here)


  // variables
  var strLocalStorageCode = "HelloWorld";
  
  //Devless instance
  var db = DV({
    "token" : "82d9d71fcbf4f9c35789d4ddb22ac4c7",
    "domain": "https://devless-paak.herokuapp.com"
  });

  

  // classes
  class Model{

    constructor(){

    }

    getUserName(){

      var pojoCurrentUser = this.getCurrentUser();
      var strUserName = pojoCurrentUser["name"];

      console.log("Model::getUserName > line 112. | strUserName: ", strUserName);

      return strUserName;
    }


    setCurrentUser(strId){

      console.log("Model::setCurrentUser > line 125. | strId: ", strId);

      var pojoData = getAllData();
      pojoData["currentUser"] = strId;
    }

    getCurrentUser(){
      var pojoData = getAllData();
      var strCurrUserId = pojoData["currentUser"];
      var pojoCurrentUser = pojoData["users"][strCurrUserId];

      console.log("Model::getCurrentUser > line 125. | pojoCurrentUser: ", pojoCurrentUser);

      return pojoCurrentUser;
    }

  }







  class Controller{
    constructor(){

    }

    setModel(objModel){
      this.model = objModel;
    }







    /* changing state. e.g. logged in, not logged in, etc. */
    checkState(){

      console.log('Controller::checkState > line 102.');

      this.boolIsLoggedIn = this.isLoggedIn();
    }

    isLoggedIn(){
      return false;
    }

    logOut(){

      console.log('Controller::logOut > line 102.');

      return false;
    }


    attemptToLoginUser(){
      // get fields
      var pojoFields = this.getFormFields();
      var strPassword = pojoFields["password"];
      var strEmail = pojoFields["email"];
      var strId = strEmail;

      // get data
      var pojoData = getAllData();
      pojoData["users"] = pojoData["users"] || {};

      var pojoUser;
      if (pojoUser = pojoData["users"][strId]){
        if (pojoUser["password"] == strPassword){
          this.loginUser(strId);
        }
        else{
          // todo handle validation
        } 
      }
    }

    // workin
    loginUser(strId){
      var strNewPage = "logged-in-home"
      this.setCurrentPage(strNewPage);
    }


    registerUser(){
      // get fields
      var pojoFields = this.getFormFields();

      var strName = pojoFields["name"];
      var strPassword = pojoFields["password"];
      var strRetypedPassword = pojoFields["retypePassword"];
      var strEmail = pojoFields["email"];
      var strId = strEmail;

      // get data
      var pojoData = getAllData();
      pojoData["users"] = pojoData["users"] || {};

      delete pojoFields["retypePassword"];
      pojoData["users"][strId] = pojoFields;

      // set current user
      this.model.setCurrentUser(strId);

      // save data
      saveAllData(pojoData);

      // change to logged in page
    }


    // to put elsewhere
    getFormFields(){

      var pojoRetObj = {};

      switch(this.getCurrentPage()){
        case "register":
        case "login":
          var strName = $("#input-login-form-name").val();
          var strPassword = $("#input-login-form-pwd").val();
          var strRetypedPassword = $("#input-login-form-retype-pwd").val();
          var strEmail = $("#input-login-form-email").val();

          pojoRetObj = {
            name: strName,
            password: strPassword,
            retypePassword: strRetypedPassword,
            email: strEmail
          };


          break;
      }

      return pojoRetObj;
    }















    /* changing pages */

    setCurrentPage(strPage){

      var that = this;

      

      // checkState
      this.checkState();

      
      var strRealPage = this.getRealPage(strPage);
      var strCurrentPage = this.getCurrentPage();

      if (!strCurrentPage || strCurrentPage == "undefined"){
        console.log('gamma');
        console.log(strCurrentPage);
        strCurrentPage = strRealPage;
        console.log(strCurrentPage);
      } 
      else{
        console.log('delta');
      }



      // var strCurrentPage = (strCurrentPage !== undefined) ? this.getCurrentPage() : strRealPage;

      console.log('Controller::setCurrentPage > line 290. | strRealPage: ', strRealPage);
      console.log('Controller::setCurrentPage > line 291. | strCurrentPage: ', strCurrentPage);

      var strSectionToChange = this.getSectionToChange(strRealPage, strCurrentPage);
      var strPageSectionToLoad = this.getPartPageToLoad(strRealPage, strCurrentPage);

      console.log('Controller::setCurrentPage > line 312. | strSectionToChange: ', strSectionToChange);
      console.log('Controller::setCurrentPage > line 313. | strPageSectionToLoad: ', strPageSectionToLoad);

      // fade out first

      $(strSectionToChange).fadeOut("fast", function(){
        $(strSectionToChange).load(strPageSectionToLoad, function( response, status, xhr ) {
          if ( status == "error" ) {
            var msg = "Sorry but there was an error: ";
            $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
          }
          else{
            that.currentPage = strRealPage;
            that.handleChangePage.call(that, strRealPage);
          }

          $(strSectionToChange).fadeIn("fast");
        });
      });
    }

    getSectionToChange(strNewPage, strCurrentPage){
      var boolIsCurrAuth = this.isAuthenticated(strCurrentPage);
      var boolIsNewAuth = this.isAuthenticated(strNewPage);

      var strRetSection = "";

      if (!boolIsCurrAuth && boolIsNewAuth){
        strRetSection = 'body';
      }
      else if (!boolIsCurrAuth && !boolIsNewAuth){
        strRetSection = `.section-middle`;
      }
      else if (boolIsCurrAuth && boolIsNewAuth){
        strRetSection = `.section-main-right`;
      }

      return strRetSection;
    }

    getPartPageToLoad(strNewPage, strCurrentPage){

      console.log('Controller::getPageSectionToLoad > line 290. | strUrl: ', strUrl);

      var strSectionToChange = this.getSectionToChange(strNewPage, strCurrentPage);
      
      var strUrl = `${strNewPage.toLowerCase()}.html`;
      var strRetSection = strSectionToChange != "body" ? `${strUrl} ${strSectionToChange}` : strUrl;

      // strRetSection =      

      console.log('Controller::getPageSectionToLoad > line 290. | strUrl: ', strUrl);
      console.log('Controller::getPageSectionToLoad > line 291. | strRetSection: ', strRetSection);

      return strRetSection;
    }

    isAuthenticated(strPage){
      var boolIsAuthed = false;

      var arrStrUnAuthed = ['index', 'login', 'register'];

      if (arrStrUnAuthed.indexOf(strPage) === -1){
        boolIsAuthed = true; 
      }

      console.log('Controller::isAuthenticated > line 291. | boolIsAuthed: ', boolIsAuthed);

      return boolIsAuthed;
    }

    getRealPage(strPage){

      var strRetPage = strPage;

      switch (strPage){
        case "home":
          strRetPage = "index";
          break;
        default:
          break;
      }

      return strRetPage;
    }

    getCurrentPage(){
      var strCurrentPage = ""+this.currentPage || "";

      console.log('Controller::getCurrentPage > line 138. | strCurrentPage: ', strCurrentPage);

      return strCurrentPage;
    }

    handleChangePage(strPage){

      var that = this;

      console.log('Controller::handleChangePage > line 141. | strPage: ', strPage);

      console.log(this);

      this.handleGeneralPageChanges.call(that);

      switch(strPage){
        case "index":
          this.handleChangeToHomePage.call(that);
          break;
        case "login":
          this.handleChangeToLoginPage.call(that);
          break;
        case "register":
          this.handleChangeToRegisterPage.call(that);
          break;
      }
    }












    // handling page changes

    // header

    handleLoginOutLinkClick(){
      if (this.isLoggedIn()){
        this.logOut();
      }
      // show log in page
      else{
        this.setCurrentPage("login");
      }
    }

    handleRegisterClick(){

      var that = this;

      this.setCurrentPage("register");
    }

    handleGeneralPageChanges(){

      console.log("Controller::handleGeneralPageChanges > line 442. | alpha");

      var that = this;

      $('.a-register').off("click");
      $('.a-login-out').off("click");

      $('.a-register').click(this.handleRegisterClick.bind(that));
      $('.a-login-out').click(this.handleLoginOutLinkClick.bind(that));

    }









    // individual pages

    handleChangeToLoginPage(){
      var that = this;

      console.log('that: ', that);

      console.log('handleChangeToLoginPage > line 160. | alpha');

      $('.btn-login-btn').off("click");
      $('.btn-login-btn').click(this.attemptToLoginUser.bind(that));
    }

    handleChangeToRegisterPage(){
      var that = this;

      $('.btn-register-btn').off("click");
      $('.btn-register-btn').click(this.registerUser.bind(that));
    }

    handleChangeToHomePage(){
      console.log('handleChangeToHomePage > line 160. | alpha');

      if (!this.isLoggedIn()){
        $('.img-div-section-header-user-icon').hide();
      }
      else{

        var strUserName = this.model.getUserName();
        $('.span-section-header-user-menu-login-out').html(strUserName);

        $('.img-div-section-header-user-icon').show();
      }
    }

  }


  // variables

  // functions

  function init(){
    var systemController = new Controller();
    var systemModel = new Model();


    systemController.setModel(systemModel);    
    systemController.checkState();
    systemController.setCurrentPage('home');




  }

  function getAllData(){
    //var strPojoData = localStorage.getItem(strLocalStorageCode) || "{}";

    console.log('getAllData > line 385. | strPojoData: ', strPojoData);

    var pojoData = JSON.parse(strPojoData);

    console.log('getAllData > line 385. | pojoData: ', pojoData);
    
    return pojoData;
  }

  function saveAllData(pojoData){

    console.log('saveAllData > line 385. | pojoData: ', pojoData);

    var strPojoData = JSON.stringify(pojoData);

    localStorage.setItem(strLocalStorageCode, strPojoData);
  }

  function reset(){
    localStorage.setItem(strLocalStorageCode, "{}");
  }





  // "script"

  init();



}else console.warn('This app needs jQuery to run');

