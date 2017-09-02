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
  var strGroupName = "helloworld";
  var systemController;
  var systemModel;
  
  //Devless instance
  var db = DV({
    "token" : "82d9d71fcbf4f9c35789d4ddb22ac4c7",
    "domain": "https://devless-paak.herokuapp.com"
  });

  











  // classes
  class Model{

    constructor(){
      this.initModel();
    }

    initModel(){
      console.log("Model::initModel > line 126. | alpha");

      var pojoAllData = getAllData();
      pojoAllData["groups"] = pojoAllData["groups"] || this.makeNewGroup();
      pojoAllData["groups"] = this.recalculateData(pojoAllData["groups"]);
 
      console.log('alpha. pojoAllData: ', pojoAllData);

      saveAllData(pojoAllData);
    }

    makeNewGroup(){

      console.log("Model::makeNewGroup > line 134. | alpha");

      var intMin = 5;
      var intMax = 15;
      var intBalance = _.random(intMin, intMax)  * 100;

      var intMin = 20;
      var intMax = 50;
      var intCredit = _.random(intMin, intMax)  * 10;

      var pojoData = {
        id: 'helloworld',
        name: '"Hello World" Collective',
        balance: intBalance,
        creditScore: intCredit,
        amountDeposited: 0,
        users: [],
      }

      return {'helloworld': pojoData};
    }

    getCurrentUserName(){

      var pojoCurrentUser = this.getCurrentUser();
      var strUserName = pojoCurrentUser["name"];

      console.log("Model::getCurrentUserName > line 112. | strUserName: ", strUserName);

      return strUserName;
    }

    saveUser(pojoFields){

      console.log("Model::saveUser > line 119. | pojoFields: ", pojoFields);

      // get data
      var pojoData = getAllData();
      var strId = pojoFields["email"];
      pojoData["users"] = pojoData["users"] || {};


      delete pojoFields["retypePassword"];

      // add stuff to user
      var pojoRandomData = this.getRandomUserData();
      pojoFields["balance"] = pojoRandomData["balance"];
      pojoFields["creditScore"] = pojoRandomData["creditScore"];
      pojoFields["amountDeposited"] = pojoRandomData["amountDeposited"];

      // calculate credit
      pojoFields = this.recalculateData(pojoFields);

      // set current user
      pojoData["users"][strId] = pojoFields;

      // add user to group
      pojoData["groups"][strGroupName].users.push(strId);

      // save data
      saveAllData(pojoData);

    }

    getRandomUserData(){
      var intMin = 5;
      var intMax = 15;
      var intBalance = _.random(intMin, intMax)  * 100;

      var intMin = 20;
      var intMax = 50;
      var intCredit = _.random(intMin, intMax)  * 10;

      var pojoData = {
        balance: intBalance,
        creditScore: intCredit,
        amountDeposited: 0,
      }

      return pojoData;
    }

    setCurrentUser(strId){

      console.log("Model::setCurrentUser > line 125. | strId: ", strId);

      var pojoData = getAllData();
      pojoData["currentUser"] = strId;

      saveAllData(pojoData);
    }

    getGroup(){
      var pojoData = getAllData();
      var pojoGroup = pojoData["groups"][strGroupName];

      // recalculate data
      pojoGroup = this.recalculateData(pojoGroup);

      return pojoGroup;
    }

    getCurrentUser(){

      console.log("Model::getCurrentUser > line 174. | alpha");

      var pojoData = getAllData();
      var strCurrUserId = pojoData["currentUser"];

      console.log("Model::getCurrentUser > line 174. | strCurrUserId: ",strCurrUserId);

      var pojoCurrentUser = pojoData["users"][strCurrUserId];

      // recalculate data
      pojoCurrentUser = this.recalculateData(pojoCurrentUser);

      console.log("Model::getCurrentUser > line 180. | pojoCurrentUser: ", pojoCurrentUser);

      return pojoCurrentUser;
    }

    recalculateData(pojoCurrentUser){

      console.log("Model::recalculateData > line 187. | pojoCurrentUser: ", pojoCurrentUser);

      var intCreditScore = pojoCurrentUser["creditScore"];
      var intDeposited = pojoCurrentUser["amountDeposited"]

      var intCreditLimit = Math.floor((intCreditScore/500) * intDeposited);
      pojoCurrentUser["creditLimit"] = intCreditLimit;
      pojoCurrentUser["totalAvailable"] = intCreditLimit + intDeposited;


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
      var pojoData = getAllData();

      var boolIsLoggedIn = !!pojoData["currentUser"];

      console.log("Controller::isLoggedIn > line 312. | boolIsLoggedIn: ", boolIsLoggedIn);

      return boolIsLoggedIn;
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

  
    loginUser(strId){
      var strNewPage = "logged-in-home"
      this.setCurrentPage(strNewPage);
    }


    registerUser(){

      console.log('Controller::registerUser > line 279.');

      // get fields
      var pojoFields = this.getFormFields();

      var strName = pojoFields["name"];
      var strPassword = pojoFields["password"];
      var strRetypedPassword = pojoFields["retypePassword"];
      var strEmail = pojoFields["email"];
      var strId = strEmail;

      //some validation
      if( strRetypedPassword === strPassword ){
        delete pojoFields["retypePassword"];
      }else{
        alert('Please make sure passwords in both fields are the same!');
        return false;
      }
      

      db.addData('People', 'peopledata', pojoFields , function(response) {
        if (response.status_code === 609) {
          console.log('addData :passed ');
          alert(response.message);
          $('.alert').html(response.message);
        } else {
          console.log('addData :failed ');
          alert(response.message);
          $('.alert').html(response.message);
        }

      });
      /* get data
      var pojoData = getAllData();
      pojoData["users"] = pojoData["users"] || {};

      // save and set user
      this.model.saveUser(pojoFields);
      this.model.setCurrentUser(strId);

      // save data
      saveAllData(pojoData);*/

      // change to logged in page
      window.location('logged-in-home.html');
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
        case "logged-in-home":
          this.handleChangeToLoggedInPage.call(that);
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

    // workinonit
    handleChangeToLoggedInPage(){
      var that = this;

      // set data
      var pojoUser = this.model.getCurrentUser();
      var pojoGroup = this.model.getGroup();

      console.log("Controller::handleChangeToLoggedInPage > line 569. | pojoUser: ", pojoUser);
      console.log("Controller::handleChangeToLoggedInPage > line 569. | pojoGroup: ", pojoGroup);

      var strUserName = this.model.getCurrentUserName();
      var strEmail = pojoUser["email"];
      var strDeposited = pojoUser["amountDeposited"] + " GHS";
      var strCreditScore = pojoUser["creditScore"];
      var strCreditLine = pojoUser["creditLimit"] + " GHS";
      var strBalance = pojoUser["balance"] + " GHS";
      var strTotalAvailable = pojoUser["totalAvailable"] + " GHS";

      // put user name here
      $('.span-logged-user-name').html(strUserName);
      $('.span-main-panel-user-name').html(strUserName);

      // put in the numbers - user
      
      $('.span-email-field').html(strEmail);
      $('.span-deposited-field').html(strDeposited);
      $('.span-credit-line-field').html(strCreditLine);
      $('.span-credit-score-field').html(strCreditScore)
      $('.span-total-available-field').html(strTotalAvailable);
      $('.span-payment-method-balance').html(strBalance);

      // put in the numbers - group


      var strDeposited = pojoGroup["amountDeposited"] + " GHS";
      var strCreditScore = pojoGroup["creditScore"];
      var strCreditLine = pojoGroup["creditLimit"] + " GHS";
      var strBalance = pojoGroup["balance"] + " GHS";
      var strTotalAvailable = pojoGroup["totalAvailable"] + " GHS";
      
      $('.span-group-deposited-field').html(strDeposited);
      $('.span-group-credit-line-field').html(strCreditLine);
      $('.span-group-credit-score-field').html(strCreditScore)
      $('.span-group-total-available-field').html(strTotalAvailable);

      // handling, eventually.
      // $('.btn-register-btn').off("click");
      // $('.btn-register-btn').click(this.registerUser.bind(that));
    }

    handleChangeToHomePage(){
      console.log('handleChangeToHomePage > line 160. | alpha');

      if (!this.isLoggedIn()){
        $('.img-div-section-header-user-icon').hide();
      }
      else{

        var strUserName = this.model.getCurrentUserName();
        $('.span-section-header-user-menu-login-out').html(strUserName);

        $('.img-div-section-header-user-icon').show();
      }
    }

  }


  // variables

  // functions

  function getAllData(){
    var strPojoData = localStorage.getItem(strLocalStorageCode) || "{}";

    console.log('getAllData > line 385. | strPojoData: ', strPojoData);

    var pojoData = JSON.parse(strPojoData);

    console.log('getAllData > line 385. | pojoData: ', pojoData);
    
    return pojoData;
  }

  function saveAllData(pojoData){

    console.log('saveAllData > line 385. | pojoData: ', pojoData);

    var strPojoData = JSON.stringify(pojoData);

    console.log(pojoData);

    /*db.addData('People', 'peopledata', pojoData , function(response) {
      if (response.status_code === 609) {
        console.log('addData :passed ');
        console.log(response);
      } else {
        console.log('addData :failed ');
        console.log(response);
      }

    });*/

    // localStorage.setItem(strLocalStorageCode, strPojoData);
  }

  function reset(){
    localStorage.setItem(strLocalStorageCode, "{}");
  }

  function init(){
    systemController = new Controller();
    systemModel = new Model();


    systemController.setModel(systemModel);    
    systemController.checkState();

    if (systemController.isLoggedIn()){
      // console.log('wtf')
      systemController.setCurrentPage('logged-in-home');
    }
    else{
      systemController.setCurrentPage('home');
      // systemController.setCurrentPage('logged-in-home');
    }

  }





  // "script"

  init();



}else console.warn('This app needs jQuery to run');

