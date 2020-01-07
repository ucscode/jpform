# jpform
JPFORM is a vanilla script light weight form handler that manages and transfer data to another page using ajax.
### formpage.html
```
<form id="jp-form" method="post" action="php-page.php">

  <input class="form-control" name="firstname" id="first" />
  
  <textarea class="form-control" row="3" col="4" name="message"></textarea>
  
</form>
```
### script.js
```
var jpform = new JPForm({
  el: "#jp-form",
}); // initialize;

var firstname = jpform.getElem("#first"); //get element by id

var message = jpform.getElem("!message"); //get element by name

firstname.validate({
  exp:'word', // allow only text and number input
  good: function() {}, // do this if input is valid
  bad: function() {} // do this if input is not valid
});
```

