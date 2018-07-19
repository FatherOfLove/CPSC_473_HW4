(function(window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  function RemoteDataStore(url) {
    if (!url) {
      throw new Error("No remote URL supplied.");
    }

    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function(key, val) {
    $.ajax({
      method: "GET",
      url: this.serverUrl,
      success: function(serverResponse) {
        if (serverResponse.length === 0) {
          $.ajax(this.url, {
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              "coffee": val.coffee,
              "emailAddress": val.emailAddress,
              "flavor": val.flavor,
              "id": val.id,
              "size": val.size,
              "strength": val.strength
            }),
            success: function(serverResponse) {
              console.log(serverResponse);
            },
            error: function(xhr) {
              alert(xhr.responseText);
            }
          });
        } else {
          var match = false;
          for (var i = 0; i < serverResponse.length; i++) {
            if (serverResponse[i].emailAddress === val.emailAddress) {
              match = true;
            }
          }
          if (!match) {
            $.ajax(this.url, {
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                "coffee": val.coffee,
                "emailAddress": val.emailAddress,
                "flavor": val.flavor,
                "id": val.id,
                "size": val.size,
                "strength": val.strength
              }),
              success: function(serverResponse) {
                console.log(serverResponse);
              },
              error: function(xhr) {
                alert(xhr.responseText);
              }
            });
          } else {
            console.log("Order for " + val.emailAddress + " has been updated");
            $.ajax({
              method: "GET",
              url: this.url,
              success: function(serverResponse) {
                console.log(serverResponse);
                for (var i = 0; i < serverResponse.length; i++) {
                  if (serverResponse[i].emailAddress == key) {
                    var id = serverResponse[i].id;
                  }
                }
                $.ajax({
                  method: "PUT",
                  url: this.url + "/" + id,
                  contentType: "application/json",
                  data: JSON.stringify({
                    "coffee": val.coffee,
                    "emailAddress": val.emailAddress,
                    "flavor": val.flavor,
                    "id": val.id,
                    "size": val.size,
                    "strength": val.strength
                  }),
                  // when debug, use the following url instead
                  // url: this.url + id,
                  success: function(serverResponse) {
                    console.log(serverResponse);
                    console.log("Update item " + id);
                  },
                  error: function(xhr) {
                    alert(xhr.responseText);
                  }
                });
              },
              error: function(xhr) {
                alert(xhr.responseText);
              }
            });
          }
        }
      },
      error: function(xhr) {
        alert(xhr.responseText);
      }
    });
  };

  RemoteDataStore.prototype.getAll = function(cb) {


    $.ajax(this.serverUrl, {
      type: "GET",
      success: function(serverResponse) {
        console.log(serverResponse);
        cb(serverResponse);
      },
      error: function(xhr) {
        alert(xhr.responseText);
      }
    });
  };

  RemoteDataStore.prototype.get = function(key, cb) {

    $.ajax({
      method: "GET",
      url: this.serverUrl,
      success: function(serverResponse) {
        console.log(serverResponse);
        var id = 0;
        for (var i = 0; i < serverResponse.length; i++) {
          if (serverResponse[i].emailAddress == key) {
            id = serverResponse[i].id;
          }
        }
        $.ajax({
          method: "GET",
          url: this.url + "/" + id,
          success: function(serverResponse) {
            console.log(this.url);
            console.log(serverResponse);
            cb(serverResponse);
          },
          error: function(xhr) {
            alert(xhr.responseText);
          }
        });
      },
    });
  };

  RemoteDataStore.prototype.remove = function(key) {

    $.ajax({
      method: "GET",
      url: this.serverUrl,
      success: function(serverResponse) {
        console.log(serverResponse);
        for (var i = 0; i < serverResponse.length; i++) {
          if (serverResponse[i].emailAddress == key) {
            var id = serverResponse[i].id;
          }
        }
        $.ajax({
          method: "DELETE",
          url: this.url + "/" + id,

          success: function(serverResponse) {
            console.log(this.url);
            console.log(serverResponse);
            console.log("delete item " + id);
          },
          error: function(xhr) {
            alert(xhr.responseText);
          }
        });
      },
      error: function(xhr) {
        alert(xhr.responseText);
      }
    });
  };

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
