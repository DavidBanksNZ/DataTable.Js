import { hasOwn } from './utils/hasOwn';

export class DomElem {

	constructor(element) {
		this.element = typeof element === 'string' ? document.createElement(element) : element;
	}

	get() {
		return this.element;
	}

	text(str) {
		this.element.textContent = str;
		return this;
	}

	prop(key, value) {
		if (typeof value === 'undefined') {
			return this.element[key];
		}
		this.element[key] = value;
		return this;
	}

	hasClass(className) {
		return this.element.className.split(' ').indexOf(className) !== -1;
	}

	addClass(className) {
		let classNameProp = this.element.className;

		if (this.element.className.search(className) === -1) {
			classNameProp = classNameProp + ' ' + className;
			this.element.className = classNameProp.trim();
		}

		return this;
	}

	append(child) {
		this.element.appendChild(child.get());
		return this;
	}

	css(styles) {
		for (let prop in styles) {
			if (hasOwn(styles, prop)) {
				this.element.style[prop] = styles[prop];
			}
		}
		return this;
	}

	data(key, value) {
		const dataProp = '__$cct';
		const _data = this.prop(dataProp);

		if (typeof value === 'undefined') {
			return (_data ? _data[key] : undefined);
		}

		if (key === null) {
			this.prop(dataProp, null);
			return this;
		}

		if (!_data) {
			this.prop(dataProp, Object.create(null));
		}

		this.prop(dataProp)[key] = value;

		return this;
	}

	find(selector, root) {
		const parent = root || document;
		const element = parent.querySelector(selector);
		return element ? new DomElem(element) : null;
	}

	findAll(selector, root) {
		const parent = root || document;
		let elements =  parent.querySelectorAll(selector);
		elements = [].concat.apply([], elements);
		return elements.map(elem => new DomElem(elem));
	}

	on(eventName, eventHandler, context) {
		this.element.addEventListener(eventName, eventHandler.bind(context || this), false);
		return this;
	}

}