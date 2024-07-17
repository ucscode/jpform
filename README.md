# UcsForm Class

The `UcsForm` class is a JavaScript utility for managing form validation and AJAX submission in web applications. It provides a flexible way to validate form inputs, handle custom submit events, and submit form data asynchronously using the Fetch API.

## Features

- Validate form inputs using custom validation callbacks.
- Handle form submission manually or asynchronously via AJAX.
- Support for adding custom submit event callbacks.
- Mark form inputs as valid or invalid based on validation results.

## Installation

No installation is required as this class is designed to be used directly in your JavaScript projects.

## Usage

1. **Initialization**:

   ```javascript
   // Initialize the form
   const form = new UcsForm('#myForm');
   ```

2. **Setting Validation Callbacks**:

   ```javascript
   // Set validation callback for an input

   form.setValidationCallback('input[name="username"]', (value, input) => {
       return /^[a-zA-Z0-9]+$/.test(value);
   });
   ```

3. **Setting Custom Submit Event**:

   ```javascript
   // Set custom submit event handler

   form.setCustomSubmitEvent((formData) => {
      // set custom submit action with ajax or use the built in submit option
      this.submit(formData)
   });
   ```

4. **Example HTML**:

   ```html
   <!-- Example HTML form -->
   <form id="myForm" action="/submit" method="post">
       <input type="text" name="username" required>
       <input type="password" name="password" required>
       <button type="submit">Submit</button>
   </form>
   ```

## API Documentation

### Constructor

```javascript
new UcsForm(element);
```

- `element` (HTMLElement|string): The form element or a selector string for the form.

### Methods

- `getFormElement()`: Get the form element.
- `setValidationCallback(input, callback)`: Set a validation callback for an input field.
- `setCustomSubmitEvent(callback)`: Set a custom submit event callback.
- `submit(formData)`: Submit the form using AJAX.

## License

This project is licensed under the MIT License.
