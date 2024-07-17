"use strict";

/**
 * Create custom form validation and ajax submission
 * 
 * @author ucscode<uche23mail@gmail.com>
 */
class UcsForm
{
	/**
	 * Create a UcsForm instance.
	 * @param {HTMLElement|string} element - The form element or a selector string for the form.
	 * @throws {ReferenceError} Will throw an error if the element is not a valid HTMLFormElement.
	 */
	constructor(element) {
		this.formElement = typeof element === 'string' ? document.querySelector(element) : element;
		this.validations = {};
		this.customSubmitCallback = null;

		if(!(this.formElement instanceof HTMLFormElement)) {
			throw new ReferenceError('Cannot find HTMLFormElement reference');
		}
		
		this.#initializeChangeEffects();

		this.formElement.addEventListener('submit', (event) => {
			if (!this.#validateForm()) {
				event.preventDefault();
			} else if (this.customSubmitCallback) {
				event.preventDefault();
				this.#handleFormSubmission();
			}
		});
	}

	/**
	 * @returns {HTMLFormElement}
	 */
	getFormElement() {
		return this.formElement;
	}

	/**
	 * Set validation callback for an input
	 * @param {string|HTMLElement} input - Selector string or HTML element
	 * @param {function|null} callback - Validation function that accepts the input element and its value, returns boolean
	 */
	setValidationCallback(input, callback) {
		let inputElement;
		if (typeof input === 'string') {
			inputElement = this.formElement.querySelector(input);
			if (!inputElement) {
				throw new ReferenceError(`Cannot find element with selector ${input}`);
			}
		} else if (input instanceof HTMLElement) {
			if (!this.formElement.contains(input) || !['INPUT', 'SELECT', 'TEXTAREA'].includes(input.tagName)) {
				throw new TypeError('Element must be a valid form field and a member of the form');
			}
			inputElement = input;
		} else {
			throw new TypeError('Input must be a selector string or an HTMLElement');
		}

		this.validations[inputElement.name] = callback;
	}

	/**
	 * Set a custom submit event callback
	 * @param {function} callback
	 */
	setCustomSubmitEvent(callback) {
		if (typeof callback === 'function') {
			this.customSubmitCallback = callback.bind(this);
		} else {
			throw new TypeError('Callback must be a function');
		}
	}

	/**
	 * Default AJAX form submission
	 * @param {FormData} formData
	 * @returns {Promise<Response>}
	 */
	submit(formData) {
		const action = this.formElement.action || window.location.href;
		const method = this.formElement.method || 'POST';

		return fetch(action, {
			method: method,
			body: formData
		});
	}

	/**
	 * Validate the form
	 * @returns {boolean}
	 */
	#validateForm() {
		let isValid = true;
		for (let name in this.validations) {
			const inputElement = this.formElement.querySelector(`[name="${name}"]`);
			if (inputElement) {
				const value = inputElement.value.trim();
				const callback = this.validations[name];
				if (typeof callback == 'function' && !callback(value, inputElement)) {
					this.#setValid(inputElement, false);
					isValid = false;
				} else {
					this.#setValid(inputElement, true);
				}
			}
		}
		return isValid;
	}

	/**
	 * Mark an input as valid or 
	 * @param {HTMLInputElement} input
	 * @param {boolean} isValid
	 */
	#setValid(input, isValid) {
		input.classList[!isValid ? 'add' : 'remove']('is-invalid');
	}

	/**
	 * Handle form submission manually
	 */
	#handleFormSubmission() {
		const formData = new FormData(this.formElement);
		if (this.customSubmitCallback) {
			this.customSubmitCallback(formData, this.formElement);
		}
	}
	
	#initializeChangeEffects() {
		const inputs = this.formElement.querySelectorAll('input, select, textarea');
		inputs.forEach(input => input.addEventListener('focus', () => this.#setValid(input, true)));
	}
}
