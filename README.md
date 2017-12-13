# angular-portfolio

## Description:
  
  A simple angular component that allows you to create a Portfolio, just passing configurations.
  
  
## This project use:
  
   * **Package Manager:** [Bower](https://bower.io/)
    
   * **Framework js:** [Angularjs](https://angularjs.org/)
   
   * **JavaScript utility library:** [Lodash](https://lodash.com/)
    
    
## Installation and Execution:
 
  ### **bower install angular-portfolio**
 
## Examples:

  ![Portfolio](portfolio-images/angular-portfolio.jpg)

  Configuration for **angular-portfolio** directive or element:
   * **items:** 
   ```js
      [
        {
            //VALUE OPTIONS
              //base usage
            "value": "value to be showed",
              //Use %i% as a placeholder to set in your value, icons
              //i suggest to use font-awesome as icon library
            "value": "this string will contain an icon here --> %i%",
              //to set icon class, it becomes: " string.. <i class="fa fa-html5"></i>"
            "icon": "fa fa-html5",
            
            //FONT
              //To use font-family(css attribute) import a font in your css
              //example: @import url("https://fonts.googleapis.com/css?family=Audiowide");
            "font": "'Audiowide', cursive",
              //font dimension
            "fontSize": "0.8em",
            
            //IMAGE
            "image": "./imgs/hamburg.jpg",
              //SHADE IMAGE
            "shadeFocus": true,
            
            //ZOOM OPTIONS
              //to set zoom operation on item
            "focusScale": 1.6,
              //to set the zoom center, 50% 50% is default (item center)
            "focusCenter": "50% 50%",
            
            //HOVER OPTIONS
              //on hover set text color
            "hoverTextColor": "#f96855",
              //on hover set background color
            "hoverBackgroundColor": "#FFFA5C",
            
            //ANIMATIONS
              //set animation time on all properties
            "animationTime": "0.9s",
            
            //ID
              //All items have an id (html id)
              //by default items passed by "items" attribute are sequencially named as "item1", "item2", "item3" etc..
              //But you can override default configuration with:
            "id": "myId",
              //so, for example you can have "item1", "myId", "item3" (if you set id attribute on second items config)
             //SUBITEMS
              //In subitems you can set recoursive items configuration
            "subitems": [ 
                  //items..
                  {
                      "value": "%i%",
                      "icon": "fa fa-linkedin-square",
                      "fontSize": "1.2em"
                      //item attributes..
                  },
                  {
                      "id": "mySubId",
                      "subitems":[...]
                  },
                  ...
              ],
             //by default subitems are sequencially named as "(parent id)-sub1", "(parent id)-mySubId", "(parent id)-sub3" etc..
            
            //CALLBACKS
              //use this sintax to pass a callback
              //in a configuration (object/json)
            "callback": {
                  "name": "navigate",
                  "params": ["http://www.hamburg.com/"]
            },
            "callback": function(..){....}
              //differences: 
              //To use "callback: function(){..}", you have to set callback with a function in your js, so you have to manipulate your config
              //to use "callback: { name: "fn name", params: ["param1", "param2", etc..]}" you don't have to set any functions to your config, just set in your controller $scope (direct parent of this directive) your function, es: $scope.navifate = function(url){..};  
        }
      ]
   ```
   * **areas:** 
   ```js
      //areas must contain a matrix of ids, and allows you to design items position, dimesions on your portfolio.
      //By default items are 
      "areas":[
        [["item1", "item2", "."], // "." is a space
         ["item1", "item2", "item3"]]
      ]
      //This configuration is well formed and generate this structure:
      
                      |content1|content2|        |
                      |content1|content2|content3|
      
       "areas":[
        [["item1", "item1", "item3"],
         ["item1", "item2", "item3"]]
      ]
      //This configuration isn't well formed and generate an error.
      //REMEMBER: this component is maded by divs and you can't have a "L" shaped div or
      //the same div in 2 different and not near positions..
      
                      |content1|content1|content3|
                      |content1|content2|content3|
      
      
   ```
    
    
  
  
