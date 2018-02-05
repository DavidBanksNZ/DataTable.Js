import { DomElem} from './DomElem';
import { DEFAULTS } from './defaults';
import { prefixCssClass } from './utils/prefixCssClass';
import { hasOwn } from './utils/hasOwn';

export class ColorCodedTable {

	constructor() {
		this.defaults();
	}

	defaults() {
		this._valueFormatter = (value, row, col, rowInfo, colInfo, opts, extras) => value;
		this._rowLabelFormatter = (label, row, rowInfo, opts, extras) => label;
		this._columnLabelFormatter = (label, col, colInfo, opts, extras) => label;
		this._cellFormatter = (elem, value, formattedValue, row, col, rowInfo, colInfo, opts, extras) => {
			elem.textContent = formattedValue;
		};
		this._styleFormatter = (value, row, col, rowInfo, colInfo, opts, extras) => ({});

		this._opts = {...DEFAULTS};
		this._extras = {};
		this._preRender = (extras, data) => {};
		this._postRender = (extras, data) => {};
	}

	theme(themeName, themeConfig) {

		if (!hasOwn(ColorCodedTable._themes, themeName)) {
			throw new Error(`Theme not found: ${themeName}`)
		}

		this._theme = ColorCodedTable._themes[themeName];

		if (typeof this._theme.valueFormatter === 'function') {
			this.valueFormatter(this._theme.valueFormatter);
		}

		if (typeof this._theme.cellFormatter === 'function') {
			this.cellFormatter(this._theme.cellFormatter);
		}

		if (typeof this._theme.styleFormatter === 'function') {
			this.styleFormatter(this._theme.styleFormatter);
		}

		if (typeof this._theme.rowLabelFormatter === 'function') {
			this.rowLabelFormatter(this._theme.rowLabelFormatter);
		}

		if (typeof this._theme.columnLabelFormatter === 'function') {
			this.columnLabelFormatter(this._theme.columnLabelFormatter);
		}

		if (typeof this._theme.preRender === 'function') {
			this.preRender(this._theme.preRender);
		}

		if (typeof this._theme.postRender === 'function') {
			this.postRender(this._theme.postRender);
		}

		if (this._theme.configDefaults && this._theme.configDefaults.columnLabels) {
			this.columnLabels(this._theme.configDefaults.columnLabels);
		}

		if (this._theme.configDefaults && this._theme.configDefaults.rowLabels) {
			this.rowLabels(this._theme.configDefaults.rowLabels);
		}

		if (this._theme.configDefaults && this._theme.configDefaults.columnInfo) {
			this.columnInfo(this._theme.configDefaults.columnInfo);
		}

		if (this._theme.configDefaults && this._theme.configDefaults.rowInfo) {
			this.rowInfo(this._theme.configDefaults.rowInfo);
		}

		const extraOpts = {...(this._theme.themeConfigDefaults || {}), ...(themeConfig || {})};
		this.opts(extraOpts);

		return this;
	}

	data(data) {
		this._data = data;
		this._numRows = data.length;
		this._numCols = Math.max(...data.map(d => d.length));
		return this;
	}

	getCell(row, column) {
		const tr = this._tableElem
			.findAll('tr')[row];

		if (!tr) {
			return null;
		}

		const td = tr.findAll(`.${prefixCssClass('column-label')}`)[column];
		return td ? td.get() : null;
	}

	opts(opts) {
		this._opts = {...this._opts, ...(opts || {})};
		return this;
	}

	rowLabels(labels) {
		this._rowLabels = labels;
		return this;
	}

	columnLabels(labels) {
		this._columnLabels = labels;
		return this;
	}

	rowInfo(info) {
		this._rowInfo = info;
		return this;
	}

	columnInfo(info) {
		this._colInfo = info;
		return this;
	}

	rowLabelFormatter(fn) {
		this._rowLabelFormatter = fn;
		return this;
	}

	columnLabelFormatter(fn) {
		this._columnLabelFormatter = fn;
		return this;
	}

	valueFormatter(fn) {
		this._valueFormatter = fn;
		return this;
	}

	styleFormatter(fn) {
		this._styleFormatter = fn;
		return this;
	}

	cellFormatter(fn) {
		this._cellFormatter = fn;
		return this;
	}

	render(container) {

		if (!(container instanceof HTMLElement)) {
			throw new Error('container must be an HTML element');
		}

		if (!Array.isArray(this._data)) {
			throw new Error('data must be an array');
		}

		this._container = container;

		if (!this._opts) {
			this.opts();
		}

		if (typeof this._preRender === 'function') {
			this._preRender(this._extras, this._data);
		}

		this._tableElem = new DomElem('table')
			.addClass(prefixCssClass('table'));

		if (this._opts.showColumnLabels) {

			const columnHeadings = new DomElem('tr');

			for (let j = 0; j <= this._numCols; j++) {

				const colInfo = this._colInfo ? this._colInfo[j] : null;

				columnHeadings.append(new DomElem('th')
					.text(j > 0 ? this._columnLabelFormatter(this._columnLabels[j - 1]) : '', j, colInfo, this._opts, this._extras)
					.addClass(prefixCssClass('column-label'))
				);
			}

			this._tableElem.append(columnHeadings);

		}

		for (let i = 0; i < this._numRows; i++) {

			const tr = new DomElem('tr');
			const rowInfo = this._rowInfo ? this._rowInfo[i] : null;

			if (this._opts.showRowLabels) {
				tr.append(new DomElem('td')
					.text(this._rowLabelFormatter(this._rowLabels[i], i, rowInfo, this._opts, this._extras))
					.addClass(prefixCssClass('row-label'))
				);
			}

			for (let j = 0; j < this._numCols; j++) {

				const value = this._data[i][j];
				const colInfo = this._colInfo ? this._colInfo[j] : null;

				const formattedValue = this._valueFormatter(value, i, j, rowInfo, colInfo, this._opts, this._extras);

				const td = new DomElem('td')
					.addClass(prefixCssClass('data-cell'));

				this._cellFormatter(td.get(), value, formattedValue, i, j, rowInfo, colInfo, this._opts, this._extras);

				td.css(this._styleFormatter(value, i, j, rowInfo, colInfo, this._opts, this._extras));

				tr.append(td);

			}

			this._tableElem.append(tr);

		}

		if (typeof this._postRender === 'function') {
			this._postRender.call(this, this._extras, this._data);
		}

		container.appendChild(this._tableElem.get());

		return this;
	}

	preRender(fn) {
		this._preRender = fn;
		return this;
	}

	postRender(fn) {
		this._postRender = fn;
		return this;
	}

	update() {
		this.destroy();
		this.render(this._container);
	}

	destroy() {
		const el = this.get();
		if (el) {
			el.parentNode.removeChild(el);
		}
		this._tableElem = null;
		return this;
	}

	get() {
		return this._tableElem.get();
	}

	static addTheme(theme) {
		this._themes[theme.name] = theme;
	}

}

ColorCodedTable._themes = Object.create(null);