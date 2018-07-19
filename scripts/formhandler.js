(function (window) {
  'use strict';
  var FORM_SELECTOR = '[data-coffee-order="form"]';
  var App = window.App || {};
  var $ = window.jQuery;

  function FormHandler(selector) {
    if (!selector) {
      throw new Error('No selector provided');
    }

    this.$formElement = $(selector);
    if (this.$formElement.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  FormHandler.prototype.addSubmitHandler = function (fn) {
     console.log('Setting submit handler for form');
     this.$formElement.on('submit', function (event) {
      event.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
        console.log(item.name + ' is ' + item.value);
      });
      console.log(data);
     fn(data);
     this.reset();
     this.elements[0].focus();
    });
   };

   FormHandler.prototype.addInputHandler = function (fn) {
    console.log('Setting input handler for form');
    this.$formElement.on('input', '[name="emailAddress"]', function (event) {
      // Event handler code will go here
      var emailAddress = event.target.value;
      var message = '';
      if (fn(emailAddress)) {
        $(event.target).setCustomValidity('');
      } else {
        message = emailAddress + ' is not an authorized email address!'
        $(event.target).setCustomValidity(message);
      }
    });
  };

   FormHandler.prototype.addValidateHandler = function() {
    console.log("Setting validate handler for form");
    this.$formElement.on("submit", function(event) {
      event.preventDefault();
      var data = {};
      $(this).serializeArray().forEach(function(item) {
        data[item.name] = item.value;
        console.log(item.name + " is " + item.value);
      });
      console.log(data);
      var dataArray = Object.values(data);
      var dialog;
      var i = 0;
      while (i < dataArray.length) {
        if (dataArray[i] == "") {
          dialog = "<p>Please fill all information</p>";
          $(dialog).modal();
          return;
        }
        i++;
      }

      dialog = "<p>Thank you for your payment, " + data["title"] + " " + data["username"] + "</p>";
    $(dialog).modal({
      fadeDuration: 1000,
      fadeDelay: 0.50
    });

    this.reset();
    this.elements[0].focus();
  });
};

  App.FormHandler = FormHandler;
  window.App = App;

})(window);
